"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { syncUserToSupabase } from "@/app/actions/user";

export function AuthSyncHandler() {
  const { user, isLoaded, isSignedIn } = useUser();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    async function sync() {
      if (!isLoaded || !isSignedIn || !user) return;

      const email =
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses[0]?.emailAddress ||
        "";

      const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.username ||
        "Creator";

      if (!email) return;

      // Prevent redundant sync calls within the same session for the same user
      const syncKey = `${user.id}_${email}_${fullName}`;
      if (syncedRef.current === syncKey) return;
      syncedRef.current = syncKey;

      try {
        console.log(`[AuthSync] Syncing user to Supabase 'users' table: ${email}`);
        const result = await syncUserToSupabase({
          name: fullName,
          email: email,
        });

        if (result.success) {
          console.log(`[AuthSync] User successfully synced to Supabase:`, result.action);
        } else {
          console.warn(`[AuthSync] Supabase sync notice:`, result.error);
        }
      } catch (err) {
        console.error(`[AuthSync] Sync error:`, err);
      }
    }

    sync();
  }, [user, isLoaded, isSignedIn]);

  return null;
}
