"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Tv,
  Sparkles,
  Play,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  MoreVertical,
  Sliders,
  Layers,
  Wand2,
  Zap,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { CreateSeriesModal } from "@/components/dashboard/create-series-modal";

export default function DashboardSeriesPage() {
  const { user } = useUser();
  const [modalOpen, setModalOpen] = useState(false);

  const seriesList = [
    {
      id: "1",
      title: "Dark Psychology Tricks",
      niche: "Psychology & Facts",
      voice: "Marcus (Deep Stoic)",
      frequency: "Daily @ 6:30 PM",
      totalVideos: 30,
      publishedVideos: 12,
      scheduledVideos: 18,
      status: "active",
      channels: ["youtube", "instagram", "tiktok"],
      views: "482,000",
      rpm: "$4.80",
    },
    {
      id: "2",
      title: "Marcus Aurelius Stoic Rules",
      niche: "Stoic Philosophy",
      voice: "Adam (Viral Storyteller)",
      frequency: "Daily @ 9:15 AM",
      totalVideos: 30,
      publishedVideos: 24,
      scheduledVideos: 6,
      status: "active",
      channels: ["youtube", "instagram", "tiktok"],
      views: "920,000",
      rpm: "$6.20",
    },
    {
      id: "3",
      title: "Billionaire Tax Loopholes",
      niche: "Money & Wealth",
      voice: "Rachel (Tech Host)",
      frequency: "3x Weekly (Mon/Wed/Fri)",
      totalVideos: 15,
      publishedVideos: 5,
      scheduledVideos: 10,
      status: "active",
      channels: ["youtube", "instagram"],
      views: "310,000",
      rpm: "$9.40",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Create Hero Banner */}
      <div className="rounded-3xl glass-card border border-white/10 p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-[#0f1220] to-cyan-950/25">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Series Automation Hub
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase font-semibold">
                3 Active Series
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Each series generates and publishes 30 days of viral reels on complete autopilot across YouTube, Instagram, and TikTok.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-200" />
              <span>+ Create New Series</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Series Running</span>
            <Tv className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">3 Series</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Autopilot armed
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Queued in Content Engine</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">34 Reels</div>
          <div className="text-[11px] text-cyan-300">Next auto-post @ 6:30 PM</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Combined Views</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">1,712,000</div>
          <div className="text-[11px] text-emerald-400">+54% this month</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Estimated Series RPM</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">$6.80 avg</div>
          <div className="text-[11px] text-slate-400">High Monetization Niches</div>
        </div>
      </div>

      {/* Active Series Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Tv className="w-5 h-5 text-purple-400" />
            Your Active Automated Series
          </h2>

          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>+ Add Another Series</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {seriesList.map((series) => {
            const progress = Math.round(
              (series.publishedVideos / series.totalVideos) * 100
            );

            return (
              <div
                key={series.id}
                className="glass-card rounded-3xl p-6 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold mb-2 inline-block">
                        {series.niche}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                        {series.title}
                      </h3>
                    </div>

                    <span className="flex h-2.5 w-2.5 relative mt-1 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                  </div>

                  {/* Settings & Voice Info */}
                  <div className="space-y-2 text-xs text-slate-400 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Neural Voice:</span>
                      <span className="text-slate-200 font-medium">{series.voice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Schedule:</span>
                      <span className="text-cyan-300 font-mono text-[11px]">{series.frequency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Monetization RPM:</span>
                      <span className="text-emerald-400 font-bold">{series.rpm}</span>
                    </div>
                  </div>

                  {/* Channel Targets */}
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                      Publishing Pipelines:
                    </span>
                    <div className="flex items-center gap-2">
                      {series.channels.includes("youtube") && (
                        <div className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/25 text-red-400 flex items-center gap-1 text-[10px] font-semibold">
                          <YoutubeIcon className="w-3.5 h-3.5" />
                          <span>Shorts</span>
                        </div>
                      )}
                      {series.channels.includes("instagram") && (
                        <div className="p-1.5 rounded-lg bg-pink-500/15 border border-pink-500/25 text-pink-400 flex items-center gap-1 text-[10px] font-semibold">
                          <InstagramIcon className="w-3.5 h-3.5" />
                          <span>Reels</span>
                        </div>
                      )}
                      {series.channels.includes("tiktok") && (
                        <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 flex items-center gap-1 text-[10px] font-semibold">
                          <TikTokIcon className="w-3.5 h-3.5" />
                          <span>TikTok</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">
                        {series.publishedVideos} of {series.totalVideos} Reels Published
                      </span>
                      <span className="text-purple-300 font-mono font-semibold">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400">Views: </span>
                    <span className="font-bold text-white">{series.views}</span>
                  </div>

                  <Link
                    href="/dashboard/videos"
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1"
                  >
                    <span>View Reels</span>
                    <Play className="w-3 h-3 text-purple-400 fill-purple-400" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CreateSeriesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
