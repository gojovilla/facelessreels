"use client";

import React from "react";
import {
  Wand2,
  Cpu,
  Send,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

const STEPS = [
  {
    step: "01",
    title: "Select Niche or Prompt",
    description:
      "Choose from 50+ pre-built high-RPM niches (Stoicism, Dark Psychology, Reddit Tales, Tech, Finance) or enter any custom prompt, URL, or article.",
    badge: "10 Seconds",
    icon: Wand2,
    gradient: "from-purple-600 to-indigo-600",
    illustration: (
      <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs font-mono space-y-2 text-slate-300">
        <div className="text-purple-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Prompt Input
        </div>
        <div className="p-2 rounded bg-white/[0.04] text-slate-200">
          &ldquo;Generate 30 short videos about unexpected historical secrets with dramatic hooks...&rdquo;
        </div>
        <div className="flex gap-2 text-[10px] text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">#History</span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">#HighRetention</span>
        </div>
      </div>
    ),
  },
  {
    step: "02",
    title: "AI Compiles the Full Video",
    description:
      "The neural engine writes the viral script, synthesizes human voiceover, matches 4K cinematic b-roll, synchronizes sound effects, and adds Hormozi kinetic captions.",
    badge: "30 Seconds",
    icon: Cpu,
    gradient: "from-indigo-600 to-cyan-500",
    illustration: (
      <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs space-y-2 text-slate-300">
        <div className="flex items-center justify-between text-xs font-medium text-cyan-400">
          <span>Rendering Reel Matrix</span>
          <span>100% Ready</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-full rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="p-1.5 rounded bg-white/[0.04] flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> Voice: Deep Baritone
          </div>
          <div className="p-1.5 rounded bg-white/[0.04] flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> Captions: Hormozi Pop
          </div>
        </div>
      </div>
    ),
  },
  {
    step: "03",
    title: "Autopilot Schedules & Posts",
    description:
      "Your video automatically queues into the scheduler calendar. It publishes at the best peak times directly to YouTube Shorts, Instagram Reels, TikTok & Email.",
    badge: "100% Hands-Free",
    icon: Send,
    gradient: "from-cyan-500 to-emerald-500",
    illustration: (
      <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs space-y-2 text-slate-300">
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
          <span>Auto-Dispatch Complete</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Published</span>
        </div>
        <div className="flex items-center justify-between pt-1 text-slate-200">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <span className="w-5 h-5 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center text-[10px] text-red-300 font-bold">Y</span>
              <span className="w-5 h-5 rounded-full bg-pink-600/30 border border-pink-500 flex items-center justify-center text-[10px] text-pink-300 font-bold">I</span>
              <span className="w-5 h-5 rounded-full bg-cyan-600/30 border border-cyan-500 flex items-center justify-center text-[10px] text-cyan-300 font-bold">T</span>
              <span className="w-5 h-5 rounded-full bg-purple-600/30 border border-purple-500 flex items-center justify-center text-[10px] text-purple-300 font-bold">E</span>
            </div>
            <span className="text-[11px]">4 Channels Synced</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Today @ 6:00 PM</span>
        </div>
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 relative bg-[#07080c] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Simple 3-Step System
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            How to Build a Faceless Channel in <span className="gradient-text-purple">Under 3 Minutes</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            No video editing skills, no expensive studio equipment, and no showing your face. Follow three simple steps to start ranking across all algorithms.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl p-7 flex flex-col justify-between border border-white/10 relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-extrabold font-mono text-white/20 group-hover:text-purple-400/60 transition-colors">
                    {step.step}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300">
                    {step.badge}
                  </span>
                </div>

                {/* Step Content */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Visual Step Illustration */}
                <div className="mt-auto">{step.illustration}</div>
              </div>
            );
          })}
        </div>

        {/* Action button */}
        <div className="mt-12 text-center">
          <a
            href="#live-demo"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white font-semibold text-sm transition-all hover:border-purple-500/50"
          >
            <span>Try the 3-Step Generator Live</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
          </a>
        </div>
      </div>
    </section>
  );
}
