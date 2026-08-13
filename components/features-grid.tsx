"use client";

import React from "react";
import {
  Wand2,
  Mic,
  Type,
  Video,
  Calendar,
  Mail,
  Zap,
  TrendingUp,
  Sparkles,
  Bot,
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  Palette,
  Globe2,
} from "lucide-react";

const FEATURES = [
  {
    icon: Wand2,
    title: "AI Scriptwriting & Hook Generator",
    description:
      "Trained on 500k+ top viral reels. Automatically writes retention-engineered hooks, curiosity gaps, and perfect loop endings.",
    tag: "GPT-4o + Claude 3.5",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    details: ["3-Second hook optimizer", "Loop closure for infinite views", "Niche-specific tone matching"],
  },
  {
    icon: Mic,
    title: "150+ Neural Human Voiceovers",
    description:
      "Studio-grade neural voices with authentic emotional inflection, breath pacing, and multi-language translation in 40+ languages.",
    tag: "Ultra-Realistic AI",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    details: ["Deep baritone, cinematic & energetic styles", "Voice cloning for custom branding", "Automatic background audio leveling"],
  },
  {
    icon: Type,
    title: "Dynamic Hormozi Auto-Captions",
    description:
      "Word-by-word animated subtitles with custom glowing highlights, bouncy kinetic emojis, and font presets that double watch time.",
    tag: "Retention Magnet",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    details: ["99.4% speech-to-text accuracy", "Custom brand color palettes", "Auto-animated emoji triggers"],
  },
  {
    icon: Video,
    title: "Cinematic 4K Visual B-Roll Matching",
    description:
      "Context-aware AI pairs your script with stunning 4K stock clips, AI generative video scenes, and smooth transitions every 2 seconds.",
    tag: "High-Budget Feel",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    details: ["Millions of 4K royalty-free clips", "AI generative scene generator", "Smart zoom & pan effects"],
  },
  {
    icon: Calendar,
    title: "Autopilot Scheduler & Timezone AI",
    description:
      "Set your publishing schedule once. The AI automatically schedules posts at peak engagement windows across YouTube, IG, and TikTok.",
    tag: "True Autopilot",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    details: ["30-Day automated content queue", "Peak traffic time algorithm", "Multi-account channel fleet"],
  },
  {
    icon: Mail,
    title: "Direct Email Video Digest Blasts",
    description:
      "Automatically convert reels into responsive animated newsletter digests with GIF previews and links sent directly to your list.",
    tag: "Newsletter Growth",
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
    details: ["Mailchimp & ConvertKit 1-click sync", "Instant GIF preview rendering", "+68% newsletter click rate"],
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 lg:py-28 relative bg-[#090a0f] overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Complete AI Video Production Suite
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Everything You Need to Run a{" "}
            <span className="gradient-text-purple">7-Figure Media Network</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            From prompt to published post, FacelessReels replaces expensive video editors, voice actors, scriptwriters, and social media managers.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="glass-card-hover rounded-2xl p-7 flex flex-col justify-between border border-white/10 relative overflow-hidden group"
              >
                <div>
                  {/* Top Icon & Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feature.bg} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300">
                      {feature.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                {/* Sub Features Bullet Checklist */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  {feature.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
