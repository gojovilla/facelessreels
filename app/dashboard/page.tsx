"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  MoreVertical,
  Edit,
  Pause,
  Trash2,
  Eye,
  Video,
  X,
  Check,
  Globe,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import {
  getUserSeries,
  SeriesItem,
  updateSeriesStatus,
  deleteSeries,
  editSeriesDetails,
  triggerReelGeneration,
} from "@/app/actions/series";

// Map visual_style_id or name to the corresponding 9:16 asset in public/video-style/
function getStyleThumbnail(styleId?: string | null, styleName?: string | null): string {
  const id = styleId?.toLowerCase() || "";
  const name = styleName?.toLowerCase() || "";

  if (id.includes("cyberpunk") || name.includes("cyberpunk")) return "/video-style/cyberpunk-neon.jpg";
  if (id.includes("anime") || name.includes("anime")) return "/video-style/dark-anime.jpg";
  if (id.includes("comic") || name.includes("comic")) return "/video-style/comic-book.jpg";
  if (id.includes("oil") || name.includes("baroque") || name.includes("oil")) return "/video-style/gothic-oil.jpg";
  if (id.includes("pixar") || id.includes("3d") || name.includes("pixar")) return "/video-style/pixar-3d.jpg";
  if (id.includes("gta") || name.includes("vector") || name.includes("gta")) return "/video-style/gta-vector.jpg";
  if (id.includes("watercolor") || name.includes("horror") || name.includes("watercolor")) return "/video-style/watercolor-horror.jpg";
  return "/video-style/cinematic-realism.jpg";
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Recently created";
  try {
    const d = new Date(dateStr);
    return `Created ${d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  } catch {
    return "Recently created";
  }
}

function formatTimeDisplay(timeStr?: string | null, frequencyStr?: string | null): string {
  if (timeStr) {
    const [hStr, mStr] = timeStr.split(":");
    const h = parseInt(hStr, 10);
    if (!isNaN(h)) {
      const suffix = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      return `Daily @ ${h12}:${mStr || "00"} ${suffix}`;
    }
    return timeStr;
  }
  return frequencyStr || "Daily @ 6:30 PM";
}

export default function DashboardSeriesPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [seriesList, setSeriesList] = useState<SeriesItem[]>([]);
  const [stats, setStats] = useState({
    totalSeries: 0,
    queuedReels: 0,
    totalViews: 0,
    avgRpm: "--",
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Popover state: active series ID whose menu is open
  const [activeMenuSeriesId, setActiveMenuSeriesId] = useState<string | null>(null);

  // Edit modal state
  const [editingSeries, setEditingSeries] = useState<SeriesItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPublishTime, setEditPublishTime] = useState("18:30");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Generating reel state
  const [generatingSeriesId, setGeneratingSeriesId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Close popovers on click outside
  useEffect(() => {
    const handleDocumentClick = () => {
      setActiveMenuSeriesId(null);
    };
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", handleDocumentClick);
  }, []);

  // Action: Toggle Pause / Resume
  const handleToggleStatus = async (series: SeriesItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuSeriesId(null);

    const newStatus = series.status === "paused" ? "active" : "paused";

    // Optimistic UI update
    setSeriesList((prev) =>
      prev.map((s) => (s.id === series.id ? { ...s, status: newStatus } : s))
    );

    const res = await updateSeriesStatus(series.id, newStatus);
    if (!res.success) {
      // Revert if error
      setSeriesList((prev) =>
        prev.map((s) => (s.id === series.id ? { ...s, status: series.status } : s))
      );
      alert("Failed to update status.");
    } else {
      setToastMessage(
        `Series is now ${newStatus === "active" ? "Resumed (Armed)" : "Paused"}`
      );
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Action: Delete Series
  const handleDelete = async (seriesId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuSeriesId(null);

    if (!confirm("Are you sure you want to delete this automated series?")) return;

    // Optimistic UI delete
    setSeriesList((prev) => prev.filter((s) => s.id !== seriesId));
    setStats((prev) => ({
      ...prev,
      totalSeries: Math.max(0, prev.totalSeries - 1),
    }));

    const res = await deleteSeries(seriesId);
    if (!res.success) {
      fetchSeries(); // Revert on failure
      alert("Failed to delete series.");
    } else {
      setToastMessage("Series deleted successfully.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Action: Open Edit in Full Step Form
  const handleOpenEdit = (series: SeriesItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuSeriesId(null);
    router.push(`/dashboard/create?edit=${series.id}`);
  };

  // Action: Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeries) return;

    setIsSavingEdit(true);
    const res = await editSeriesDetails(editingSeries.id, {
      title: editTitle,
      publish_time: editPublishTime,
    });

    if (res.success) {
      setSeriesList((prev) =>
        prev.map((s) =>
          s.id === editingSeries.id
            ? {
                ...s,
                title: editTitle,
                publish_time: editPublishTime,
                frequency: `Daily @ ${editPublishTime}`,
              }
            : s
        )
      );
      setToastMessage("Series details updated successfully!");
      setEditingSeries(null);
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      alert("Failed to save changes.");
    }
    setIsSavingEdit(false);
  };

  // Action: Trigger Instant Video Generation & Navigate to Videos Page
  const handleTriggerGenerate = async (series: SeriesItem) => {
    setGeneratingSeriesId(series.id);
    try {
      const res = await triggerReelGeneration(series.id);
      if (res.success) {
        setToastMessage("AI generation started! Navigating to video production library...");
        // Immediately navigate user to video library page
        router.push(`/dashboard/videos?seriesId=${series.id}&generating=true`);
      } else {
        alert(res.message || "Failed to trigger generation");
        setGeneratingSeriesId(null);
      }
    } catch (err) {
      console.error(err);
      setGeneratingSeriesId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-purple-500/40 text-white flex items-center gap-3 shadow-2xl shadow-purple-950 animate-fade-in text-xs sm:text-sm font-semibold">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

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

        {/* EMPTY STATE */}
        {!loading && seriesList.length === 0 && (
          <div className="p-12 sm:p-16 rounded-3xl border border-white/10 bg-[#0d0f1a]/80 text-center space-y-5 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto shadow-inner">
              <Film className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white">No Series Created Yet</h3>
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

        {/* DYNAMIC SERIES GRID */}
        {!loading && seriesList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seriesList.map((series) => {
              const published = series.published_videos || 0;
              const total = series.total_videos || 30;
              const progress = Math.round((published / total) * 100);
              const isPaused = series.status === "paused";
              const isMenuOpen = activeMenuSeriesId === series.id;
              const thumbnailSrc = getStyleThumbnail(series.visual_style_id, series.visual_style);
              const isGenerating = generatingSeriesId === series.id;

              return (
                <div
                  key={series.id}
                  className="glass-card rounded-3xl p-5 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 group relative"
                >
                  {/* TOP: 9:12 / 16:9 VIDEO STYLE THUMBNAIL */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl bg-slate-950 border border-white/10 overflow-hidden group/thumb shadow-inner">
                    {/* Visual Style Image */}
                    <Image
                      src={thumbnailSrc}
                      alt={series.visual_style || "Video Style"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                    />

                    {/* Gradient Overlay for Text Clarity */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

                    {/* Top Left: Niche Badge & Status Indicator */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-purple-300 font-mono text-[10px] font-semibold">
                        {series.niche}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 backdrop-blur-md border ${
                          isPaused
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
                          }`}
                        />
                        {isPaused ? "Paused" : "Active"}
                      </span>
                    </div>

                    {/* Top Right on Thumbnail: EDIT BUTTON */}
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEdit(series, e)}
                        title="Edit Series"
                        className="p-1.5 rounded-xl bg-black/70 hover:bg-purple-600/80 backdrop-blur-md border border-white/20 text-white hover:text-white transition-all shadow-md cursor-pointer flex items-center justify-center"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom of Thumbnail: Visual Style Name Pill */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 text-[11px] text-slate-300">
                      <span className="font-semibold text-white drop-shadow-md">
                        Style: {series.visual_style || "Cinematic"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-white/10">
                        {series.duration_option || "30-50s"}
                      </span>
                    </div>
                  </div>

                  {/* MIDDLE: SERIES TITLE, CREATED DATE & 3-DOTS POPOVER */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 relative">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-1">
                          {series.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{formatDate(series.created_at)}</span>
                        </p>
                      </div>

                      {/* 3-DOTS POPOVER BUTTON */}
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuSeriesId(isMenuOpen ? null : series.id)
                          }
                          className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* POPOVER DROPDOWN MENU */}
                        {isMenuOpen && (
                          <div className="absolute right-0 top-9 w-44 rounded-2xl bg-[#121526] border border-white/15 shadow-2xl p-1.5 z-30 space-y-1 animate-fade-in backdrop-blur-xl">
                            {/* Option 1: Edit */}
                            <button
                              type="button"
                              onClick={(e) => handleOpenEdit(series, e)}
                              className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:bg-purple-600/20 hover:text-purple-300 transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5 text-purple-400" />
                              <span>Edit Series</span>
                            </button>

                            {/* Option 2: Pause / Resume */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleStatus(series, e)}
                              className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:bg-white/[0.08] transition-all flex items-center gap-2 cursor-pointer"
                            >
                              {isPaused ? (
                                <>
                                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-300">Resume Series</span>
                                </>
                              ) : (
                                <>
                                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                                  <span className="text-amber-300">Pause Series</span>
                                </>
                              )}
                            </button>

                            <div className="border-t border-white/10 my-1" />

                            {/* Option 3: Delete */}
                            <button
                              type="button"
                              onClick={(e) => handleDelete(series.id, e)}
                              className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              <span>Delete Series</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata Box: Neural Voice & Publish Schedule */}
                    <div className="space-y-1.5 text-xs text-slate-400 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Neural Voice:</span>
                        <span className="text-slate-200 font-medium truncate max-w-[140px]">
                          {series.voice || "Deepgram Neural"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Publish Time:</span>
                        <span className="text-cyan-300 font-mono text-[11px] font-semibold">
                          {formatTimeDisplay(series.publish_time, series.frequency)}
                        </span>
                      </div>
                    </div>

                    {/* Publishing Channel Badges */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Pipelines:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {(!series.channels || series.channels.includes("youtube")) && (
                          <div className="p-1 rounded-md bg-red-500/15 text-red-400" title="YouTube Shorts">
                            <YoutubeIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {(!series.channels || series.channels.includes("instagram")) && (
                          <div className="p-1 rounded-md bg-pink-500/15 text-pink-400" title="Instagram Reels">
                            <InstagramIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {(!series.channels || series.channels.includes("tiktok")) && (
                          <div className="p-1 rounded-md bg-cyan-500/15 text-cyan-400" title="TikTok">
                            <TikTokIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">
                          {published} of {total} Reels Published
                        </span>
                        <span className="text-purple-300 font-mono font-semibold">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM: VIEW PREVIOUS VIDEOS & TRIGGER GENERATION BUTTON */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    {/* View Generated Videos Button */}
                    <Link
                      href={`/dashboard/videos?seriesId=${series.id}`}
                      className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5 hover:text-white"
                    >
                      <Film className="w-3.5 h-3.5 text-purple-400" />
                      <span>View Reels</span>
                    </Link>

                    {/* Trigger Video Generation Button */}
                    <button
                      type="button"
                      disabled={isGenerating || isPaused}
                      onClick={() => handleTriggerGenerate(series)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-cyan-200 fill-cyan-200" />
                          <span>Generate Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT SERIES MODAL DIALOG */}
      {editingSeries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0d0f1a] border border-white/15 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Edit Series Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSeries(null)}
                className="p-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 block">
                  Series Name
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 block">
                  Daily Publish Time
                </label>
                <input
                  type="time"
                  required
                  value={editPublishTime}
                  onChange={(e) => setEditPublishTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-purple-500 [color-scheme:dark]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSeries(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSavingEdit || !editTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingEdit ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
