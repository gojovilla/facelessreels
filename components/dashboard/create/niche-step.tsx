"use client";

import React, { useState } from "react";
import {
  Skull,
  Zap,
  Lightbulb,
  Heart,
  Cpu,
  DollarSign,
  Brain,
  Compass,
  Rocket,
  Check,
  ArrowRight,
  PenTool,
  Sparkles,
} from "lucide-react";

export interface NicheData {
  nicheType: "available" | "custom";
  nicheId: string;
  nicheTitle: string;
  nicheDescription: string;
  customTopic?: string;
  customPrompt?: string;
}

interface NicheStepProps {
  initialData?: Partial<NicheData>;
  onNext: (data: NicheData) => void;
}

export const NICHE_TOPICS = [
  {
    id: "scary-stories",
    title: "Scary Stories",
    description: "Chilling tales and urban legends.",
    icon: Skull,
    iconColor: "text-red-400 bg-red-500/10",
  },
  {
    id: "motivational",
    title: "Motivational",
    description: "Boost productivity and mindset.",
    icon: Zap,
    iconColor: "text-amber-400 bg-amber-500/10",
  },
  {
    id: "interesting-facts",
    title: "Interesting Facts",
    description: "Mind-blowing trivia tidbits.",
    icon: Lightbulb,
    iconColor: "text-blue-400 bg-blue-500/10",
  },
  {
    id: "health-fitness",
    title: "Health & Fitness",
    description: "Quick tips for better lifestyle.",
    icon: Heart,
    iconColor: "text-emerald-400 bg-emerald-500/10",
  },
  {
    id: "tech-news",
    title: "Tech News",
    description: "Latest updates from tech world.",
    icon: Cpu,
    iconColor: "text-purple-400 bg-purple-500/10",
  },
  {
    id: "finance-tips",
    title: "Finance Tips",
    description: "Smart money management advice.",
    icon: DollarSign,
    iconColor: "text-emerald-400 bg-emerald-500/10",
  },
  {
    id: "dark-psychology",
    title: "Dark Psychology",
    description: "Human behavior and mind tricks.",
    icon: Brain,
    iconColor: "text-pink-400 bg-pink-500/10",
  },
  {
    id: "stoic-wisdom",
    title: "Stoic Wisdom",
    description: "Ancient philosophy for modern life.",
    icon: Compass,
    iconColor: "text-cyan-400 bg-cyan-500/10",
  },
  {
    id: "space-mysteries",
    title: "Space Mysteries",
    description: "Cosmic anomalies and universe secrets.",
    icon: Rocket,
    iconColor: "text-indigo-400 bg-indigo-500/10",
  },
];

export function NicheStep({ initialData, onNext }: NicheStepProps) {
  const [nicheType, setNicheType] = useState<"available" | "custom">(
    initialData?.nicheType || "available"
  );
  const [selectedNicheId, setSelectedNicheId] = useState<string>(
    initialData?.nicheId || "motivational"
  );

  // Custom Niche Form Inputs
  const [customTitle, setCustomTitle] = useState(
    initialData?.customTopic || ""
  );
  const [customPrompt, setCustomPrompt] = useState(
    initialData?.customPrompt || ""
  );

  const handleContinue = () => {
    if (nicheType === "available") {
      const nicheObj = NICHE_TOPICS.find((n) => n.id === selectedNicheId);
      if (!nicheObj) return;
      onNext({
        nicheType: "available",
        nicheId: nicheObj.id,
        nicheTitle: nicheObj.title,
        nicheDescription: nicheObj.description,
      });
    } else {
      if (!customTitle.trim()) return;
      onNext({
        nicheType: "custom",
        nicheId: "custom",
        nicheTitle: customTitle.trim(),
        nicheDescription:
          customPrompt.trim() || "Custom user-defined topic concept.",
        customTopic: customTitle.trim(),
        customPrompt: customPrompt.trim(),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Soft Tabs Switcher (as in screenshot) */}
      <div className="flex items-center p-1 bg-white/[0.04] border border-white/10 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setNicheType("available")}
          className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
            nicheType === "available"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Available Niche
        </button>

        <button
          type="button"
          onClick={() => setNicheType("custom")}
          className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
            nicheType === "custom"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Custom Niche
        </button>
      </div>

      {/* TAB 1: Available Niche Cards Grid (Clean & Soft Minimalist Design) */}
      {nicheType === "available" && (
        <div className="max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NICHE_TOPICS.map((topic) => {
              const isSelected = selectedNicheId === topic.id;
              const IconComponent = topic.icon;

              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedNicheId(topic.id)}
                  className={`p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between min-h-[140px] space-y-3 bg-[#0d0f1a]/80 ${
                    isSelected
                      ? "border-2 border-purple-500 shadow-lg shadow-purple-950/40"
                      : "border border-white/10 hover:border-white/20 hover:bg-white/[0.03]"
                  }`}
                >
                  {/* Top Row: Left Icon Box, Right Check Badge when selected */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${topic.iconColor}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Title & 1-line Description */}
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Custom Niche Form (Soft & Clean) */}
      {nicheType === "custom" && (
        <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0f1a]/80 space-y-4 max-w-2xl">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Define Custom Niche</h3>
            <p className="text-xs text-slate-400">
              Type your custom series angle. The AI will adapt scriptwriting accordingly.
            </p>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Custom Topic Name <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. AI Robotics Breakthroughs, Luxury Supercars..."
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Story Guidelines / Context (Optional)
              </label>
              <textarea
                rows={3}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Briefly describe what kind of stories or facts to generate..."
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Continue Action Bar */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          {nicheType === "available" ? (
            <span>
              Selected:{" "}
              <strong className="text-purple-300 font-semibold">
                {NICHE_TOPICS.find((n) => n.id === selectedNicheId)?.title}
              </strong>
            </span>
          ) : (
            <span>
              Custom:{" "}
              <strong className="text-purple-300 font-semibold">
                {customTitle || "None"}
              </strong>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={nicheType === "custom" && !customTitle.trim()}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-purple-600/25 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
