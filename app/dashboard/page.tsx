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
  Send,
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
  executeSeriesWorkflow,
} from "@/app/actions/series";

// Map visual_style_id or name to the corresponding 9:16 asset in public/video-style/
function getStyleThumbnail(styleId?: string | null, styleName?: string | null): string {
  const id = styleId?.toLowerCase() || "";
  const name = styleName?.toLowerCase() || "";

  if (id.includes("fantasy") || name.includes("fantasy") || id.includes("gothic")) return "/video-style/dark_fantasy_new.jpg";
  if (id.includes("creepy") || name.includes("creepy") || id.includes("eerie")) return "/video-style/creepy_comic.jpg";
  if (id.includes("comic") || name.includes("comic") || id.includes("graphic")) return "/video-style/comic.jpg";
  if (id.includes("ghibli") || name.includes("ghibli")) return "/video-style/ghibli.jpg";
  if (id.includes("anime") || name.includes("anime") || id.includes("shonen")) return "/video-style/anime.jpg";
  if (id.includes("disney") || id.includes("pixar") || name.includes("disney") || name.includes("pixar")) return "/video-style/disney.jpeg";
  if (id.includes("lego") || name.includes("lego")) return "/video-style/lego.jpg";
  if (id.includes("cartoon") || name.includes("cartoon") || id.includes("modern")) return "/video-style/modern_cartoon.png";
  if (id.includes("mythology") || name.includes("mythology") || id.includes("gods")) return "/video-style/mythology.jpg";
  if (id.includes("oil") || name.includes("oil") || id.includes("painting") || name.includes("renaissance")) return "/video-style/painting.png";
  if (id.includes("pixel") || name.includes("pixel")) return "/video-style/pixel_art.jpg";
  if (id.includes("polaroid") || name.includes("polaroid") || id.includes("vintage")) return "/video-style/polaroid.jpg";
  if (id.includes("fantastic") || id.includes("scifi") || name.includes("scifi") || name.includes("space") || name.includes("cyberpunk")) return "/video-style/fantastic.png";
  return "/video-style/realism.jpg";
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
  const [executingWorkflowId, setExecutingWorkflowId] = useState<string | null>(null);
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
    router.push(`/dashboard/create?editSeriesId=${series.id}`);
  };

  // Action: Quick Edit Publish Time / Title Inline
  const handleOpenQuickEditModal = (series: SeriesItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuSeriesId(null);
    setEditingSeries(series);
    setEditTitle(series.title);
    setEditPublishTime(series.publish_time || "18:30");
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
      setToastMessage("Series updated successfully.");
      setTimeout(() => setToastMessage(null), 3000);
      setEditingSeries(null);
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

  // Action: Execute Full Scheduled Workflow (Generates video & dispatches to Email & Social Platforms)
  const handleExecuteWorkflow = async (series: SeriesItem) => {
    setExecutingWorkflowId(series.id);
    try {
      setToastMessage("⚡ Executing complete workflow: AI video generation, Plunk email & platform publishing...");
      const res = await executeSeriesWorkflow(series.id, { immediatePublish: true });
      if (res.success) {
        setToastMessage("⚡ Workflow executed! Dispatched generation and multi-platform publishing.");
        // Immediately navigate user to video library page
        router.push(`/dashboard/videos?seriesId=${series.id}&generating=true`);
      } else {
        alert(res.message || "Failed to execute workflow");
        setExecutingWorkflowId(null);
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to execute workflow");
      setExecutingWorkflowId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-purple-500/40 text-white flex items-center gap-3 shadow-2xl shadow-purple-950/50 animate-fade-in text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Welcome & Quick Create Hero Banner */}
      <div className="rounded-2xl glass-card border border-slate-200 dark:border-white/10 p-5 sm:p-6 relative overflow-hidden bg-gradient-to-r from-purple-50/80 via-white to-cyan-50/50 dark:from-purple-950/40 dark:via-[#0f1220] dark:to-cyan-950/25">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Series Automation Hub
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-[10px] font-mono uppercase font-semibold">
                {loading ? "Loading..." : `${stats.totalSeries} Active`}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
              Each series generates and publishes automated viral reels across YouTube Shorts, Instagram Reels, and TikTok on autopilot.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/create"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-200" />
              <span>+ Create New Series</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row (Dynamic from Database) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card rounded-xl p-3.5 sm:p-4 border border-slate-200 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Active Series</span>
            <Tv className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {loading ? "..." : `${stats.totalSeries}`}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            {stats.totalSeries > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Armed & active
              </span>
            ) : (
              <span>No pipelines</span>
            )}
          </div>
        </div>

        <div className="glass-card rounded-xl p-3.5 sm:p-4 border border-slate-200 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Content Engine</span>
            <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {loading ? "..." : `${stats.queuedReels} Reels`}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {stats.queuedReels > 0 ? "Automated scheduling active" : "Queue empty"}
          </div>
        </div>

        <div className="glass-card rounded-xl p-3.5 sm:p-4 border border-slate-200 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Total Views</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {loading ? "..." : stats.totalViews.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {stats.totalViews > 0 ? "Connected channels" : "0 views"}
          </div>
        </div>

        <div className="glass-card rounded-xl p-3.5 sm:p-4 border border-slate-200 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Est. Series RPM</span>
            <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {loading ? "..." : stats.avgRpm}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            {stats.totalSeries > 0 ? "Target niches" : "No data"}
          </div>
        </div>
      </div>

      {/* Active Series Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tv className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Your Automated Series</span>
          </h2>

          <Link
            href="/dashboard/create"
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>+ Create New Series</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-10 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#0d0f1a]/80 text-center space-y-2.5">
            <Loader2 className="w-7 h-7 text-purple-600 dark:text-purple-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading series from database...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && seriesList.length === 0 && (
          <div className="p-10 sm:p-14 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#0d0f1a]/80 text-center space-y-4 relative overflow-hidden">
            <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-inner">
              <Film className="w-7 h-7" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Series Created Yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You have not created any video series yet. Launch your first automated series to start generating daily reels on autopilot.
              </p>
            </div>

            <div>
              <Link
                href="/dashboard/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 hover:opacity-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-cyan-200" />
                <span>+ Create Your First Series</span>
              </Link>
            </div>
          </div>
        )}

        {/* DYNAMIC SERIES GRID (COMPACT 4-COL ON DESKTOP) */}
        {!loading && seriesList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {seriesList.map((series) => {
              const published = series.published_videos || 0;
              const total = series.total_videos || 30;
              const progress = Math.round((published / total) * 100);
              const isPaused = series.status === "paused";
              const isMenuOpen = activeMenuSeriesId === series.id;
              const thumbnailSrc = getStyleThumbnail(series.visual_style_id, series.visual_style);
              const isGenerating = generatingSeriesId === series.id;
              const isExecutingWorkflow = executingWorkflowId === series.id;

              return (
                <div
                  key={series.id}
                  className="glass-card rounded-2xl p-3.5 border border-slate-200 dark:border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3 group relative shadow-sm dark:shadow-md"
                >
                  {/* TOP: COMPACT 16:9 VIDEO STYLE THUMBNAIL */}
                  <div className="relative aspect-[16/9] w-full rounded-xl bg-slate-950 border border-slate-200/50 dark:border-white/10 overflow-hidden group/thumb shadow-inner">
                    {/* Visual Style Image */}
                    <Image
                      src={thumbnailSrc}
                      alt={series.visual_style || "Video Style"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                    />

                    {/* Gradient Overlay for Text Clarity */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

                    {/* Top Left: Niche Badge & Status Indicator */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                      <span className="px-1.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-purple-300 font-mono text-[9px] font-semibold">
                        {series.niche}
                      </span>

                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold flex items-center gap-1 backdrop-blur-md border ${isPaused
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
                            }`}
                        />
                        {isPaused ? "Paused" : "Active"}
                      </span>
                    </div>

                    {/* Top Right on Thumbnail: EDIT BUTTON */}
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEdit(series, e)}
                        title="Edit Series"
                        className="p-1 rounded-lg bg-black/70 hover:bg-purple-600/80 backdrop-blur-md border border-white/20 text-white transition-all shadow cursor-pointer flex items-center justify-center"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Bottom of Thumbnail: Visual Style Name Pill */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10 text-[10px] text-slate-300">
                      <span className="font-semibold text-white drop-shadow-md truncate max-w-[130px]">
                        {series.visual_style || "Cinematic"}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-black/60 backdrop-blur-md text-[9px] font-mono text-cyan-300 border border-white/10">
                        {series.duration_option || "30-50s"}
                      </span>
                    </div>
                  </div>

                  {/* MIDDLE: SERIES TITLE, CREATED DATE & 3-DOTS POPOVER */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-1.5 relative">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                          {series.title}
                        </h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {formatDate(series.created_at)}
                        </p>
                      </div>

                      {/* 3-DOTS MENU TRIGGER */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuSeriesId(isMenuOpen ? null : series.id);
                          }}
                          className="p-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* POPOVER MENU */}
                        {isMenuOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-white dark:bg-[#0f1220] border border-slate-200 dark:border-white/15 p-1.5 shadow-2xl z-30 space-y-1 animate-fade-in"
                          >
                            <button
                              type="button"
                              onClick={(e) => handleOpenEdit(series, e)}
                              className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-300 transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <Sliders className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                              <span>Edit All Steps</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleToggleStatus(series, e)}
                              className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-500/10 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-300 transition-all flex items-center gap-2 cursor-pointer"
                            >
                              {isPaused ? (
                                <>
                                  <Play className="w-3 h-3 text-emerald-500" />
                                  <span>Resume Schedule</span>
                                </>
                              ) : (
                                <>
                                  <Pause className="w-3 h-3 text-amber-500" />
                                  <span>Pause Schedule</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleDelete(series.id, e)}
                              className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3 text-red-500 dark:text-red-400" />
                              <span>Delete Series</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata Box: Neural Voice & Publish Schedule */}
                    <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.02] p-2 rounded-xl border border-slate-200/60 dark:border-white/5">
                      <div className="flex items-center justify-between">
                        <span>Voice:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[110px]">
                          {series.voice || "Deepgram Neural"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Schedule:</span>
                        <span className="text-purple-600 dark:text-cyan-300 font-mono text-[10px] font-semibold">
                          {formatTimeDisplay(series.publish_time, series.frequency)}
                        </span>
                      </div>
                    </div>

                    {/* Publishing Channel Badges */}
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                        Platforms:
                      </span>
                      <div className="flex items-center gap-1">
                        {(!series.channels || series.channels.includes("youtube")) && (
                          <div className="p-1 rounded bg-red-500/10 dark:bg-red-500/15 text-red-500 dark:text-red-400" title="YouTube Shorts">
                            <YoutubeIcon className="w-3 h-3" />
                          </div>
                        )}
                        {(!series.channels || series.channels.includes("instagram")) && (
                          <div className="p-1 rounded bg-pink-500/10 dark:bg-pink-500/15 text-pink-500 dark:text-pink-400" title="Instagram Reels">
                            <InstagramIcon className="w-3 h-3" />
                          </div>
                        )}
                        {(!series.channels || series.channels.includes("tiktok")) && (
                          <div className="p-1 rounded bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400" title="TikTok">
                            <TikTokIcon className="w-3 h-3" />
                          </div>
                        )}
                        {(!series.channels || series.channels.includes("email")) && (
                          <div className="p-1 rounded bg-purple-500/10 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400" title="Email Notification">
                            <Send className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-0.5 pt-0.5">
                      <div className="flex justify-between text-[9px]">
                        <span className="text-slate-500 dark:text-slate-400">
                          {published}/{total} Reels
                        </span>
                        <span className="text-purple-600 dark:text-purple-300 font-mono font-semibold">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM: VIEW REELS, RUN WORKFLOW & GENERATE */}
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-1.5 flex-wrap">
                    {/* View Generated Videos Button */}
                    <Link
                      href={`/dashboard/videos?seriesId=${series.id}`}
                      className="px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Film className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      <span>Reels</span>
                    </Link>

                    {/* <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={isGenerating || isExecutingWorkflow || isPaused}
                        onClick={() => handleExecuteWorkflow(series)}
                        title="Execute Workflow: Generates video now and dispatches to Email & Social Platforms"
                        className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-white font-bold text-[11px] shadow-sm shadow-amber-500/20 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isExecutingWorkflow ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-white" />
                            <span className="hidden sm:inline">Running...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3 h-3 text-white fill-white" />
                            <span>⚡ Run Workflow</span>
                          </>
                        )}
                      </button>


                      <button
                        type="button"
                        disabled={isGenerating || isExecutingWorkflow || isPaused}
                        onClick={() => handleTriggerGenerate(series)}
                        title="Generate Reel"
                        className="px-2 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-[11px] shadow-sm shadow-purple-600/20 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-white" />
                            <span>Gen...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 text-white fill-white" />
                            <span>Gen</span>
                          </>
                        )}
                      </button>
                    </div> */}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT SERIES MODAL DIALOG */}
      {editingSeries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0d0f1a] border border-slate-200 dark:border-white/15 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Edit Series Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSeries(null)}
                className="p-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  Series Name
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  Daily Publish Time
                </label>
                <input
                  type="time"
                  required
                  value={editPublishTime}
                  onChange={(e) => setEditPublishTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSeries(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSavingEdit || !editTitle.trim()}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingEdit ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Check className="w-3 h-3" />
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
