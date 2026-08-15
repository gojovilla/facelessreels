import React from "react";
import { Composition } from "remotion";
import { MainVideoReel } from "./Composition";
import { MainVideoReelProps } from "./types";

export const defaultReelProps: MainVideoReelProps = {
  title: "Automated Viral Short",
  scenes: [],
  imageUrls: [
    "/video-style/cinematic-realism.jpg",
    "/video-style/cyberpunk-neon.jpg",
    "/video-style/gothic-oil.jpg",
    "/video-style/dark-anime.jpg",
  ],
  audioUrl: "/audio/aura-2-odysseus-en.mp3",
  subtitles: [
    {
      index: 0,
      text: "DID YOU KNOW",
      start: 0.1,
      end: 1.4,
      words: [],
    },
    {
      index: 1,
      text: "THIS SHOCKING TRUTH",
      start: 1.5,
      end: 3.2,
      words: [],
    },
    {
      index: 2,
      text: "ABOUT HUMAN FOCUS",
      start: 3.3,
      end: 5.0,
      words: [],
    },
  ],
  captionStyleId: "hormozi-yellow",
  captionStyleName: "Hormozi Viral Pop",
  durationInSeconds: 40,
  fps: 30,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FacelessVideoReel"
        component={MainVideoReel as any}
        durationInFrames={40 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultReelProps as any}
      />
    </>
  );
};
