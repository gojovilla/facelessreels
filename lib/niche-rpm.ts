/**
 * Target Niches & Creator RPM Intelligence Engine
 * Provides estimated RPM (Revenue Per Mille / Revenue per 1,000 views) based on industry monetization data
 * across YouTube Shorts, Instagram Reels Bonuses, and TikTok Creator Rewards Program.
 */

export interface NicheRpmProfile {
  nicheKey: string;
  displayName: string;
  avgRpm: number;
  rpmFormatted: string;
  rpmRange: string;
  monetizationTier: "high" | "medium-high" | "medium" | "standard";
  topAdCategories: string[];
}

export const NICHE_RPM_PROFILES: Record<string, NicheRpmProfile> = {
  finance: {
    nicheKey: "finance",
    displayName: "Finance & Wealth",
    avgRpm: 5.80,
    rpmFormatted: "$5.80",
    rpmRange: "$4.50 - $8.50",
    monetizationTier: "high",
    topAdCategories: ["Investing", "Credit Cards", "Real Estate", "Crypto"],
  },
  ai: {
    nicheKey: "ai",
    displayName: "AI Innovations & Tech",
    avgRpm: 4.90,
    rpmFormatted: "$4.90",
    rpmRange: "$3.80 - $6.50",
    monetizationTier: "high",
    topAdCategories: ["SaaS", "Software Tools", "Cloud Computing", "AI Agents"],
  },
  tech: {
    nicheKey: "tech",
    displayName: "Tech & Gadgets",
    avgRpm: 4.20,
    rpmFormatted: "$4.20",
    rpmRange: "$3.20 - $5.50",
    monetizationTier: "medium-high",
    topAdCategories: ["Consumer Electronics", "Apps", "Cybersecurity"],
  },
  health: {
    nicheKey: "health",
    displayName: "Health, Fitness & Longevity",
    avgRpm: 3.40,
    rpmFormatted: "$3.40",
    rpmRange: "$2.80 - $4.50",
    monetizationTier: "medium-high",
    topAdCategories: ["Supplements", "Fitness Equipment", "Wellness Apps"],
  },
  science: {
    nicheKey: "science",
    displayName: "Science & Space Wonders",
    avgRpm: 3.10,
    rpmFormatted: "$3.10",
    rpmRange: "$2.40 - $3.90",
    monetizationTier: "medium",
    topAdCategories: ["EdTech", "Documentaries", "STEM Programs"],
  },
  mindset: {
    nicheKey: "mindset",
    displayName: "Stoic Wisdom & Mindset",
    avgRpm: 2.80,
    rpmFormatted: "$2.80",
    rpmRange: "$2.20 - $3.60",
    monetizationTier: "medium",
    topAdCategories: ["Audiobooks", "Productivity Apps", "Life Coaching"],
  },
  history: {
    nicheKey: "history",
    displayName: "Historical & Ancient Legends",
    avgRpm: 2.60,
    rpmFormatted: "$2.60",
    rpmRange: "$2.10 - $3.40",
    monetizationTier: "medium",
    topAdCategories: ["Gaming", "History Apps", "Publishing"],
  },
  mystery: {
    nicheKey: "mystery",
    displayName: "True Crime & Dark Mysteries",
    avgRpm: 2.50,
    rpmFormatted: "$2.50",
    rpmRange: "$2.00 - $3.20",
    monetizationTier: "medium",
    topAdCategories: ["Podcasts", "Streaming Services", "Books"],
  },
  motivation: {
    nicheKey: "motivation",
    displayName: "Daily Motivation & Quotes",
    avgRpm: 2.30,
    rpmFormatted: "$2.30",
    rpmRange: "$1.80 - $3.00",
    monetizationTier: "medium",
    topAdCategories: ["Self-help", "Courses", "Fitness"],
  },
  scary: {
    nicheKey: "scary",
    displayName: "Scary Stories & Urban Legends",
    avgRpm: 2.10,
    rpmFormatted: "$2.10",
    rpmRange: "$1.60 - $2.80",
    monetizationTier: "standard",
    topAdCategories: ["Entertainment", "Gaming", "Horror Media"],
  },
  gaming: {
    nicheKey: "gaming",
    displayName: "Gaming & Pop Culture",
    avgRpm: 1.80,
    rpmFormatted: "$1.80",
    rpmRange: "$1.30 - $2.40",
    monetizationTier: "standard",
    topAdCategories: ["Video Games", "Peripherals", "Merchandise"],
  },
  humor: {
    nicheKey: "humor",
    displayName: "Viral Humor & Memes",
    avgRpm: 1.50,
    rpmFormatted: "$1.50",
    rpmRange: "$1.00 - $2.00",
    monetizationTier: "standard",
    topAdCategories: ["Consumer Goods", "Fast Food", "Social Apps"],
  },
  default: {
    nicheKey: "default",
    displayName: "Viral Storytelling",
    avgRpm: 2.50,
    rpmFormatted: "$2.50",
    rpmRange: "$2.00 - $3.50",
    monetizationTier: "medium",
    topAdCategories: ["General Audience", "E-Commerce"],
  },
};

