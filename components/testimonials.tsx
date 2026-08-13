"use client";

import React from "react";
import {
  Star,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Quote,
} from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Marcus Vance",
    role: "Faceless Creator & YouTuber",
    channel: "@StoicMindsetOfficial",
    platform: "YouTube & TikTok",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    stats: "380K Subscribers • $6,400/mo AdSense",
    rating: 5,
    quote:
      "FacelessReels completely automated my workflow. I used to spend 15 hours every weekend editing reels manually. Now I generate and auto-schedule 60 reels on Monday morning in 15 minutes, and they post across YouTube and TikTok all week.",
  },
  {
    name: "Elena Rostova",
    role: "Media Page Operator",
    channel: "@DarkPsychologyVibe",
    platform: "Instagram & YouTube",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    stats: "1.2M Followers • $11,200/mo Brand Deals",
    rating: 5,
    quote:
      "The voiceovers sound so realistic that my audience constantly asks who my voice actor is. The Hormozi captions and auto-b-roll matching get 85%+ retention, which sends our reels straight to the Instagram Explore tab.",
  },
  {
    name: "David Kim",
    role: "Agency Founder & Growth Hacker",
    channel: "ViralFleet Media Agency",
    platform: "Multi-Account Fleet",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    stats: "12 Client Channels • 45M Total Views/Mo",
    rating: 5,
    quote:
      "We manage 12 faceless accounts for e-commerce brands. The email video digest integration alone increased our clients' newsletter click rates by 64%. The auto-scheduler has never missed a post in 8 months.",
  },
  {
    name: "Sarah Jenkins",
    role: "Newsletter Publisher",
    channel: "CuriousMind Daily",
    platform: "Email & Shorts",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    stats: "92K Email Subscribers • 48% Open Rate",
    rating: 5,
    quote:
      "Embedding the auto-generated animated video digests directly into my ConvertKit newsletter turned standard text emails into an interactive experience. Subscribers love the 30-second science reels.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 relative bg-[#07080c] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            Loved By 50,000+ Creators
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Real Creators. <span className="gradient-text-gold">Real Views & Revenue.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            See how solo creators and digital agencies use FacelessReels to build passive income streams and dominate short-form video algorithms.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-7 flex flex-col justify-between border border-white/10 relative hover:border-purple-500/30 transition-all duration-300 group"
            >
              <div>
                {/* Rating stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, rIdx) => (
                      <Star key={rIdx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-white/10 group-hover:text-purple-400/30 transition-colors" />
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Creator Info Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border border-purple-500/30"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1">
                      {item.name} <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    </h4>
                    <span className="text-[11px] text-slate-400">{item.channel}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-semibold text-emerald-400 block">
                    {item.stats}
                  </span>
                  <span className="text-[10px] text-slate-500">{item.platform}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
