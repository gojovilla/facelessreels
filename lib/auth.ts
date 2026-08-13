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

  // Check and upsert in public.users table
  const { data: userData, error } = await supabase
    .from("users")
    .upsert({
      id: user.id,
      name: fullName,
      email: email,
      avatar_url: user.imageUrl || null,
      tier: "free",
      credits_remaining: 3,
    })
    .select()
    .single();

  if (error) {
    console.error("Error syncing user to Supabase 'users' table:", error);
  }

  // Also sync to profiles
  await supabase.from("profiles").upsert({
    id: user.id,
    email: email,
    full_name: fullName,
    avatar_url: user.imageUrl || null,
    tier: "free",
    credits_remaining: 3,
  });

  return userData;
}