/**
 * Calculates RPM profile and estimated metrics based on series niche text
 */
export function getNicheRpmProfile(niche?: string | null): NicheRpmProfile {
  if (!niche) return NICHE_RPM_PROFILES.default;

  const n = niche.toLowerCase();

  if (n.includes("finance") || n.includes("money") || n.includes("crypto") || n.includes("wealth") || n.includes("invest") || n.includes("business") || n.includes("stock") || n.includes("rich")) {
    return NICHE_RPM_PROFILES.finance;
  }
  if (n.includes("ai") || n.includes("artificial") || n.includes("software") || n.includes("gpt") || n.includes("automation") || n.includes("coding")) {
    return NICHE_RPM_PROFILES.ai;
  }
  if (n.includes("tech") || n.includes("gadget") || n.includes("phone") || n.includes("cyber")) {
    return NICHE_RPM_PROFILES.tech;
  }
  if (n.includes("health") || n.includes("fitness") || n.includes("workout") || n.includes("gym") || n.includes("diet") || n.includes("longevity")) {
    return NICHE_RPM_PROFILES.health;
  }
  if (n.includes("science") || n.includes("space") || n.includes("universe") || n.includes("planet") || n.includes("physics") || n.includes("cosmos")) {
    return NICHE_RPM_PROFILES.science;
  }
  if (n.includes("stoic") || n.includes("mindset") || n.includes("philosophy") || n.includes("wisdom") || n.includes("discipline")) {
    return NICHE_RPM_PROFILES.mindset;
  }
  if (n.includes("history") || n.includes("ancient") || n.includes("war") || n.includes("legend") || n.includes("mythology") || n.includes("empire")) {
    return NICHE_RPM_PROFILES.history;
  }
  if (n.includes("crime") || n.includes("mystery") || n.includes("detective") || n.includes("unsolved") || n.includes("dark")) {
    return NICHE_RPM_PROFILES.mystery;
  }
  if (n.includes("motivation") || n.includes("quote") || n.includes("inspire") || n.includes("success")) {
    return NICHE_RPM_PROFILES.motivation;
  }
  if (n.includes("scary") || n.includes("horror") || n.includes("ghost") || n.includes("creepy") || n.includes("spooky")) {
    return NICHE_RPM_PROFILES.scary;
  }
  if (n.includes("game") || n.includes("gaming") || n.includes("esport") || n.includes("anime")) {
    return NICHE_RPM_PROFILES.gaming;
  }
  if (n.includes("humor") || n.includes("meme") || n.includes("funny") || n.includes("comedy") || n.includes("joke")) {
    return NICHE_RPM_PROFILES.humor;
  }

  return NICHE_RPM_PROFILES.default;
}

/**
 * Calculates aggregated RPM across multiple series
 */
export function calculateAggregatedRpm(seriesList: Array<{ niche?: string | null }>): {
  avgRpm: number;
  avgRpmFormatted: string;
  rpmRange: string;
  nichesSummary: string;
  nicheProfiles: NicheRpmProfile[];
} {
  if (!seriesList || seriesList.length === 0) {
    return {
      avgRpm: 0,
      avgRpmFormatted: "$0.00",
      rpmRange: "$0.00",
      nichesSummary: "No active niches",
      nicheProfiles: [],
    };
  }

  const profiles = seriesList.map((s) => getNicheRpmProfile(s.niche));
  const totalRpm = profiles.reduce((acc, p) => acc + p.avgRpm, 0);
  const avg = totalRpm / profiles.length;

  const uniqueNiches = Array.from(new Set(profiles.map((p) => p.displayName)));
  const nichesSummary =
    uniqueNiches.length <= 2
      ? uniqueNiches.join(" & ")
      : `${uniqueNiches.slice(0, 2).join(", ")} +${uniqueNiches.length - 2} more`;

  const minRpm = Math.min(...profiles.map((p) => p.avgRpm));
  const maxRpm = Math.max(...profiles.map((p) => p.avgRpm));
  const rpmRange = minRpm === maxRpm ? `$${minRpm.toFixed(2)}` : `$${minRpm.toFixed(2)} - $${maxRpm.toFixed(2)}`;

  return {
    avgRpm: Number(avg.toFixed(2)),
    avgRpmFormatted: `$${avg.toFixed(2)}`,
    rpmRange,
    nichesSummary,
    nicheProfiles: profiles,
  };
}
