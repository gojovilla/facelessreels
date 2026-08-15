"use client";

import React, { useState } from "react";
import {
  Settings,
  User,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Bell,
  Key,
  Globe,
  Trash2,
  Sparkles,
} from "lucide-react";
import { useUser, UserProfile } from "@clerk/nextjs";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

export default function SettingsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"profile" | "channels" | "notifications">("profile");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Account & Pipeline Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your creator profile, connected distribution channels, and publishing preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-purple-50 dark:bg-purple-600/25 text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-purple-500/40 font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Profile Details
        </button>
        <button
          onClick={() => setActiveTab("channels")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "channels"
              ? "bg-purple-50 dark:bg-purple-600/25 text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-purple-500/40 font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Connected Social Accounts
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "notifications"
              ? "bg-purple-50 dark:bg-purple-600/25 text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-purple-500/40 font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Dispatch Alerts
        </button>
      </div>

      {/* Profile Section */}
      {activeTab === "profile" && (
        <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0e18]/80 space-y-6 max-w-3xl shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Creator Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={user?.fullName || user?.username || "Creator"}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.primaryEmailAddress?.emailAddress || ""}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Clerk Auth & Supabase Synced</span>
            </div>

            <span className="text-[11px] text-slate-500">
              Account Managed by Clerk
            </span>
          </div>
        </div>
      )}

      {/* Connected Channels Section */}
      {activeTab === "channels" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl">
          <div className="rounded-2xl p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0e18]/80 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <YoutubeIcon className="w-5 h-5 text-red-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">YouTube Shorts</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-semibold">
                Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Auto-publish reels as YouTube Shorts with tags & description</p>
            <button className="w-full py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
              Manage YouTube Auth
            </button>
          </div>

          <div className="rounded-2xl p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0e18]/80 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <InstagramIcon className="w-5 h-5 text-pink-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Instagram Reels</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-semibold">
                Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Auto-post to Instagram Reels with high-conversion caption hooks</p>
            <button className="w-full py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
              Manage IG Graph API
            </button>
          </div>

          <div className="rounded-2xl p-5 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0e18]/80 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TikTokIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">TikTok FYP</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-semibold">
                Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Direct pipeline to TikTok content API for peak-time scheduling</p>
            <button className="w-full py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
              Manage TikTok Auth
            </button>
          </div>
        </div>
      )}

      {/* Notifications Section */}
      {activeTab === "notifications" && (
        <div className="rounded-3xl p-6 border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0e18]/80 max-w-2xl space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Dispatch & Render Notifications
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-purple-600" />
              <span>Email me when a series reel finishes rendering</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-purple-600" />
              <span>Send daily summary of published reels & views</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-purple-600" />
              <span>Alert me if any social channel token expires</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
