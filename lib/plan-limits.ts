export type PlanType = "free" | "basic" | "unlimited";

export interface PlanConfig {
  id: PlanType;
  name: string;
  maxSeries: number;
  allowedPlatforms: ("youtube" | "instagram" | "tiktok" | "email")[];
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
}

export const PLANS: Record<PlanType, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    maxSeries: 1,
    allowedPlatforms: ["youtube", "email"],
    priceMonthly: 0,
    priceYearly: 0,
    description: "For new creators getting started with AI video automation",
    features: [
      "1 Automated Video Series",
      "YouTube Shorts & Email Channels Only",
      "Google Gemini High-Retention Scripts",
      "Deepgram & Fonada Neural Voiceovers",
      "Standard Video Production Queue",
      "Community Support & Guides",
    ],
  },
  basic: {
    id: "basic",
    name: "Basic",
    maxSeries: 3,
    allowedPlatforms: ["youtube", "email"],
    priceMonthly: 19,
    priceYearly: 15,
    description: "For scaling creators building multiple automated channels",
    features: [
      "Up to 3 Automated Video Series Simultaneously",
      "YouTube Shorts & Email Channels Only",
      "OpenAI ChatGPT DALL-E 3 HD 4K Scene Generation",
      "Custom Background Music CDN Mixing & Looping",
      "30-Day Auto-Scheduler with 2h Pre-Generation",
      "Target Niches RPM Monetization Intelligence",
    ],
  },
  unlimited: {
    id: "unlimited",
    name: "Unlimited",
    maxSeries: Infinity,
    allowedPlatforms: ["youtube", "instagram", "tiktok", "email"],
    priceMonthly: 49,
    priceYearly: 39,
    description: "For professional creators & agencies scaling across all social platforms",
    features: [
      "Unlimited Automated Video Series",
      "ALL 4 Platforms (YouTube, Instagram Reels, TikTok, Email)",
      "OpenAI ChatGPT DALL-E 3 HD 4K Scene Generation",
      "Custom Background Music CDN Mixing & Looping",
      "Full Multi-Channel Simultaneous Auto-Dispatch",
      "Priority 24/7 AWS Lambda Rendering Queue",
      "Custom Visual Styles & Prompt Modifiers",
    ],
  },
};

/**
 * Normalizes any string representation of a user plan to "free" | "basic" | "unlimited"
 */
export function getPlanLimits(planKey?: string | null): PlanConfig {
  if (!planKey) return PLANS.free;
  const normalized = planKey.toLowerCase().trim();

  if (normalized === "unlimited" || normalized === "agency" || normalized === "pro") {
    return PLANS.unlimited;
  }
  if (normalized === "basic" || normalized === "starter") {
    return PLANS.basic;
  }
  return PLANS.free;
}

/**
 * Checks whether user can create additional series given their current series count
 */
export function canCreateMoreSeries(currentSeriesCount: number, planKey?: string | null): boolean {
  const plan = getPlanLimits(planKey);
  return currentSeriesCount < plan.maxSeries;
}

/**
 * Checks whether a platform is allowed for the user's plan
 */
export function isPlatformAllowed(
  platform: "youtube" | "instagram" | "tiktok" | "email" | string,
  planKey?: string | null
): boolean {
  const plan = getPlanLimits(planKey);
  return plan.allowedPlatforms.includes(platform as any);
}
