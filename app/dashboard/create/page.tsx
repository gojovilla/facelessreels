"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Edit,
  Sparkles,
  Loader2,
  Tv,
} from "lucide-react";
import { Stepper } from "@/components/dashboard/create/stepper";
import { NicheStep, NicheData } from "@/components/dashboard/create/niche-step";
import { VoiceStep, VoiceStepData } from "@/components/dashboard/create/voice-step";
import { MusicStep, MusicStepData } from "@/components/dashboard/create/music-step";
import { StyleStep, StyleStepData } from "@/components/dashboard/create/style-step";
import { CaptionStep, CaptionStepData } from "@/components/dashboard/create/caption-step";
import { ScheduleStep, ScheduleStepData } from "@/components/dashboard/create/schedule-step";
import {
  Language,
  BackgroundMusicTracks,
  VideoStyles,
  DeepgramEnglishVoices,
  FonadaHindiVoices,
  FonadaMarathiVoices,
  FonadaTeluguVoices,
  DeepgramSpanishVoices,
  DeepgramGermanVoices,
} from "@/components/dashboard/create/constants";
import { CAPTION_STYLES } from "@/components/dashboard/create/caption-styles";
import { getSeriesById, SeriesItem } from "@/app/actions/series";

const ALL_VOICES = [
  ...DeepgramEnglishVoices,
  ...DeepgramSpanishVoices,
  ...DeepgramGermanVoices,
  ...FonadaHindiVoices,
  ...FonadaMarathiVoices,
  ...FonadaTeluguVoices,
];

function CreateSeriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSeriesId = searchParams.get("edit") || searchParams.get("seriesId");
  const isEditing = Boolean(editSeriesId);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingSeries, setIsLoadingSeries] = useState<boolean>(Boolean(editSeriesId));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    niche?: NicheData;
    voiceData?: VoiceStepData;
    musicData?: MusicStepData;
    styleData?: StyleStepData;
    captionData?: CaptionStepData;
    scheduleData?: ScheduleStepData;
  }>({});

  // Fetch and prefill form data when editing existing series
  useEffect(() => {
    if (!editSeriesId) return;

    async function loadExistingSeries() {
      setIsLoadingSeries(true);
      try {
        const res = await getSeriesById(editSeriesId!);
        if (res.success && res.series) {
          const s = res.series;

          // 1. Reconstruct Niche
          const nicheData: NicheData = {
            nicheType: (s.niche_type as any) || "available",
            nicheId: s.niche.toLowerCase().replace(/\s+/g, "-"),
            nicheTitle: s.niche,
            nicheDescription: s.niche,
            customTopic: s.niche,
            customPrompt: s.custom_prompt || "",
          };

          // 2. Reconstruct Voice & Language
          const selectedLang =
            Language.find(
              (l) =>
                l.language.toLowerCase() === s.language?.toLowerCase() ||
                l.modelLangCode === s.language_code
            ) || Language[0];

          const selectedVoice =
            ALL_VOICES.find(
              (v) =>
                v.modelName === s.voice_id ||
                v.displayName.toLowerCase() === s.voice?.toLowerCase()
            ) || ALL_VOICES[0];

          const voiceData: VoiceStepData = {
            language: selectedLang,
            voice: selectedVoice,
          };

          // 3. Reconstruct Music
          const selectedTracks = BackgroundMusicTracks.filter((t) =>
            s.bg_music_tracks?.includes(t.id) ||
            s.bg_music?.toLowerCase().includes(t.title.toLowerCase())
          );

          const musicData: MusicStepData = {
            selectedTracks:
              selectedTracks.length > 0
                ? selectedTracks
                : [BackgroundMusicTracks[0]],
            volume: s.bg_music_volume ?? 22,
            randomRotation: true,
          };

          // 4. Reconstruct Visual Style
          const selectedStyle =
            VideoStyles.find(
              (style) =>
                style.id === s.visual_style_id ||
                style.name.toLowerCase() === s.visual_style?.toLowerCase()
            ) || VideoStyles[0];

          const styleData: StyleStepData = {
            selectedStyle,
            customModifier: s.custom_style_modifier || "",
          };

          // 5. Reconstruct Caption Style
          const selectedCaptionStyle =
            CAPTION_STYLES.find(
              (c) =>
                c.id === s.caption_style_id ||
                c.name.toLowerCase() === s.caption_style?.toLowerCase()
            ) || CAPTION_STYLES[0];

          const captionData: CaptionStepData = {
            selectedCaptionStyle,
            wordsPerBatch: (s.caption_words_per_batch as any) || 1,
            fontSizePreference: "large",
          };

          // 6. Reconstruct Schedule
          const scheduleData: ScheduleStepData = {
            seriesName: s.title,
            durationOption:
              (s.duration_option as any) || "30-50 sec video",
            platforms: s.channels || ["tiktok", "youtube", "instagram"],
            publishTime: s.publish_time || "18:30",
          };

          setFormData({
            niche: nicheData,
            voiceData,
            musicData,
            styleData,
            captionData,
            scheduleData,
          });
        }
      } catch (err) {
        console.error("Failed to load existing series:", err);
      } finally {
        setIsLoadingSeries(false);
      }
    }

    loadExistingSeries();
  }, [editSeriesId]);

  const handleNicheNext = (nicheData: NicheData) => {
    setFormData((prev) => ({ ...prev, niche: nicheData }));
    setCurrentStep(2);
  };

  const handleVoiceNext = (voiceData: VoiceStepData) => {
    setFormData((prev) => ({ ...prev, voiceData }));
    setCurrentStep(3);
  };

  const handleMusicNext = (musicData: MusicStepData) => {
    setFormData((prev) => ({ ...prev, musicData }));
    setCurrentStep(4);
  };

  const handleStyleNext = (styleData: StyleStepData) => {
    setFormData((prev) => ({ ...prev, styleData }));
    setCurrentStep(5);
  };

  const handleCaptionNext = (captionData: CaptionStepData) => {
    setFormData((prev) => ({ ...prev, captionData }));
    setCurrentStep(6);
  };

  const handleScheduleSubmit = async (scheduleData: ScheduleStepData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        id: editSeriesId || undefined,
        title: scheduleData.seriesName,
        niche: formData.niche?.nicheTitle || "Viral Niche",
        niche_type: formData.niche?.nicheType || "available",
        custom_prompt: formData.niche?.customPrompt || "",
        voice:
          formData.voiceData?.voice.displayName ||
          formData.voiceData?.voice.modelName ||
          "Deepgram Neural",
        voice_id: formData.voiceData?.voice.modelName || "aura-2-odysseus-en",
        language: formData.voiceData?.language.language || "English",
        language_code: formData.voiceData?.language.modelLangCode || "en-US",
        bg_music:
          formData.musicData?.selectedTracks.map((t) => t.title).join(", ") ||
          "Shadows & Deep Tension",
        bg_music_tracks:
          formData.musicData?.selectedTracks.map((t) => t.id) || ["dark-suspense"],
        bg_music_volume: formData.musicData?.volume ?? 22,
        visual_style:
          formData.styleData?.selectedStyle.name || "Cinematic Realism",
        visual_style_id:
          formData.styleData?.selectedStyle.id || "cinematic-realism",
        custom_style_modifier: formData.styleData?.customModifier || "",
        caption_style:
          formData.captionData?.selectedCaptionStyle.name || "Hormozi Viral Pop",
        caption_style_id:
          formData.captionData?.selectedCaptionStyle.id || "hormozi-yellow",
        caption_words_per_batch: formData.captionData?.wordsPerBatch || 1,
        duration_option: scheduleData.durationOption,
        publish_time: scheduleData.publishTime,
        channels: scheduleData.platforms,
      };

      const endpoint = "/api/series";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const res = await response.json();

      if (res.success || response.ok) {
        setSuccessMessage(
          isEditing
            ? `Series "${scheduleData.seriesName}" updated successfully! Redirecting to dashboard...`
            : `Series "${scheduleData.seriesName}" scheduled successfully! Redirecting to dashboard...`
        );
        router.refresh();
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      } else {
        alert(res.error || "Failed to save series. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting series via /api/series:", err);
      window.location.href = "/dashboard";
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  if (isLoadingSeries) {
    return (
      <div className="p-16 rounded-3xl border border-white/10 bg-[#0d0f1a]/80 text-center space-y-4 max-w-xl mx-auto my-12">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
        <h3 className="text-base font-bold text-white">Loading Series Data...</h3>
        <p className="text-xs text-slate-400">
          Fetching full stepform configuration for editing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Navigation & Breadcrumb Summaries */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          {isEditing && (
            <span className="px-3 py-1 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5">
              <Edit className="w-3.5 h-3.5" />
              <span>Editing: {formData.scheduleData?.seriesName || "Series"}</span>
            </span>
          )}
        </div>

        {/* Dynamic Summary Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {formData.niche && (
            <span className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold font-mono text-[11px]">
              Niche: {formData.niche.nicheTitle}
            </span>
          )}
          {formData.voiceData && (
            <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold font-mono text-[11px]">
              Voice: {formData.voiceData.voice.displayName} ({formData.voiceData.language.language})
            </span>
          )}
          {formData.musicData && (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold font-mono text-[11px]">
              Music: {formData.musicData.selectedTracks.length} Tracks
            </span>
          )}
          {formData.styleData && (
            <span className="px-2.5 py-1 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 font-semibold font-mono text-[11px]">
              Style: {formData.styleData.selectedStyle.name}
            </span>
          )}
          {formData.captionData && (
            <span className="px-2.5 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 font-semibold font-mono text-[11px]">
              Captions: {formData.captionData.selectedCaptionStyle.name}
            </span>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-center gap-3 animate-fade-in shadow-xl shadow-emerald-950/50">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs sm:text-sm font-semibold">{successMessage}</div>
        </div>
      )}

      {/* 6 Segmented Stepper Bar (Clickable steps for instant edit jumps) */}
      <Stepper
        currentStep={currentStep}
        totalSteps={6}
        onStepClick={handleStepClick}
      />

      {/* Step Components Container */}
      <div className="pt-2">
        {/* Step 1: Niche Selection */}
        {currentStep === 1 && (
          <NicheStep
            initialData={formData.niche}
            onNext={handleNicheNext}
          />
        )}

        {/* Step 2: Language & Voice Selection */}
        {currentStep === 2 && (
          <VoiceStep
            initialData={formData.voiceData}
            onBack={() => setCurrentStep(1)}
            onNext={handleVoiceNext}
          />
        )}

        {/* Step 3: Background Music Selection (Multi-Select) */}
        {currentStep === 3 && (
          <MusicStep
            initialData={formData.musicData}
            onBack={() => setCurrentStep(2)}
            onNext={handleMusicNext}
          />
        )}

        {/* Step 4: Video Visual Style & Art Direction (9:16 Horizontal Gallery) */}
        {currentStep === 4 && (
          <StyleStep
            initialData={formData.styleData}
            onBack={() => setCurrentStep(3)}
            onNext={handleStyleNext}
          />
        )}

        {/* Step 5: Animated Captions & Subtitles Selection */}
        {currentStep === 5 && (
          <CaptionStep
            initialData={formData.captionData}
            onBack={() => setCurrentStep(4)}
            onNext={handleCaptionNext}
          />
        )}

        {/* Step 6: Series Details, Platforms, Schedule & Launch */}
        {currentStep === 6 && (
          <ScheduleStep
            initialData={formData.scheduleData}
            seriesContext={{
              nicheTitle: formData.niche?.nicheTitle,
              voiceName: formData.voiceData?.voice.displayName,
              musicCount: formData.musicData?.selectedTracks.length,
              styleName: formData.styleData?.selectedStyle.name,
              captionStyleName: formData.captionData?.selectedCaptionStyle.name,
            }}
            onBack={() => setCurrentStep(5)}
            onSubmit={handleScheduleSubmit}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
          />
        )}
      </div>
    </div>
  );
}

export default function CreateSeriesRoute() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading creation wizard...</p>
        </div>
      }
    >
      <CreateSeriesContent />
    </Suspense>
  );
}
