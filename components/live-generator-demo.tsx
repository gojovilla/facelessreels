"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Play,
  Pause,
  RefreshCw,
  Calendar,
  Mail,
  CheckCircle,
  Clock,
  Volume2,
  Sliders,
  Share2,
  Check,
  TrendingUp,
  Zap,
  Flame,
  ArrowRight,
  Eye,
  Layers,
  Wand2,
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, TikTokIcon } from "@/components/icons";

interface NicheOption {
  id: string;
  name: string;
  emoji: string;
  hook: string;
  captionExcerpt: string;
  tagline: string;
  bgGradient: string;
  videoThumb: string;
  estimatedViews: string;
  rpm: string;
}

const NICHES: NicheOption[] = [
  {
    id: "dark-psychology",
    name: "Dark Psychology",
    emoji: "🧠",
    hook: "The 3 toxic body language tricks people use to manipulate you without speaking...",
    captionExcerpt: "NEVER look directly into their left eye if you want to stay in CONTROL.",
    tagline: "High retention, high viral shareability",
    bgGradient: "from-purple-950 via-slate-900 to-black",
    videoThumb: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    estimatedViews: "2.4M avg views",
    rpm: "$4.80 RPM",
  },
  {
    id: "stoic-wisdom",
    name: "Stoic Wisdom",
    emoji: "🏛️",
    hook: "Marcus Aurelius warned us: If you want peace, stop caring about this ONE thing...",
    captionExcerpt: "You have power over your MIND, not outside events. Realize this.",
    tagline: "Evergreen audience, loyal following",
    bgGradient: "from-amber-950 via-stone-900 to-black",
    videoThumb: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
    estimatedViews: "1.8M avg views",
    rpm: "$6.20 RPM",
  },
  {
    id: "scary-reddit",
    name: "Scary Encounters",
    emoji: "👻",
    hook: "I worked as a night guard in an empty museum. Rule #4 was never look at Mirror 3...",
    captionExcerpt: "At 3:14 AM, the reflection blinked before I did. I dropped the radio.",
    tagline: "Insane watch time & loop rate",
    bgGradient: "from-emerald-950 via-zinc-900 to-black",
    videoThumb: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    estimatedViews: "3.1M avg views",
    rpm: "$3.90 RPM",
  },
  {
    id: "space-mysteries",
    name: "Cosmic Mysteries",
    emoji: "🚀",
    hook: "NASA detected a radio signal repeating every 16 days from 500 million light years away...",
    captionExcerpt: "It is mathematically TOO precise to be an exploding star. What is it?",
    tagline: "Global curiosity appeal",
    bgGradient: "from-cyan-950 via-slate-900 to-black",
    videoThumb: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    estimatedViews: "2.9M avg views",
    rpm: "$5.10 RPM",
  },
  {
    id: "wealth-secrets",
    name: "Wealth Secrets",
    emoji: "💰",
    hook: "Why billionaires never buy luxury cars under their own name. The tax loophole explained...",
    captionExcerpt: "Section 179 allows 100% first-year deduction on vehicles over 6,000 lbs.",
    tagline: "Highest affiliate & sponsorship RPM",
    bgGradient: "from-indigo-950 via-slate-900 to-black",
    videoThumb: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
    estimatedViews: "1.5M avg views",
    rpm: "$9.40 RPM",
  },
];

const VOICES = [
  { id: "marcus", name: "Marcus (Cinematic Baritone)", lang: "US English", style: "Documentary / Deep" },
  { id: "sophia", name: "Sophia (British Storyteller)", lang: "UK English", style: "Mystery & Lore" },
  { id: "alex", name: "Alex (High-Retention Viral)", lang: "US English", style: "Fast & Punchy" },
  { id: "elena", name: "Elena (Calm Philosophical)", lang: "Neutral", style: "Stoic & Mindset" },
];

const CAPTION_STYLES = [
  { id: "hormozi", name: "Hormozi Glow", previewColor: "text-amber-400 font-black", badge: "Most Viral" },
  { id: "mrbeast", name: "Beast Pop Green", previewColor: "text-emerald-400 font-extrabold", badge: "High CTR" },
  { id: "cyberpunk", name: "Cyber Neon Cyan", previewColor: "text-cyan-400 font-bold", badge: "Tech & Sci-Fi" },
  { id: "classic", name: "Clean Minimalist", previewColor: "text-white font-semibold", badge: "Luxury" },
];

