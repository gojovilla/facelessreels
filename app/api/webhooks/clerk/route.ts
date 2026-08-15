import { NextResponse } from "next/server";

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

      if (email) {
        // Save to public.users table (name, email)
        await fetch(`${supabaseUrl}/rest/v1/users`, {
          method: "POST",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            name: fullName,
            email: email,
          }),
        });
      }
    }

    // 2. User Updated Event
    if (eventType === "user.updated") {
      const email = data.email_addresses?.[0]?.email_address;
      const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.username || "Creator";

      if (email) {
        await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
          method: "PATCH",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName,
          }),
        });
      }
    }

    // 3. User Deleted Event
    if (eventType === "user.deleted") {
      const email = data.email_addresses?.[0]?.email_address;
      if (email) {
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
