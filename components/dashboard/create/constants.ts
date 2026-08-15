export interface LanguageOption {
  language: string;
  countryCode: string;
  countryFlag: string;
  modelName: "deepgram" | "fonadalab" | string;
  modelLangCode: string;
}

export interface VoiceOption {
  model: "deepgram" | "fonadalab" | string;
  modelName: string;
  displayName: string;
  preview: string;
  gender: "male" | "female";
  langCode: string;
  sampleText: string;
}

export interface MusicTrackOption {
  id: string;
  title: string;
  genre: string;
  mood: string;
  bpm: number;
  duration: string;
  previewFile: string;
  tagColor: string;
  description: string;
  recommendedFor: string;
}

export interface VideoStyleOption {
  id: string;
  name: string;
  tag: string;
  image: string;
  tagColor: string;
  description: string;
  promptModifier: string;
  recommendedNiches: string;
}

export const Language: LanguageOption[] = [
  {
    language: "English",
    countryCode: "US",
    countryFlag: "🇺🇸",
    modelName: "deepgram",
    modelLangCode: "en-US",
  },
  {
    language: "Hindi",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    modelName: "fonadalab",
    modelLangCode: "hi-IN",
  },
  {
    language: "Spanish",
    countryCode: "ES",
    countryFlag: "🇪🇸",
    modelName: "deepgram",
    modelLangCode: "es-ES",
  },
  {
    language: "Tamil",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    modelName: "fonadalab",
    modelLangCode: "ta-IN",
  },
  {
    language: "Telugu",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    modelName: "fonadalab",
    modelLangCode: "te-IN",
  },
  {
    language: "German",
    countryCode: "DE",
    countryFlag: "🇩🇪",
    modelName: "deepgram",
    modelLangCode: "de-DE",
  },
];

// Deepgram English Voices (en-US)
export const DeepgramEnglishVoices: VoiceOption[] = [
  {
    model: "deepgram",
    modelName: "aura-2-odysseus-en",
    displayName: "Odysseus",
    preview: "deepgram-aura-2-odysseus-en.wav",
    gender: "male",
    langCode: "en-US",
    sampleText: "You have power over your mind, not outside events. Realize this, and you will find strength.",
  },
  {
    model: "deepgram",
    modelName: "aura-2-thalia-en",
    displayName: "Thalia",
    preview: "deepgram-aura-2-thalia-en.wav",
    gender: "female",
    langCode: "en-US",
    sampleText: "Here is a secret about human psychology that most people will never tell you.",
  },
  {
    model: "deepgram",
    modelName: "aura-2-helios-en",
    displayName: "Helios",
    preview: "deepgram-aura-2-odysseus-en.wav",
    gender: "male",
    langCode: "en-US",
    sampleText: "In the world of relentless ambition, only those with iron discipline survive.",
  },
  {
    model: "deepgram",
    modelName: "aura-2-luna-en",
    displayName: "Luna",
    preview: "deepgram-aura-2-thalia-en.wav",
    gender: "female",
    langCode: "en-US",
    sampleText: "Deep in the darkest depths of the ocean lies a mystery scientists cannot explain.",
  },
  {
    model: "deepgram",
    modelName: "aura-2-arcas-en",
    displayName: "Arcas",
    preview: "deepgram-aura-2-odysseus-en.wav",
    gender: "male",
    langCode: "en-US",
    sampleText: "Here is the exact financial blueprint billionaires use to preserve and multiply wealth.",
  },
];

// Deepgram Spanish Voices (es-ES / es-MX)
export const DeepgramSpanishVoices: VoiceOption[] = [
  {
    model: "deepgram",
    modelName: "aura-2-nestor-es",
    displayName: "Nestor",
    preview: "deepgram-aura-2-odysseus-en.wav",
    gender: "male",
    langCode: "es-ES",
    sampleText: "Descubre el poder de tu mente para dominar cualquier conversación.",
  },
  {
    model: "deepgram",
    modelName: "aura-2-diana-es",
    displayName: "Diana",
    preview: "deepgram-aura-2-thalia-en.wav",
    gender: "female",
    langCode: "es-ES",
    sampleText: "Este es el misterio psicológico que cambiará por completo cómo ves a las personas.",
  },
];

