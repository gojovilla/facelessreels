"use client";

import React, { useState } from "react";
import {
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Flame,
} from "lucide-react";

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      tagline: "For solo creators testing their first faceless channel",
      monthlyPrice: 24,
      annualPrice: 19,
      popular: false,
      badge: "Beginner",
      features: [
        "30 AI Generated Shorts / month",
        "1080p 60FPS Full HD Export",
        "Auto-Schedule to YouTube Shorts & TikTok",
        "30+ Neural Voiceover options",
        "Classic & Hormozi Animated Captions",
        "Standard B-Roll Video Matching",
        "Email Support",
      ],
      ctaText: "Start Free 7-Day Trial",
      ctaLink: "#live-demo",
      buttonStyle: "bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10",
    },
    {
      name: "Pro Growth",
      tagline: "Best for serious creators building a multi-channel media empire",
      monthlyPrice: 59,
      annualPrice: 45,
      popular: true,
      badge: "Most Popular",
      features: [
        "120 AI Generated Shorts / month (4 posts/day)",
        "4K Ultra HD Cinema Quality Rendering",
        "Full 4-Channel Auto-Scheduler (YouTube, IG, TikTok, Email)",
        "150+ Ultra-Realistic Neural Voices in 40+ languages",
        "Voice Cloning (Clone your own or custom brand voice)",
        "All Caption Styles (Hormozi, MrBeast, Cyberpunk, Custom)",
        "AI Peak-Time Algorithm & 30-Day Auto-Refill Queue",
        "Direct Email Video Digest Newsletter Generator",
        "Priority GPU Render Speed (2x faster)",
      ],
      ctaText: "Claim Pro Growth (7-Day Trial)",
      ctaLink: "#live-demo",
      buttonStyle: "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02]",
    },
    {
      name: "Agency Empire",
      tagline: "For agencies & media managers running multiple client fleets",
      monthlyPrice: 129,
      annualPrice: 99,
      popular: false,
      badge: "Max Scale",
      features: [
        "Unlimited AI Generated Shorts / month",
        "Manage up to 15 Connected Social & Email Channels",
        "Full 4-Channel Auto-Scheduler with Multi-Account Fleet",
        "Unlimited Email Video Digest blasts",
        "White-label exports & custom brand watermarks",
        "Full Developer REST API & Webhook Access",
        "Dedicated Channel Growth Manager & Private Slack Channel",
        "Commercial monetization & copyright indemnification",
      ],
      ctaText: "Scale Your Agency",
      ctaLink: "#live-demo",
      buttonStyle: "bg-white/[0.05] hover:bg-purple-600 text-white border border-white/10 hover:border-purple-500",
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 relative bg-[#090a0f] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            Transparent & High-ROI Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Invest in an Autopilot Media Machine That <span className="gradient-text-purple">Pays For Itself</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            A single freelance video editor costs $1,500+/mo. FacelessReels generates, edits, captions, and auto-schedules daily reels for a fraction of the cost.
          </p>

          {/* Billing Interval Toggle */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                !annual ? "bg-purple-600 text-white shadow-md shadow-purple-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                annual ? "bg-purple-600 text-white shadow-md shadow-purple-600/30" : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-extrabold uppercase">
                Save 25% + 2 Mo Free
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={idx}
                className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                  plan.popular
                    ? "bg-[#111422] border-2 border-purple-500/80 shadow-2xl shadow-purple-600/20 scale-105 z-20"
                    : "glass-card border border-white/10 hover:border-white/20"
                }`}
              >
                {/* Popular Glow / Top Ribbon */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> {plan.badge}
                  </div>
                )}

                <div>
                  {/* Title & Tagline */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    {!plan.popular && (
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-slate-400">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-6 min-h-[32px]">{plan.tagline}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-white/10">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white">${price}</span>
                    <span className="text-sm text-slate-400">/ month</span>
                    {annual && (
                      <span className="text-[11px] text-emerald-400 ml-2 font-medium">
                        (Billed annually)
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
                      Included in {plan.name}:
                    </span>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div>
                  <a
                    href={plan.ctaLink}
                    className={`w-full py-3.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${plan.buttonStyle}`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <p className="text-[11px] text-center text-slate-400 mt-3">
                    14-Day Money-Back Guarantee • Cancel Anytime
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-14 max-w-2xl mx-auto p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center gap-3 text-center text-xs text-slate-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <strong>100% Risk-Free Guarantee:</strong> Try FacelessReels for 14 days. If your channels don&apos;t get views or you are unsatisfied for any reason, get a full 100% refund.
          </span>
        </div>
      </div>
    </section>
  );
}
