export interface CaptionStyleConfig {
  id: string;
  name: string;
  creatorTag: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  textTransform: "uppercase" | "none" | "capitalize";
  activeColor: string;
  inactiveColor: string;
  stroke: string;
  shadow: string;
  backgroundPill?: string;
  activeBackgroundPill?: string;
  animationType: "pop-scale" | "gradient-pulse" | "minimal-fade" | "neon-glitch" | "box-highlight" | "comic-bounce";
  description: string;
  wordsPerBatch: 1 | 2 | 3;
}

export const CAPTION_STYLES: CaptionStyleConfig[] = [
  {
    id: "hormozi-yellow",
    name: "Hormozi Viral Pop",
    creatorTag: "Alex Hormozi Style",
    fontFamily: "'Impact', 'Montserrat', sans-serif",
    fontSize: "text-lg sm:text-xl font-black",
    fontWeight: "900",
    textTransform: "uppercase",
    activeColor: "#FFE600", // Vibrant Yellow
    inactiveColor: "#FFFFFF",
    stroke: "2px #000000",
    shadow: "3px 3px 0px #000000",
    animationType: "pop-scale",
    description: "High-energy word-by-word bouncing pop with bright yellow focus and thick black comic outline.",
    wordsPerBatch: 1,
  },
  {
    id: "beast-gradient",
    name: "MrBeast Gradient Pulse",
    creatorTag: "MrBeast & Retention Style",
    fontFamily: "'Montserrat', 'Inter', sans-serif",
    fontSize: "text-lg sm:text-xl font-black",
    fontWeight: "900",
    textTransform: "uppercase",
    activeColor: "#00F0FF", // Electric Cyan
    inactiveColor: "#FFFFFF",
    stroke: "2px #000000",
    shadow: "0 0 20px rgba(0, 240, 255, 0.6), 2px 2px 0px #000",
    activeBackgroundPill: "bg-gradient-to-r from-cyan-500/20 to-purple-500/20",
    animationType: "gradient-pulse",
    description: "Electric cyan and magenta glowing highlights with instant visual impact for high retention.",
    wordsPerBatch: 2,
  },
  {
    id: "minimal-clean",
    name: "Minimalist Clean Pill",
    creatorTag: "Modern Aesthetic Style",
    fontFamily: "'Inter', sans-serif",
    fontSize: "text-sm sm:text-base font-bold",
    fontWeight: "700",
    textTransform: "none",
    activeColor: "#FFFFFF",
    inactiveColor: "#94A3B8",
    stroke: "none",
    shadow: "0 2px 10px rgba(0,0,0,0.5)",
    backgroundPill: "bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10",
    animationType: "minimal-fade",
    description: "Sleek translucent glass pill with smooth opacity transitions. Perfect for Stoic and Tech reels.",
    wordsPerBatch: 3,
  },
  {
    id: "cyber-neon",
    name: "Cyberpunk Neon Glow",
    creatorTag: "Sci-Fi & Tech Style",
    fontFamily: "'Courier New', 'JetBrains Mono', monospace",
    fontSize: "text-sm sm:text-base font-extrabold",
    fontWeight: "800",
    textTransform: "uppercase",
    activeColor: "#39FF14", // Neon Green
    inactiveColor: "#00F0FF", // Neon Cyan
    stroke: "1px #000000",
    shadow: "0 0 15px #39FF14, 0 0 30px rgba(57, 255, 20, 0.4)",
    backgroundPill: "bg-black/80 px-2.5 py-1 rounded-lg border border-cyan-500/40",
    animationType: "neon-glitch",
    description: "Terminal code look with intense green and cyan neon aura. Ideal for AI, Tech and Sci-Fi.",
    wordsPerBatch: 2,
  },
  {
    id: "cinematic-red-box",
    name: "Cinematic Red Box",
    creatorTag: "Documentary & Crime Style",
    fontFamily: "'Arial Black', 'Montserrat', sans-serif",
    fontSize: "text-base sm:text-lg font-black",
    fontWeight: "900",
    textTransform: "uppercase",
    activeColor: "#FFFFFF",
    inactiveColor: "#E2E8F0",
    stroke: "1px #000000",
    shadow: "2px 2px 0px #000000",
    activeBackgroundPill: "bg-red-600 px-2 py-0.5 rounded shadow-md shadow-red-600/50 -rotate-1",
    animationType: "box-highlight",
    description: "Dramatic crimson badge highlight for breaking mysteries, true crime cases, and urgent hooks.",
    wordsPerBatch: 1,
  },
  {
    id: "comic-bounce",
    name: "Comic Bubble Spring",
    creatorTag: "Entertainment & Fun Style",
    fontFamily: "'Trebuchet MS', 'Comic Sans MS', sans-serif",
    fontSize: "text-base sm:text-lg font-black",
    fontWeight: "900",
    textTransform: "none",
    activeColor: "#FF007F", // Neon Pink
    inactiveColor: "#FFFFFF",
    stroke: "2px #000000",
    shadow: "3px 3px 0px #000000",
    activeBackgroundPill: "bg-yellow-300 text-black px-2 py-0.5 rounded-lg shadow rotate-2",
    animationType: "comic-bounce",
    description: "Playful bouncy spring animation with candy contrast colors for humor, fitness, and life hacks.",
    wordsPerBatch: 2,
  },
];