// Deepgram German Voices (de-DE)
export const DeepgramGermanVoices: VoiceOption[] = [
  {
    model: "deepgram",
    modelName: "aura-2-brigit-de",
    displayName: "Brigit",
    preview: "deepgram-aura-2-thalia-en.wav",
    gender: "female",
    langCode: "de-DE",
    sampleText: "Erkenne die Kraft deiner Gedanken und beherrsche jeden Moment deines Lebens.",
  },
];

// FonadaLab Hindi Voices (hi-IN) - Verified Active Neural Models
export const FonadaHindiVoices: VoiceOption[] = [
  {
    model: "fonadalab",
    modelName: "fonada-dhruv-hi",
    displayName: "Dhruv",
    preview: "fonada-rohit-hi.wav",
    gender: "male",
    langCode: "hi-IN",
    sampleText: "क्या आप जानते हैं कि दुनिया के सबसे अमीर लोग किस गुप्त नियम का पालन करते हैं?",
  },
  {
    model: "fonadalab",
    modelName: "fonada-vaanee-hi",
    displayName: "Vaanee",
    preview: "fonada-priya-hi.wav",
    gender: "female",
    langCode: "hi-IN",
    sampleText: "मानव मनोविज्ञान का यह रहस्य आपको हर बातचीत में सफलता दिला सकता है।",
  },
  {
    model: "fonadalab",
    modelName: "fonada-swastik-hi",
    displayName: "Swastik",
    preview: "fonada-kabir-hi.wav",
    gender: "male",
    langCode: "hi-IN",
    sampleText: "अनुशासन ही वह एकमात्र शक्ति है जो सपनों को हकीकत में बदलती है।",
  },
  {
    model: "fonadalab",
    modelName: "fonada-tara-hi",
    displayName: "Tara",
    preview: "fonada-neha-hi.wav",
    gender: "female",
    langCode: "hi-IN",
    sampleText: "इतिहास की वे रहस्यमयी कहानियां जिन्हें दुनिया से छुपाया गया था।",
  },
  {
    model: "fonadalab",
    modelName: "fonada-raag-hi",
    displayName: "Raag",
    preview: "fonada-rohit-hi.wav",
    gender: "male",
    langCode: "hi-IN",
    sampleText: "जब इरादे मजबूत हों, तो हर मुश्किल रास्ता आसान बन जाता है।",
  },
  {
    model: "fonadalab",
    modelName: "fonada-ruhi-hi",
    displayName: "Ruhi",
    preview: "fonada-priya-hi.wav",
    gender: "female",
    langCode: "hi-IN",
    sampleText: "सफलता का असली राज हर दिन की निरंतर मेहनत में छुपा है।",
  },
];

// FonadaLab Tamil Voices (ta-IN) - Verified Active Neural Models
export const FonadaTamilVoices: VoiceOption[] = [
  {
    model: "fonadalab",
    modelName: "fonada-vaani-ta",
    displayName: "Vaani",
    preview: "fonada-priya-hi.wav",
    gender: "female",
    langCode: "ta-IN",
    sampleText: "வெற்றி பெறுவதற்கு மிக முக்கியமான விஷயம் உங்கள் ஒழுக்கமும் விடாமுயற்சியும் தான்.",
  },
  {
    model: "fonadalab",
    modelName: "fonada-dhruv-ta",
    displayName: "Dhruv",
    preview: "fonada-rohit-hi.wav",
    gender: "male",
    langCode: "ta-IN",
    sampleText: "வாழ்க்கையில் பெரிய இலக்கை அடைய தினமும் கடினமாக உழைக்க வேண்டும்.",
  },
  {
    model: "fonadalab",
    modelName: "fonada-isai-ta",
    displayName: "Isai",
    preview: "fonada-priya-hi.wav",
    gender: "female",
    langCode: "ta-IN",
    sampleText: "மனித மனவியலின் இந்த ரகசியம் உங்கள் சிந்தனையை மாற்றும்.",
  },
  {
    model: "fonadalab",
    modelName: "fonada-swaram-ta",
    displayName: "Swaram",
    preview: "fonada-kabir-hi.wav",
    gender: "male",
    langCode: "ta-IN",
    sampleText: "வரலாற்றில் மறைக்கப்பட்ட பல மர்மமான உண்மை கதைகள்.",
  },
];

