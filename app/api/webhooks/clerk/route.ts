import { NextResponse } from "next/server";
import { getPlanLimits } from "@/lib/plan-limits";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const eventType = payload?.type;
    const data = payload?.data;

    if (!eventType || !data) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    // 1. User Created Event (Sign Up)
    if (eventType === "user.created") {
      const email = data.email_addresses?.[0]?.email_address;
      const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.username || "Creator";
      const metaPlan = data.public_metadata?.plan || data.unsafe_metadata?.plan;
      const planConfig = getPlanLimits(metaPlan);
      const tierEnum = planConfig.id === "unlimited" ? "pro" : planConfig.id === "basic" ? "starter" : "free";

      if (email) {
        // Save to public.users table (id, name, email, tier)
        await fetch(`${supabaseUrl}/rest/v1/users`, {
          method: "POST",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            id: data.id,
            name: fullName,
            email: email,
            tier: tierEnum,
            credits_remaining: 3,
          }),
        });
      }
    }

    // 2. User Updated Event
    if (eventType === "user.updated") {
      const email = data.email_addresses?.[0]?.email_address;
      const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.username || "Creator";
      const metaPlan = data.public_metadata?.plan || data.unsafe_metadata?.plan;
      const planConfig = getPlanLimits(metaPlan);

      const updatePayload: Record<string, any> = { name: fullName };
      if (metaPlan) {
        updatePayload.tier = planConfig.id === "unlimited" ? "pro" : planConfig.id === "basic" ? "starter" : "free";
      }

      if (data.id) {
        await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${encodeURIComponent(data.id)}`, {
          method: "PATCH",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        });
      } else if (email) {
        await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
          method: "PATCH",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        });
      }
    }

    // 3. Subscription Created / Updated / Active Events
    if (
      eventType.startsWith("subscription.") ||
      eventType.startsWith("commerce.subscription.") ||
      eventType === "subscription_item.created" ||
      eventType === "subscription_item.updated"
    ) {
      const userId = data.payer_id || data.user_id || data.customer_id;
      const planRaw =
        data.plan?.name ||
        data.plan?.slug ||
        data.subscription_item?.plan?.name ||
        data.subscription_item?.plan?.slug ||
        data.subscription_items?.[0]?.plan?.slug ||
        "";

      const isCanceled =
        eventType.includes("deleted") ||
        eventType.includes("ended") ||
        data.status === "canceled" ||
        data.status === "ended";

      const targetPlan = isCanceled ? "free" : getPlanLimits(planRaw).id;
      const tierEnum = targetPlan === "unlimited" ? "pro" : targetPlan === "basic" ? "starter" : "free";

      if (userId) {
        await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${encodeURIComponent(userId)}`, {
          method: "PATCH",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tier: tierEnum }),
        });

        await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
          method: "PATCH",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tier: tierEnum }),
        });
      }
    }

    // 4. User Deleted Event
    if (eventType === "user.deleted") {
      const email = data.email_addresses?.[0]?.email_address;
      if (data.id) {
        await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${encodeURIComponent(data.id)}`, {
          method: "DELETE",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
          },
        });
      } else if (email) {
        await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
          method: "DELETE",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (err) {
    console.error("Clerk Webhook Error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
