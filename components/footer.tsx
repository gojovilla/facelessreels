"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Video,
  Mail,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Send,
  Heart,
  Globe,
  Loader2,
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

export function Footer() {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      startTransition(async () => {
        await subscribeToNewsletter(emailInput);
        setSubscribed(true);
      });
    }
  };

  return (
    <footer className="bg-[#050608] border-t border-white/10 text-slate-400 relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-purple-600/10 blur-[100px] pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        {/* Newsletter Subscription Row */}
        <div className="rounded-3xl glass-card border border-white/10 p-6 sm:p-8 mb-16 bg-gradient-to-r from-purple-950/20 via-[#0d0f18] to-cyan-950/20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center lg:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center justify-center lg:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Get 5 Viral Video Hooks Delivered Every Monday
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Join 45,000+ creators getting retention formulas, trending niches, and algorithm updates.
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You&apos;re in! Look out for your first viral hook drop this Monday.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2"
              >
                <input
                  type="email"
                  required
                  disabled={isPending}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your creator email..."
                  className="w-full sm:w-72 px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Subscribe Free</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-block">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20">
                <div className="w-full h-full bg-[#0d0f18] rounded-[11px] flex items-center justify-center">
                  <Video className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                FacelessReels <span className="gradient-text-purple">AI</span>
              </span>
            </Link>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              <strong>FacelessReels AI</strong> is an automated short video generator & YouTube scheduler. Create viral shorts in seconds and automatically publish to YouTube, Instagram, TikTok & Email on complete autopilot.
            </p>

            {/* Live Operational Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (99.99%)</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/40 transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@facelessreels.ai"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-500/40 transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 1: Product & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-purple-300 transition-colors">
                  AI Video Generator
                </a>
              </li>
              <li>
                <a href="#scheduler" className="hover:text-purple-300 transition-colors">
                  Auto-Scheduler Engine
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-purple-300 transition-colors">
                  150+ Neural Voiceovers
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-purple-300 transition-colors">
                  Hormozi Dynamic Captions
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-purple-300 transition-colors">
                  4K Cinematic B-Roll Vault
                </a>
              </li>
              <li>
                <a href="#channels" className="hover:text-purple-300 transition-colors">
                  Email Video Digest Blasts
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-purple-300 transition-colors">
                  Pricing & Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Supported Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Channels</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#channels" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                  <YoutubeIcon className="w-3.5 h-3.5 text-red-400" /> YouTube Shorts
                </a>
              </li>
              <li>
                <a href="#channels" className="hover:text-pink-400 transition-colors flex items-center gap-1.5">
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400" /> Instagram Reels
                </a>
              </li>
              <li>
                <a href="#channels" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <TikTokIcon className="w-3.5 h-3.5 text-cyan-400" /> TikTok FYP Sync
                </a>
              </li>
              <li>
                <a href="#channels" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-400" /> Email Video Digests
                </a>
              </li>
              <li>
                <a href="#scheduler" className="hover:text-white transition-colors">
                  ConvertKit & Mailchimp
                </a>
              </li>
              <li>
                <a href="#scheduler" className="hover:text-white transition-colors">
                  Multi-Account Fleet
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Trending Niches */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Niches</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#niches" className="hover:text-purple-300 transition-colors">
                  Dark Psychology
                </a>
              </li>
              <li>
                <a href="#niches" className="hover:text-purple-300 transition-colors">
                  Stoic Wisdom & Quotes
                </a>
              </li>
              <li>
                <a href="#niches" className="hover:text-purple-300 transition-colors">
                  Scary Reddit Tales
                </a>
              </li>
              <li>
                <a href="#niches" className="hover:text-purple-300 transition-colors">
                  Cosmic Deep Space
                </a>
              </li>
              <li>
                <a href="#niches" className="hover:text-purple-300 transition-colors">
                  Wealth & Tax Secrets
                </a>
              </li>
              <li>
                <a href="#niches" className="hover:text-purple-300 transition-colors">
                  Ancient Gods & Lore
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#faq" className="hover:text-purple-300 transition-colors">
                  Monetization FAQ
                </a>
              </li>
              <li>
                <a href="#live-demo" className="hover:text-purple-300 transition-colors">
                  Interactive Reel Studio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-300 transition-colors flex items-center gap-1">
                  Affiliate Program (30% RevShare) <span className="text-[9px] px-1 py-0.2 bg-purple-500/20 text-purple-300 rounded">Earn $</span>
                </a>
              </li>
              <li>
                <a href="#youtube-disclosure" className="hover:text-red-400 transition-colors flex items-center gap-1">
                  <YoutubeIcon className="w-3.5 h-3.5 text-red-400" /> YouTube API Disclosure
                </a>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-200 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="#youtube-disclosure" className="hover:text-slate-200 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Google Limited Use Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} FacelessReels AI. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              Made for creators with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Global Cloud CDN
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
