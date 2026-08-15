"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Zap,
  TrendingUp,
  Star,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";

export function HeroSection() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const handleDashboardAction = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      openSignIn({
        fallbackRedirectUrl: "/dashboard",
      });
    }
  };

  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-grid-pattern">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-purple-600/20 via-indigo-600/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-7">
          {/* Release Announcement Pill */}
          <div
            onClick={handleDashboardAction}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-purple-500/30 backdrop-blur-md shadow-lg shadow-purple-500/10 hover:border-purple-500/50 transition-all cursor-pointer group"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-xs font-semibold text-purple-300">
              New: Multi-Platform Autopilot v2.4
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1 transition-colors">
              Schedule 30 Days in 1-Click <ArrowRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Create & Auto-Schedule{" "}
            <span className="gradient-text-purple">100% Faceless</span> Viral Shorts on Autopilot
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Generate high-retention short videos with AI scriptwriting, hyper-realistic voiceovers, dynamic captions, and 4K visual b-roll. Automatically publish to{" "}
            <span className="text-red-400 font-semibold">YouTube Shorts</span>,{" "}
            <span className="text-pink-400 font-semibold">Instagram Reels</span>,{" "}
            <span className="text-cyan-300 font-semibold">TikTok</span> &{" "}
            <span className="text-purple-300 font-semibold">Email Video Digests</span> without lifting a finger.
          </p>

          {/* CTA Buttons (Dashboard / Auth Integrated) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleDashboardAction}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>{isSignedIn ? "Go to Dashboard" : "Start Free — Open Dashboard"}</span>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleDashboardAction}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-semibold text-base backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:border-purple-500/40 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-400" />
              <span>Launch Creator Dashboard</span>
            </button>
          </div>

          {/* Guarantee / Micro Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free 3 AI videos on sign up
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Auto-saved to your account
            </span>
          </div>

          {/* Social Proof Banner */}
          <div className="pt-8 border-t border-white/[0.08] max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-6 text-center">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#090a0f]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Creator" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#090a0f]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Creator" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#090a0f]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Creator" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#090a0f]" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Creator" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-xs font-bold text-white ml-1">4.9/5</span>
                </div>
                <p className="text-[11px] text-slate-400">from 1,420+ creators</p>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <div className="text-left">
                <div className="text-sm font-bold text-white">140M+ Views</div>
                <div className="text-[11px] text-slate-400">Generated on autopilot</div>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <div className="text-left">
                <div className="text-sm font-bold text-white">35 Hours/Wk</div>
                <div className="text-[11px] text-slate-400">Saved per channel</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
