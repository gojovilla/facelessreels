"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { createClient } from "@supabase/supabase-js";
import { getPlanLimits, PlanConfig, canCreateMoreSeries, isPlatformAllowed, PlanType } from "@/lib/plan-limits";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export interface UserSubscriptionInfo {
  userId: string;
  plan: PlanConfig;
  planKey: PlanType;
  currentSeriesCount: number;
  canCreateSeries: boolean;
  allowedPlatforms: string[];
}

/**
 * Rank plans so highest tier wins (unlimited > basic > free)
 */
function rankPlan(planId: PlanType): number {
  if (planId === "unlimited") return 3;
  if (planId === "basic") return 2;
  return 1;
}

/**
 * Retrieves the current user's active subscription tier, current series count, and feature permissions.
 * Inspects Clerk Billing claims, Clerk auth has(), Clerk metadata, and Supabase profiles.
 */
export async function getUserSubscriptionInfo(): Promise<UserSubscriptionInfo> {
  const authObj = await auth();
  const user = await currentUser();

  const userId = authObj?.userId || user?.id;
  if (!userId) {
    const freePlan = getPlanLimits("free");
    return {
      userId: "",
      plan: freePlan,
      planKey: "free",
      currentSeriesCount: 0,
      canCreateSeries: false,
      allowedPlatforms: freePlan.allowedPlatforms,
    };
  }

  // 1. Detect plan from Clerk Billing has() helper
  let clerkAuthPlan: PlanType = "free";
  try {
    if (typeof authObj?.has === "function") {
      const isUnlimited =
        authObj.has({ plan: "unlimited" }) ||
        authObj.has({ plan: "unlimted" }) ||
        authObj.has({ plan: "agency" }) ||
        authObj.has({ plan: "pro" });

      const isBasic =
        authObj.has({ plan: "basic" }) ||
        authObj.has({ plan: "starter" });

      if (isUnlimited) {
        clerkAuthPlan = "unlimited";
      } else if (isBasic) {
        clerkAuthPlan = "basic";
      }
    }
  } catch (err) {
    console.warn("[Billing] Clerk auth.has check notice:", err);
  }

  // 2. Detect plan from Clerk sessionClaims
  let sessionClaimPlan: PlanType = "free";
  try {
    const claims = authObj?.sessionClaims as any;
    if (claims) {
      const pla = claims.pla || claims.plans || claims.sub || "";
      const plaStr = Array.isArray(pla) ? pla.join(" ") : String(pla);
      if (plaStr) {
        sessionClaimPlan = getPlanLimits(plaStr).id;
      }
    }
  } catch (err) {
    // ignore
  }

  // 3. Detect plan from Clerk User Metadata
  let metadataPlan: PlanType = "free";
  if (user) {
    const rawMeta =
      (user.publicMetadata?.plan as string) ||
      (user.unsafeMetadata?.plan as string) ||
      (user.privateMetadata?.plan as string) ||
      "";
    if (rawMeta) {
      metadataPlan = getPlanLimits(rawMeta).id;
    }
  }

  // 4. Detect plan from Supabase DB
  let dbPlan: PlanType = "free";
  try {
    const { data: dbUser } = await supabase
      .from("users")
      .select("tier")
      .eq("id", userId)
      .single();

    if (dbUser?.tier) {
      dbPlan = getPlanLimits(dbUser.tier).id;
    }
  } catch (err) {
    // DB user might not exist yet
  }

  // 5. Select highest tier among all sources
  const candidatePlans: PlanType[] = [clerkAuthPlan, sessionClaimPlan, metadataPlan, dbPlan];
  let highestPlanId: PlanType = "free";
  let maxRank = 0;

  for (const candidate of candidatePlans) {
    const rank = rankPlan(candidate);
    if (rank > maxRank) {
      maxRank = rank;
      highestPlanId = candidate;
    }
  }

  const planConfig = getPlanLimits(highestPlanId);

  // 6. Auto-heal/sync if Clerk detects a paid plan but DB is out-of-date or vice-versa
  if (planConfig.id !== "free") {
    // Auto-sync Supabase if DB tier doesn't match
    if (dbPlan !== planConfig.id) {
      try {
        // Try setting plan id (e.g. 'unlimited' or 'basic')
        const { error } = await supabase
          .from("users")
          .update({ tier: planConfig.id })
          .eq("id", userId);

        if (error) {
          // If enum only accepts 'pro'/'agency'/'starter'/'free'
          const fallbackTier = planConfig.id === "unlimited" ? "pro" : "starter";
          await supabase
            .from("users")
            .update({ tier: fallbackTier })
            .eq("id", userId);
        }

        // Also update profiles table
        await supabase
          .from("profiles")
          .update({ tier: planConfig.id === "unlimited" ? "pro" : "starter" })
          .eq("id", userId);
      } catch (syncErr) {
        console.warn("[Billing] Supabase tier auto-sync notice:", syncErr);
      }
    }

    // Auto-sync Clerk publicMetadata if not set
    if (user && user.publicMetadata?.plan !== planConfig.id) {
      try {
        const clerkSecret = process.env.CLERK_SECRET_KEY;
        if (clerkSecret) {
          const clerk = createClerkClient({ secretKey: clerkSecret });
          await clerk.users.updateUserMetadata(userId, {
            publicMetadata: {
              ...(user.publicMetadata || {}),
              plan: planConfig.id,
            },
          });
        }
      } catch (clerkSyncErr) {
        console.warn("[Billing] Clerk metadata auto-sync notice:", clerkSyncErr);
      }
    }
  }

  // 7. Count existing active series for this user
  let seriesCount = 0;
  try {
    const { count, error } = await supabase
      .from("series")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (!error && typeof count === "number") {
      seriesCount = count;
    }
  } catch (err) {
    console.warn("Could not query series count:", err);
  }

  return {
    userId: userId,
    plan: planConfig,
    planKey: planConfig.id,
    currentSeriesCount: seriesCount,
    canCreateSeries: canCreateMoreSeries(seriesCount, planConfig.id),
    allowedPlatforms: planConfig.allowedPlatforms,
  };
}
