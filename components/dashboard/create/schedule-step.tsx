"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Check,
  ArrowLeft,
  Sparkles,
  Zap,
  Info,
  Layers,
  Send,
  Loader2,
  Tv,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

export interface ScheduleStepData {
  seriesName: string;
  durationOption: "30-50 sec video" | "60-70 sec video";
  platforms: string[]; // ["tiktok", "youtube", "instagram", "email"]
  publishTime: string; // "18:30"
}

interface ScheduleStepProps {
  initialData?: Partial<ScheduleStepData>;
  seriesContext?: {
    nicheTitle?: string;
    voiceName?: string;
    musicCount?: number;
    styleName?: string;
    captionStyleName?: string;
  };
  onBack: () => void;
  onSubmit: (data: ScheduleStepData) => void;
  isSubmitting?: boolean;
  isEditing?: boolean;
}

const TIME_PRESETS = [
  { label: "09:15 AM", value: "09:15", desc: "Morning Commute" },
  { label: "12:30 PM", value: "12:30", desc: "Lunch Break" },
  { label: "06:30 PM", value: "18:30", desc: "Evening Peak" },
  { label: "08:00 PM", value: "20:00", desc: "Prime Social" },
  { label: "10:00 PM", value: "22:00", desc: "Late Night Focus" },
];

const PLATFORM_OPTIONS = [
  {
    id: "tiktok",
    name: "TikTok",
    icon: TikTokIcon,
    tag: "High Virality",
    color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  },
  {
    id: "youtube",
    name: "YouTube Shorts",
    icon: YoutubeIcon,
    tag: "Long-term Search",
    color: "border-red-500/40 bg-red-500/10 text-red-300",
  },
  {
    id: "instagram",
    name: "Instagram Reels",
    icon: InstagramIcon,
    tag: "Social Discovery",
    color: "border-pink-500/40 bg-pink-500/10 text-pink-300",
  },
  {
    id: "email",
    name: "Email Newsletter",
    icon: Send,
    tag: "Owned Audience",
    color: "border-purple-500/40 bg-purple-500/10 text-purple-300",
  },
];

