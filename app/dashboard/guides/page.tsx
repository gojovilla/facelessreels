"use client";

import React from "react";
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  Flame,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";

export default function GuidesPage() {
  const guides = [
    {
      id: "1",
      title: "How to Build a $10k/Mo Faceless Channel in 90 Days",
      category: "Blueprint",
      readTime: "6 min read",
      description:
        "The exact step-by-step strategy to hit YouTube monetization threshold and Instagram Creator bonus using automated 3x daily schedule.",
      tags: ["Monetization", "Strategy", "RPM"],
    },
    {
      id: "2",
      title: "Top 10 Highest-RPM Faceless Niches in 2026",
      category: "Market Research",
      readTime: "8 min read",
      description:
        "A breakdown of $8–$18 RPM categories including Luxury Real Estate, AI Tech News, Stock Market Wealth, and Dark Psychology.",
      tags: ["RPM Data", "Niche Analysis"],
    },
    {
      id: "3",
      title: "The 3-Second Hook Formula for 80%+ Retention",
      category: "Scripting",
      readTime: "4 min read",
      description:
        "How our neural script engine generates psychological curiosity loops that prevent users from swiping away on Shorts and TikTok FYP.",
      tags: ["Algorithm", "Retention"],
    },
    {
      id: "4",
      title: "Monetization Compliance: Never Get Reused Content Strikes",
      category: "Legal & Safety",
      readTime: "5 min read",
      description:
        "Why our AI uses commercial licensed dynamic b-roll, generated neural scripts, and original audio frequencies to ensure 100% YouTube AdSense approval.",
      tags: ["AdSense Safe", "Copyright"],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Guide Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-purple-100 via-white to-cyan-50 dark:from-purple-950/40 dark:via-[#0e101d] dark:to-cyan-950/20 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold uppercase">
                Creator Academy
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Faceless Channel Growth Guides & Blueprints
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Master the algorithms of YouTube Shorts, Instagram Reels, and TikTok. Learn how top faceless creators scale to 10M+ views per month.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-center shadow-sm">
              <div className="text-xl font-bold text-slate-900 dark:text-white">4.9/5</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Creator Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="rounded-3xl p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0e18]/80 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 group cursor-pointer shadow-sm hover:shadow-md dark:shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold text-[10px]">
                  {guide.category}
                </span>
                <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  {guide.readTime}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-200 transition-colors leading-snug">
                {guide.title}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {guide.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {guide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-[10px] text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
              <span>Read Full Blueprint</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
