"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Video,
  Calendar,
  Clock,
  Mail,
  TrendingUp,
  Zap,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Layers,
  Wand2,
  Play,
  Flame,
  CreditCard,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { syncUserToSupabase } from "@/app/actions/user";

export function DashboardClient() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<"overview" | "create" | "schedules" | "channels">("overview");
  const [credits, setCredits] = useState(3);
  const [tier, setTier] = useState("free");

  // Auto-sync user with Supabase 'users' table on dashboard load
  useEffect(() => {
    async function syncUser() {
      if (!user) return;
      try {
        const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || "";
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Creator";

        if (email) {
          await syncUserToSupabase({
            name: fullName,
            email: email,
          });
        }
      } catch (err) {
        console.warn("Supabase user sync notice:", err);
      }
    }

    if (isLoaded && user) {
      syncUser();
    }
  }, [user, isLoaded]);

  const recentReels = [
    {
      id: "1",
      title: "Dark Psychology: 3 body language triggers to control any conversation",
      niche: "Psychology",
      status: "scheduled",
      scheduledFor: "Today @ 6:30 PM",
      channels: ["youtube", "instagram", "tiktok", "email"],
      predictedViews: "340k views",
      score: 94,
    },
    {
      id: "2",
      title: "Marcus Aurelius: The brutal truth about seeking validation",
      niche: "Stoicism",
      status: "published",
      scheduledFor: "Yesterday @ 9:15 AM",
      channels: ["youtube", "instagram", "tiktok"],
      predictedViews: "210k views",
      score: 89,
    },
    {
      id: "3",
      title: "Wealth Rules: The IRS loophole billionaires use to write off cars",
      niche: "Finance",
      status: "scheduled",
      scheduledFor: "Tomorrow @ 12:00 PM",
      channels: ["youtube", "email"],
      predictedViews: "450k views",
      score: 96,
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#090a0f]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#0d0f18] rounded-[11px] flex items-center justify-center">
                  <Video className="w-4 h-4 text-purple-400 group-hover:text-cyan-300 transition-colors" />
                </div>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Faceless<span className="gradient-text-purple">Reels</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "overview"
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("schedules")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "schedules"
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Auto-Scheduler Queue
              </button>
              <button
                onClick={() => setActiveTab("channels")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "channels"
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                4 Connected Channels
              </button>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Credit Pill */}
            <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 flex items-center gap-2 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span className="text-purple-300 font-semibold">{credits} AI Credits</span>
            </div>

            <Link
              href="/#live-demo"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-semibold hover:opacity-95 shadow-md shadow-purple-600/25 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Reel</span>
            </Link>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 ring-2 ring-purple-500/50",
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-3xl glass-card border border-white/10 p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-purple-950/30 via-[#101322] to-cyan-950/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome back, {user?.firstName || user?.username || "Creator"} 👋
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono uppercase">
                  Supabase Synced
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                Your 4 autopilot channels are armed. 3 viral reels queued for dispatch this week.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/#pricing"
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-slate-200 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Upgrade Plan</span>
              </Link>

              <Link
                href="/#live-demo"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4 text-cyan-300" />
                <span>Generate Video Now</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Remaining Credits</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{credits} Reels</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Free tier active
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Queued in Scheduler</span>
              <Calendar className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">4 Shorts</div>
            <div className="text-[11px] text-cyan-300">Next post today @ 6:30 PM</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Connected Pipelines</span>
              <Layers className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">4 / 4 Active</div>
            <div className="text-[11px] text-slate-400">YouTube, IG, TikTok, Email</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Est. Weekly Reach</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">1.2M Views</div>
            <div className="text-[11px] text-emerald-400">+48% vs last week</div>
          </div>
        </div>

        {/* Content Queue & Active Reels Table */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Active Auto-Scheduler Queue
              </h2>
              <p className="text-xs text-slate-400">Manage and preview videos scheduled for automatic multi-channel dispatch</p>
            </div>

            <Link
              href="/#live-demo"
              className="px-4 py-2 rounded-xl bg-purple-600/30 border border-purple-500/40 text-xs font-semibold text-purple-200 hover:bg-purple-600/50 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Reel to Queue</span>
            </Link>
          </div>

          <div className="space-y-3">
            {recentReels.map((reel) => (
              <div
                key={reel.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                    <Video className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white">{reel.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                        {reel.niche}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-cyan-300 font-mono">
                        <Clock className="w-3 h-3 text-cyan-400" /> {reel.scheduledFor}
                      </span>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        {reel.channels.includes("youtube") && <YoutubeIcon className="w-3.5 h-3.5 text-red-400" />}
                        {reel.channels.includes("instagram") && <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />}
                        {reel.channels.includes("tiktok") && <TikTokIcon className="w-3.5 h-3.5 text-cyan-400" />}
                        {reel.channels.includes("email") && <Mail className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-emerald-400">{reel.predictedViews}</div>
                    <div className="text-[10px] text-slate-500">Viral Index: {reel.score}/100</div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
                    reel.status === "published"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  }`}>
                    {reel.status === "published" ? "Published" : "Queued"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Connected Channels Status Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center text-red-400">
                <YoutubeIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">YouTube Shorts</h4>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-600/20 flex items-center justify-center text-pink-400">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Instagram Reels</h4>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 flex items-center justify-center text-cyan-400">
                <TikTokIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">TikTok FYP</h4>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Email Digest</h4>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
