"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Layers,
  Video,
  BookOpen,
  CreditCard,
  Settings,
  Plus,
  Sparkles,
  Zap,
  ChevronRight,
  User,
  ShieldCheck,
  Tv,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";
import { CreateSeriesModal } from "./create-series-modal";

interface SidebarProps {
  onMobileClose?: () => void;
}

export function DashboardSidebar({ onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems = [
    {
      name: "Series",
      href: "/dashboard/series",
      alias: "/dashboard",
      icon: Tv,
      badge: "3 Active",
    },
    {
      name: "Videos",
      href: "/dashboard/videos",
      icon: Video,
      badge: "12 Ready",
    },
    {
      name: "Guides",
      href: "/dashboard/guides",
      icon: BookOpen,
      badge: "New",
    },
    {
      name: "Billing",
      href: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const isActive = (item: (typeof navItems)[0]) => {
    if (pathname === item.href) return true;
    if (item.alias && pathname === item.alias) return true;
    if (pathname.startsWith(item.href) && item.href !== "/dashboard") return true;
    return false;
  };

  return (
    <>
      <aside className="w-64 h-full bg-[#0a0c14] border-r border-white/10 flex flex-col justify-between selection:bg-purple-500/30 selection:text-purple-200">
        {/* Top Section */}
        <div className="p-5 space-y-6">
          {/* Sidebar Header: Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform hover:scale-[1.02]"
            onClick={onMobileClose}
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-purple-600/20 border border-purple-500/30 p-1 flex items-center justify-center shadow-lg shadow-purple-950/40">
              <Image
                src="/logo.png"
                alt="facelessreels logo"
                width={36}
                height={36}
                className="w-full h-full object-contain rounded-lg"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-base font-extrabold tracking-tight text-white group-hover:text-purple-200 transition-colors">
                  faceless<span className="gradient-text-purple">reels</span>
                </span>
                <span className="px-1 py-0.2 text-[9px] font-bold uppercase bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium -mt-0.5">
                Video Automation
              </span>
            </div>
          </Link>

          {/* "+ Create New Series" Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200 text-cyan-200" />
            <span>+ Create New Series</span>
          </button>

          {/* Navigation Menu Options */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Main Menu
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(item);
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                      active
                        ? "bg-purple-600/20 text-purple-200 border border-purple-500/40 font-semibold shadow-sm shadow-purple-600/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className={`w-4 h-4 transition-colors ${
                          active
                            ? "text-purple-400"
                            : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span className="capitalize">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded-md ${
                          active
                            ? "bg-purple-500/30 text-purple-200"
                            : "bg-white/[0.05] text-slate-400 group-hover:text-slate-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer Section */}
        <div className="p-4 space-y-3 border-t border-white/10 bg-black/20">
          {/* Upgrade to Pro Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-indigo-950/30 border border-purple-500/25 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/15 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Upgrade to Pro</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2.5 leading-snug">
              Unlock unlimited 4K reels & 4-channel auto-publishing.
            </p>
            <Link
              href="/dashboard/billing"
              onClick={onMobileClose}
              className="w-full py-1.5 px-3 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 font-semibold text-[11px] transition-all flex items-center justify-center gap-1"
            >
              <span>Upgrade Plan</span>
              <ChevronRight className="w-3 h-3 text-purple-300" />
            </Link>
          </div>

          {/* Profile Setting Option */}
          <Link
            href="/dashboard/settings"
            onClick={onMobileClose}
            className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-7 h-7 ring-2 ring-purple-500/40",
                    },
                  }}
                />
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-semibold text-white truncate">
                  {user?.fullName || user?.username || "Creator Profile"}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  Profile & Settings
                </span>
              </div>
            </div>

            <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-300 transition-colors shrink-0" />
          </Link>
        </div>
      </aside>

      {/* Modal Dialog */}
      <CreateSeriesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
