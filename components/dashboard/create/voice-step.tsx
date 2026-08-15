"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  Play,
  Pause,
  Check,
  Globe,
  ArrowRight,
  ArrowLeft,
  User,
  AudioWaveform,
} from "lucide-react";
import {
  Language,
  ALL_VOICES,
  LanguageOption,
  VoiceOption,
  DeepgramEnglishVoices,
} from "./constants";

export interface VoiceStepData {
  language: LanguageOption;
  voice: VoiceOption;
}

interface VoiceStepProps {
  initialData?: Partial<VoiceStepData>;
  onBack: () => void;
  onNext: (data: VoiceStepData) => void;
}

export function VoiceStep({ initialData, onBack, onNext }: VoiceStepProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(
    initialData?.language || Language[0]
  );
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(
    initialData?.voice || DeepgramEnglishVoices[0]
  );
  const [playingVoiceModel, setPlayingVoiceModel] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // STRICT language filtering: only show voices matching the exact selected language code
  const availableVoices = ALL_VOICES.filter(
    (voice) => voice.langCode === selectedLanguage.modelLangCode
  );

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingVoiceModel(null);
  };

  // When language changes, auto-select the first available voice for that language
  const handleLanguageChange = (lang: LanguageOption) => {
    setSelectedLanguage(lang);
    stopAudio();

    const matchingVoices = ALL_VOICES.filter(
      (v) => v.langCode === lang.modelLangCode
    );

    if (matchingVoices.length > 0) {
      setSelectedVoice(matchingVoices[0]);
    }
  };

  const handlePlayPreview = (voice: VoiceOption, e: React.MouseEvent) => {
    e.stopPropagation();

    // If already playing this voice, pause/stop it
    if (playingVoiceModel === voice.modelName) {
      stopAudio();
      return;
    }

    stopAudio();
    setPlayingVoiceModel(voice.modelName);

    try {
      const audioUrl = `/audio/${voice.preview}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.play().catch(() => {
        // Fallback: Web Speech API with gender-specific pitch and voice selection
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const textToSpeak =
            voice.sampleText ||
            `Hello, I am ${voice.displayName}. This is a preview of my AI voice.`;

          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          
          // Male vs Female pitch tuning
          const isMale = voice.gender === "male";
          utterance.pitch = isMale ? 0.72 : 1.25;
          utterance.rate = 0.95;

          // Select matching browser voice by language and gender
          const browserVoices = window.speechSynthesis.getVoices();
          const langMatch = browserVoices.filter((v) =>
            v.lang.toLowerCase().startsWith(voice.langCode.split("-")[0].toLowerCase())
          );

          if (langMatch.length > 0) {
            // Find gender match if available
            const genderMatch = langMatch.find((v) =>
              isMale
                ? v.name.toLowerCase().includes("male") ||
                  v.name.toLowerCase().includes("david") ||
                  v.name.toLowerCase().includes("ravi") ||
                  v.name.toLowerCase().includes("mark") ||
                  v.name.toLowerCase().includes("george")
                : v.name.toLowerCase().includes("female") ||
                  v.name.toLowerCase().includes("zira") ||
                  v.name.toLowerCase().includes("heera") ||
                  v.name.toLowerCase().includes("priya") ||
                  v.name.toLowerCase().includes("victoria") ||
                  v.name.toLowerCase().includes("samantha")
            );
            utterance.voice = genderMatch || langMatch[0];
          }

          utterance.onend = () => setPlayingVoiceModel(null);
          utterance.onerror = () => setPlayingVoiceModel(null);

          window.speechSynthesis.speak(utterance);
        } else {
          setTimeout(() => setPlayingVoiceModel(null), 3500);
        }
      });

      audio.onended = () => {
        setPlayingVoiceModel(null);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setPlayingVoiceModel(null);
        audioRef.current = null;
      };
    } catch {
      setPlayingVoiceModel(null);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const handleContinue = () => {
    stopAudio();
    onNext({
      language: selectedLanguage,
      voice: selectedVoice,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Language Selection Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 dark:text-white tracking-wide flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Select Video Language</span>
          </label>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Powered by Deepgram & FonadaLab
          </span>
        </div>

        {/* Clean Language Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {Language.map((lang) => {
            const isSelected = selectedLanguage.modelLangCode === lang.modelLangCode;

            return (
              <button
                key={lang.modelLangCode}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-1.5 cursor-pointer shadow-sm ${
                  isSelected
                    ? "bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-600 dark:border-purple-500 shadow-md"
                    : "bg-white dark:bg-[#0d0f1a]/80 border border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{lang.countryFlag}</span>
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold ${
                      lang.modelName === "deepgram"
                        ? "bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300"
                        : "bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300"
                    }`}
                  >
                    {lang.modelName}
                  </span>
                </div>

                <div>
                  <div
                    className={`text-xs font-bold transition-colors ${
                      isSelected ? "text-purple-900 dark:text-white" : "text-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {lang.language}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {lang.modelLangCode}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Neural Voice List Container */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 dark:text-white tracking-wide flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>
              Available {selectedLanguage.language} Neural Voices ({availableVoices.length})
            </span>
          </label>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Click card to select • Press play to audition voice
          </span>
        </div>

        {/* List Container with Fixed Height & Smooth Scroll */}
        <div className="max-h-[380px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableVoices.map((voice) => {
              const isSelected = selectedVoice.modelName === voice.modelName;
              const isPlaying = playingVoiceModel === voice.modelName;

              return (
                <div
                  key={voice.modelName}
                  onClick={() => setSelectedVoice(voice)}
                  className={`p-4 rounded-2xl transition-all cursor-pointer flex flex-col justify-between space-y-3 bg-white dark:bg-[#0d0f1a]/80 shadow-sm ${
                    isSelected
                      ? "border-2 border-purple-600 dark:border-purple-500 shadow-md bg-purple-50/60 dark:bg-purple-950/20"
                      : "border border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  }`}
                >
                  {/* Top Row: Avatar/Gender Icon + Model Details + Checkmark */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar Icon Box */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          voice.gender === "male"
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                            : "bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400"
                        }`}
                      >
                        <User className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-xs sm:text-sm font-bold transition-colors ${
                              isSelected ? "text-purple-900 dark:text-white" : "text-slate-900 dark:text-slate-200"
                            }`}
                          >
                            {voice.displayName}
                          </h4>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold capitalize ${
                              voice.gender === "male"
                                ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                : "bg-pink-500/10 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300"
                            }`}
                          >
                            {voice.gender}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="font-mono text-purple-700 dark:text-purple-300 font-semibold">
                            {voice.modelName}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{voice.model}</span>
                        </div>
                      </div>
                    </div>

                    {/* Radio Checkmark */}
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

                  {/* Sample Voice Quote */}
                  {voice.sampleText && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 italic line-clamp-2 leading-relaxed bg-slate-100 dark:bg-black/30 p-2.5 rounded-xl border border-slate-200 dark:border-white/5">
                      &ldquo;{voice.sampleText}&rdquo;
                    </p>
                  )}

                  {/* Bottom Row: Preview Button & Active Sound Wave Indicator */}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => handlePlayPreview(voice, e)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isPlaying
                          ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                          : "bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-white" />
                          <span>Pause Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-purple-600 dark:fill-purple-400 text-purple-600 dark:text-purple-400" />
                          <span>Play Audio Preview</span>
                        </>
                      )}
                    </button>

                    {isPlaying && (
                      <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 animate-pulse text-xs font-mono">
                        <AudioWaveform className="w-4 h-4 animate-bounce" />
                        <span className="text-[10px]">
                          Playing {voice.gender.toUpperCase()} Audio...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            stopAudio();
            onBack();
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Niche</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 text-right">
            Selected:{" "}
            <strong className="text-purple-700 dark:text-purple-300">
              {selectedVoice.displayName} ({selectedLanguage.language})
            </strong>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Continue to Music</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
