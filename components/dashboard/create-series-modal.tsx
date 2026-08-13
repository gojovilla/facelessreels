"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Layers,
  Wand2,
  Calendar,
  Volume2,
  Flame,
  CheckCircle2,
  ArrowRight,
  Video,
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

interface CreateSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSeriesModal({ isOpen, onClose }: CreateSeriesModalProps) {
  const [seriesName, setSeriesName] = useState("");
  const [niche, setNiche] = useState("Psychology & Dark Facts");
  const [voice, setVoice] = useState("Marcus (Deep Stoic)");
  const [frequency, setFrequency] = useState("Daily (1 Reel/Day)");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    "youtube",
    "instagram",
    "tiktok",
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  if (!isOpen) return null;

  const niches = [
    { name: "Psychology & Dark Facts", icon: "🧠" },
    { name: "Stoic Philosophy & Quotes", icon: "🏛️" },
    { name: "Money & Business Rules", icon: "💰" },
    { name: "Sci-Fi & Space Mysteries", icon: "🌌" },
    { name: "Scary & Reddit Stories", icon: "👁️" },
    { name: "Fitness & Motivation", icon: "⚡" },
  ];

  const voices = [
    "Marcus (Deep Stoic Narrator)",
    "Adam (Viral Storyteller)",
    "Elena (Hypnotic Mystery)",
    "Rachel (Energetic Tech Host)",
  ];

  const frequencies = [
    "Daily (1 Reel / Day at Peak Times)",
    "2x Daily (Morning & Evening)",
    "3x Weekly (Mon, Wed, Fri)",
    "Custom Schedule",
  ];

  const toggleChannel = (channel: string) => {
    if (selectedChannels.includes(channel)) {
      setSelectedChannels(selectedChannels.filter((c) => c !== channel));
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const handleCreate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsCreated(true);
      setTimeout(() => {
        setIsCreated(false);
        onClose();
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0e101a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40 text-slate-100 space-y-6 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create New Faceless Series</h2>
              <p className="text-xs text-slate-400">
                Setup an automated 30-day reel generation pipeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCreated ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Series Created & Armed!</h3>
            <p className="text-xs text-slate-300">
              30 days of automated reels queued into your Auto-Scheduler.
            </p>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            {/* Series Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Series Name / Concept
              </label>
              <input
                type="text"
                value={seriesName}
                onChange={(e) => setSeriesName(e.target.value)}
                placeholder="e.g. Daily Dark Psychology Tricks"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Select Niche */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Content Niche
              </label>
              <div className="grid grid-cols-2 gap-2">
                {niches.map((n) => (
                  <button
                    key={n.name}
                    type="button"
                    onClick={() => setNiche(n.name)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all flex items-center gap-2 ${
                      niche === n.name
                        ? "bg-purple-600/25 border-purple-500/60 text-purple-200 shadow-sm shadow-purple-600/20"
                        : "bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span>{n.icon}</span>
                    <span className="truncate">{n.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice & Schedule Frequency Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" /> Neural Voice
                </label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                >
                  {voices.map((v) => (
                    <option key={v} value={v} className="bg-[#0e101a] text-white">
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Auto-Dispatch Schedule
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                >
                  {frequencies.map((f) => (
                    <option key={f} value={f} className="bg-[#0e101a] text-white">
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Distribution Channels */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Autopilot Channels
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleChannel("youtube")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                    selectedChannels.includes("youtube")
                      ? "bg-red-500/20 border-red-500/50 text-red-300"
                      : "bg-white/[0.02] border-white/10 text-slate-500 hover:text-white"
                  }`}
                >
                  <YoutubeIcon className="w-4 h-4 text-red-400" />
                  YouTube Shorts
                </button>

                <button
                  type="button"
                  onClick={() => toggleChannel("instagram")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                    selectedChannels.includes("instagram")
                      ? "bg-pink-500/20 border-pink-500/50 text-pink-300"
                      : "bg-white/[0.02] border-white/10 text-slate-500 hover:text-white"
                  }`}
                >
                  <InstagramIcon className="w-4 h-4 text-pink-400" />
                  Instagram Reels
                </button>

                <button
                  type="button"
                  onClick={() => toggleChannel("tiktok")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                    selectedChannels.includes("tiktok")
                      ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                      : "bg-white/[0.02] border-white/10 text-slate-500 hover:text-white"
                  }`}
                >
                  <TikTokIcon className="w-4 h-4 text-cyan-400" />
                  TikTok FYP
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreate}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>Arming AI Generation Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Launch Automated Series</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
