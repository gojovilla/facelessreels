import React from "react";
import Link from "next/link";
import { Video, Sparkles, CheckCircle2, ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col relative overflow-hidden bg-grid-pattern">
      {/* Radiant Background Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar Header */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/25 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0d0f18] rounded-[11px] flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white">
              Faceless<span className="gradient-text-purple">Reels</span>
            </span>
            <span className="text-[11px] text-slate-400 -mt-0.5">
              AI Video & Auto-Scheduler
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Auth Form Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Trust Pill Above Card */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-[11px] font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>3 Free AI Reels on Sign Up • No Credit Card</span>
          </div>

          {/* Clerk Auth Card */}
          <div className="w-full flex justify-center">{children}</div>

          {/* Micro Trust Indicators */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 mt-8">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> YouTube & Meta Verified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Monetization Safe
            </span>
          </div>
        </div>
      </main>

      {/* Auth Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500 border-t border-white/5">
        &copy; {new Date().getFullYear()} FacelessReels.ai Inc. All rights reserved.
      </footer>
    </div>
  );
}
