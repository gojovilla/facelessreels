"use client";

import React, { useState, useEffect } from "react";
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
  Sliders,
  Layers,
  Wand2,
  Zap,
  Film,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { getUserSeries, SeriesItem } from "@/app/actions/series";

export default function DashboardSeriesPage() {
  const { user, isLoaded } = useUser();
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [stats, setStats] = useState({
    totalSeries: 0,
    queuedReels: 0,
    totalViews: 0,
    avgRpm: "--",
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSeries = async () => {
    setLoading(true);
    try {
      const res = await getUserSeries();
      if (res.success) {
        setSeriesList(res.series);
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to load series:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchSeries();
    }
  }, [isLoaded]);

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
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[11px] font-mono uppercase font-semibold">
                {loading ? "Loading..." : `${stats.totalSeries} Active Series`}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Each series generates and publishes automated viral reels across YouTube Shorts, Instagram Reels, and TikTok on autopilot.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/create"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-200" />
              <span>+ Create New Series</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row (Dynamic from Database) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Series Running</span>
            <Tv className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? "..." : `${stats.totalSeries} Series`}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            {stats.totalSeries > 0 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Autopilot armed
              </span>
            ) : (
              <span>No active pipelines</span>
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Queued in Content Engine</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? "..." : `${stats.queuedReels} Reels`}
          </div>
          <div className="text-[11px] text-slate-400">
            {stats.queuedReels > 0 ? "Automated scheduling active" : "Queue empty"}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Combined Views</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? "..." : stats.totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">
            {stats.totalViews > 0 ? "Across connected channels" : "0 views logged"}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Estimated Series RPM</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {loading ? "..." : stats.avgRpm}
          </div>
          <div className="text-[11px] text-slate-400">
            {stats.totalSeries > 0 ? "Based on selected niches" : "No series data"}
          </div>
        </div>
      </div>

      {/* Active Series Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Tv className="w-5 h-5 text-purple-400" />
            <span>Your Active Automated Series</span>
          </h2>

          <Link
            href="/dashboard/create"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>+ Create New Series</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 rounded-3xl border border-white/10 bg-[#0d0f1a]/80 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading series from database...</p>
          </div>
        )}

        {/* EMPTY STATE: When no series exist in database */}
        {!loading && seriesList.length === 0 && (
          <div className="p-12 sm:p-16 rounded-3xl border border-white/10 bg-[#0d0f1a]/80 text-center space-y-5 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto shadow-inner">
              <Film className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white">
                No Data Available
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You have not created any video series in the database yet. Launch your first automated series to start generating daily reels on autopilot.
              </p>
            </div>

            <div>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-cyan-200" />
                <span>+ Create Your First Series</span>
              </Link>
            </div>
          </div>
        )}

        {/* DYNAMIC SERIES GRID: Render only when stored in database */}
        {!loading && seriesList.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {seriesList.map((series) => {
              const published = series.published_videos || 0;
              const total = series.total_videos || 30;
              const progress = Math.round((published / total) * 100);

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
                        <span className="text-slate-200 font-medium">{series.voice || "Deepgram"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Schedule:</span>
                        <span className="text-cyan-300 font-mono text-[11px]">
                          {series.frequency || "Daily"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Visual Style:</span>
                        <span className="text-slate-200 font-medium">
                          {series.visual_style || "Cinematic"}
                        </span>
                      </div>
                    </div>

                    {/* Channel Targets */}
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                        Publishing Pipelines:
                      </span>
                      <div className="flex items-center gap-2">
                        {(!series.channels || series.channels.includes("youtube")) && (
                          <div className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/25 text-red-400 flex items-center gap-1 text-[10px] font-semibold">
                            <YoutubeIcon className="w-3.5 h-3.5" />
                            <span>Shorts</span>
                          </div>
                        )}
                        {(!series.channels || series.channels.includes("instagram")) && (
                          <div className="p-1.5 rounded-lg bg-pink-500/15 border border-pink-500/25 text-pink-400 flex items-center gap-1 text-[10px] font-semibold">
                            <InstagramIcon className="w-3.5 h-3.5" />
                            <span>Reels</span>
                          </div>
                        )}
                        {(!series.channels || series.channels.includes("tiktok")) && (
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
                          {published} of {total} Reels Published
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
                      <span className="font-bold text-white">
                        {(series.views || 0).toLocaleString()}
                      </span>
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
        )}
      </div>
    </div>
  );
}
