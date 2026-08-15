"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Palette,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Wand2,
} from "lucide-react";
import { VideoStyles, VideoStyleOption } from "./constants";

export interface StyleStepData {
  selectedStyle: VideoStyleOption;
  customModifier?: string;
}

interface StyleStepProps {
  initialData?: Partial<StyleStepData>;
  onBack: () => void;
  onNext: (data: StyleStepData) => void;
}

export function StyleStep({ initialData, onBack, onNext }: StyleStepProps) {
  const [selectedStyleId, setSelectedStyleId] = useState<string>(
    initialData?.selectedStyle?.id || VideoStyles[0].id
  );
  const [customModifier, setCustomModifier] = useState<string>(
    initialData?.customModifier || ""
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const selectedStyle =
    VideoStyles.find((s) => s.id === selectedStyleId) || VideoStyles[0];

  const handleContinue = () => {
    onNext({
      selectedStyle,
      customModifier: customModifier.trim(),
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Scroll Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0f1a]/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Visual Art Direction & Style
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-semibold">
              9:16 Vertical Ratio
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a signature visual look for all scenes in your short video series.
          </p>
        </div>

        {/* Left / Right Carousel Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Horizontal Scroll List with 9:16 Vertical Ratio Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Available Visual Styles ({VideoStyles.length})</span>
          </label>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Scroll horizontally • Tap to select style
          </span>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x custom-scrollbar scroll-smooth"
        >
          {VideoStyles.map((style) => {
            const isSelected = selectedStyleId === style.id;

            return (
              <div
                key={style.id}
                onClick={() => setSelectedStyleId(style.id)}
                className={`w-[220px] sm:w-[235px] aspect-[9/16] shrink-0 rounded-2xl overflow-hidden relative group cursor-pointer transition-all duration-300 snap-start flex flex-col justify-between ${
                  isSelected
                    ? "ring-4 ring-purple-500/50 border-2 border-purple-500 shadow-2xl shadow-purple-950 scale-[1.02]"
                    : "border border-slate-300 dark:border-white/10 hover:border-purple-400 dark:hover:border-white/30 hover:scale-[1.01]"
                }`}
              >
                {/* Full 9:16 Image */}
                <img
                  src={style.image}
                  alt={style.name}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Top Badge & Checkmark Overlay */}
                <div className="relative z-10 p-3 flex items-start justify-between">
                  <span
                    className={`text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md ${style.tagColor}`}
                  >
                    {style.tag}
                  </span>

                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "border-purple-400 bg-purple-600 text-white shadow-md shadow-purple-600/50"
                        : "border-white/30 bg-black/40 text-transparent opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Bottom Gradient Meta Card */}
                <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/85 to-transparent space-y-1.5 pt-10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {style.name}
                    </h4>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                    {style.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px]">
                    <span className="text-purple-300 font-medium truncate max-w-[130px]">
                      {style.recommendedNiches.split(",")[0]}
                    </span>

                    <span
                      className={`font-semibold ${
                        isSelected ? "text-cyan-300" : "text-slate-400"
                      }`}
                    >
                      {isSelected ? "Selected ✓" : "Select"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Selected Style Details & Prompt Customizer */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0f1a]/80 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Selected Style: <span className="text-purple-700 dark:text-purple-300">{selectedStyle.name}</span>
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Recommended for: {selectedStyle.recommendedNiches}
          </span>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Optional Art Directives / Camera Details
          </label>
          <input
            type="text"
            value={customModifier}
            onChange={(e) => setCustomModifier(e.target.value)}
            placeholder="e.g. golden hour rim lighting, foggy atmosphere, anamorphic lens flares..."
            className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* 4. Bottom Navigation Buttons */}
      <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Background Music</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 text-right">
            Active Style:{" "}
            <strong className="text-purple-700 dark:text-purple-300 font-semibold">
              {selectedStyle.name}
            </strong>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Continue to Captions & Subtitles</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
