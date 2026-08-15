"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  ShieldCheck,
  CreditCard,
  Layers,
  Crown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PLANS, PlanType } from "@/lib/plan-limits";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

export interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  reason?: "series_limit" | "platform_locked" | "custom";
  currentPlan?: PlanType | string;
  recommendedPlan?: "basic" | "unlimited";
  lockedPlatformName?: "Instagram Reels" | "TikTok" | string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  title,
  description,
  reason = "series_limit",
  currentPlan = "free",
  recommendedPlan = "unlimited",
  lockedPlatformName,
}: UpgradeModalProps) {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    onClose();
    router.push("/dashboard/billing");
  };

  const currentPlanNormalized = (currentPlan || "free").toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0e101a] border border-slate-200 dark:border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-purple-950/40 text-slate-900 dark:text-slate-100 space-y-6 overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Close Button */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <div className="w-full h-full bg-[#0e101a] rounded-[14px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {title || (reason === "platform_locked" ? "Unlock All Social Media Platforms" : "Upgrade Your Plan")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {description ||
                  (reason === "platform_locked"
                    ? `${lockedPlatformName || "Instagram Reels & TikTok"} integration requires the Unlimited Plan.`
                    : currentPlanNormalized === "free"
                    ? "You have reached the 1-series limit on your Free plan. Upgrade to unlock more series."
                    : "You have reached the 3-series limit on your Basic plan. Upgrade to Unlimited for infinite series.")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plan Limits Notice Pill */}
        <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="text-purple-900 dark:text-purple-200 font-medium">
              Current Tier: <strong className="uppercase font-bold">{currentPlan}</strong>
            </span>
          </div>
          <span className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
            {currentPlanNormalized === "free"
              ? "Max 1 Series • YouTube & Email Only"
              : currentPlanNormalized === "basic"
              ? "Max 3 Series • YouTube & Email Only"
              : "Unlimited Series • All 4 Platforms"}
          </span>
        </div>

        {/* Plan Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {/* 1. Basic Plan Card */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              recommendedPlan === "basic"
                ? "border-purple-500/50 bg-gradient-to-b from-purple-50 dark:from-purple-950/20 to-white dark:to-[#121526] shadow-md"
                : "border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#121526]/50"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Basic Plan</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                  Up to 3 Series
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">$19</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Run 3 automated channels simultaneously.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>3 Automated Video Series</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>YouTube Shorts & Email Dispatch</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>OpenAI DALL-E 3 HD 4K Scenes</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] line-through">
                  <Lock className="w-3 h-3 shrink-0" />
                  <span>Instagram & TikTok (Unlimited Only)</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleUpgradeClick}
              className="w-full py-2.5 px-3 rounded-xl border border-purple-500/30 bg-purple-50 dark:bg-purple-600/20 hover:bg-purple-100 dark:hover:bg-purple-600/30 text-purple-700 dark:text-purple-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Choose Basic ($19/mo)
            </button>
          </div>

          {/* 2. Unlimited Plan Card */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 relative ${
              recommendedPlan === "unlimited" || reason === "platform_locked"
                ? "border-purple-500 shadow-xl shadow-purple-950/30 bg-gradient-to-b from-purple-50 via-white to-white dark:from-purple-950/30 dark:to-[#121526]"
                : "border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#121526]/50"
            }`}
          >
            <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-[9px] font-extrabold uppercase tracking-wide shadow">
              Recommended
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Unlimited</span>
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                  Infinite Series
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">$49</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Full social automation suite with all 4 platforms.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Unlimited</strong> Automated Series</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span><strong>ALL 4 Platforms</strong> (YouTube, IG, TikTok, Email)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>OpenAI DALL-E 3 HD 4K Quality</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Priority 24/7 Render Queue</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleUpgradeClick}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>Upgrade to Unlimited ($49/mo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>14-day money-back guarantee • Cancel anytime</span>
          </div>
          <button
            onClick={onClose}
            className="hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
