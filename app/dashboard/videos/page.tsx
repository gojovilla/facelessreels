"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Video,
  Play,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  Eye,
  Flame,
  Plus,
  Loader2,
  Film,
  ArrowLeft,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { getUserReels, ReelItem } from "@/app/actions/series";

function VideosContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const seriesIdParam = searchParams.get("seriesId");

  const [search, setSearch] = useState("");
  const [filterNiche, setFilterNiche] = useState("all");
  const [videos, setVideos] = useState<ReelItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await getUserReels(seriesIdParam || undefined);
      if (res.success) {
        setVideos(res.reels);
      }
    } catch (err) {
      console.error("Failed to load reels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchVideos();
    }
  }, [isLoaded, seriesIdParam]);

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      (v.series && v.series.toLowerCase().includes(search.toLowerCase()));
    const matchesNiche = filterNiche === "all" || v.niche === filterNiche;
    return matchesSearch && matchesNiche;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white transition-all mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
              <Video className="w-6 h-6 text-purple-400" />
              AI Video Production Library
            </h1>
          </div>
          <p className="text-xs text-slate-400 pl-8">
            {seriesIdParam
              ? "Viewing generated video reels for selected series"
              : "Browse, preview, and download all generated reels and automated schedule dispatches"}
          </p>
        </div>

        <Link
          href="/dashboard/create"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-xs shadow-md shadow-purple-600/20 hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>+ Create New Series</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0c0e18] p-3 rounded-2xl border border-white/10">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reel hook, title, or series name..."
            className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterNiche}
            onChange={(e) => setFilterNiche(e.target.value)}
            className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500 w-full sm:w-auto"
          >
            <option value="all">All Niches</option>
            <option value="Psychology">Psychology</option>
            <option value="Stoicism">Stoicism</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="p-12 rounded-3xl border border-white/10 bg-[#0d0f1a]/80 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading video library from database...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredVideos.length === 0 && (
        <div className="p-12 sm:p-16 rounded-3xl border border-white/10 bg-[#0d0f1a]/80 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <Film className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">No Generated Reels Found</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {seriesIdParam
                ? "No reels have been rendered for this series yet. Click 'Generate Now' on the series card to trigger the rendering pipeline."
                : "No generated video reels found in the database. Create a new series or trigger reel generation to start."}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 text-xs font-semibold"
            >
              Back to Series Hub
            </Link>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-200" />
              <span>+ Create New Series</span>
            </Link>
          </div>
        </div>
      )}

      {/* Videos List Grid */}
      {!loading && filteredVideos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="glass-card rounded-3xl p-5 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* Video Thumbnail Hero */}
              <div className="relative aspect-[9/12] w-full rounded-2xl bg-[#121526] border border-white/10 overflow-hidden flex flex-col justify-between p-4 group-hover:shadow-lg group-hover:shadow-purple-600/20 transition-all">
                <div className="flex items-center justify-between relative z-10">
                  <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-purple-300 border border-white/10">
                    {video.niche}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      video.status === "published"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : video.status === "generating"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse"
                        : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                    }`}
                  >
                    {video.status === "published"
                      ? "Published"
                      : video.status === "generating"
                      ? "Rendering..."
                      : "Scheduled"}
                  </span>
                </div>

                {/* Play Button */}
                <div className="self-center my-auto">
                  <div className="w-12 h-12 rounded-full bg-purple-600/40 border border-purple-400/50 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-purple-600/80 transition-all shadow-xl shadow-purple-950">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Card Bar */}
                <div className="flex items-center justify-between text-[11px] text-slate-300 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="font-mono">{video.duration || `${video.duration_seconds || 45}s`}</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <Flame className="w-3 h-3" /> Score {video.viralScore || video.viral_score || 95}
                  </span>
                </div>
              </div>

              {/* Video Meta Info */}
              <div className="space-y-2">
                {video.series && (
                  <span className="text-[11px] text-purple-400 font-semibold block">
                    {video.series}
                  </span>
                )}
                <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                  {video.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {video.publishedDate || "Queued"}
                  </span>

                  <div className="flex items-center gap-1">
                    {(!video.channels || video.channels.includes("youtube")) && (
                      <YoutubeIcon className="w-3.5 h-3.5 text-red-400" />
                    )}
                    {(!video.channels || video.channels.includes("instagram")) && (
                      <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                    )}
                    {(!video.channels || video.channels.includes("tiktok")) && (
                      <TikTokIcon className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <button className="flex-1 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  <span>Preview</span>
                </button>

                <button className="py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer">
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">4K</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
        </div>
      }
    >
      <VideosContent />
    </Suspense>
  );
}
