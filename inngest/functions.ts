import { inngest } from "./client";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import Replicate from "replicate";
import fs from "fs";
import path from "path";
import { renderRemotionVideo, RenderVideoResult } from "@/lib/remotion-lambda";
import { MainVideoReelProps } from "@/remotion/types";
import { sendVideoReadyEmail, resolveUserEmail } from "@/lib/plunk";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// Google Gemini AI SDK Helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey || apiKey.trim().length === 0 || apiKey.includes("placeholder")) {
    return null;
  }

  return new GoogleGenAI({ apiKey });
}

// Replicate AI SDK Helper (Optional)
function getReplicateClient(): Replicate | null {
  const token =
    process.env.REPLICATE_API_TOKEN ||
    process.env.REPLICATE_API_KEY ||
    "";

  if (!token || token.trim().length === 0 || token.includes("placeholder")) {
    return null;
  }

  return new Replicate({ auth: token });
}

export interface GeneratedScene {
  sceneNumber: number;
  durationEstimateSeconds: number;
  narration: string;
  imagePrompt: string;
  imageUrl?: string;
  imageStoragePath?: string;
}

export interface GeneratedScriptPayload {
  videoTitle: string;
  hook: string;
  script: string;
  targetDurationSeconds: number;
  wordCount: number;
  imagePrompts: string[];
  scenes: GeneratedScene[];
}

export interface GeneratedAudioPayload {
  provider: "deepgram" | "fonadalab";
  voiceName: string;
  voiceId: string;
  language: string;
  scriptText: string;
  audioUrl: string;
  supabaseStoragePath?: string;
  durationSeconds: number;
  generatedAt: string;
  format: string;
}

export interface SubtitleWord {
  word: string;
  punctuatedWord: string;
  start: number;
  end: number;
  confidence: number;
}

export interface SubtitleBatch {
  index: number;
  text: string;
  start: number;
  end: number;
  words: SubtitleWord[];
}

export interface GeneratedCaptionPayload {
  captionStyle: string;
  captionStyleId: string;
  wordsPerBatch: number;
  totalWords: number;
  fullTranscript: string;
  subtitles: SubtitleBatch[];
  words: SubtitleWord[];
  generatedAt: string;
}

export interface GeneratedImagesPayload {
  totalImages: number;
  imageUrls: string[];
  generatedScenes: GeneratedScene[];
  modelUsed: string;
  generatedAt: string;
}

