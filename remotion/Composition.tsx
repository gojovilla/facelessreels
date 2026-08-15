import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  useVideoConfig,
} from "remotion";
import { MainVideoReelProps } from "./types";
import { SceneImage } from "./components/SceneImage";
import { CaptionsOverlay } from "./components/CaptionsOverlay";

const ANIMATION_CYCLE: Array<
  "zoomIn" | "zoomOut" | "slideUp" | "slideDown" | "panRight"
> = ["zoomIn", "panRight", "slideUp", "zoomOut", "slideDown"];

export const MainVideoReel: React.FC<MainVideoReelProps> = ({
  title,
  scenes = [],
  imageUrls = [],
  audioUrl,
  bgMusicUrl,
  bgMusicVolume = 0.18,
  subtitles = [],
  captionStyleId = "hormozi-yellow",
  durationInSeconds = 40,
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  // Consolidate images list
  const activeImages: string[] =
    imageUrls && imageUrls.length > 0
      ? imageUrls
      : scenes && scenes.length > 0
      ? scenes.map((s) => s.imageUrl).filter(Boolean)
      : ["/video-style/cinematic-realism.jpg"];

  const imageCount = Math.max(1, activeImages.length);

  // Divide video duration evenly across scenes
  const framesPerScene = Math.floor(durationInFrames / imageCount);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        width: 1080,
        height: 1920,
      }}
    >
      {/* 1. SCENE IMAGES PLAYING ONE BY ONE IN SEQUENCE WITH DYNAMIC ANIMATIONS */}
      {activeImages.map((imgSrc, index) => {
        const fromFrame = index * framesPerScene;
        // Last scene stretches to cover any remainder frames
        const durationFrames =
          index === activeImages.length - 1
            ? durationInFrames - fromFrame
            : framesPerScene + 10; // 10 frames overlap for smooth crossfade

        const animation =
          ANIMATION_CYCLE[index % ANIMATION_CYCLE.length];

        return (
          <Sequence
            key={index}
            from={fromFrame}
            durationInFrames={durationFrames}
          >
            <SceneImage
              src={imgSrc}
              animationType={animation}
              durationInFrames={durationFrames}
            />
          </Sequence>
        );
      })}

      {/* 2. SYNCHRONIZED WORD-LEVEL ANIMATED SUBTITLES */}
      <CaptionsOverlay
        subtitles={subtitles}
        captionStyleId={captionStyleId}
      />

      {/* 3. SYNTHESIZED NEURAL VOICEOVER AUDIO */}
      {audioUrl && (
        <Audio
          src={audioUrl}
          volume={1.0}
        />
      )}

      {/* 4. BACKGROUND MUSIC TRACK (OPTIONAL DUCKED VOLUME) */}
      {bgMusicUrl &&
        (bgMusicUrl.startsWith("http://") || bgMusicUrl.startsWith("https://")) && (
          <Audio
            src={bgMusicUrl}
            volume={bgMusicVolume}
            loop
          />
        )}
    </AbsoluteFill>
  );
};
