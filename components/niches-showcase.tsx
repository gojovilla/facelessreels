"use client";

import React, { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Eye,
  ArrowRight,
  Flame,
  Star,
  CheckCircle2,
} from "lucide-react";

const NICHES_LIST = [
  {
    title: "Dark Psychology & Manipulation",
    category: "Psychology & Mindset",
    emoji: "🧠",
    rpm: "$4.80 - $7.20 RPM",
    views: "2.8M avg views",
    difficulty: "Beginner Friendly",
    hookExample: "3 subtle body language tricks to immediately know if someone is lying to your face...",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    growthBadge: "+340% Trend Growth",
  },
  {
    title: "Stoic Philosophy & Marcus Aurelius",
    category: "Motivation & Life Rules",
    emoji: "🏛️",
    rpm: "$5.50 - $8.90 RPM",
    views: "1.9M avg views",
    difficulty: "Easy Automation",
    hookExample: "Marcus Aurelius wrote this in his private journal when he was betrayed by his closest general...",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
    growthBadge: "Evergreen Monetization",
  },
  {
    title: "Scary Encounters & Reddit Lore",
    category: "Horror & True Mystery",
    emoji: "👻",
    rpm: "$3.80 - $5.50 RPM",
    views: "4.2M avg views",
    difficulty: "Highest Loop Rate",
    hookExample: "I worked as a deep sea welder on an offshore rig. In 2019, we saw something at 400 feet depth...",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    growthBadge: "Maximum Viral Potential",
  },
  {
    title: "Wealth Rules & Hidden Tax Loopholes",
    category: "Finance & Investing",
    emoji: "💰",
    rpm: "$9.50 - $16.00 RPM",
    views: "1.4M avg views",
    difficulty: "High Sponsor RPM",
    hookExample: "Why the top 1% never sell their stock to buy real estate: The 'Buy, Borrow, Die' method...",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
    growthBadge: "Highest RPM Niche",
  },
  {
    title: "Cosmic Mysteries & Deep Space",
    category: "Science & Curiosity",
    emoji: "🚀",
    rpm: "$5.20 - $7.80 RPM",
    views: "3.1M avg views",
    difficulty: "Global Appeal",
    hookExample: "The James Webb Telescope just found a structure in deep space that shouldn't exist by current physics...",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    growthBadge: "Global Virality",
  },
  {
    title: "Mythology, Gods & Ancient Lore",
    category: "History & Folklore",
    emoji: "⚡",
    rpm: "$4.50 - $6.90 RPM",
    views: "2.4M avg views",
    difficulty: "High Share Rate",
    hookExample: "Why Zeus was terrified of Nyx, the primordial goddess of Night, when even Titans feared him...",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    growthBadge: "Crazy Retention",
  },
];

export function NichesShowcase() {
  return (
    <section id="niches" className="py-20 lg:py-28 relative bg-[#07080c] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Flame className="w-3.5 h-3.5 text-pink-400" />
            50+ Pre-Configured Niches
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Top <span className="gradient-text-rainbow">High-RPM Niches</span> Ready to Launch
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Don&apos;t know what to post? Choose from our battle-tested niche templates proven to drive millions of views, high ad revenue, and fast subscriber growth.
          </p>
        </div>

        {/* Niche Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NICHES_LIST.map((niche, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/40 transition-all duration-300 flex flex-col group"
            >
              {/* Thumbnail image header */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={niche.image}
                  alt={niche.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-[#11131c]/40 to-transparent" />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white flex items-center gap-1.5">
                  <span>{niche.emoji}</span>
                  <span>{niche.category}</span>
                </div>

                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-purple-600/80 backdrop-blur-md text-[10px] font-bold text-white">
                  {niche.growthBadge}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                    {niche.title}
                  </h3>

                  {/* Hook preview box */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 italic font-mono leading-relaxed mb-4">
                    &ldquo;{niche.hookExample}&rdquo;
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Est. Revenue:</span>
                      <span className="font-semibold text-emerald-400">{niche.rpm}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Avg. Reach:</span>
                      <span className="font-semibold text-cyan-300">{niche.views}</span>
                    </div>
                  </div>
                </div>

                {/* Launch Button */}
                <a
                  href="#live-demo"
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-purple-600 border border-white/10 hover:border-purple-500 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <span>1-Click Auto-Schedule This Niche</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
