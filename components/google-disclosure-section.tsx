"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Trash2,
  ExternalLink,
  CheckCircle2,
  KeyRound,
  FileText,
} from "lucide-react";
import { YoutubeIcon } from "@/components/icons";

export function GoogleDisclosureSection() {
  return (
    <section
      id="youtube-disclosure"
      className="py-20 bg-gradient-to-b from-[#090a0f] via-[#0d0f18] to-[#090a0f] border-t border-b border-white/10 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            <YoutubeIcon className="w-4 h-4 text-red-400" />
            <span>Official YouTube Data API Integration & Compliance</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How <span className="text-purple-400">FacelessReels AI</span> Uses YouTube API Services
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            <strong>FacelessReels AI</strong> is an automated video generation and channel management platform. We connect to your YouTube channel using Google&apos;s official OAuth 2.0 protocol strictly to publish the short-form videos you create and approve.
          </p>
        </div>

        {/* 4 Pillars of Google / YouTube Compliance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Pillar 1: Purpose */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-red-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <YoutubeIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Application Purpose</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              FacelessReels AI allows creators to automate video scriptwriting, voiceover generation, and direct publishing of scheduled YouTube Shorts to their connected channels.
            </p>
          </div>

          {/* Pillar 2: OAuth Scopes */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Requested Scopes</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We only request <code className="text-purple-300 bg-purple-950/40 px-1 rounded">youtube.upload</code> (to publish approved videos) and <code className="text-purple-300 bg-purple-950/40 px-1 rounded">youtube.readonly</code> (to confirm upload status and channel title).
            </p>
          </div>

          {/* Pillar 3: Data Security */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Strict Data Security</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tokens are stored using AES-256 encryption. We never access private personal messages, videos, search history, or personal profile data outside of authorized upload operations.
            </p>
          </div>

          {/* Pillar 4: User Control & Revocation */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1-Click Revocation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You maintain 100% control. You can disconnect your YouTube account anytime inside the FacelessReels AI dashboard or via Google&apos;s Security Settings page.
            </p>
          </div>
        </div>

        {/* Detailed Google User Data Policy Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/20 via-[#0e111a] to-purple-950/20 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-base font-bold text-white">
                  Adherence to Google API Services User Data Policy
                </h4>
                <p className="text-xs text-slate-400">
                  FacelessReels AI strictly adheres to the Google API Services User Data Policy, including the Limited Use requirements.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/privacy"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Privacy Policy</span>
              </Link>
              <Link
                href="/terms"
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Terms of Service</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 pt-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>No Data Selling:</strong> Google user data is never sold, leased, or transferred to advertising platforms or data brokers.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero AI Training on User Data:</strong> Your YouTube account data and video uploads are never used to train generalized AI models.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Terms Alignment:</strong> By using this integration, you agree to be bound by the{" "}
                <a
                  href="https://www.youtube.com/t/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 underline hover:text-red-300 inline-flex items-center gap-0.5"
                >
                  YouTube Terms of Service <ExternalLink className="w-2.5 h-2.5" />
                </a>{" "}
                and{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 underline hover:text-purple-300 inline-flex items-center gap-0.5"
                >
                  Google Privacy Policy <ExternalLink className="w-2.5 h-2.5" />
                </a>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
