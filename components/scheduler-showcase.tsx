"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Mail,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Zap,
  Filter,
  Check,
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  title: string;
  niche: string;
  channels: ("youtube" | "instagram" | "tiktok" | "email")[];
  status: "published" | "scheduled" | "rendering";
  predictedViews: string;
  viralScore: number;
}

const SCHEDULE_DATA: ScheduleItem[] = [
  {
    id: "1",
    day: "Monday",
    time: "09:30 AM",
    title: "Dark Psychology: How narcissists test your boundaries",
    niche: "Psychology",
    channels: ["youtube", "instagram", "tiktok", "email"],
    status: "published",
    predictedViews: "340k views",
    viralScore: 94,
  },
  {
    id: "2",
    day: "Monday",
    time: "06:15 PM",
    title: "Marcus Aurelius: 3 rules for uncontrollable anger",
    niche: "Stoicism",
    channels: ["youtube", "instagram", "tiktok"],
    status: "published",
    predictedViews: "210k views",
    viralScore: 88,
  },
  {
    id: "3",
    day: "Tuesday",
    time: "11:00 AM",
    title: "Reddit Creepypasta: The forest ranger who found stairs in the woods",
    niche: "Scary Stories",
    channels: ["youtube", "tiktok"],
    status: "published",
    predictedViews: "520k views",
    viralScore: 98,
  },
  {
    id: "4",
    day: "Wednesday",
    time: "02:30 PM",
    title: "Space Secrets: The silent ocean hidden on Jupiter's moon",
    niche: "Cosmic Mysteries",
    channels: ["youtube", "instagram", "tiktok", "email"],
    status: "scheduled",
    predictedViews: "180k views",
    viralScore: 85,
  },
  {
    id: "5",
    day: "Thursday",
    time: "07:00 PM",
    title: "Wealth Rules: Why rich people never hold cash during inflation",
    niche: "Finance",
    channels: ["youtube", "instagram", "tiktok", "email"],
    status: "scheduled",
    predictedViews: "290k views",
    viralScore: 91,
  },
  {
    id: "6",
    day: "Friday",
    time: "05:45 PM",
    title: "Daily Motivation: The 1-minute rule that kills procrastination",
    niche: "Self Growth",
    channels: ["youtube", "instagram", "tiktok"],
    status: "rendering",
    predictedViews: "410k views",
    viralScore: 96,
  },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function SchedulerShowcase() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [autoRefill, setAutoRefill] = useState(true);
  const [smartPeakTime, setSmartPeakTime] = useState(true);

  const filteredItems = SCHEDULE_DATA.filter((item) => item.day === selectedDay);

  return (
    <section id="scheduler" className="py-20 lg:py-28 relative bg-[#090a0f] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            Set Once, Publish Forever
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Smart Auto-Scheduler for <span className="gradient-text-purple">30 Days of Content</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Keep your channels firing around the clock. Our AI analyzes when your audience is scrolling and auto-dispatches reels to YouTube Shorts, Instagram, TikTok, and your Email newsletter at peak hours.
          </p>
        </div>

        {/* Scheduler Dashboard Mockup */}
        <div className="rounded-3xl glass-card border border-white/10 p-6 sm:p-8 relative shadow-2xl">
          {/* Top Bar with Controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Faceless Content Queue & Calendar
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                    AUTOPILOT ON
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Syncing with 4 connected platforms</p>
              </div>
            </div>

            {/* Smart Toggles */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                onClick={() => setSmartPeakTime(!smartPeakTime)}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                  smartPeakTime
                    ? "bg-purple-600/20 border-purple-500 text-purple-200"
                    : "bg-white/[0.03] border-white/10 text-slate-400"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Peak-Time Algorithm</span>
                {smartPeakTime && <Check className="w-3 h-3 text-purple-300 ml-0.5" />}
              </button>

              <button
                onClick={() => setAutoRefill(!autoRefill)}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                  autoRefill
                    ? "bg-cyan-600/20 border-cyan-500 text-cyan-200"
                    : "bg-white/[0.03] border-white/10 text-slate-400"
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auto-Refill 30 Days</span>
                {autoRefill && <Check className="w-3 h-3 text-cyan-300 ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Days of Week Tab selector */}
          <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-white/5 scrollbar-none">
            {DAYS.map((day) => {
              const isSelected = selectedDay === day;
              const count = SCHEDULE_DATA.filter((i) => i.day === day).length;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                      : "bg-white/[0.02] border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
                  }`}
                >
                  <span>{day}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? "bg-black/30 text-white" : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {count} reels
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Day Schedule Timeline */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-300">
                Scheduled Slots for {selectedDay}:
              </span>
              <span className="text-xs text-purple-400 flex items-center gap-1 font-mono">
                <Sparkles className="w-3.5 h-3.5" /> Optimal Post Frequency: 2-3 Shorts/Day
              </span>
            </div>

            {filteredItems.length > 0 ? (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                  >
                    {/* Time & Title */}
                    <div className="flex items-start gap-3">
                      <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-cyan-300 shrink-0 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {item.time}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-white group-hover:text-purple-200 transition-colors">
                            {item.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">
                            {item.niche}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>Target:</span>
                          <div className="flex items-center gap-1.5">
                            {item.channels.includes("youtube") && (
                              <span className="flex items-center gap-1 text-[10px] text-red-400">
                                <YoutubeIcon className="w-3 h-3" /> Shorts
                              </span>
                            )}
                            {item.channels.includes("instagram") && (
                              <span className="flex items-center gap-1 text-[10px] text-pink-400">
                                <InstagramIcon className="w-3 h-3" /> Reels
                              </span>
                            )}
                            {item.channels.includes("tiktok") && (
                              <span className="flex items-center gap-1 text-[10px] text-cyan-400">
                                <TikTokIcon className="w-3 h-3" /> TikTok
                              </span>
                            )}
                            {item.channels.includes("email") && (
                              <span className="flex items-center gap-1 text-[10px] text-purple-400">
                                <Mail className="w-3 h-3" /> Email
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status & Predictions */}
                    <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                      <div className="text-right text-xs">
                        <div className="font-semibold text-emerald-400">{item.predictedViews}</div>
                        <div className="text-[10px] text-slate-400">Viral Index: {item.viralScore}/100</div>
                      </div>

                      <div className="w-24 text-center">
                        {item.status === "published" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                            <CheckCircle2 className="w-3 h-3" /> Published
                          </span>
                        )}
                        {item.status === "scheduled" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                            <Clock className="w-3 h-3" /> Queued
                          </span>
                        )}
                        {item.status === "rendering" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Rendering
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-white/[0.01] border border-dashed border-white/10 text-center space-y-3">
                <p className="text-xs text-slate-400">No manual reels scheduled yet for this day.</p>
                <button
                  onClick={() => {}}
                  className="px-4 py-2 rounded-xl bg-purple-600/30 border border-purple-500/40 text-xs font-semibold text-purple-200 hover:bg-purple-600/50 transition-all inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Auto-Fill With AI Niche Generator
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