// FonadaLab Telugu Voices (te-IN) - Verified Active Neural Models
export const FonadaTeluguVoices: VoiceOption[] = [
  {
    model: "fonadalab",
    modelName: "fonada-dhruv-te",
    displayName: "Dhruv",
    preview: "fonada-rohit-hi.wav",
    gender: "male",
    langCode: "te-IN",
    sampleText: "విజయం సాధించడానికి క్రమశిక్షణ మరియు పట్టుదల చాలా ముఖ్యం.",
  },
  {
    model: "fonadalab",
    modelName: "fonada-aadhira-te",
    displayName: "Aadhira",
    preview: "fonada-priya-hi.wav",
    gender: "female",
    langCode: "te-IN",
    sampleText: "జీవితంలో గొప్ప లక్ష్యాలను సాధించడానికి నిరంతర శ్రమ అవసరం.",
  },
  {
    model: "fonadalab",
    modelName: "fonada-ansh-te",
    displayName: "Ansh",
    preview: "fonada-kabir-hi.wav",
    gender: "male",
    langCode: "te-IN",
    sampleText: "చరిత్రలో దాగి ఉన్న అనేక ఆసక్తికరమైన నిజాలు ఇవే.",
  },
  {
    model: "fonadalab",
    modelName: "fonada-priya-te",
    displayName: "Priya",
    preview: "fonada-priya-hi.wav",
    gender: "female",
    langCode: "te-IN",
    sampleText: "మనిషి ఆలోచన విధానాన్ని మార్చే మానసిక రహస్యాలు.",
  },
];

export const ALL_VOICES: VoiceOption[] = [
  ...DeepgramEnglishVoices,
  ...DeepgramSpanishVoices,
  ...DeepgramGermanVoices,
  ...FonadaHindiVoices,
  ...FonadaTamilVoices,
  ...FonadaTeluguVoices,
];

// Background Music Tracks Collection
export const BackgroundMusicTracks: MusicTrackOption[] = [
  {
    id: "dark-suspense",
    title: "Shadows & Deep Tension",
    genre: "Dark Ambient / Suspense",
    mood: "Mysterious & Chilling",
    bpm: 75,
    duration: "0:12",
    previewFile: "dark-suspense-drone.mp3",
    tagColor: "bg-red-500/15 text-red-300 border-red-500/30",
    description: "Deep analog sub-bass drone and ominous textures. Perfect for unsolved mysteries and scary stories.",
    recommendedFor: "Scary Stories, Dark Psychology, True Crime",
  },
  {
    id: "cyberpunk-neon",
    title: "Neon Pulse 2088",
    genre: "Synthwave / Cyberpunk",
    mood: "Driving & Futuristic",
    bpm: 118,
    duration: "0:12",
    previewFile: "cyberpunk-neon-drive.mp3",
    tagColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    description: "Retro-futuristic analog arpeggios with punchy cyberpunk drums. Ideal for tech breakdowns and AI reels.",
    recommendedFor: "AI & Tech, Sci-Fi Space, Luxury Supercars",
  },
  {
    id: "lofi-midnight",
    title: "Midnight Coffee Chillhop",
    genre: "Lo-Fi Beats / Chill",
    mood: "Relaxed & Nostalgic",
    bpm: 82,
    duration: "0:12",
    previewFile: "lofi-midnight-chill.mp3",
    tagColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    description: "Warm tape-saturated Rhodes electric piano chords and smooth vinyl dust. Great for thoughtful advice.",
    recommendedFor: "Stoic Wisdom, Self Growth, Life Facts",
  },
  {
    id: "aggressive-phonk",
    title: "Drift King Tokyo Phonk",
    genre: "Phonk / Hard Bass",
    mood: "High Adrenaline & Aggressive",
    bpm: 135,
    duration: "0:10",
    previewFile: "aggressive-drift-phonk.mp3",
    tagColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    description: "Heavy distorted 808 sub and signature cowbell melodies. Builds explosive viral retention.",
    recommendedFor: "Motivational Grind, Fitness, Billionaire Rules",
  },
  {
    id: "epic-cinematic",
    title: "Titan's Awakening",
    genre: "Cinematic / Orchestral",
    mood: "Grand & Powerful",
    bpm: 90,
    duration: "0:14",
    previewFile: "epic-cinematic-orchestra.mp3",
    tagColor: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    description: "Ascending brass swells and heroic strings designed to create goosebumps and cinematic authority.",
    recommendedFor: "History Conspiracies, Empires, Grand Discoveries",
  },
  {
    id: "titan-motivational",
    title: "Relentless Pursuit",
    genre: "Motivational / Hybrid Beat",
    mood: "Inspiring & Victorious",
    bpm: 110,
    duration: "0:12",
    previewFile: "titan-motivational-rise.mp3",
    tagColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    description: "Uplifting progressive chords with steady heartbeat percussion. Keeps listeners focused until the last second.",
    recommendedFor: "Finance Rules, Discipline Quotes, Mindset Hacks",
  },
];

