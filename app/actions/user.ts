"use server";

import { createAdminClient } from "@/lib/supabase/admin";

interface SyncUserData {
  name: string;
  email: string;
}

export async function syncUserToSupabase({ name, email }: SyncUserData) {
  if (!email) {
    return { success: false, error: "Email is required" };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes("placeholder")) {
    console.warn("Supabase credentials not configured yet in .env.local");
    return { success: false, error: "Supabase not configured" };
  }

  try {
    // 1. Check if user already exists with this email
    const checkRes = await fetch(
      `${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=*`,
      {
        method: "GET",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        cache: "no-store",
      }
    );

    const existingUsers = await checkRes.json();

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      // User exists, update their name if changed
      const updateRes = await fetch(
        `${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({ name }),
        }
      );

      const updated = await updateRes.json();
      return { success: true, action: "updated", data: updated };
    } else {
      // User doesn't exist, insert new user record (name and email)
      const insertRes = await fetch(`${supabaseUrl}/rest/v1/users`, {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          name: name || "Creator",
          email: email,
        }),
      });

      const inserted = await insertRes.json();
      return { success: true, action: "inserted", data: inserted };
    }
  } catch (err: any) {
    console.error("Error syncing user to Supabase:", err);
    return { success: false, error: err.message || "Failed to sync user" };
  }
}
