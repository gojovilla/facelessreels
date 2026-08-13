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
    language: "Spanish",
    countryCode: "MX",
    countryFlag: "🇲🇽",
    modelName: "deepgram",
    modelLangCode: "es-MX",
  },
  {
    language: "German",
    countryCode: "DE",
    countryFlag: "🇩🇪",
    modelName: "deepgram",
    modelLangCode: "de-DE",
  },
  {
    language: "Hindi",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    modelName: "fonadalab",
    modelLangCode: "hi-IN",
  },
  {
    language: "Marathi",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    modelName: "fonadalab",
    modelLangCode: "mr-IN",
  },
  {
    language: "Telugu",
    countryCode: "IN",
    countryFlag: "🇮🇳",
    modelName: "fonadalab",
    modelLangCode: "te-IN",
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
    modelName: "aura-2-amalthea-en",
    displayName: "Amalthea",
    preview: "deepgram-aura-2-amalthea-en.wav",
    gender: "female",
    langCode: "en-US",
    sampleText: "Deep in the darkest depths of the ocean lies a mystery scientists cannot explain.",
  },
  {
    model: "deepgram",
    modelName: "aura-2-andromeda-en",
    displayName: "Andromeda",
    preview: "deepgram-aura-2-andromeda-en.wav",
    gender: "female",
    langCode: "en-US",
    sampleText: "In the year twenty twenty six, artificial intelligence took a leap that changed everything.",
  },
  {
    model: "deepgram",
    modelName: "aura-2-orion-en",
    displayName: "Orion",
    preview: "deepgram-aura-2-orion-en.wav",
    gender: "male",
    langCode: "en-US",
    sampleText: "Here is the exact IRS loophole that billionaires use to legally pay zero tax.",
  },
];

// Deepgram Spanish Voices (es-MX)
export const DeepgramSpanishVoices: VoiceOption[] = [
  {
    model: "deepgram",
    modelName: "aura-2-mateo-es",
    displayName: "Mateo",
    preview: "deepgram-aura-2-mateo-es.wav",
    gender: "male",
    langCode: "es-MX",
    sampleText: "Descubre el poder de tu mente para dominar cualquier conversación.",
  },
  {
    model: "deepgram",
    modelName: "aura-2-helen-es",
    displayName: "Helen",
    preview: "deepgram-aura-2-helen-es.wav",
    gender: "female",
    langCode: "es-MX",
    sampleText: "Este es el misterio psicológico que cambiará por completo cómo ves a las personas.",
  },
];

// Deepgram German Voices (de-DE)
export const DeepgramGermanVoices: VoiceOption[] = [
  {
    model: "deepgram",
    modelName: "aura-2-marcus-de",
    displayName: "Marcus",
    preview: "deepgram-aura-2-marcus-de.wav",
    gender: "male",
    langCode: "de-DE",
    sampleText: "Erkenne die Kraft deiner Gedanken und beherrsche jeden Moment deines Lebens.",
  },
  {
    model: "deepgram",
    modelName: "aura-2-hannah-de",
    displayName: "Hannah",
    preview: "deepgram-aura-2-hannah-de.wav",
    gender: "female",
    langCode: "de-DE",
    sampleText: "Hier ist das Geheimnis für unaufhaltsamen Erfolg und eiserne Disziplin.",
  },
];

// FonadaLab Hindi Voices ONLY (hi-IN)
export const FonadaHindiVoices: VoiceOption[] = [
  {
    model: "fonadalab",
    modelName: "fonada-rohit-hi",
    displayName: "Rohit",
    preview: "fonada-rohit-hi.wav",
    gender: "male",
    langCode: "hi-IN",
    sampleText: "क्या आप जानते हैं कि दुनिया के सबसे अमीर लोग किस गुप्त नियम का पालन करते हैं?",
  },
  {
    model: "fonadalab",
    modelName: "fonada-priya-hi",
    displayName: "Priya",
    preview: "fonada-priya-hi.wav",
    gender: "female",
    langCode: "hi-IN",
    sampleText: "मानव मनोविज्ञान का यह रहस्य आपको हर बातचीत में सफलता दिला सकता है।",
  },
  {
    model: "fonadalab",
    modelName: "fonada-kabir-hi",
    displayName: "Kabir",
    preview: "fonada-kabir-hi.wav",
    gender: "male",
    langCode: "hi-IN",
    sampleText: "अनुशासन ही वह एकमात्र शक्ति है जो सपनों को हकीकत में बदलती है।",
  },
  {
    model: "fonadalab",
    modelName: "fonada-neha-hi",
    displayName: "Neha",
    preview: "fonada-neha-hi.wav",
    gender: "female",
    langCode: "hi-IN",
    sampleText: "इतिहास की वे रहस्यमयी कहानियां जिन्हें दुनिया से छुपाया गया था।",
  },
];

// FonadaLab Marathi Voices ONLY (mr-IN)
export const FonadaMarathiVoices: VoiceOption[] = [
  {
    model: "fonadalab",
    modelName: "fonada-aarav-mr",
    displayName: "Aarav",
    preview: "fonada-aarav-mr.wav",
    gender: "male",
    langCode: "mr-IN",
    sampleText: "यशस्वी होण्यासाठी सर्वात महत्त्वाची गोष्ट म्हणजे तुमची शिस्त आणि संयम.",
  },
  {
    model: "fonadalab",
    modelName: "fonada-tanvi-mr",
    displayName: "Tanvi",
    preview: "fonada-tanvi-mr.wav",
    gender: "female",
    langCode: "mr-IN",
    sampleText: "जीवनात मोठे ध्येय गाठण्यासाठी दररोज कठोर मेहनत करणे आवश्यक आहे.",
  },
];

