"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Video,
  Play,
  Pause,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Eye,
  Flame,
  Plus,
  Loader2,
  Film,
  ArrowLeft,
  Trash2,
  Volume2,
  Copy,
  Check,
  X,
  ExternalLink,
  Layers,
  Mic,
  FileText,
  ImageIcon,
  Radio,
  Zap,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { getUserReels, deleteReel, ReelItem } from "@/app/actions/series";

function formatCardDate(dateStr?: string): string {
  if (!dateStr) return "TODAY";
  try {
    const d = new Date(dateStr);
    const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  } catch {
    return "TODAY";
  }
}

function formatCardTime(dateStr?: string): string {
  if (!dateStr) return "12:00 PM";
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "12:00 PM";
  }
}

function getStyleFallback(niche?: string): string {
  const n = (niche || "").toLowerCase();
  if (n.includes("cyberpunk") || n.includes("tech")) return "/video-style/cyberpunk-neon.jpg";
  if (n.includes("anime")) return "/video-style/dark-anime.jpg";
  if (n.includes("comic")) return "/video-style/comic-book.jpg";
  if (n.includes("oil") || n.includes("history") || n.includes("ancient") || n.includes("roman")) return "/video-style/gothic-oil.jpg";
  if (n.includes("3d") || n.includes("pixar")) return "/video-style/pixar-3d.jpg";
  return "/video-style/cinematic-realism.jpg";
}

