import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SubtitleBatch } from "../types";

interface CaptionsOverlayProps {
  subtitles: SubtitleBatch[];
  captionStyleId?: string;
}

export const CaptionsOverlay: React.FC<CaptionsOverlayProps> = ({
  subtitles,
  captionStyleId = "hormozi-yellow",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find the active subtitle batch based on voiceover timestamp
  const activeBatch = subtitles.find(
    (b) => currentTime >= b.start && currentTime <= b.end + 0.15
  );

  if (!activeBatch) {
    return null;
  }

  // Calculate local frame within this subtitle batch for spring animation
  const batchStartFrame = Math.floor(activeBatch.start * fps);
  const localBatchFrame = Math.max(0, frame - batchStartFrame);

  // Pop-in bounce spring on each batch transition
  const springScale = spring({
    frame: localBatchFrame,
    fps,
    config: {
      damping: 12,
      mass: 0.5,
      stiffness: 220,
    },
  });

  const scale = interpolate(springScale, [0, 1], [0.88, 1.05], {
    extrapolateRight: "clamp",
  });

  // Determine Caption Style Styling Tokens
  const styleId = (captionStyleId || "").toLowerCase();

  let textColor = "#FDE047"; // Default Hormozi Yellow
  let textShadow =
    "0 0 20px rgba(0,0,0,0.9), -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 6px 12px rgba(0,0,0,0.85)";
  let textTransform: React.CSSProperties["textTransform"] = "uppercase";
  let bgHighlight = "rgba(0,0,0,0.7)";
  let borderColor = "rgba(253, 224, 71, 0.4)";

  if (styleId.includes("beast") || styleId.includes("green")) {
    textColor = "#4ADE80"; // MrBeast Green
    borderColor = "rgba(74, 222, 128, 0.5)";
    textShadow =
      "0 0 25px rgba(74,222,128,0.4), -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 6px 14px rgba(0,0,0,0.9)";
  } else if (styleId.includes("neon") || styleId.includes("cyan")) {
    textColor = "#38BDF8"; // Cyber Neon Cyan
    borderColor = "rgba(56, 189, 248, 0.5)";
    textShadow =
      "0 0 30px rgba(56,189,248,0.7), -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 6px 14px rgba(0,0,0,0.9)";
  } else if (styleId.includes("minimal") || styleId.includes("white")) {
    textColor = "#FFFFFF"; // Minimal Clean White
    borderColor = "rgba(255, 255, 255, 0.2)";
    textTransform = "none";
    textShadow =
      "-2px -2px 0 rgba(0,0,0,0.8), 2px -2px 0 rgba(0,0,0,0.8), -2px 2px 0 rgba(0,0,0,0.8), 2px 2px 0 rgba(0,0,0,0.8), 0 8px 16px rgba(0,0,0,0.9)";
  } else if (styleId.includes("orange") || styleId.includes("fire")) {
    textColor = "#FB923C"; // Fiery Orange
    borderColor = "rgba(251, 146, 60, 0.5)";
    textShadow =
      "0 0 25px rgba(251,146,60,0.5), -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 6px 14px rgba(0,0,0,0.9)";
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: "22%",
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 48px",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          backgroundColor: bgHighlight,
          padding: "16px 32px",
          borderRadius: "24px",
          border: `2px solid ${borderColor}`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          textAlign: "center",
          maxWidth: "88%",
        }}
      >
        <span
          style={{
            fontFamily:
              "'Montserrat', 'Arial Black', 'Impact', 'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "58px",
            lineHeight: 1.15,
            color: textColor,
            textShadow,
            textTransform,
            letterSpacing: "0.5px",
            display: "inline-block",
          }}
        >
          {activeBatch.text}
        </span>
      </div>
    </div>
  );
};