export function LiveGeneratorDemo() {
  const [selectedNiche, setSelectedNiche] = useState<NicheOption>(NICHES[0]);
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState(CAPTION_STYLES[0].id);
  const [channels, setChannels] = useState({
    youtube: true,
    instagram: true,
    tiktok: true,
    email: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scheduledSuccess, setScheduledSuccess] = useState(true);

  // Dynamic simulated word-by-word animation for caption
  const words = selectedNiche.captionExcerpt.split(" ");

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 450);
    return () => clearInterval(interval);
  }, [isPlaying, words.length]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep(1);
    setScheduledSuccess(false);

    setTimeout(() => setGenerationStep(2), 700);
    setTimeout(() => setGenerationStep(3), 1500);
    setTimeout(() => setGenerationStep(4), 2200);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStep(0);
      setScheduledSuccess(true);
      setIsPlaying(true);
    }, 2800);
  };

  const toggleChannel = (key: keyof typeof channels) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section id="live-demo" className="relative py-20 lg:py-28 overflow-hidden bg-[#090a0f]">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[350px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Interactive Live Studio
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Test the <span className="gradient-text-purple">AI Generator & Scheduler</span> Right Now
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Select your niche, choose an AI voiceover, select your 4 target channels, and preview how FacelessReels builds and queues 30 days of viral content in seconds.
          </p>
        </div>

        {/* Interactive Studio Sandbox Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls Panel (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Select Niche */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 text-xs font-bold border border-purple-500/40">
                    1
                  </span>
                  <h3 className="text-base font-semibold text-white">Choose Your High-RPM Niche</h3>
                </div>
                <span className="text-xs text-purple-400 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> 50+ templates inside
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {NICHES.map((niche) => {
                  const isSelected = selectedNiche.id === niche.id;
                  return (
                    <button
                      key={niche.id}
                      onClick={() => setSelectedNiche(niche)}
                      className={`text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-purple-600/20 border-purple-500 text-white shadow-md shadow-purple-600/20"
                          : "bg-white/[0.03] border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <span className="text-lg">{niche.emoji}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-purple-400" />}
                      </div>
                      <div className="text-xs font-semibold text-white truncate">{niche.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{niche.rpm}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Niche Hook Preview */}
              <div className="mt-4 p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
                <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">Viral Hook Formula: </span>
                  <span className="text-slate-200 italic font-mono">&ldquo;{selectedNiche.hook}&rdquo;</span>
                </div>
              </div>
            </div>

            {/* Step 2: Voice & Caption Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Voice selector */}
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-600/30 text-purple-300 text-xs font-bold border border-purple-500/40">
                    2
                  </span>
                  <h4 className="text-sm font-semibold text-white">Neural Voice Style</h4>
                </div>
                <div className="space-y-2">
                  {VOICES.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        selectedVoice === voice.id
                          ? "bg-indigo-600/25 border-indigo-500 text-white font-medium shadow-sm"
                          : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Volume2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{voice.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{voice.style}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption Style */}
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-600/30 text-purple-300 text-xs font-bold border border-purple-500/40">
                    3
                  </span>
                  <h4 className="text-sm font-semibold text-white">Viral Caption Style</h4>
                </div>
                <div className="space-y-2">
                  {CAPTION_STYLES.map((cap) => (
                    <button
                      key={cap.id}
                      onClick={() => setSelectedCaptionStyle(cap.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        selectedCaptionStyle === cap.id
                          ? "bg-cyan-600/25 border-cyan-500 text-white font-medium shadow-sm"
                          : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className={cap.previewColor}>{cap.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                        {cap.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Target Channels & Auto-Schedule Toggle */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 text-xs font-bold border border-purple-500/40">
                    4
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-white">Multi-Channel Autopilot Dispatch</h3>
                    <p className="text-xs text-slate-400">Post simultaneously or staggered across your 4 pipelines</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" /> Auto-Sync Active
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* YouTube */}
                <button
                  onClick={() => toggleChannel("youtube")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                    channels.youtube
                      ? "bg-red-500/15 border-red-500/50 text-white"
                      : "bg-white/[0.02] border-white/5 text-slate-500 opacity-60"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center text-red-400">
                    <YoutubeIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">YT Shorts</span>
                  <span className="text-[10px] text-slate-400">1080x1920 60fps</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={() => toggleChannel("instagram")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                    channels.instagram
                      ? "bg-pink-500/15 border-pink-500/50 text-white"
                      : "bg-white/[0.02] border-white/5 text-slate-500 opacity-60"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-pink-600/20 flex items-center justify-center text-pink-400">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">IG Reels</span>
                  <span className="text-[10px] text-slate-400">Audio Tagged</span>
                </button>

                {/* TikTok */}
                <button
                  onClick={() => toggleChannel("tiktok")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                    channels.tiktok
                      ? "bg-cyan-500/15 border-cyan-500/50 text-white"
                      : "bg-white/[0.02] border-white/5 text-slate-500 opacity-60"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-600/20 flex items-center justify-center text-cyan-400">
                    <TikTokIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">TikTok</span>
                  <span className="text-[10px] text-slate-400">Auto Captions</span>
                </button>

                {/* Email Newsletter */}
                <button
                  onClick={() => toggleChannel("email")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                    channels.email
                      ? "bg-purple-500/15 border-purple-500/50 text-white"
                      : "bg-white/[0.02] border-white/5 text-slate-500 opacity-60"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">Email Digest</span>
                  <span className="text-[10px] text-slate-400">GIF Preview</span>
                </button>
              </div>

              {/* Generate CTA Button */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="flex -space-x-1.5">
                    <span className="inline-block w-6 h-6 rounded-full bg-purple-600 border border-slate-900 text-[10px] text-center leading-5 font-bold">1</span>
                    <span className="inline-block w-6 h-6 rounded-full bg-indigo-600 border border-slate-900 text-[10px] text-center leading-5 font-bold">2</span>
                    <span className="inline-block w-6 h-6 rounded-full bg-cyan-600 border border-slate-900 text-[10px] text-center leading-5 font-bold">3</span>
                  </div>
                  <span>Ready to compile 30 daily reels</span>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                      <span>
                        {generationStep === 1 && "Writing Viral Script Hook..."}
                        {generationStep === 2 && "Synthesizing Neural Voice..."}
                        {generationStep === 3 && "Applying Hormozi Captions & 4K B-Roll..."}
                        {generationStep === 4 && "Syncing Multi-Platform Scheduler..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-cyan-300" />
                      <span>Generate & Auto-Schedule Reel</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Live Reel Phone Mockup & Schedule Status (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Phone Screen Mockup */}
            <div className="w-full max-w-[340px] rounded-[36px] p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-2xl shadow-purple-900/40 border border-white/20 relative">
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800" />
              </div>

              {/* Reel Screen */}
              <div className="relative w-full aspect-[9/16] rounded-[28px] overflow-hidden bg-black flex flex-col justify-between p-4">
                {/* Background Image / Generative Video Simulation */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 brightness-75 scale-105"
                  style={{ backgroundImage: `url(${selectedNiche.videoThumb})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

                {/* Top Overlay Badges */}
                <div className="relative z-20 flex items-center justify-between pt-5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] text-white">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>AI Reel Preview</span>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/40 text-[10px] text-purple-200">
                    <Sparkles className="w-3 h-3 text-cyan-300" />
                    <span>60 FPS HD</span>
                  </div>
                </div>

                {/* Center Dynamic Word-by-Word Viral Captions */}
                <div className="relative z-20 my-auto text-center px-2">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-cyan-300 drop-shadow mb-1">
                    {selectedNiche.name} • #{selectedNiche.id}
                  </div>

                  {/* Word by word highlighted caption */}
                  <div className="text-lg sm:text-xl font-extrabold uppercase leading-snug drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] transition-all">
                    {words.map((word, idx) => {
                      const isCurrent = idx === currentWordIndex;
                      return (
                        <span
                          key={idx}
                          className={`inline-block mx-1 transition-all duration-150 ${
                            isCurrent
                              ? selectedCaptionStyle === "hormozi"
                                ? "text-amber-300 scale-125 bg-black/60 px-1.5 py-0.5 rounded-md border border-amber-400/50 shadow-lg shadow-amber-500/40"
                                : selectedCaptionStyle === "mrbeast"
                                ? "text-emerald-300 scale-125 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-400"
                                : selectedCaptionStyle === "cyberpunk"
                                ? "text-cyan-300 scale-125 text-shadow-cyan"
                                : "text-white scale-110 underline decoration-purple-500 decoration-2"
                              : "text-white/80"
                          }`}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </div>

                  {/* Dynamic Sound Wave Indicator */}
                  <div className="flex items-center justify-center gap-1 mt-4">
                    <span className="w-1 bg-cyan-400 rounded-full animate-wave-1 h-3" />
                    <span className="w-1 bg-purple-400 rounded-full animate-wave-2 h-5" />
                    <span className="w-1 bg-indigo-400 rounded-full animate-wave-3 h-6" />
                    <span className="w-1 bg-pink-400 rounded-full animate-wave-4 h-4" />
                    <span className="w-1 bg-cyan-300 rounded-full animate-wave-5 h-2" />
                    <span className="text-[10px] text-slate-300 font-mono ml-2">
                      Voice: {VOICES.find((v) => v.id === selectedVoice)?.name.split(" ")[0]}
                    </span>
                  </div>
                </div>

                {/* Bottom Video Meta & Engagement Mockup */}
                <div className="relative z-20 space-y-2">
                  {/* Creator handle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 p-[1px]">
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                          FR
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          @faceless_empire <CheckCircle className="w-3 h-3 text-cyan-400" />
                        </div>
                        <div className="text-[10px] text-slate-300">Auto-created with FacelessReels.ai</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      aria-label="Toggle Play"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                  </div>

                  {/* Multi-Channel Distribution Badges */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="text-slate-400">Target Channels:</span>
                    <div className="flex items-center gap-1.5">
                      {channels.youtube && <YoutubeIcon className="w-3.5 h-3.5 text-red-400" />}
                      {channels.instagram && <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />}
                      {channels.tiktok && <TikTokIcon className="w-3.5 h-3.5 text-cyan-400" />}
                      {channels.email && <Mail className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-Scheduler Live Queue Card */}
            {scheduledSuccess && (
              <div className="w-full max-w-[340px] mt-4 p-4 rounded-2xl glass-card border border-emerald-500/30 bg-emerald-950/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Auto-Scheduler Queued
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Slot #1 Today</span>
                </div>
                <div className="text-xs text-slate-300 font-medium truncate mb-2">
                  &ldquo;{selectedNiche.name}: {selectedNiche.hook.slice(0, 35)}...&rdquo;
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> Today @ 6:30 PM (Peak Reach)
                  </span>
                  <span className="text-emerald-400 font-semibold">{selectedNiche.estimatedViews}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