// FonadaLab Telugu Voices ONLY (te-IN)
export const FonadaTeluguVoices: VoiceOption[] = [
  {
    model: "fonadalab",
    modelName: "fonada-sai-te",
    displayName: "Sai",
    preview: "fonada-sai-te.wav",
    gender: "male",
    langCode: "te-IN",
    sampleText: "జీవితంలో విజయం సాధించడానికి క్రమశిక్షణే అతి ముఖ్యమైన ఆయుధం.",
  },
  {
    model: "fonadalab",
    modelName: "fonada-ananya-te",
    displayName: "Ananya",
    preview: "fonada-ananya-te.wav",
    gender: "female",
    langCode: "te-IN",
    sampleText: "మీ జీవితాన్ని మార్చే అత్యంత शक्तिవంతమైన మైండ్‌సెట్ రహస్యాలు ఇవే.",
  },
];

export const ALL_VOICES: VoiceOption[] = [
  ...DeepgramEnglishVoices,
  ...DeepgramSpanishVoices,
  ...DeepgramGermanVoices,
  ...FonadaHindiVoices,
  ...FonadaMarathiVoices,
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
    image: "/video-style/cinematic-realism.jpg",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    description: "Dramatic volumetric lighting, deep shadows, and Hollywood movie depth.",
    promptModifier: "hyper-realistic cinematic movie still, 8k resolution, volumetric lighting, photorealistic, 35mm film grain",
    recommendedNiches: "Stoic Philosophy, History, True Crime, Wealth",
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk 3D Neon",
    tag: "Futuristic & Sci-Fi",
    image: "/video-style/cyberpunk-neon.jpg",
    tagColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    description: "Vibrant neon glows, rain-slicked city reflections, and high-tech armor.",
    promptModifier: "cyberpunk aesthetic, glowing purple and cyan neon, octane render 3D, high-tech dystopian city, Unreal Engine 5",
    recommendedNiches: "AI & Tech, Sci-Fi Space, Biohacking",
  },
  {
    id: "dark-anime",
    name: "Dark Anime Fantasy",
    tag: "Anime & Manga",
    image: "/video-style/dark-anime.jpg",
    tagColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    description: "Ethereal dark anime concept art with glowing particle effects.",
    promptModifier: "dark fantasy anime aesthetic, studio MAPPA key visual, intense glowing eyes, vibrant magical aura, sharp cel shading",
    recommendedNiches: "Scary Stories, Dark Psychology, Mind Games",
  },
  {
    id: "gothic-oil",
    name: "Baroque Oil Painting",
    tag: "Classical Masterpiece",
    image: "/video-style/gothic-oil.jpg",
    tagColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    description: "Chiaroscuro lighting, rich textured brushstrokes, and timeless museum elegance.",
    promptModifier: "Rembrandt baroque oil painting, dramatic chiaroscuro lighting, rich oil canvas texture, classical masterpiece",
    recommendedNiches: "History & Conspiracies, Stoic Wisdom, Philosophy",
  },
  {
    id: "comic-book",
    name: "Graphic Novel Noir",
    tag: "Comic Book Art",
    image: "/video-style/comic-book.jpg",
    tagColor: "bg-red-500/20 text-red-300 border-red-500/30",
    description: "Bold inked outlines, dynamic halftone dots, and gritty comic storytelling.",
    promptModifier: "vintage graphic novel illustration, bold ink linework, halftone shading, Frank Miller noir style, high contrast",
    recommendedNiches: "True Crime, Action Stories, Riddles & Paradoxes",
  },
  {
    id: "pixar-3d",
    name: "Pixar 3D Animation",
    tag: "Stylized & Vibrant",
    image: "/video-style/pixar-3d.jpg",
    tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    description: "Warm expressive character lighting, smooth textures, and colorful charm.",
    promptModifier: "3D Pixar Disney animation style, subsurface scattering, expressive cartoon lighting, vibrant cinematic 3D render",
    recommendedNiches: "Motivational, Interesting Facts, Health & Fitness",
  },
  {
    id: "gta-vector",
    name: "GTA Street Vector",
    tag: "Urban & High Impact",
    image: "/video-style/gta-vector.jpg",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    description: "Sleek saturated color blocks, street culture aesthetics, and luxury vibes.",
    promptModifier: "GTA loading screen vector art, high saturation colors, bold cel-shaded street illustration, luxury lifestyle aesthetic",
    recommendedNiches: "Money & Wealth Rules, Luxury & Billionaires",
  },
  {
    id: "watercolor-horror",
    name: "Eldritch Watercolor",
    tag: "Atmospheric & Eerie",
    image: "/video-style/watercolor-horror.jpg",
    tagColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    description: "Bleeding wet-on-wet ink washes, haunting silhouettes, and atmospheric dread.",
    promptModifier: "atmospheric eerie watercolor painting, bleeding ink washes, dark eldritch horror aesthetic, misty ominous landscape",
    recommendedNiches: "Scary Stories, Urban Legends, Supernatural",
  },
];
