"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Video,
  Calendar,
  Layers,
  Zap,
  Menu,
  X,
  ArrowRight,
  Play,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Live Demo", href: "#live-demo" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Channels", href: "#channels" },
    { name: "Auto-Scheduler", href: "#scheduler" },
    { name: "Niches", href: "#niches" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#090a0f]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-purple-950/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/25 transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#0d0f18] rounded-[11px] flex items-center justify-center">
                <Video className="w-5 h-5 text-purple-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#090a0f] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-purple-200 transition-colors">
                  Faceless<span className="gradient-text-purple">Reels</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-purple-500/15 border border-purple-500/30 text-purple-300 rounded-md">
                  AI v2.4
                </span>
              </div>
              <span className="text-[11px] text-slate-400 tracking-tight -mt-0.5">
                Create & Auto-Schedule
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-full transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#pricing"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </a>
            <a
              href="#live-demo"
              className="relative inline-flex items-center justify-center p-[1px] overflow-hidden rounded-full font-medium transition-all duration-300 group hover:shadow-lg hover:shadow-purple-500/25"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 via-indigo-500 to-cyan-400 group-hover:from-purple-500 group-hover:to-cyan-300"></span>
              <span className="relative px-4 py-2 text-xs font-semibold text-white bg-[#0f111e] rounded-full transition-all duration-200 group-hover:bg-opacity-0 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Start Free</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="#live-demo"
              className="text-xs font-semibold bg-purple-600 text-white px-3 py-1.5 rounded-full"
            >
              Try Free
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0f18]/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-3 pb-6 mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <a
              href="#live-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate First Reel Free
            </a>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 py-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No Card Needed
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant Autopilot
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
