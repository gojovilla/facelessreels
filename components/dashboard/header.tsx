"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Sparkles,
  Search,
  Bell,
  Plus,
  Zap,
  ExternalLink,
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  onOpenCreateSeries?: () => void;
}

export function DashboardHeader({
  onMobileMenuToggle,
  onOpenCreateSeries,
}: HeaderProps) {
  const pathname = usePathname();
  const { user } = useUser();

  const getPageTitle = () => {
    if (pathname.includes("/dashboard/series") || pathname === "/dashboard") {
      return "Series Overview";
    }
    if (pathname.includes("/dashboard/videos")) {
      return "Video Library";
    }
    if (pathname.includes("/dashboard/guides")) {
      return "Growth Guides & Tutorials";
    }
    if (pathname.includes("/dashboard/billing")) {
      return "Billing & Subscriptions";
    }
    if (pathname.includes("/dashboard/settings")) {
      return "Account Settings";
    }
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#090b12]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 flex items-center justify-between">
      {/* Left Area: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Dashboard
          </span>
          <span className="text-xs text-slate-600 hidden sm:inline">/</span>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right Area: Credits, Live Preview, and User Profile */}
      <div className="flex items-center gap-3">
        {/* Credits Remaining Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span className="text-purple-300 font-semibold">3 AI Credits</span>
        </div>

        {/* Live Demo Generator Trigger */}
        <Link
          href="/#live-demo"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all"
        >
          <span>Live AI Demo</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* Quick Create Series Button */}
        {onOpenCreateSeries && (
          <button
            onClick={onOpenCreateSeries}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 hover:opacity-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Series</span>
          </button>
        )}

        {/* User Profile Button */}
        <div className="flex items-center pl-1">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 ring-2 ring-purple-500/40 hover:ring-purple-400 transition-all",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
