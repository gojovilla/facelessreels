"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Stepper } from "@/components/dashboard/create/stepper";
import { NicheStep, NicheData } from "@/components/dashboard/create/niche-step";
import { VoiceStep, VoiceStepData } from "@/components/dashboard/create/voice-step";
import { MusicStep, MusicStepData } from "@/components/dashboard/create/music-step";
import { StyleStep, StyleStepData } from "@/components/dashboard/create/style-step";
import { CaptionStep, CaptionStepData } from "@/components/dashboard/create/caption-step";
import { ScheduleStep, ScheduleStepData } from "@/components/dashboard/create/schedule-step";
import { createSeries } from "@/app/actions/series";

export default function CreateSeriesRoute() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    niche?: NicheData;
    voiceData?: VoiceStepData;
    musicData?: MusicStepData;
    styleData?: StyleStepData;
    captionData?: CaptionStepData;
    scheduleData?: ScheduleStepData;
  }>({});

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
      const res = await createSeries({
        title: scheduleData.seriesName,
        niche: formData.niche?.nicheTitle || "Viral Niche",
        voice: formData.voiceData?.voice.displayName || "Deepgram Neural",
        language: formData.voiceData?.language.language || "English",
        bg_music:
          formData.musicData?.selectedTracks.map((t) => t.title).join(", ") ||
          "Shadows & Deep Tension",
        visual_style: formData.styleData?.selectedStyle.name || "Cinematic Realism",
        caption_style:
          formData.captionData?.selectedCaptionStyle.name || "Hormozi Viral Pop",
        duration_option: scheduleData.durationOption,
        publish_time: scheduleData.publishTime,
        channels: scheduleData.platforms,
      });

      if (res.success) {
        setSuccessMessage(
          `Series "${scheduleData.seriesName}" has been successfully scheduled and armed on autopilot!`
        );
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        alert(res.error || "Failed to schedule series. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting series:", err);
      setIsSubmitting(false);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Navigation & Breadcrumb Summaries */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

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

      {/* 6 Segmented Stepper Bar */}
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
          />
        )}
      </div>
    </div>
  );
}