// Helper: Ensure directories exist
async function ensureDirExists(dirPath: string): Promise<void> {
  if (!fs.existsSync(dirPath)) {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
}

// Helper: Upload Audio Buffer directly to Supabase Storage bucket 'voiceovers'
async function uploadVoiceoverToSupabase(
  buffer: Buffer,
  filename: string,
  seriesId: string
): Promise<{ publicUrl: string; storagePath: string } | null> {
  try {
    const storagePath = `${seriesId}/${filename}`;

    const { data, error } = await supabase.storage
      .from("voiceovers")
      .upload(storagePath, buffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (error) {
      console.warn("Supabase 'voiceovers' bucket upload notice:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("voiceovers")
      .getPublicUrl(storagePath);

    return {
      publicUrl: publicUrlData.publicUrl,
      storagePath,
    };
  } catch (err: any) {
    console.warn("Failed to upload audio to Supabase 'voiceovers' bucket:", err?.message);
    return null;
  }
}

// Helper: Upload Image Buffer directly to Supabase Storage bucket 'images' (with fallback to 'voiceovers')
async function uploadImageToSupabase(
  buffer: Buffer,
  filename: string,
  seriesId: string
): Promise<{ publicUrl: string; storagePath: string }> {
  const storagePath = `${seriesId}/${filename}`;
  const contentType = filename.endsWith(".webp") ? "image/webp" : "image/jpeg";

  const { data, error } = await supabase.storage
    .from("images")
    .upload(storagePath, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    // If 'images' bucket doesn't exist yet, upload to 'voiceovers' under images/ prefix
    const { error: fbErr } = await supabase.storage
      .from("voiceovers")
      .upload(`images/${storagePath}`, buffer, {
        contentType,
        upsert: true,
      });

    if (fbErr) {
      throw new Error(
        `Supabase image upload failed to 'images' bucket (${error.message}) and fallback 'voiceovers' bucket (${fbErr.message})`
      );
    }

    const { data: fbUrl } = supabase.storage
      .from("voiceovers")
      .getPublicUrl(`images/${storagePath}`);

    return { publicUrl: fbUrl.publicUrl, storagePath: `images/${storagePath}` };
  }

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(storagePath);

  return {
    publicUrl: publicUrlData.publicUrl,
    storagePath,
  };
}

// Deepgram Aura Text-To-Speech Generator
async function generateDeepgramAudio(
  text: string,
  modelName: string,
  seriesId: string
): Promise<{ audioUrl: string; storagePath?: string; durationSeconds: number; format: string }> {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey || apiKey.trim().length === 0 || apiKey.includes("placeholder")) {
    throw new Error("DEEPGRAM_API_KEY is missing in environment variables.");
  }

  const estimatedDuration = Math.max(30, Math.round(text.split(/\s+/).length / 2.5));
  const filename = `deepgram-${seriesId}-${Date.now()}.mp3`;

  const endpoint = `https://api.deepgram.com/v1/speak?model=${encodeURIComponent(modelName)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Deepgram TTS API failed with HTTP ${response.status}: ${errText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const localAudioDir = path.join(process.cwd(), "public", "audio");
  await ensureDirExists(localAudioDir);
  const filePath = path.join(localAudioDir, filename);
  await fs.promises.writeFile(filePath, buffer);

  const supabaseResult = await uploadVoiceoverToSupabase(buffer, filename, seriesId);

  return {
    audioUrl: supabaseResult?.publicUrl || `/audio/${filename}`,
    storagePath: supabaseResult?.storagePath,
    durationSeconds: estimatedDuration,
    format: "mp3",
  };
}

// FonadaLabs Indian Languages Text-To-Speech Generator (https://fonadalabs.ai/docs/text-to-speech)
async function generateFonadaAudio(
  text: string,
  voiceName: string,
  languageName: string,
  seriesId: string
): Promise<{ audioUrl: string; storagePath?: string; durationSeconds: number; format: string }> {
  const apiKey = process.env.FONADA_API_KEY || process.env.FONADALABS_API_KEY;
  const cleanVoice = voiceName.replace(/^fonada-|-.*$/gi, "").trim() || "Rohit";
  const cleanLanguage = languageName || "Hindi";
  const estimatedDuration = Math.max(30, Math.round(text.split(/\s+/).length / 2.5));
  const filename = `fonada-${seriesId}-${Date.now()}.mp3`;

  if (apiKey && apiKey.trim().length > 0 && !apiKey.includes("placeholder")) {
    try {
      const endpoint = "https://api.fonadalabs.ai/v1/tts/synthesize";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: text,
          voice: cleanVoice,
          language: cleanLanguage,
        }),
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type") || "";
        const localAudioDir = path.join(process.cwd(), "public", "audio");
        await ensureDirExists(localAudioDir);
        const filePath = path.join(localAudioDir, filename);

        let audioBuffer: Buffer | null = null;

        if (contentType.includes("application/json")) {
          const json = await response.json();
          if (json.audio_base64 || json.base64) {
            audioBuffer = Buffer.from(json.audio_base64 || json.base64, "base64");
          } else if (json.audioUrl || json.url) {
            const audioFetch = await fetch(json.audioUrl || json.url);
            const arrayBuf = await audioFetch.arrayBuffer();
            audioBuffer = Buffer.from(arrayBuf);
          }
        } else {
          const arrayBuffer = await response.arrayBuffer();
          audioBuffer = Buffer.from(arrayBuffer);
        }

        if (audioBuffer) {
          await fs.promises.writeFile(filePath, audioBuffer);
          const supabaseResult = await uploadVoiceoverToSupabase(audioBuffer, filename, seriesId);

          return {
            audioUrl: supabaseResult?.publicUrl || `/audio/${filename}`,
            storagePath: supabaseResult?.storagePath,
            durationSeconds: estimatedDuration,
            format: "mp3",
          };
        }
        const errText = await response.text().catch(() => "");
        const fallbackEndpoint = "https://api.fonada.ai/tts/generate-audio-large";
        const fbResponse = await fetch(fallbackEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: text,
            voice: cleanVoice,
            language: cleanLanguage,
          }),
        });

        if (fbResponse.ok) {
          const arrayBuffer = await fbResponse.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const localAudioDir = path.join(process.cwd(), "public", "audio");
          await ensureDirExists(localAudioDir);
          const filePath = path.join(localAudioDir, filename);
          await fs.promises.writeFile(filePath, buffer);

          const supabaseResult = await uploadVoiceoverToSupabase(buffer, filename, seriesId);

          return {
            audioUrl: supabaseResult?.publicUrl || `/audio/${filename}`,
            storagePath: supabaseResult?.storagePath,
            durationSeconds: estimatedDuration,
            format: "mp3",
          };
        }

        const fbErr = await fbResponse.text().catch(() => "");
        throw new Error(
          `FonadaLabs TTS API failed. Primary: ${errText}, Fallback: ${fbErr}`
        );
      }
    } catch (err: any) {
      throw new Error(`FonadaLabs TTS synthesis failed: ${err?.message}`);
    }
  }

  throw new Error("FONADA_API_KEY is missing in environment variables.");
}

// Deepgram Speech-to-Text Caption & Word-level Timestamp Generator
async function generateDeepgramCaptions(
  audioUrl: string,
  scriptText: string,
  wordsPerBatch: number,
  durationSeconds: number
): Promise<{ words: SubtitleWord[]; batches: SubtitleBatch[]; transcript: string }> {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (apiKey && apiKey.trim().length > 0 && !apiKey.includes("placeholder")) {
    try {
      const endpoint =
        "https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&punctuate=true&utterances=true";
      let response: Response;

      if (audioUrl.startsWith("http://") || audioUrl.startsWith("https://")) {
        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Token ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: audioUrl }),
        });
      } else {
        const cleanPath = audioUrl.replace(/^\//, "");
        const localFilePath = path.join(process.cwd(), "public", cleanPath);
        if (fs.existsSync(localFilePath)) {
          const buffer = await fs.promises.readFile(localFilePath);
          response = await fetch(endpoint, {
            method: "POST",
            headers: {
              Authorization: `Token ${apiKey}`,
              "Content-Type": "audio/mpeg",
            },
            body: buffer,
          });
        } else {
          throw new Error(`Local audio file not found at ${localFilePath}`);
        }
      }

      if (response && response.ok) {
        const json = await response.json();
        const rawWords: any[] =
          json?.results?.channels?.[0]?.alternatives?.[0]?.words || [];
        const transcriptText: string =
          json?.results?.channels?.[0]?.alternatives?.[0]?.transcript || scriptText;

        if (rawWords.length > 0) {
          const words: SubtitleWord[] = rawWords.map((w) => ({
            word: (w.word || "").toUpperCase(),
            punctuatedWord: w.punctuated_word || w.word || "",
            start: Number(Number(w.start).toFixed(2)),
            end: Number(Number(w.end).toFixed(2)),
            confidence: Number(Number(w.confidence || 0.99).toFixed(2)),
          }));

          const batchSize = Math.max(1, Math.min(3, wordsPerBatch || 1));
          const batches: SubtitleBatch[] = [];

          for (let i = 0; i < words.length; i += batchSize) {
            const slice = words.slice(i, i + batchSize);
            batches.push({
              index: Math.floor(i / batchSize),
              text: slice.map((w) => w.punctuatedWord || w.word).join(" "),
              start: slice[0].start,
              end: slice[slice.length - 1].end,
              words: slice,
            });
          }

          return {
            words,
            batches,
            transcript: transcriptText,
          };
        }
      }

      const errText = response ? await response.text().catch(() => "") : "No response";
      throw new Error(`Deepgram STT Transcription API failed: ${errText}`);
    } catch (err: any) {
      throw new Error(`Deepgram STT Transcription failed: ${err?.message}`);
    }
  }

  throw new Error("DEEPGRAM_API_KEY is missing in environment variables.");
}

// Helper: Map visual style ID or Name to prompt modifier
function getStylePromptModifier(styleIdOrName?: string | null): string {
  const s = (styleIdOrName || "").toLowerCase();
  if (s.includes("fantasy") || s.includes("gothic")) {
    return "dark fantasy epic aesthetic, Elden Ring and Dark Souls inspired, dramatic moody rim lighting, foggy medieval ruins, glowing mystical runes, highly detailed concept art";
  }
  if (s.includes("creepy") || s.includes("horror") || s.includes("eerie")) {
    return "eerie noir horror comic style, Junji Ito inspired, gritty scratchy ink crosshatching, deep black shadows, psychological dread, high contrast black and white";
  }
  if (s.includes("comic") || s.includes("graphic")) {
    return "classic vintage graphic novel illustration, bold ink linework, halftone shading patterns, DC Marvel vintage comic aesthetic, high contrast dramatic lighting";
  }
  if (s.includes("ghibli")) {
    return "Studio Ghibli Hayao Miyazaki anime style, hand-painted lush watercolor background, soft fluffy clouds, nostalgic whimsical lighting, vibrant green and blue palette";
  }
  if (s.includes("anime") || s.includes("shonen")) {
    return "vibrant Japanese anime aesthetic, ufotable studio quality, dynamic action pose, sharp cel shading, glowing energy particles, cinematic anime masterpiece";
  }
  if (s.includes("disney") || s.includes("pixar") || s.includes("3d")) {
    return "Pixar Disney 3D animation style, soft subsurface scattering, expressive charming lighting, warm vibrant colors, highly detailed Unreal Engine 5 3D render";
  }
  if (s.includes("lego")) {
    return "Lego movie style 3D render, glossy plastic brick textures, toy minifigure world, macro tilt-shift photography, ray-traced reflections";
  }
  if (s.includes("cartoon") || s.includes("vector")) {
    return "modern 2D vector animation style, flat vector illustration, clean lines, bold saturated color palette, infographic storytelling aesthetic";
  }
  if (s.includes("mythology") || s.includes("gods") || s.includes("ancient")) {
    return "epic ancient mythology aesthetic, colossal gods and deities, golden divine rays, marble classical architecture, dramatic stormy sky, cinematic masterpiece";
  }
  if (s.includes("oil") || s.includes("painting") || s.includes("renaissance")) {
    return "classical Renaissance oil painting, Rembrandt chiaroscuro lighting, rich canvas impasto texture, dramatic golden glow, museum masterpiece";
  }
  if (s.includes("pixel") || s.includes("game")) {
    return "detailed 16-bit pixel art style, isometric view, retro arcade video game aesthetic, vibrant neon palette, crisp pixel dithering";
  }
  if (s.includes("polaroid") || s.includes("vintage") || s.includes("film")) {
    return "vintage 1990s polaroid snapshot, authentic 35mm disposable camera look, subtle light leaks, warm retro color grading, grainy analog film";
  }
  if (s.includes("fantastic") || s.includes("scifi") || s.includes("space") || s.includes("cyberpunk")) {
    return "surreal sci-fi cosmic aesthetic, glowing interstellar nebulae, bioluminescent alien planet, futuristic holographic architecture, 8k cinematic masterpiece";
  }
  return "hyper-realistic cinematic movie still, 8k resolution, volumetric lighting, photorealistic, 35mm film grain, masterclass cinematography, highly detailed";
}

// Scene Image Generator (Using Gemini AI API & Neural Image Synthesis)
async function generateSceneImage(
  prompt: string,
  sceneIndex: number,
  seriesId: string,
  styleModifier?: string
): Promise<{ imageUrl: string; storagePath?: string; prompt: string }> {
  const filename = `scene-${sceneIndex}-${Date.now()}.jpg`;
  const localDir = path.join(process.cwd(), "public", "generated-images");
  await ensureDirExists(localDir);
  const localPath = path.join(localDir, filename);

  const finalStyle = styleModifier && styleModifier.trim().length > 0
    ? styleModifier
    : "hyper-realistic cinematic movie still, 8k resolution, volumetric lighting, photorealistic, 35mm film grain";
  const enrichedPrompt = prompt.includes(finalStyle.slice(0, 20))
    ? prompt
    : `${prompt}, ${finalStyle}`;

  let buffer: Buffer | null = null;

  // 1. Try Gemini API Image Generation via @google/genai
  const gemini = getGeminiClient();
  if (gemini) {
    const candidateModels = [
      "gemini-2.5-flash-image",
      "gemini-3.1-flash-image",
      "gemini-3.1-flash-lite-image",
      "gemini-3-pro-image",
    ];

    for (const model of candidateModels) {
      try {
        const response = await gemini.models.generateContent({
          model,
          contents: `Generate a vertical 9:16 portrait image for video scene: ${enrichedPrompt}. 9:16 vertical aspect ratio, ultra detailed.`,
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            buffer = Buffer.from(part.inlineData.data, "base64");
            break;
          }
        }
        if (buffer) break;
      } catch (err: any) {
        // Continue to next candidate or fallback
      }
    }
  }

  // 2. High-Resolution 9:16 Neural AI Image Synthesis (from exact Gemini Scene Prompt)
  if (!buffer) {
    try {
      const seed = Math.floor(Math.random() * 1000000);
      const encodedPrompt = encodeURIComponent(
        `${enrichedPrompt}, 9:16 vertical portrait aspect ratio`
      );
      const aiSynthesisUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=720&height=1280&nologo=true&seed=${seed}`;

      const res = await fetch(aiSynthesisUrl);
      if (res.ok) {
        const ab = await res.arrayBuffer();
        buffer = Buffer.from(ab);
      }
    } catch (err: any) {
      console.warn("AI scene image synthesis fetch failed:", err?.message);
    }
  }

  if (!buffer) {
    throw new Error(
      `Failed to generate image for Scene #${sceneIndex} using Gemini / AI Synthesis.`
    );
  }

  // 3. Save local copy to public/generated-images/
  await fs.promises.writeFile(localPath, buffer);

  // 4. Upload directly to Supabase Storage bucket 'images'
  const supabaseResult = await uploadImageToSupabase(buffer, filename, seriesId);

  return {
    imageUrl: supabaseResult.publicUrl,
    storagePath: supabaseResult.storagePath,
    prompt: enrichedPrompt,
  };
}

// 1. Hello World Test Function
export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
    name: "Hello World Test",
    triggers: [{ event: "test/hello.world" }],
  },
  async ({ event, step }) => {
    const greeting = await step.run("create-greeting", async () => {
      const name = (event.data as any)?.name || "FacelessReels Creator";
      return `Hello, ${name}! Inngest pipeline is active and ready.`;
    });

    await step.sleep("wait-a-moment", "1s");

    return {
      status: "success",
      message: greeting,
      timestamp: new Date().toISOString(),
    };
  }
);

