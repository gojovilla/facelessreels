"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      name: "Free Trial",
      tier: "free",
      price: "$0",
      period: "forever",
      description: "Test AI reel generation with no card needed",
      current: true,
      features: [
        "3 Free AI Generated 1080p Reels",
        "1 Connected Social Channel",
        "Standard Neural Voiceovers",
        "Auto-captions with Hormozi presets",
        "Community Support",
      ],
      cta: "Current Plan",
    },
    {
      name: "Creator Pro",
      tier: "pro",
      price: billingCycle === "yearly" ? "$29" : "$39",
      period: "/month",
      popular: true,
      description: "For creators scaling 1–3 monetized channels",
      features: [
        "60 AI Generated 4K Viral Reels / Month",
        "All 4 Platforms (YouTube, IG, TikTok, Email)",
        "30-Day Automated Calendar Scheduler",
        "150+ Ultra-Realistic Neural Voices",
        "Premium B-Roll & Dynamic FX",
        "Viral Score & Retention Prediction",
        "Priority 24/7 Render Queue",
      ],
      cta: "Upgrade to Pro",
    },
    {
      name: "Agency Autopilot",
      tier: "agency",
      price: billingCycle === "yearly" ? "$79" : "$99",
      period: "/month",
      description: "Scale a faceless media empire with unlimited pipelines",
      features: [
        "200 AI Generated 4K Reels / Month",
        "Unlimited Connected Channels",
        "10 Automated 30-Day Series Simultaneously",
        "Custom Voice Cloning in Any Language",
        "Custom Brand Logos & Watermarks",
        "Team Members & Multi-User Access",
        "Dedicated Account Strategist",
      ],
      cta: "Upgrade to Agency",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Billing Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-purple-400" />
            Subscription & Billing
          </h1>
          <p className="text-xs text-slate-400">
            Manage your AI reel generation limits, active plan, and billing history
          </p>
        </div>

        {/* Monthly/Yearly Toggle */}
        <div className="flex items-center gap-2 bg-[#0c0e18] p-1 rounded-full border border-white/10 text-xs">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-3 py-1.5 rounded-full transition-all ${
              billingCycle === "monthly"
                ? "bg-purple-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              billingCycle === "yearly"
                ? "bg-purple-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Annual</span>
            <span className="px-1.5 py-0.2 bg-cyan-400 text-black text-[9px] font-bold rounded-full">
              Save 25%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-card rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-6 relative overflow-hidden ${
              plan.popular
                ? "border-purple-500/60 shadow-xl shadow-purple-950/40 bg-gradient-to-b from-purple-950/20 to-[#0e101d]"
                : "border-white/10 bg-[#0c0e18]/80"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-[10px] font-extrabold uppercase tracking-wide">
                Most Popular
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                <span className="text-xs text-slate-400">{plan.period}</span>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-white/10">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  What's included:
                </span>
                {plan.features.map((feat) => (
                  <div
                    key={feat}
                    className="flex items-start gap-2 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                disabled={plan.current}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  plan.current
                    ? "bg-white/[0.05] border border-white/10 text-slate-400 cursor-default"
                    : plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30 hover:opacity-95 cursor-pointer"
                    : "bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 cursor-pointer"
                }`}
              >
                {plan.current ? (
                  <span>Active Free Plan</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white">14-Day Money-Back Guarantee</h4>
            <p className="text-[11px] text-slate-400">
              Cancel anytime in 1 click. Zero questions asked.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-4">
          <span>🔒 256-Bit Encrypted Checkout</span>
          <span>•</span>
          <span>Powered by Stripe</span>
        </div>
      </div>
    </div>
  );
}