// Video Visual Styles Collection (9:16 Vertical Ratio)
export const VideoStyles: VideoStyleOption[] = [
  {
    id: "cinematic-realism",
    name: "Cinematic Realism",
    tag: "Photorealistic 8K",
    image: "/video-style/realism.jpg",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    description: "Hyper-realistic cinematic movie stills, 35mm film grain, atmospheric depth, and Hollywood studio lighting.",
    promptModifier: "hyper-realistic cinematic movie still, 8k resolution, volumetric lighting, photorealistic, 35mm film grain, masterclass cinematography, highly detailed",
    recommendedNiches: "Stoic Philosophy, History, True Crime, Wealth, Real Estate",
  },
  {
    id: "anime",
    name: "Shonen Anime",
    tag: "Japanese Animation",
    image: "/video-style/anime.jpg",
    tagColor: "bg-red-500/20 text-red-300 border-red-500/30",
    description: "High-octane Japanese anime aesthetic with dynamic action lines, vibrant cel shading, and iconic character expressions.",
    promptModifier: "vibrant Japanese anime aesthetic, ufotable studio quality, dynamic action pose, sharp cel shading, glowing energy particles, cinematic anime masterpiece",
    recommendedNiches: "Motivational Stories, Hero Journeys, Mindset, Fitness, Gaming",
  },
  {
    id: "dark-fantasy",
    name: "Dark Fantasy Epic",
    tag: "Gothic & Mystical",
    image: "/video-style/dark_fantasy_new.jpg",
    tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    description: "Ominous medieval castles, glowing ethereal magic, misty shadows, and dark soul-inspired atmosphere.",
    promptModifier: "dark fantasy epic aesthetic, Elden Ring and Dark Souls inspired, dramatic moody rim lighting, foggy medieval ruins, glowing mystical runes, highly detailed concept art",
    recommendedNiches: "Scary Stories, Dark Psychology, Mind Games, Ancient Lore",
  },
  {
    id: "comic",
    name: "Classic Graphic Novel",
    tag: "Comic Book Art",
    image: "/video-style/comic.jpg",
    tagColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    description: "Bold black ink linework, vintage halftone dot textures, high-contrast dynamic action panels.",
    promptModifier: "classic vintage graphic novel illustration, bold ink linework, halftone shading patterns, DC Marvel vintage comic aesthetic, high contrast dramatic lighting",
    recommendedNiches: "Superheroes, Action Stories, Riddles & Paradoxes, Crime Solvers",
  },
  {
    id: "creepy-comic",
    name: "Eerie Noir Horror",
    tag: "Dark & Gritty",
    image: "/video-style/creepy_comic.jpg",
    tagColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    description: "Chilling monochromatic ink sketches, heavy shadows, surreal horror silhouettes, and psychological dread.",
    promptModifier: "eerie noir horror comic style, Junji Ito inspired, gritty scratchy ink crosshatching, deep black shadows, psychological dread, high contrast black and white",
    recommendedNiches: "Scary Stories, Urban Legends, Supernatural, Creepypasta",
  },
  {
    id: "disney-3d",
    name: "3D Pixar & Disney",
    tag: "Vibrant & Warm 3D",
    image: "/video-style/disney.jpeg",
    tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    description: "Warm expressive characters, soft subsurface scattering, bouncy lighting, and high-end 3D animated film render.",
    promptModifier: "Pixar Disney 3D animation style, soft subsurface scattering, expressive charming lighting, warm vibrant colors, highly detailed Unreal Engine 5 3D render",
    recommendedNiches: "Motivational, Interesting Facts, Health & Wellness, Kids & Family",
  },
  {
    id: "ghibli",
    name: "Studio Ghibli Watercolor",
    tag: "Peaceful & Nostalgic",
    image: "/video-style/ghibli.jpg",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    description: "Whimsical hand-painted gouache backgrounds, lush green meadows, blue skies, and nostalgic anime aesthetics.",
    promptModifier: "Studio Ghibli Hayao Miyazaki anime style, hand-painted lush watercolor background, soft fluffy clouds, nostalgic whimsical lighting, vibrant green and blue palette",
    recommendedNiches: "Self-Care, Nature Facts, Wholesome Stories, Philosophy, Meditation",
  },
  {
    id: "lego",
    name: "Lego Brick World",
    tag: "Toy & Claymation 3D",
    image: "/video-style/lego.jpg",
    tagColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    description: "Playful plastic minifigures, glossy interlocking brick environments, and stop-motion style cinematic rendering.",
    promptModifier: "Lego movie style 3D render, glossy plastic brick textures, toy minifigure world, macro tilt-shift photography, ray-traced reflections",
    recommendedNiches: "Historical Battles, Parody Stories, Fun Science, Pop Culture Facts",
  },
  {
    id: "modern-cartoon",
    name: "Modern 2D Cartoon",
    tag: "Clean & Flat Vector",
    image: "/video-style/modern_cartoon.png",
    tagColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    description: "Clean vector illustrations, vibrant color blocks, modern flat design characters, and engaging explanatory visuals.",
    promptModifier: "modern 2D vector animation style, flat vector illustration, clean lines, bold saturated color palette, infographic storytelling aesthetic",
    recommendedNiches: "Finance Explanations, Tech Trends, Startup Breakdowns, Psychology",
  },
  {
    id: "mythology",
    name: "Ancient Mythology & Gods",
    tag: "Epic Historical Fantasy",
    image: "/video-style/mythology.jpg",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    description: "Colossal Greek & Norse deities, golden armor, marble temples, storm clouds, and mythological grandeur.",
    promptModifier: "epic ancient mythology aesthetic, colossal gods and deities, golden divine rays, marble classical architecture, dramatic stormy sky, cinematic masterpiece",
    recommendedNiches: "Greek & Norse Mythology, Ancient Civilizations, History, Epic Tales",
  },
  {
    id: "oil-painting",
    name: "Renaissance Oil Painting",
    tag: "Classical Fine Art",
    image: "/video-style/painting.png",
    tagColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    description: "Textured impasto brushwork, chiaroscuro lighting, rich earth tones, and timeless fine art museum aesthetics.",
    promptModifier: "classical Renaissance oil painting, Rembrandt chiaroscuro lighting, rich canvas impasto texture, dramatic golden glow, museum masterpiece",
    recommendedNiches: "Stoic Philosophy, Wisdom of the Past, Literature, Royal History",
  },
  {
    id: "pixel-art",
    name: "Retro 16-Bit Pixel Art",
    tag: "Nostalgic Cyber Retro",
    image: "/video-style/pixel_art.jpg",
    tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    description: "Nostalgic 16-bit pixelated characters, retro game color palettes, isometric perspective, and arcade neon vibes.",
    promptModifier: "detailed 16-bit pixel art style, isometric view, retro arcade video game aesthetic, vibrant neon palette, crisp pixel dithering",
    recommendedNiches: "Crypto & Web3, Gaming Secrets, Nostalgia, Tech Hacks",
  },
  {
    id: "vintage-polaroid",
    name: "Vintage 90s Polaroid",
    tag: "Retro Analog Film",
    image: "/video-style/polaroid.jpg",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    description: "Nostalgic analog film camera look, light leaks, warm washed-out tones, and candid vintage snapshot authenticity.",
    promptModifier: "vintage 1990s polaroid snapshot, authentic 35mm disposable camera look, subtle light leaks, warm retro color grading, grainy analog film",
    recommendedNiches: "Nostalgia Stories, True Crime Cold Cases, Travel Mysteries, Life Hacks",
  },
  {
    id: "fantastic-scifi",
    name: "Sci-Fi Cosmic Wonder",
    tag: "Futuristic & Nebula",
    image: "/video-style/fantastic.png",
    tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    description: "Surreal glowing nebulae, alien landscapes, quantum physics realms, and breathtaking intergalactic vistas.",
    promptModifier: "surreal sci-fi cosmic aesthetic, glowing interstellar nebulae, bioluminescent alien planet, futuristic holographic architecture, 8k cinematic masterpiece",
    recommendedNiches: "Space Facts, Sci-Fi Theories, Quantum Physics, Future of AI",
  },
];
