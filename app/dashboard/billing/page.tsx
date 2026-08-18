"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Receipt,
  Layers,
  HelpCircle,
  Clock,
  Tv,
  Film,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useUser, PricingTable, useClerk } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { getPlanLimits, PlanType } from "@/lib/plan-limits";
import { getUserSubscriptionInfo, UserSubscriptionInfo } from "@/app/actions/billing";

export default function BillingPage() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const { theme } = useTheme();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [showClerkPricing, setShowClerkPricing] = useState<boolean>(true);

  const [subInfo, setSubInfo] = useState<UserSubscriptionInfo | null>(null);

  useEffect(() => {
    async function loadSub() {
      try {
        const info = await getUserSubscriptionInfo();
        setSubInfo(info);
      } catch (err) {
        // ignore
      }
    }
    loadSub();
  }, []);

  const userPlanKey =
    subInfo?.planKey ||
    (user?.publicMetadata?.plan as string) ||
    (user?.unsafeMetadata?.plan as string) ||
    "free";
  const userPlan = getPlanLimits(userPlanKey);

  const isDarkMode = theme === "dark" || theme === "system";

  const handleManageClerkBilling = () => {
    openUserProfile();
  };

  const isFreeActive = userPlan.id === "free";
  const isBasicActive = userPlan.id === "basic";
  const isUnlimitedActive = userPlan.id === "unlimited";

  const plans = [
    {
      name: "Free Plan",
      tier: "free",
      price: "$0",
      period: "forever",
      description: "For creators starting their first automated faceless channel",
      current: isFreeActive,
      features: [
        "1 Active Automated Video Series",
        "YouTube Shorts & Email Channels Only",
        "Google Gemini Viral Script Generation",
        "Deepgram & Fonada Neural Voiceovers",
        "Standard Video Production Queue",
        "Community Support & Guides",
      ],
      cta: "Current Free Tier",
      badge: "Starter",
    },
    {
      name: "Basic Plan",
      tier: "basic",
      price: billingCycle === "yearly" ? "$15" : "$19",
      period: "/month",
      popular: isBasicActive,
      description: "For growing creators managing up to 3 video pipelines",
      features: [
        "Up to 3 Automated Video Series Simultaneously",
        "YouTube Shorts & Email Channels",
        "OpenAI ChatGPT DALL-E 3 HD 4K Scene Generation",
        "Custom Background Music CDN Mixing & Looping",
        "30-Day Auto-Scheduler with 2h Pre-Generation",
        "Target Niches RPM Monetization Intelligence",
      ],
      cta: isBasicActive ? "Active Plan" : "Upgrade to Basic",
      badge: "Growth",
    },
    {
      name: "Unlimited Plan",
      tier: "unlimited",
      price: billingCycle === "yearly" ? "$39" : "$49",
      period: "/month",
      popular: true,
      description: "For professional creators & agencies scaling across all social networks",
      features: [
        "Unlimited Automated Video Series Simultaneously",
        "ALL 4 Platforms (YouTube, Instagram Reels, TikTok, Email)",
        "OpenAI ChatGPT DALL-E 3 HD 4K Scene Generation",
        "Custom Background Music CDN Mixing & Looping",
        "Full Multi-Channel Simultaneous Auto-Dispatch",
        "Priority 24/7 AWS Lambda Rendering Queue",
        "Custom Art Styles & Unlimited Edits",
      ],
      cta: isUnlimitedActive ? "Active Plan" : "Upgrade to Unlimited",
      badge: "Most Popular",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. TOP HEADER & ACTIVE QUOTA SUMMARY */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#0c0e18]/80 border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Subscription & Billing
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your Clerk billing subscription, AI video quotas, and payment methods
              </p>
            </div>
          </div>
        </div>

        {/* User Account & Manage Billing Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
              Signed in as
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {user?.primaryEmailAddress?.emailAddress || "Creator Account"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleManageClerkBilling}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Receipt className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Manage Customer Portal</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. USAGE & QUOTA CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Monthly Reel Quota</span>
            <Film className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            3 / 3 <span className="text-xs font-normal text-slate-400">Reels</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div className="h-full bg-purple-600 rounded-full w-full" />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Free trial quota (Reset on upgrade)
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Video Resolution</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            4K UHD
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" /> OpenAI DALL-E 3 HD Enabled
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Automated Channels</span>
            <Tv className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            4 Platforms
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            YouTube, Instagram, TikTok & Email
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Scheduler Status</span>
            <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Autopilot
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            2h pre-generation & sleep active
          </p>
        </div>
      </div>

      {/* 3. CLERK BILLING PRICING TABLE CONTAINER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Available Plans & Upgrades</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Powered by Clerk Billing & Stripe with instant activation
            </p>
          </div>

          {/* Toggle between Clerk Pricing Table and Interactive Plan Cards */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowClerkPricing(!showClerkPricing)}
              className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors cursor-pointer"
            >
              {showClerkPricing ? "View Custom Grid View" : "View Clerk Pricing Table"}
            </button>
          </div>
        </div>

        {/* EMBEDDED CLERK BILLING PRICING TABLE */}
        {showClerkPricing && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e18] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden min-h-[300px]">
            <PricingTable
              appearance={
                {
                  baseTheme: isDarkMode ? dark : undefined,
                  variables: {
                    colorPrimary: "#7c3aed",
                    borderRadius: "1rem",
                  },
                } as any
              }
            />
          </div>
        )}

        {/* CUSTOM INTERACTIVE PRICING CARDS */}
        {!showClerkPricing && (
          <div className="space-y-6 animate-fade-in">
            {/* Monthly / Annual Selector */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0c0e18] p-1 rounded-full border border-slate-200 dark:border-white/10 text-xs">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-purple-600 text-white font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === "yearly"
                      ? "bg-purple-600 text-white font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>Annual (Save 25%)</span>
                  <span className="px-1.5 py-0.2 bg-cyan-400 text-black text-[9px] font-bold rounded-full">
                    2 MONTHS FREE
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-6 relative overflow-hidden shadow-sm hover:shadow-md dark:shadow-xl ${
                    plan.popular
                      ? "border-purple-500/60 shadow-xl shadow-purple-950/20 bg-gradient-to-b from-purple-50 via-white to-white dark:from-purple-950/20 dark:to-[#0e101d]"
                      : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0e18]/80"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-[10px] font-extrabold uppercase tracking-wide shadow">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1 pt-2">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{plan.period}</span>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-white/10">
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-2">
                        What's included:
                      </span>
                      {plan.features.map((feat) => (
                        <div
                          key={feat}
                          className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-white/10">
                    <button
                      onClick={handleManageClerkBilling}
                      disabled={plan.current}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        plan.current
                          ? "bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 cursor-default"
                          : plan.popular
                          ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30 hover:opacity-95"
                          : "bg-purple-600/10 hover:bg-purple-600/20 dark:bg-purple-600/20 dark:hover:bg-purple-600/40 border border-purple-500/40 text-purple-700 dark:text-purple-200"
                      }`}
                    >
                      {plan.current ? (
                        <span>Active Free Tier</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-cyan-200" />
                          <span>{plan.cta}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. TRUST & GUARANTEE BANNER */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e18]/80 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">14-Day Money-Back Guarantee</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Upgrade risk-free. Cancel anytime in 1 click via your Clerk Customer Portal.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
          <span>🔒 256-Bit SSL Checkout</span>
          <span>•</span>
          <span>Powered by Clerk & Stripe</span>
        </div>
      </div>
    </div>
  );
}