export function ScheduleStep({
  initialData,
  seriesContext,
  onBack,
  onSubmit,
  isSubmitting = false,
  isEditing = false,
}: ScheduleStepProps) {
  const defaultTitle = seriesContext?.nicheTitle
    ? `${seriesContext.nicheTitle} Viral Series`
    : "Daily Automated Mindset Series";

  const [seriesName, setSeriesName] = useState<string>(
    initialData?.seriesName || defaultTitle
  );
  const [durationOption, setDurationOption] = useState<
    "30-50 sec video" | "60-70 sec video"
  >(initialData?.durationOption || "30-50 sec video");

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    initialData?.platforms || ["tiktok", "youtube", "instagram"]
  );

  // Time Picker state (defaults to 18:30 / 6:30 PM)
  const [publishTime, setPublishTime] = useState<string>(
    initialData?.publishTime || "18:30"
  );

  const [userTimeZone, setUserTimeZone] = useState<string>("");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimeZone(tz);
    } catch {
      setUserTimeZone("Local Time");
    }
  }, []);

  // Format 24h string (e.g. 18:30) to 12h readable string (e.g. 6:30 PM)
  const formatTime12h = (time24: string) => {
    if (!time24) return "6:30 PM";
    const [hoursStr, minutesStr] = time24.split(":");
    const hours = parseInt(hoursStr, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutesStr} ${suffix}`;
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platformId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((p) => p !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seriesName.trim()) return;

    onSubmit({
      seriesName: seriesName.trim(),
      durationOption,
      platforms: selectedPlatforms,
      publishTime,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0f1a]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Series Configuration & Automation Launch
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-semibold">
              Step 6 of 6
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set your series branding, video duration, destination channels, and automated daily dispatch schedule.
          </p>
        </div>
      </div>

      {/* 2. Series Form Fields */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0f1a]/90 space-y-5 shadow-sm">
        {/* Field A: Series Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
            Series Name <span className="text-purple-600 dark:text-purple-400">*</span>
          </label>
          <input
            type="text"
            required
            value={seriesName}
            onChange={(e) => setSeriesName(e.target.value)}
            placeholder="e.g. Stoic Mindset Secrets, Scary Urban Legends 2026..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Field B: Video Duration Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
            Video Duration <span className="text-purple-600 dark:text-purple-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDurationOption("30-50 sec video")}
              className={`p-3.5 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                durationOption === "30-50 sec video"
                  ? "bg-purple-50/70 dark:bg-purple-950/30 border-2 border-purple-600 dark:border-purple-500 shadow-md"
                  : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/20"
              }`}
            >
              <div>
                <div className={`text-xs sm:text-sm font-bold ${
                  durationOption === "30-50 sec video" ? "text-purple-900 dark:text-white" : "text-slate-800 dark:text-white"
                }`}>
                  30-50 sec video
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Optimized for viral retention & high completion rates on Shorts/TikTok.
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  durationOption === "30-50 sec video"
                    ? "border-purple-600 bg-purple-600 text-white"
                    : "border-slate-300 dark:border-white/20"
                }`}
              >
                {durationOption === "30-50 sec video" && (
                  <Check className="w-3 h-3 stroke-[3]" />
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDurationOption("60-70 sec video")}
              className={`p-3.5 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                durationOption === "60-70 sec video"
                  ? "bg-purple-50/70 dark:bg-purple-950/30 border-2 border-purple-600 dark:border-purple-500 shadow-md"
                  : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/20"
              }`}
            >
              <div>
                <div className={`text-xs sm:text-sm font-bold ${
                  durationOption === "60-70 sec video" ? "text-purple-900 dark:text-white" : "text-slate-800 dark:text-white"
                }`}>
                  60-70 sec video
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Detailed storytelling format for high RPM long narratives and breakdowns.
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  durationOption === "60-70 sec video"
                    ? "border-purple-600 bg-purple-600 text-white"
                    : "border-slate-300 dark:border-white/20"
                }`}
              >
                {durationOption === "60-70 sec video" && (
                  <Check className="w-3 h-3 stroke-[3]" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Field C: Target Platforms Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Select Target Platforms <span className="text-purple-600 dark:text-purple-400">*</span>
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {selectedPlatforms.length} Platforms Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PLATFORM_OPTIONS.map((plat) => {
              const isSelected = selectedPlatforms.includes(plat.id);
              const IconComponent = plat.icon;

              return (
                <button
                  key={plat.id}
                  type="button"
                  onClick={() => togglePlatform(plat.id)}
                  className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between space-y-2 cursor-pointer ${
                    isSelected
                      ? `${plat.color} border-2 shadow-sm`
                      : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <IconComponent className="w-5 h-5" />
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isSelected
                          ? "border-purple-600 bg-purple-600 text-white"
                          : "border-slate-300 dark:border-white/20"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <div className={`text-xs font-bold ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-white"}`}>
                      {plat.name}
                    </div>
                    <span className="text-[10px] opacity-75">{plat.tag}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Field D: Time Picker Selection & Crucial Warning Note */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Time to Publish</span>
            </label>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              <span>Timezone: <strong className="text-slate-800 dark:text-slate-200">{userTimeZone || "Local"}</strong></span>
            </span>
          </div>

          {/* Interactive Time Picker Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="time"
                    required
                    value={publishTime}
                    onChange={(e) => setPublishTime(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#121526] border border-purple-500/40 text-slate-900 dark:text-white text-base font-mono font-bold focus:outline-none focus:border-purple-500 cursor-pointer shadow-sm"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-purple-700 dark:text-purple-300 font-mono">
                    Daily @ {formatTime12h(publishTime)}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Automated daily publish time
                  </span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                {TIME_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setPublishTime(preset.value)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
                      publishTime === preset.value
                        ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                        : "bg-white dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* REQUIRED NOTE: "Video will generate 3-6 hours before video publish" */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 text-purple-800 dark:text-purple-200">
            <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-purple-900 dark:text-purple-300">
                Video will generate 3-6 hours before video publish
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                Our rendering pipeline pre-generates visual art, voice tracks, and animations early so your reel is ready for instant automated dispatch at your chosen time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Series Production Summary Badge */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0f1a]/80 space-y-2 shadow-sm">
        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Series Pipeline Summary</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Niche:</span>
            <span className="font-semibold text-slate-900 dark:text-white truncate block">
              {seriesContext?.nicheTitle || "Custom Niche"}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Voice:</span>
            <span className="font-semibold text-cyan-700 dark:text-cyan-300 truncate block">
              {seriesContext?.voiceName || "Deepgram Neural"}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Art Style:</span>
            <span className="font-semibold text-pink-700 dark:text-pink-300 truncate block">
              {seriesContext?.styleName || "Cinematic 9:16"}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-0.5">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Captions:</span>
            <span className="font-semibold text-amber-700 dark:text-yellow-300 truncate block">
              {seriesContext?.captionStyleName || "Viral Pop"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Navigation & Schedule Button */}
      <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Captions</span>
        </button>

        {/* Finally show Schedule / Save Changes button */}
        <button
          type="submit"
          disabled={isSubmitting || !seriesName.trim() || selectedPlatforms.length === 0}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>{isEditing ? "Saving Changes..." : "Scheduling Series..."}</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-cyan-200 fill-cyan-200" />
              <span>{isEditing ? "Save Series Changes" : "Schedule Series"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
