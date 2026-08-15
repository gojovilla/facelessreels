import React from "react";
import {
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";

interface SceneImageProps {
  src: string;
  animationType: "zoomIn" | "zoomOut" | "slideUp" | "slideDown" | "panRight";
  durationInFrames: number;
}

export const SceneImage: React.FC<SceneImageProps> = ({
  src,
  animationType,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth Fade In (First 12 frames) and subtle Fade Out (Last 8 frames)
  const fadeIn = interpolate(frame, [0, Math.min(15, durationInFrames * 0.2)], [0, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [Math.max(0, durationInFrames - 10), durationInFrames],
    [1, 0.85],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = fadeIn * fadeOut;

  // Animation Transforms
  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  switch (animationType) {
    case "zoomIn":
      // Smooth continuous Ken-Burns zoom in from 1.0 to 1.18
      scale = interpolate(frame, [0, durationInFrames], [1.0, 1.18], {
        extrapolateRight: "clamp",
      });
      break;

    case "zoomOut":
      // Smooth continuous Ken-Burns zoom out from 1.20 to 1.04
      scale = interpolate(frame, [0, durationInFrames], [1.2, 1.04], {
        extrapolateRight: "clamp",
      });
      break;

    case "slideUp":
      // Subtle slide up + scale
      scale = interpolate(frame, [0, durationInFrames], [1.08, 1.15], {
        extrapolateRight: "clamp",
      });
      translateY = interpolate(frame, [0, durationInFrames], [40, -40], {
        extrapolateRight: "clamp",
      });
      break;

    case "slideDown":
      // Subtle slide down + scale
      scale = interpolate(frame, [0, durationInFrames], [1.14, 1.06], {
        extrapolateRight: "clamp",
      });
      translateY = interpolate(frame, [0, durationInFrames], [-40, 40], {
        extrapolateRight: "clamp",
      });
      break;

    case "panRight":
    default:
      // Subtle horizontal pan + scale
      scale = interpolate(frame, [0, durationInFrames], [1.06, 1.16], {
        extrapolateRight: "clamp",
      });
      translateX = interpolate(frame, [0, durationInFrames], [-30, 30], {
        extrapolateRight: "clamp",
      });
      break;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#000",
        opacity,
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: "center center",
          filter: "contrast(1.06) saturate(1.1)",
        }}
      />

      {/* Cinematic Vignette Overlay to enhance contrast for subtitles and depth */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top and Bottom Subtitle Backing Gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "40%",
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
