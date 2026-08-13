"use client";

import React, { useState } from "react";
import {
  Mail,
  TrendingUp,
  CheckCircle2,
  Zap,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Send,
  Sparkles,
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

const CHANNELS = [
  {
    id: "youtube",
    name: "YouTube Shorts",
    badge: "Monetization Ready",
    badgeColor: "bg-red-500/15 text-red-300 border-red-500/30",
    icon: YoutubeIcon,
    iconColor: "text-red-400",
    gradient: "from-red-600/20 via-red-950/10 to-transparent",
    borderColor: "hover:border-red-500/50",
    headline: "Auto-Rank on the YouTube Shorts Feed",
    description:
      "Automated YouTube Data API publishing with AI-optimized titles, high-CTR descriptions, tags, and category indexing.",
    features: [
      "Official YouTube Partner API Integration",
      "Auto-generated SEO tags & searchable chapters",
      "Auto-pinned first comment with affiliate links",
      "100% Monetization-compliant AI voices & music",
    ],
    stats: "Avg 45k-250k views / short",
  },
  {
    id: "instagram",
    name: "Instagram Reels",
    badge: "Trending Audio Sync",
    badgeColor: "bg-pink-500/15 text-pink-300 border-pink-500/30",
    icon: InstagramIcon,
    iconColor: "text-pink-400",
    gradient: "from-pink-600/20 via-purple-950/10 to-transparent",
    borderColor: "hover:border-pink-500/50",
    headline: "Dominate Explore & Reels Algorithmic Feeds",
    description:
      "Direct Meta Graph API auto-scheduling that aligns with Instagram's peak engagement windows and auto-shares to Main Feed.",
    features: [
      "Meta Business Graph API direct publishing",
      "Dynamic hashtag clusters (30 targeted tags)",
      "Auto-share to Feed & Reels Explore tab",
      "Custom cover frame picker & link-in-bio prompt",
    ],
    stats: "3.8x higher profile follower conversion",
  },
  {
    id: "tiktok",
    name: "TikTok",
    badge: "Viral Loop Optimization",
    badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    icon: TikTokIcon,
    iconColor: "text-cyan-400",
    gradient: "from-cyan-600/20 via-slate-950/10 to-transparent",
    borderColor: "hover:border-cyan-500/50",
    headline: "Crack the For You Page (FYP) Every Day",
    description:
      "Trained on over 100,000 viral TikTok hooks with retention spikes, sound pairing, and auto-caption syncing.",
    features: [
      "TikTok Content Posting API automated queue",
      "Retention hook pacing (0.5s visual stimulus)",
      "Built-in TikTok SEO keyword captions",
      "Multi-account TikTok farm management",
    ],
    stats: "Up to 1.2M FYP algorithmic impressions",
  },
  {
    id: "email",
    name: "Email Video Digests",
    badge: "Unique Superpower",
    badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    icon: Mail,
    iconColor: "text-purple-400",
    gradient: "from-purple-600/20 via-indigo-950/10 to-transparent",
    borderColor: "hover:border-purple-500/50",
    headline: "Send Snackable Video Digests to Inboxes",
    description:
      "Deliver automated weekly or daily video digests with animated GIF embeds directly to your email subscriber list.",
    features: [
      "Compatible with Mailchimp, ConvertKit, Klaviyo & Beehiiv",
      "Auto-generates lightweight animated GIF previews",
      "Dynamic 1-click video landing page links",
      "Boosts newsletter open rates by +42% and CTR by +68%",
    ],
    stats: "48% higher newsletter click-through rate",
  },
];

export function ChannelMatrix() {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0].id);

  return (
    <section id="channels" className="py-20 lg:py-28 relative bg-[#07080c] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            4-In-1 Multi-Channel Autopilot
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            One AI Reel. Published to <span className="gradient-text-cyan">4 Viral Channels</span> at Once.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Never waste time manually downloading, reformatting, or uploading videos across individual apps. FacelessReels handles format adjustments, platform tags, and schedules everything on autopilot.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CHANNELS.map((ch) => {
            const Icon = ch.icon;
            const isActive = activeChannel === ch.id;

            return (
              <div
                key={ch.id}
                onMouseEnter={() => setActiveChannel(ch.id)}
                className={`rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between glass-card relative overflow-hidden group border ${
                  isActive ? "border-purple-500/40 shadow-xl shadow-purple-950/40" : "border-white/10"
                } ${ch.borderColor}`}
              >
                {/* Background Ambient Glow */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${ch.gradient} rounded-full blur-2xl pointer-events-none`}
                />

                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className={`w-6 h-6 ${ch.iconColor}`} />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${ch.badgeColor}`}>
                      {ch.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                    {ch.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {ch.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {ch.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Metric Pill */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Impact Metric:</span>
                  <span className="font-semibold text-emerald-400">{ch.stats}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cross-Posting Sync Flow Visual Banner */}
        <div className="mt-12 rounded-2xl glass-card p-6 sm:p-8 border border-white/10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-purple-600/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Automated Multi-Account Fleet Support
                </h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Run 10+ niche channels simultaneously across YouTube, Instagram, TikTok and Email with zero account bans.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-400">Official API Partner</span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% TOS Compliant
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