// 2. Video Reel Generation Pipeline
export const generateVideoReel = inngest.createFunction(
  {
    id: "generate-video-reel",
    name: "Generate Video Reel",
    triggers: [{ event: "video/generate.reel" }],
  },
  async ({ event, step }) => {
    const { seriesId, userId, reelId } = (event.data as any) || {};

    // =========================================================================
    // STEP 1: Fetch Series data from Supabase (Real Logic)
    // =========================================================================
    const seriesData = await step.run("fetch-series-from-supabase", async () => {
      if (!seriesId) {
        throw new Error("Missing seriesId in event data");
      }

      const { data, error } = await supabase
        .from("series")
        .select("*")
        .eq("id", seriesId)
        .single();

      if (error || !data) {
        throw new Error(
          `Failed to fetch series from Supabase: ${error?.message || "Record not found"}`
        );
      }

      return data;
    });

    // =========================================================================
    // STEP 2: Generate Video Script using Gemini AI (Google Gen SDK)
    // =========================================================================
    const scriptData = await step.run("generate-video-script-ai", async (): Promise<GeneratedScriptPayload> => {
      const durationOpt = seriesData.duration_option || "30-50 sec video";
      const isLongDuration = durationOpt.includes("60") || durationOpt.includes("70");

      const targetSceneCount = isLongDuration ? 6 : 5;
      const wordTarget = isLongDuration
        ? "130-150 words (approx 60-70 seconds spoken speed)"
        : "75-95 words (approx 35-45 seconds spoken speed)";

      const nicheName = seriesData.niche || "Viral Mindset";
      const customTopic = seriesData.custom_prompt
        ? `Specific Focus/Story: ${seriesData.custom_prompt}`
        : "";
      const visualStyle = seriesData.visual_style || "Cinematic Realism";
      const baseStyleMod = getStylePromptModifier(seriesData.visual_style_id || visualStyle);
      const customStyleMod = seriesData.custom_style_modifier || "";
      const styleModifier = customStyleMod
        ? `${baseStyleMod}, ${customStyleMod}`
        : baseStyleMod;
      const language = seriesData.language || "English";

      // Fetch previously generated reels for this series to guarantee unique topics per episode
      const { data: previousReels } = await supabase
        .from("reels")
        .select("title, hook")
        .eq("series_id", seriesData.id)
        .order("created_at", { ascending: true });

      const episodeNum = (previousReels?.length || 0) + 1;
      const previousTitles = (previousReels || []).map((r) => r.title).filter(Boolean);

      const prompt = `You are an elite viral short-form video scriptwriter and cinematic director for YouTube Shorts, Instagram Reels, and TikTok.
Your task is to write a high-retention, engaging video script and matching visual scene image prompts for an automated faceless video series.

### Series Parameters:
- **Series Title**: "${seriesData.title}"
- **Niche / Topic**: "${nicheName}" ${customTopic}
- **Episode Number**: #${episodeNum}
- **Previous Episodes in this series (DO NOT REPEAT THESE TOPICS/STORIES)**: ${JSON.stringify(previousTitles)}
- **Duration Target**: ${durationOpt} (${wordTarget})
- **Spoken Language**: ${language}
- **Visual Art Style**: "${visualStyle}" (Directives: ${styleModifier})

### Critical Directives for Voiceover Script:
1. **100% Unique Story/Concept**: Create a fresh, captivating, and distinct story or concept for Episode #${episodeNum}.
2. **Natural & Conversational**: The script text MUST sound natural, captivating, and human when read aloud by a text-to-speech (TTS) neural voice.
3. **NO Artifacts / NO Stage Directions**: Do NOT include brackets like [Sound of wind], parentheticals like (whispering), speaker tags like "Narrator:", scene numbers, or asterisks (*word*). The script must contain ONLY the spoken words.
4. **Viral Hook (First 3 Seconds)**: The opening sentence must immediately hook the viewer with curiosity, a shocking insight, or high emotional tension.
5. **Fast Pacing**: Keep sentences punchy, rhythmic, and easy to subtitle.

### Critical Directives for Scene Image Prompts:
1. Generate **EXACTLY ${targetSceneCount} scene image prompts** corresponding to each visual scene progression.
2. Each image prompt MUST be formatted for **9:16 vertical aspect ratio** (portrait), rich in cinematic detail, lighting, mood, color palette, camera angle, and subject matter matching the art style "${visualStyle}".
3. Each scene prompt MUST describe the specific visual action for that scene rather than a generic summary.
4. Do NOT include any text, letters, or subtitles inside the image prompt descriptions.

### Output JSON Format (STRICT JSON ONLY, NO MARKDOWN, NO RAW TEXT):
Return ONLY a valid JSON object matching this schema:
{
  "videoTitle": "Catchy Viral Title without quotes",
  "hook": "The exact first sentence hook of the script",
  "script": "The complete natural voiceover script with all sentences concatenated",
  "targetDurationSeconds": ${isLongDuration ? 65 : 40},
  "wordCount": 85,
  "imagePrompts": [
    "Ultra-detailed 9:16 vertical prompt for scene 1 in ${visualStyle} style...",
    "Ultra-detailed 9:16 vertical prompt for scene 2 in ${visualStyle} style...",
    "Ultra-detailed 9:16 vertical prompt for scene 3 in ${visualStyle} style...",
    "Ultra-detailed 9:16 vertical prompt for scene 4 in ${visualStyle} style...",
    "Ultra-detailed 9:16 vertical prompt for scene 5 in ${visualStyle} style..."
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "durationEstimateSeconds": 8,
      "narration": "First spoken segment of the script",
      "imagePrompt": "Ultra-detailed 9:16 vertical prompt for scene 1 in ${visualStyle} style..."
    }
  ]
}`;

      const gemini = getGeminiClient();
      if (!gemini) {
        throw new Error(
          "GEMINI_API_KEY is missing in environment variables. Please add a valid Gemini API key in .env.local."
        );
      }

      const candidateModels = [
        "gemini-3.5-flash",
        "gemini-flash-lite-latest",
        "gemini-3.1-flash-lite",
      ];

      let lastError: any = null;

      for (const model of candidateModels) {
        try {
          console.log(`[Gemini AI] Generating script with model: ${model} for Episode #${episodeNum}...`);
          const response = await gemini.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.85,
            },
          });

          const rawText = response.text || "";
          const cleanedJson = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const parsed = JSON.parse(cleanedJson) as GeneratedScriptPayload;

          if (parsed && parsed.script && Array.isArray(parsed.imagePrompts) && parsed.imagePrompts.length > 0) {
            console.log(`[Gemini AI] Successfully generated script: "${parsed.videoTitle}" using ${model}`);
            return parsed;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`[Gemini AI] Model ${model} attempt failed:`, err?.message || err);
        }
      }

      throw new Error(
        `Gemini AI Video Script Generation failed across all candidate models (${candidateModels.join(", ")}): ${lastError?.message || lastError}`
      );
    });

    // =========================================================================
    // STEP 3: Generate Voice using Deepgram / FonadaLabs & Store in Supabase 'voiceovers'
    // =========================================================================
    const audioData = await step.run("generate-voice-tts", async (): Promise<GeneratedAudioPayload> => {
      const voiceId = seriesData.voice_id || "aura-2-odysseus-en";
      const voiceName = seriesData.voice || "Odysseus";
      const language = seriesData.language || "English";
      const scriptText = scriptData.script;

      const isFonada =
        voiceId.includes("fonada") ||
        ["Hindi", "Marathi", "Telugu"].includes(language);

      let ttsResult: {
        audioUrl: string;
        storagePath?: string;
        durationSeconds: number;
        format: string;
      };

      if (isFonada) {
        ttsResult = await generateFonadaAudio(
          scriptText,
          voiceName,
          language,
          seriesData.id
        );
      } else {
        const deepgramModel = voiceId.includes("aura") ? voiceId : "aura-2-odysseus-en";
        ttsResult = await generateDeepgramAudio(
          scriptText,
          deepgramModel,
          seriesData.id
        );
      }

      return {
        provider: isFonada ? "fonadalab" : "deepgram",
        voiceName,
        voiceId,
        language,
        scriptText,
        audioUrl: ttsResult.audioUrl,
        supabaseStoragePath: ttsResult.storagePath,
        durationSeconds: ttsResult.durationSeconds || scriptData.targetDurationSeconds,
        generatedAt: new Date().toISOString(),
        format: ttsResult.format,
      };
    });

    // =========================================================================
    // STEP 4: Generate Caption & Word-level Timestamps using Deepgram
    // =========================================================================
    const captionData = await step.run("generate-captions-model", async (): Promise<GeneratedCaptionPayload> => {
      const captionStyle = seriesData.caption_style || "Hormozi Viral Pop";
      const captionStyleId = seriesData.caption_style_id || "hormozi-yellow";
      const wordsPerBatch = seriesData.caption_words_per_batch || 1;

      const transcription = await generateDeepgramCaptions(
        audioData.audioUrl,
        scriptData.script,
        wordsPerBatch,
        audioData.durationSeconds || scriptData.targetDurationSeconds
      );

      return {
        captionStyle,
        captionStyleId,
        wordsPerBatch,
        totalWords: transcription.words.length,
        fullTranscript: transcription.transcript,
        subtitles: transcription.batches,
        words: transcription.words,
        generatedAt: new Date().toISOString(),
      };
    });

    // =========================================================================
    // STEP 5: Generate 9:16 Scene Images (Gemini AI & Neural Image Synthesis)
    // =========================================================================
    const imagesData = await step.run("generate-images-from-prompts", async (): Promise<GeneratedImagesPayload> => {
      const scenesToProcess = scriptData.scenes && scriptData.scenes.length > 0
        ? scriptData.scenes
        : scriptData.imagePrompts.map((prompt, idx) => ({
            sceneNumber: idx + 1,
            durationEstimateSeconds: Math.round(scriptData.targetDurationSeconds / scriptData.imagePrompts.length),
            narration: "",
            imagePrompt: prompt,
          }));

      const processedScenes: GeneratedScene[] = [];
      const imageUrls: string[] = [];

      const visualStyleName = seriesData.visual_style || "Cinematic Realism";
      const baseStyleMod = getStylePromptModifier(seriesData.visual_style_id || visualStyleName);
      const customStyleMod = seriesData.custom_style_modifier || "";
      const combinedStyleModifier = customStyleMod
        ? `${baseStyleMod}, ${customStyleMod}`
        : baseStyleMod;

      for (let i = 0; i < scenesToProcess.length; i++) {
        const scene = scenesToProcess[i];
        const result = await generateSceneImage(
          scene.imagePrompt,
          scene.sceneNumber || i + 1,
          seriesData.id,
          combinedStyleModifier
        );

        processedScenes.push({
          ...scene,
          imageUrl: result.imageUrl,
          imageStoragePath: result.storagePath,
        });
        imageUrls.push(result.imageUrl);
      }

      return {
        totalImages: imageUrls.length,
        imageUrls,
        generatedScenes: processedScenes,
        modelUsed: "gemini-imagen-synthesis",
        generatedAt: new Date().toISOString(),
      };
    });

    // =========================================================================
    // STEP 6: Create Remotion Video Composition & Render MP4 via AWS Lambda
    // =========================================================================
    const remotionVideoData = await step.run("create-remotion-video", async (): Promise<RenderVideoResult> => {
      const compositionProps: MainVideoReelProps = {
        title: scriptData.videoTitle,
        scenes: imagesData.generatedScenes.map((s) => ({
          sceneNumber: s.sceneNumber,
          imageUrl: s.imageUrl || "",
          durationEstimateSeconds: s.durationEstimateSeconds,
          narration: s.narration,
          imagePrompt: s.imagePrompt,
        })),
        imageUrls: imagesData.imageUrls,
        audioUrl: audioData.audioUrl,
        bgMusicUrl: seriesData.bg_music && seriesData.bg_music.startsWith("http") ? seriesData.bg_music : undefined,
        bgMusicVolume: (seriesData.bg_music_volume ?? 22) / 100,
        subtitles: captionData.subtitles,
        captionStyleId: captionData.captionStyleId,
        captionStyleName: captionData.captionStyle,
        durationInSeconds: audioData.durationSeconds || scriptData.targetDurationSeconds,
        fps: 30,
      };

      const result = await renderRemotionVideo(compositionProps, seriesData.id);
      return result;
    });

    // =========================================================================
    // STEP 7: Save Everything to Supabase Database (public.reels & public.video_assets)
    // =========================================================================
    const savedResult = await step.run("save-everything-to-database", async () => {
      const targetUserId = userId || seriesData.user_id;

      // 1. Insert or update public.reels (with resilient schema fallback)
      const baseReelRecord: Record<string, any> = {
        user_id: targetUserId,
        series_id: seriesData.id,
        title: scriptData.videoTitle,
        niche: seriesData.niche,
        hook: scriptData.hook,
        script: scriptData.script,
        voice_name: audioData.voiceName,
        voice_id: audioData.voiceId,
        caption_style: captionData.captionStyle,
        background_music: seriesData.bg_music,
        video_url: remotionVideoData.videoUrl || audioData.audioUrl,
        thumbnail_url: imagesData.imageUrls[0],
        duration_seconds: audioData.durationSeconds || scriptData.targetDurationSeconds,
        status: "scheduled",
        viral_score: Math.floor(Math.random() * 7) + 93,
        actual_views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const extendedReelRecord: Record<string, any> = {
        ...baseReelRecord,
        audio_url: audioData.audioUrl,
        scenes: imagesData.generatedScenes,
        subtitles: captionData.subtitles,
        image_prompts: scriptData.imagePrompts,
      };

      let savedReel: any = null;

      // If reelId was created by triggerReelGeneration, update the existing placeholder
      if (reelId) {
        const { data: updatedFull, error: updateFullErr } = await supabase
          .from("reels")
          .update(extendedReelRecord)
          .eq("id", reelId)
          .select("*")
          .single();

        if (!updateFullErr && updatedFull) {
          savedReel = updatedFull;
        } else {
          // Schema fallback for update
          const { data: updatedBase, error: updateBaseErr } = await supabase
            .from("reels")
            .update(baseReelRecord)
            .eq("id", reelId)
            .select("*")
            .single();

          if (!updateBaseErr && updatedBase) {
            savedReel = updatedBase;
          }
        }
      }

      // If no reelId or update did not succeed, insert a new record
      if (!savedReel) {
        const { data: fullData, error: fullError } = await supabase
          .from("reels")
          .insert(extendedReelRecord)
          .select("*")
          .single();

        if (fullError) {
          console.warn("Retrying reel insert with base columns due to schema difference:", fullError.message);
          const { data: baseData, error: baseError } = await supabase
            .from("reels")
            .insert(baseReelRecord)
            .select("*")
            .single();

          if (baseError) {
            throw new Error(`Supabase reels table insert failed: ${baseError.message}`);
          }
          savedReel = baseData;
        } else {
          savedReel = fullData;
        }
      }

      // 2. Insert into dedicated public.video_assets registry (if table exists)
      try {
        const assetRecord = {
          user_id: targetUserId,
          series_id: seriesData.id,
          reel_id: savedReel?.id || null,
          title: scriptData.videoTitle,
          script: scriptData.script,
          hook: scriptData.hook,
          voice_url: audioData.audioUrl,
          voice_provider: audioData.provider,
          voice_id: audioData.voiceId,
          caption_style: captionData.captionStyle,
          subtitles: captionData.subtitles,
          scenes: imagesData.generatedScenes,
          image_prompts: scriptData.imagePrompts,
          image_urls: imagesData.imageUrls,
          video_url: remotionVideoData.videoUrl,
          render_id: remotionVideoData.renderId,
          status: "ready_to_render",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error: assetError } = await supabase
          .from("video_assets")
          .insert(assetRecord);

        if (assetError) {
          console.warn("Supabase video_assets insert notice:", assetError.message);
        }
      } catch (assetErr: any) {
        console.warn("video_assets table insert bypassed:", assetErr?.message);
      }

      // 3. Increment scheduled_videos count on series
      await supabase
        .from("series")
        .update({
          scheduled_videos: (seriesData.scheduled_videos || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", seriesData.id);

      return {
        savedToDatabase: true,
        reelId: savedReel?.id,
        seriesId: seriesData.id,
        title: scriptData.videoTitle,
        audioUrl: audioData.audioUrl,
        videoUrl: remotionVideoData.videoUrl,
        thumbnailUrl: imagesData.imageUrls[0],
        totalScenes: imagesData.totalImages,
        status: "scheduled",
        savedAt: new Date().toISOString(),
      };
    });

    // =========================================================================
    // STEP 8: Send Email Notification to User via Plunk
    // =========================================================================
    const emailResult = await step.run("send-email-notification-plunk", async () => {
      const targetUserId = userId || seriesData.user_id;
      const { email: recipientEmail, name: recipientName } = await resolveUserEmail(
        targetUserId,
        (event.data as any)?.userEmail
      );

      if (!recipientEmail) {
        console.warn("[Inngest Step 8] No user email found to send notification. User ID:", targetUserId);
        return {
          emailSent: false,
          reason: "No user email resolved",
          userId: targetUserId,
        };
      }

      const emailPayload = {
        to: recipientEmail,
        recipientName: recipientName || "Creator",
        videoTitle: scriptData.videoTitle,
        seriesTitle: seriesData.title,
        niche: seriesData.niche,
        hook: scriptData.hook,
        durationSeconds: audioData.durationSeconds || scriptData.targetDurationSeconds,
        thumbnailUrl: imagesData.imageUrls[0],
        videoUrl: remotionVideoData.videoUrl,
        reelId: savedResult.reelId,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        voiceName: audioData.voiceName,
        captionStyle: captionData.captionStyle,
      };

      const result = await sendVideoReadyEmail(emailPayload);

      return {
        emailSent: result.success,
        recipient: recipientEmail,
        messageId: result.messageId,
        simulated: result.simulated,
        error: result.error,
      };
    });

    return {
      success: true,
      message: "Video Reel generation, Remotion render, and Plunk email notification completed successfully!",
      seriesId: seriesData.id,
      series: seriesData,
      script: scriptData,
      audio: audioData,
      captions: captionData,
      images: imagesData,
      renderedVideo: remotionVideoData,
      saved: savedResult,
      email: emailResult,
    };
  }
);

