"use client";

import React from "react";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-20 relative overflow-hidden bg-[#07080c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden border border-purple-500/30 bg-gradient-to-br from-purple-900/40 via-[#121424] to-[#0d0f1a] shadow-2xl shadow-purple-950/60 text-center">
          {/* Ambient Lighting */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-500/30 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/25 rounded-full blur-[90px] pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            {/* Top pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-purple-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-cyan-300" />
              Launch Your First 30 Days of Content Today
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Put Your Faceless Channels on{" "}
              <span className="gradient-text-rainbow">100% Autopilot?</span>
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Stop spending hours editing videos. Start creating high-retention viral reels for YouTube Shorts, Instagram, TikTok & Email in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="#live-demo"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-400 text-white font-bold text-base shadow-xl shadow-purple-600/40 hover:shadow-purple-600/60 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
              >
                <Sparkles className="w-5 h-5 text-cyan-200" />
                <span>Create & Schedule First Reel Free</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Micro Guarantees */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 pt-3">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3 Free AI Reels on Sign Up
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Credit Card Required
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 14-Day Money-Back Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
