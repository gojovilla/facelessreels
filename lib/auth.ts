import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Get current authenticated Clerk user session
 */
export async function getAuthSession() {
  return await auth();
}

/**
 * Get full Clerk user profile
 */
export async function getAuthUser() {
  return await currentUser();
}

import { getPlanLimits } from "@/lib/plan-limits";

/**
 * Helper to ensure a Supabase 'users' record exists for the logged-in Clerk user
 */
export async function syncClerkUserWithSupabase() {
  const user = await currentUser();
  if (!user) return null;

  const supabase = createAdminClient();
  const email = user.emailAddresses[0]?.emailAddress;
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Creator";

  if (!email) return null;

  // Determine initial tier from metadata if available
  const metaTierRaw =
    (user.publicMetadata?.plan as string) ||
    (user.unsafeMetadata?.plan as string) ||
    "free";
  const initialPlan = getPlanLimits(metaTierRaw).id;
  const dbEnumTier = initialPlan === "unlimited" ? "pro" : initialPlan === "basic" ? "starter" : "free";

  // Check if user already exists to preserve active tier
  let existingTier = dbEnumTier;
  try {
    const { data: existingUser } = await supabase
      .from("users")
      .select("tier")
      .eq("id", user.id)
      .single();

    if (existingUser?.tier && existingUser.tier !== "free") {
      existingTier = existingUser.tier;
    }
  } catch {
    // User does not exist yet
  }

  // Upsert in public.users table with preserved/resolved tier
  const { data: userData, error } = await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        name: fullName,
        email: email,
        avatar_url: user.imageUrl || null,
        tier: existingTier as any,
        credits_remaining: 3,
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error syncing user to Supabase 'users' table:", error);
  }

  // Also sync to profiles
  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: email,
      full_name: fullName,
      avatar_url: user.imageUrl || null,
      tier: existingTier as any,
      credits_remaining: 3,
    },
    { onConflict: "id" }
  );

  return userData;
}
