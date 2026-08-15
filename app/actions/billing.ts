"use server";

import { currentUser } from "@clerk/nextjs/server";
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
 * Retrieves the current user's active subscription tier, current series count, and feature permissions.
 */
export async function getUserSubscriptionInfo(): Promise<UserSubscriptionInfo> {
  const user = await currentUser();
  if (!user) {
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

  // 1. Determine plan from Clerk metadata or Supabase profile
  const clerkPlan =
    (user.publicMetadata?.plan as string) ||
    (user.unsafeMetadata?.plan as string) ||
    "free";

  let finalPlanKey = clerkPlan;

  try {
    const { data: dbUser } = await supabase
      .from("users")
      .select("tier")
      .eq("id", user.id)
      .single();

    if (dbUser?.tier) {
      finalPlanKey = dbUser.tier;
    }
  } catch (err) {
    // Fallback to clerk metadata
  }

  const planConfig = getPlanLimits(finalPlanKey);

  // 2. Count existing active series for this user
  let seriesCount = 0;
  try {
    const { count, error } = await supabase
      .from("series")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (!error && typeof count === "number") {
      seriesCount = count;
    }
  } catch (err) {
    console.warn("Could not query series count:", err);
  }

  return {
    userId: user.id,
    plan: planConfig,
    planKey: planConfig.id,
    currentSeriesCount: seriesCount,
    canCreateSeries: canCreateMoreSeries(seriesCount, planConfig.id),
    allowedPlatforms: planConfig.allowedPlatforms,
  };
}
