"use client";

import React, { useState, useEffect } from "react";
import {
  Subtitles,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Play,
  Pause,
  Layers,
  Type,
} from "lucide-react";
import {
  CAPTION_STYLES,
  CaptionStyleConfig,
} from "./caption-styles";

export interface CaptionStepData {
  selectedCaptionStyle: CaptionStyleConfig;
  wordsPerBatch: 1 | 2 | 3;
  fontSizePreference: "normal" | "large" | "extra-large";
}

interface CaptionStepProps {
  initialData?: Partial<CaptionStepData>;
  onBack: () => void;
  onNext: (data: CaptionStepData) => void;
}

const PREVIEW_WORDS = [
  "THIS",
  "SECRET",
  "WILL",
  "CHANGE",
  "YOUR",
  "LIFE",
  "FOREVER",
];

export function CaptionStep({ initialData, onBack, onNext }: CaptionStepProps) {
  const [selectedStyleId, setSelectedStyleId] = useState<string>(
    initialData?.selectedCaptionStyle?.id || CAPTION_STYLES[0].id
  );
  const [wordsPerBatch, setWordsPerBatch] = useState<1 | 2 | 3>(
    initialData?.wordsPerBatch || 1
  );
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [isAnimationRunning, setIsAnimationRunning] = useState<boolean>(true);

  // Live animated caption ticker (cycles through PREVIEW_WORDS)
  useEffect(() => {
    if (!isAnimationRunning) return;

    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % PREVIEW_WORDS.length);
    }, 420);

    return () => clearInterval(interval);
  }, [isAnimationRunning]);

  const selectedStyle =
    CAPTION_STYLES.find((s) => s.id === selectedStyleId) || CAPTION_STYLES[0];

  const handleContinue = () => {
    onNext({
      selectedCaptionStyle: selectedStyle,
      wordsPerBatch,
      fontSizePreference: "large",
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0f1a]/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Subtitles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Animated Captions & Subtitles
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-semibold">
              Live Interactive Previews
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose an eye-catching animated subtitle theme. Captions will render word-by-word in Remotion video export.
          </p>
        </div>

        {/* Animation Play/Pause Toggle */}
        <button
          type="button"
          onClick={() => setIsAnimationRunning(!isAnimationRunning)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          {isAnimationRunning ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-purple-600 dark:fill-purple-400 text-purple-600 dark:text-purple-400" />
              <span>Pause Animation</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-purple-600 dark:fill-purple-400 text-purple-600 dark:text-purple-400" />
              <span>Resume Animation</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Responsive 6-Style Grid with Live Animated Previews */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Select 1 of 6 Caption Styles</span>
          </label>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Active word: <span className="font-mono text-purple-700 dark:text-purple-300 font-bold">{PREVIEW_WORDS[activeWordIndex]}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPTION_STYLES.map((style) => {
            const isSelected = selectedStyleId === style.id;

            return (
              <div
                key={style.id}
                onClick={() => setSelectedStyleId(style.id)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 bg-white dark:bg-[#0d0f1a]/90 shadow-sm ${
                  isSelected
                    ? "border-2 border-purple-600 dark:border-purple-500 shadow-md bg-purple-50/50 dark:bg-purple-950/20"
                    : "border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                }`}
              >
                {/* Top Card Info & Radio Check */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h4
                      className={`text-sm font-bold transition-colors ${
                        isSelected ? "text-purple-900 dark:text-white" : "text-slate-900 dark:text-slate-200"
                      }`}
                    >
                      {style.name}
                    </h4>
                    <span className="text-[10px] font-mono text-purple-700 dark:text-purple-400 font-medium">
                      {style.creatorTag}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "border-purple-600 bg-purple-600 text-white shadow-sm"
                        : "border-slate-300 dark:border-white/20 bg-transparent"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Live Animated Video Screen Mockup Container */}
                <div className="h-32 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-neutral-900 border border-slate-800 dark:border-white/10 flex items-center justify-center p-3 relative overflow-hidden shadow-inner group">
                  {/* Subtle video background grid lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />

                  {/* Animated Caption Content */}
                  <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 text-center">
                    {PREVIEW_WORDS.map((word, idx) => {
                      const isCurrentWord = idx === activeWordIndex;
                      const isPastWord = idx < activeWordIndex;

                      return (
                        <span
                          key={word}
                          style={{
                            fontFamily: style.fontFamily,
                            color: isCurrentWord
                              ? style.activeColor
                              : isPastWord
                              ? style.inactiveColor
                              : "#64748B",
                            textShadow: isCurrentWord ? style.shadow : "none",
                            transform: isCurrentWord
                              ? style.animationType === "pop-scale"
                                ? "scale(1.22) translateY(-2px)"
                                : style.animationType === "comic-bounce"
                                ? "scale(1.2) rotate(-3deg)"
                                : "scale(1.1)"
                              : "scale(1.0)",
                            transition: "all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                          }}
                          className={`inline-block font-black tracking-wide text-xs sm:text-sm uppercase ${
                            isCurrentWord && style.activeBackgroundPill
                              ? style.activeBackgroundPill
                              : ""
                          }`}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Description & Word Batch Pill */}
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {style.description}
                </p>

                {/* Bottom Tags */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 dark:text-slate-400 font-mono">
                    Animation: <strong className="text-slate-700 dark:text-slate-200 capitalize">{style.animationType.replace("-", " ")}</strong>
                  </span>

                  <span
                    className={`font-semibold ${
                      isSelected ? "text-purple-700 dark:text-purple-300" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {isSelected ? "Selected ✓" : "Click to select"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Caption Display Settings */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0f1a]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-0.5">
          <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Words Displayed per Screen</span>
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Control the caption pacing on screen for optimal viewer retention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setWordsPerBatch(num as 1 | 2 | 3)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                wordsPerBatch === num
                  ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30"
                  : "bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
              }`}
            >
              {num} {num === 1 ? "Word (Fast)" : num === 2 ? "Words (Balanced)" : "Words (Phrase)"}
            </button>
          ))}
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
          <span>Back to Visual Style</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 text-right">
            Active Theme:{" "}
            <strong className="text-purple-700 dark:text-purple-300 font-semibold">
              {selectedStyle.name}
            </strong>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Continue to Channels & Schedule</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
