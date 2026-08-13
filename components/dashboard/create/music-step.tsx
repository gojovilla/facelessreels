"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Music,
  Play,
  Pause,
  Check,
  ArrowRight,
  ArrowLeft,
  AudioWaveform,
  Sliders,
  Sparkles,
  Layers,
  Volume2,
} from "lucide-react";
import { BackgroundMusicTracks, MusicTrackOption } from "./constants";

export interface MusicStepData {
  selectedTracks: MusicTrackOption[];
  volume: number; // 0 to 100
  randomRotation: boolean;
}

interface MusicStepProps {
  initialData?: Partial<MusicStepData>;
  onBack: () => void;
  onNext: (data: MusicStepData) => void;
}

export function MusicStep({ initialData, onBack, onNext }: MusicStepProps) {
  // Multi-select state: array of selected track IDs
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>(
    initialData?.selectedTracks?.map((t) => t.id) || [
      BackgroundMusicTracks[0].id,
      BackgroundMusicTracks[1].id,
    ]
  );
  const [volume, setVolume] = useState<number>(initialData?.volume ?? 22);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingTrackId(null);
  };

  const handleToggleSelect = (trackId: string) => {
    setSelectedTrackIds((prev) => {
      if (prev.includes(trackId)) {
        // Prevent deselecting all tracks; keep at least 1 track selected
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== trackId);
      } else {
        return [...prev, trackId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTrackIds.length === BackgroundMusicTracks.length) {
      // Keep only first track
      setSelectedTrackIds([BackgroundMusicTracks[0].id]);
    } else {
      setSelectedTrackIds(BackgroundMusicTracks.map((t) => t.id));
    }
  };

  const handlePlayPreview = (track: MusicTrackOption, e: React.MouseEvent) => {
    e.stopPropagation();

    // If already playing this track, pause it
    if (playingTrackId === track.id) {
      stopAudio();
      return;
    }

    stopAudio();
    setPlayingTrackId(track.id);

    try {
      const audioUrl = `/backgroundmusic/${track.previewFile}`;
      const audio = new Audio(audioUrl);
      audio.volume = Math.max(0.1, volume / 100);
      audioRef.current = audio;

      audio.play().catch(() => {
        setPlayingTrackId(null);
      });

      audio.onended = () => {
        setPlayingTrackId(null);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setPlayingTrackId(null);
        audioRef.current = null;
      };
    } catch {
      setPlayingTrackId(null);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const handleContinue = () => {
    stopAudio();
    const selectedObjects = BackgroundMusicTracks.filter((t) =>
      selectedTrackIds.includes(t.id)
    );
    onNext({
      selectedTracks: selectedObjects,
      volume,
      randomRotation: selectedObjects.length > 1,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-white/10 bg-[#0d0f1a]/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">
              Background Music Selection
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-semibold">
              {selectedTrackIds.length} of {BackgroundMusicTracks.length} Selected
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Select one or multiple royalty-free tracks. Multiple tracks will auto-rotate across your series videos.
          </p>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {selectedTrackIds.length === BackgroundMusicTracks.length
              ? "Deselect Others"
              : "Select All Tracks"}
          </button>
        </div>
      </div>

      {/* 2. Scrollable Music Tracks List Format */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Available Audio Tracks</span>
          </label>
          <span className="text-[11px] text-slate-400">
            Click row or checkbox to multi-select • Audition before generating
          </span>
        </div>

        <div className="max-h-[400px] overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
          {BackgroundMusicTracks.map((track) => {
            const isSelected = selectedTrackIds.includes(track.id);
            const isPlaying = playingTrackId === track.id;

            return (
              <div
                key={track.id}
                onClick={() => handleToggleSelect(track.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-purple-950/25 border-purple-500 shadow-md shadow-purple-950/40"
                    : "bg-[#0d0f1a]/80 border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                }`}
              >
                {/* Left Area: Checkbox + Track Meta */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  {/* Multi-Select Checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelect(track.id);
                    }}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-600 text-white shadow-sm"
                        : "border-white/20 bg-transparent hover:border-white/40"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  {/* Meta Details */}
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-sm font-bold truncate transition-colors ${
                          isSelected ? "text-white" : "text-slate-200"
                        }`}
                      >
                        {track.title}
                      </h4>

                      <span
                        className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full border font-semibold ${track.tagColor}`}
                      >
                        {track.genre}
                      </span>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {track.bpm} BPM
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {track.description}
                    </p>

                    <div className="text-[10.5px] text-purple-300 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>Best for: {track.recommendedFor}</span>
                    </div>
                  </div>
                </div>

                {/* Right Area: Audio Preview Button & Waveform */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {isPlaying && (
                    <div className="flex items-center gap-1 text-purple-400 animate-pulse text-xs font-mono">
                      <AudioWaveform className="w-4 h-4 animate-bounce" />
                      <span className="text-[10px]">Playing...</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handlePlayPreview(track, e)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isPlaying
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                        : "bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-white" />
                        <span>Pause Preview</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                        <span>Preview Music</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Background Music Mixing Volume Slider */}
      <div className="p-4 rounded-2xl border border-white/10 bg-[#0d0f1a]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Background Music Mix Volume</span>
          </label>
          <p className="text-[11px] text-slate-400">
            Recommended: 15%–25% so speech narration stays crystal clear.
          </p>
        </div>

        <div className="flex items-center gap-3 sm:w-64">
          <input
            type="range"
            min="5"
            max="60"
            value={volume}
            onChange={(e) => {
              const val = Number(e.target.value);
              setVolume(val);
              if (audioRef.current) {
                audioRef.current.volume = val / 100;
              }
            }}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-xs font-mono font-bold text-purple-300 w-8 text-right shrink-0">
            {volume}%
          </span>
        </div>
      </div>

      {/* 4. Bottom Navigation Buttons */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            stopAudio();
            onBack();
          }}
          className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Language & Voice</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-xs text-slate-400 text-right">
            Selected:{" "}
            <strong className="text-purple-300 font-semibold">
              {selectedTrackIds.length} {selectedTrackIds.length === 1 ? "Track" : "Tracks"}
            </strong>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={selectedTrackIds.length === 0}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Continue to Visual Style</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