function VideosContent() {
  const { isLoaded } = useUser();
  const searchParams = useSearchParams();
  const seriesIdParam = searchParams.get("seriesId");
  const isGeneratingParam = searchParams.get("generating") === "true";

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [videos, setVideos] = useState<ReelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLivePolling, setIsLivePolling] = useState(false);

  // Preview Modal State
  const [previewVideo, setPreviewVideo] = useState<ReelItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [activeTab, setActiveTab] = useState<"preview" | "script" | "scenes">("preview");
  const [copiedScript, setCopiedScript] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchVideos = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await getUserReels(seriesIdParam || undefined);
      if (res.success) {
        setVideos(res.reels);

        // Check if any video is actively generating/processing to keep polling
        const hasGenerating = res.reels.some(
          (v) => v.status === "generating" || v.status === "processing" || v.status === "pending"
        );
        setIsLivePolling(hasGenerating);
      }
    } catch (err) {
      console.error("Failed to load reels:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (isLoaded) {
      fetchVideos();
    }
  }, [isLoaded, seriesIdParam]);

  // Live polling: Check every 3 seconds if there are videos in generating/pending/processing state
  useEffect(() => {
    const hasGenerating = videos.some(
      (v) => v.status === "generating" || v.status === "processing" || v.status === "pending"
    );
    if (!hasGenerating && !isGeneratingParam && !isLivePolling) return;

    const interval = setInterval(() => {
      fetchVideos(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [videos, isGeneratingParam, isLivePolling, seriesIdParam]);

  // Handle Reel Deletion
  const handleDeleteReel = async (reelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this generated video reel?")) return;

    setVideos((prev) => prev.filter((v) => v.id !== reelId));
    try {
      await deleteReel(reelId);
    } catch (err) {
      console.error("Failed to delete reel:", err);
      fetchVideos(true);
    }
  };

  // Handle Audio Playback in Modal
  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration || 1;
    setAudioCurrentTime(current);
    setAudioDuration(total);
    setAudioProgress((current / total) * 100);
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
  };

  const handleCopyScript = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  // Open Preview Modal (Only for ready videos)
  const handleOpenPreview = (video: ReelItem) => {
    const isProcessing =
      video.status === "generating" || video.status === "processing" || video.status === "pending";
    if (isProcessing) return;

    setPreviewVideo(video);
    setIsPlayingAudio(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
    setActiveTab("preview");
  };

  // Close Preview Modal
  const handleClosePreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPreviewVideo(null);
    setIsPlayingAudio(false);
  };

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      (v.series_title && v.series_title.toLowerCase().includes(search.toLowerCase())) ||
      (v.hook && v.hook.toLowerCase().includes(search.toLowerCase())) ||
      (v.niche && v.niche.toLowerCase().includes(search.toLowerCase()));

    const isPending = v.status === "generating" || v.status === "processing" || v.status === "pending";
    const isReady = v.status === "scheduled" || v.status === "ready_to_publish" || v.status === "ready" || v.status === "published";

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "processing" && isPending) ||
      (filterStatus === "ready" && isReady);

    return matchesSearch && matchesStatus;
  });

  const processingCount = videos.filter(
    (v) => v.status === "generating" || v.status === "processing" || v.status === "pending"
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md shadow-purple-950/40">
                <Video className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                AI Video Production Library
              </h1>
            </div>

            {processingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4f46e5]/20 border border-[#6366f1]/40 text-[#a5b4fc] text-xs font-semibold animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{processingCount} Processing</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 pl-11">
            {seriesIdParam
              ? "Viewing generated AI video reels and scheduled production assets"
              : "Manage all generated faceless video reels, voiceover tracks, and production schedules"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchVideos()}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Radio className={`w-3.5 h-3.5 ${isLivePolling ? "text-emerald-400 animate-pulse" : "text-slate-400"}`} />
            <span>{isLivePolling ? "Live Syncing" : "Refresh"}</span>
          </button>

          <Link
            href="/dashboard/create"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-purple-600/25 hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>+ Create Series</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0c0e18] p-3 rounded-2xl border border-white/10 shadow-lg">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by video title, hook, or series name..."
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === "all"
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All ({videos.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("processing")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === "processing"
                  ? "bg-[#4f46e5]/30 text-indigo-300 border border-[#6366f1]/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Processing ({processingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("ready")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === "ready"
                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Ready ({videos.length - processingCount})
            </button>
          </div>
        </div>
      </div>

      {/* Loading Initial State */}
      {loading && (
        <div className="p-16 rounded-3xl border border-white/10 bg-[#0d0f1a]/80 text-center space-y-3 shadow-xl">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-white">Loading video production library...</p>
          <p className="text-xs text-slate-400">Fetching generated AI reels from Supabase database</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredVideos.length === 0 && (
        <div className="p-16 sm:p-20 rounded-3xl border border-white/10 bg-[#0d0f1a]/80 text-center space-y-6 shadow-xl">
          <div className="w-20 h-20 rounded-3xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto shadow-inner">
            <Film className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-white">No Videos Found</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {seriesIdParam
                ? "No video reels have been generated for this series yet. Head over to the Series Hub and click 'Generate Now' on the series card to start the pipeline."
                : "Your video library is currently empty. Click 'Generate Now' on any active series or create a new automated series."}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 text-xs font-semibold transition-all"
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

      {/* ========================================================================= */}
      {/* VIDEO CARDS GRID (EXACTLY MATCHING USER'S SPECIFIED DESIGN) */}
      {/* ========================================================================= */}
      {!loading && filteredVideos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const isProcessing =
              video.status === "generating" ||
              video.status === "processing" ||
              video.status === "pending" ||
              !video.thumbnail_url;

            const thumbnailSrc =
              video.thumbnail_url ||
              video.scenes?.[0]?.imageUrl ||
              getStyleFallback(video.niche);

            const displayTitle =
              isProcessing && (!video.title || video.title === "Automated Viral Short")
                ? "Untitled Video"
                : video.title || "Untitled Video";

            const seriesName =
              video.series_title || video.series || video.niche || "Historical Stories";

            return (
              <div
                key={video.id}
                onClick={() => handleOpenPreview(video)}
                className={`bg-[#0f1220] rounded-3xl p-4 border border-white/10 transition-all flex flex-col justify-between space-y-4 group shadow-xl hover:shadow-2xl hover:border-white/20 relative overflow-hidden ${
                  !isProcessing ? "cursor-pointer hover:border-purple-500/40" : "cursor-default"
                }`}
              >
                {/* 1. TOP THUMBNAIL CONTAINER */}
                <div className="relative aspect-[16/10] w-full rounded-2xl bg-[#0a0c14] border border-white/10 overflow-hidden flex flex-col justify-between">
                  {/* Status Badge: Top Left */}
                  <div className="absolute top-3.5 left-3.5 z-20">
                    {isProcessing ? (
                      <span className="px-3.5 py-1 rounded-full bg-[#4f46e5] text-white text-[11px] font-black tracking-wider uppercase shadow-lg shadow-indigo-950/50 flex items-center gap-1.5">
                        <span>PROCESSING</span>
                      </span>
                    ) : (
                      <span className="px-3.5 py-1 rounded-full bg-[#10b981] text-white text-[11px] font-black tracking-wider uppercase shadow-lg shadow-emerald-950/50">
                        READY
                      </span>
                    )}
                  </div>

                  {/* Processing State: Spinner + Generating Pill in Center */}
                  {isProcessing ? (
                    <div className="absolute inset-0 bg-[#0d1020] flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                      {/* Circular Spinner Ring */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-3 border-white/10 border-t-white/80 animate-spin" />
                      </div>

                      {/* Translucent Generating Pill */}
                      <div className="px-4 py-1 rounded-full bg-[#2a2e45]/80 backdrop-blur-md text-white/90 text-xs font-bold tracking-wide shadow-md">
                        Generating...
                      </div>
                    </div>
                  ) : (
                    /* Ready State: Real Image Thumbnail */
                    <>
                      <Image
                        src={thumbnailSrc}
                        alt={displayTitle}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                      {/* Play Button Overlay on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="w-12 h-12 rounded-full bg-purple-600/80 border border-purple-300 backdrop-blur-md flex items-center justify-center text-white shadow-xl shadow-purple-950">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* 2. CARD CONTENT (TITLE, SERIES, DATE & TIME) */}
                <div className="space-y-3 px-1">
                  {/* Video Title */}
                  <h3
                    className={`text-base font-bold leading-snug line-clamp-1 ${
                      isProcessing
                        ? "text-[#818cf8] font-extrabold"
                        : "text-white group-hover:text-purple-200 transition-colors"
                    }`}
                  >
                    {displayTitle}
                  </h3>

                  {/* Series Name with Film Icon */}
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                    <div className="w-4 h-4 rounded bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                      <Film className="w-2.5 h-2.5" />
                    </div>
                    <span className="truncate">{seriesName}</span>
                  </div>

                  {/* Date & Time Footer Row */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatCardDate(video.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatCardTime(video.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Optional Action Overlay / Delete */}
                <div
                  className="flex items-center justify-between pt-1 border-t border-white/5 text-xs text-slate-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5">
                    {video.audio_url && (
                      <a
                        href={video.audio_url}
                        target="_blank"
                        rel="noreferrer"
                        download
                        title="Download Voice Audio"
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-cyan-300 transition-all flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span className="text-[10px] font-mono">Audio</span>
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteReel(video.id, e)}
                    title="Delete Reel"
                    className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9:16 INTERACTIVE REEL & ASSET PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={handleClosePreview}
        >
          <div
            className="w-full max-w-4xl bg-[#0e111d] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LEFT COLUMN: 9:16 PLAYER DISPLAY */}
            <div className="w-full md:w-[340px] bg-black p-4 flex flex-col items-center justify-between relative border-b md:border-b-0 md:border-r border-white/10 shrink-0">
              {/* Close Button on Mobile */}
              <button
                onClick={handleClosePreview}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-white md:hidden cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* 9:16 Vertical Screen Frame */}
              <div className="relative aspect-[9/16] w-full max-w-[260px] rounded-2xl overflow-hidden bg-[#121526] border border-white/15 shadow-2xl flex flex-col justify-between p-4 my-auto">
                {previewVideo.video_url &&
                (previewVideo.video_url.includes(".mp4") ||
                  (!previewVideo.video_url.includes(".mp3") &&
                    previewVideo.video_url.startsWith("http"))) ? (
                  /* RENDER FULL MP4 VIDEO */
                  <div className="absolute inset-0 w-full h-full bg-black">
                    <video
                      src={previewVideo.video_url}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                      poster={previewVideo.thumbnail_url || undefined}
                    />
                  </div>
                ) : (
                  /* FALLBACK: IMAGE + SYNTHESIZED AUDIO PLAYER */
                  <>
                    {/* Background Scene Image */}
                    <Image
                      src={
                        previewVideo.thumbnail_url ||
                        previewVideo.scenes?.[0]?.imageUrl ||
                        getStyleFallback(previewVideo.niche)
                      }
                      alt={previewVideo.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

                    {/* Player Top Pill */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-black/70 text-[9px] font-mono text-purple-300 border border-white/10">
                        {previewVideo.niche || "Viral"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-600/80 text-[9px] font-bold text-white">
                        9:16 HD
                      </span>
                    </div>

                    {/* Dynamic Hormozi Subtitle Simulation */}
                    <div className="relative z-10 my-auto text-center px-2">
                      <div className="inline-block px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-amber-400/40 shadow-xl animate-pulse">
                        <span className="text-amber-400 font-extrabold text-sm tracking-wide uppercase drop-shadow-md">
                          {previewVideo.hook?.slice(0, 32) || "VIRAL REEL HOOK"}
                        </span>
                      </div>
                    </div>

                    {/* Player Bottom Bar */}
                    <div className="relative z-10 space-y-2">
                      {/* Play / Pause Toggle Button */}
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={togglePlayAudio}
                          className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:scale-105 text-white flex items-center justify-center shadow-lg shadow-purple-950 transition-all cursor-pointer"
                        >
                          {isPlayingAudio ? (
                            <Pause className="w-5 h-5 fill-white" />
                          ) : (
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Audio Progress Bar */}
                      <div className="space-y-1">
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-200"
                            style={{ width: `${audioProgress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-slate-300">
                          <span>{Math.floor(audioCurrentTime)}s</span>
                          <span>{previewVideo.duration_seconds || 45}s</span>
                        </div>
                      </div>
                    </div>

                    {/* Hidden Audio Element */}
                    {previewVideo.audio_url && (
                      <audio
                        ref={audioRef}
                        src={previewVideo.audio_url}
                        onTimeUpdate={handleAudioTimeUpdate}
                        onEnded={handleAudioEnded}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: REEL ASSETS & DATA TABS */}
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Modal Top Header */}
              <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                      {previewVideo.series_title || previewVideo.series || "Automated Series"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatCardDate(previewVideo.created_at)} • {formatCardTime(previewVideo.created_at)}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white leading-snug">
                    {previewVideo.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleClosePreview}
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer hidden md:flex"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "preview"
                      ? "border-purple-400 text-purple-300 font-bold"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("script")}
                  className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "script"
                      ? "border-purple-400 text-purple-300 font-bold"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Voiceover Script</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("scenes")}
                  className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "scenes"
                      ? "border-purple-400 text-purple-300 font-bold"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Scene Prompts ({previewVideo.scenes?.length || previewVideo.image_prompts?.length || 5})</span>
                </button>
              </div>

              {/* Tab Content Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {/* TAB 1: OVERVIEW */}
                {activeTab === "preview" && (
                  <div className="space-y-4">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Neural Voice</span>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{previewVideo.voice_name || "Deepgram Neural"}</span>
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Caption Preset</span>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>{previewVideo.caption_style || "Hormozi Pop"}</span>
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Estimated Duration</span>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          <span>{previewVideo.duration_seconds || 45} Seconds</span>
                        </p>
                      </div>
                    </div>

                    {/* Hook Callout Box */}
                    {previewVideo.hook && (
                      <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-1.5">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wide flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-purple-400" /> 3-Second Viral Opening Hook
                        </span>
                        <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                          &ldquo;{previewVideo.hook}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Video / Audio Player Controls Box */}
                    {previewVideo.video_url &&
                    (previewVideo.video_url.includes(".mp4") ||
                      (!previewVideo.video_url.includes(".mp3") &&
                        previewVideo.video_url.startsWith("http"))) ? (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-cyan-950/40 border border-purple-500/30 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center">
                            <Film className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>Rendered Remotion Reel</span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                                1080x1920 MP4
                              </span>
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Synced Captions + Dynamic Ken-Burns Animations
                            </p>
                          </div>
                        </div>

                        <a
                          href={previewVideo.video_url}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg shadow-purple-950 transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-white" />
                          <span>Download MP4</span>
                        </a>
                      </div>
                    ) : null}

                    {/* Audio Player Controls Box */}
                    {previewVideo.audio_url && (
                      <div className="p-4 rounded-2xl bg-[#121526] border border-white/10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={togglePlayAudio}
                            className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                          >
                            {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                          <div>
                            <p className="text-xs font-bold text-white">Synthesized Voiceover Track</p>
                            <p className="text-[10px] text-slate-400">High fidelity neural narration (MP3)</p>
                          </div>
                        </div>

                        <a
                          href={previewVideo.audio_url}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Download MP3</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: FULL SCRIPT */}
                {activeTab === "script" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Complete AI Generated Spoken Narration</span>
                      <button
                        type="button"
                        onClick={() => handleCopyScript(previewVideo.script)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedScript ? "Copied!" : "Copy Script"}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                      {previewVideo.script || "Script is being rendered..."}
                    </div>
                  </div>
                )}

                {/* TAB 3: SCENE PROMPTS & VISUALS */}
                {activeTab === "scenes" && (
                  <div className="space-y-3">
                    {(previewVideo.scenes && previewVideo.scenes.length > 0
                      ? previewVideo.scenes
                      : (previewVideo.image_prompts || []).map((prompt, idx) => ({
                          sceneNumber: idx + 1,
                          imagePrompt: prompt,
                          imageUrl: previewVideo.thumbnail_url,
                        }))
                    ).map((scene: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3.5 hover:border-white/15 transition-all"
                      >
                        <div className="relative w-16 h-24 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                          <Image
                            src={scene.imageUrl || previewVideo.thumbnail_url || getStyleFallback(previewVideo.niche)}
                            alt={`Scene ${scene.sceneNumber || idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] font-bold text-purple-400 uppercase font-mono">
                            Scene #{scene.sceneNumber || idx + 1}
                          </span>
                          <p className="text-xs text-slate-300 leading-snug">
                            {scene.imagePrompt || "9:16 Vertical Portrait Composition"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer Bar */}
              <div className="p-4 px-6 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Production Assets Stored in Supabase</span>
                </span>

                <button
                  type="button"
                  onClick={handleClosePreview}
                  className="px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading videos...</p>
        </div>
      }
    >
      <VideosContent />
    </Suspense>
  );
}
