export interface SubtitleWord {
  word: string;
  punctuatedWord: string;
  start: number; // in seconds
  end: number;   // in seconds
  confidence: number;
}

export interface SubtitleBatch {
  index: number;
  text: string;
  start: number; // in seconds
  end: number;   // in seconds
  words: SubtitleWord[];
}

export interface VideoScene {
  sceneNumber: number;
  imageUrl: string;
  durationEstimateSeconds?: number;
  narration?: string;
  imagePrompt?: string;
}

export interface MainVideoReelProps {
  title: string;
  scenes: VideoScene[];
  imageUrls: string[];
  audioUrl: string;
  bgMusicUrl?: string;
  bgMusicVolume?: number;
  subtitles: SubtitleBatch[];
  captionStyleId?: string;
  captionStyleName?: string;
  durationInSeconds: number;
  fps?: number;
}
