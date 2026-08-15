import { inngest } from "./client";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import Replicate from "replicate";
import fs from "fs";
import path from "path";
import { renderRemotionVideo, RenderVideoResult } from "@/lib/remotion-lambda";
import { MainVideoReelProps } from "@/remotion/types";
import { sendVideoReadyEmail, resolveUserEmail } from "@/lib/plunk";
import { dispatchAllConfiguredPlatforms } from "@/lib/publishers";

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

// Helper: Resolve clean voice and language for FonadaLabs TTS
function resolveFonadaParams(
  voiceName: string,
  languageName: string
): { voice: string; language: "Hindi" | "Tamil" | "Telugu" | "English" } {
  const langLower = (languageName || "").toLowerCase();
  let lang: "Hindi" | "Tamil" | "Telugu" | "English" = "Hindi";
  if (langLower.includes("tamil") || langLower.includes("ta")) lang = "Tamil";
  else if (langLower.includes("telugu") || langLower.includes("te")) lang = "Telugu";
  else if (langLower.includes("english") || langLower.includes("en")) lang = "English";
  else lang = "Hindi";

  // Official available voices per language on Fonada API
  const validVoices: Record<string, string[]> = {
    Hindi: [
      "Dhruv", "Vaanee", "Swastik", "Laksh", "Raag", "Sarvagya", "Komal", "Meghra",
      "Pancham", "Tara", "Sharad", "Kritika", "Mandra", "Karn", "Gauri", "Ruhi", "Roshini", "Parikshit"
    ],
    Tamil: [
      "Vaani", "Isai", "Thalam", "Swaram", "Madhuri", "Naadham", "Rachna", "Pallavi",
      "Mrityunjay", "Malika", "Yamini", "Tilak", "Dhruv", "Sanket", "Rudraksh"
    ],
    Telugu: [
      "Dhruv", "Ansh", "Aadhira", "Aahana", "Aakriti", "Ridhima", "Vaani", "Shaury",
      "Bhavyaa", "Tanuj", "Utkarsh", "Priya", "Tara", "Divya"
    ],
    English: [
      "Dhruv", "Vaanee", "Swastik", "Laksh", "Raag", "Sarvagya", "Tara", "Ruhi"
    ],
  };

  // Strip prefixes like "fonada-", "-hi", "-ta", "-te"
  const cleanInput = voiceName
    .replace(/^fonada-/i, "")
    .replace(/-(hi|ta|te|en|mr|in)$/i, "")
    .trim();

  const matched = validVoices[lang].find((v) => v.toLowerCase() === cleanInput.toLowerCase());

  return {
    language: lang,
    voice: matched || validVoices[lang][0] || "Dhruv",
  };
}

// FonadaLabs Indian Languages Text-To-Speech Generator (https://api.fonada.ai/tts/generate-audio-large)
async function generateFonadaAudio(
  text: string,
  voiceName: string,
  languageName: string,
  seriesId: string
): Promise<{ audioUrl: string; storagePath?: string; durationSeconds: number; format: string }> {
  const apiKey = process.env.FONADA_API_KEY || process.env.FONADALABS_API_KEY;
  const { voice: cleanVoice, language: cleanLanguage } = resolveFonadaParams(voiceName, languageName);
  const estimatedDuration = Math.max(30, Math.round(text.split(/\s+/).length / 2.5));
  const filename = `fonada-${seriesId}-${Date.now()}.wav`;

  if (!apiKey || apiKey.trim().length === 0 || apiKey.includes("placeholder")) {
    throw new Error("FONADA_API_KEY is missing in environment variables.");
  }

  try {
    const endpoint = "https://api.fonada.ai/tts/generate-audio-large";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
        voice: cleanVoice,
        language: cleanLanguage,
      }),
    });

    let audioBuffer: Buffer | null = null;

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer = Buffer.from(arrayBuffer);
    } else {
      const errBody = await response.text().catch(() => "");
      console.warn(
        `[FonadaLabs TTS] Synthesis failed for voice "${cleanVoice}" (${cleanLanguage}): ${errBody}. Retrying with default voice "Dhruv"...`
      );

      // Auto-retry with default "Dhruv" voice if custom voice fails
      const retryResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: text,
          voice: "Dhruv",
          language: cleanLanguage,
        }),
      });

      if (retryResponse.ok) {
        const arrayBuffer = await retryResponse.arrayBuffer();
        audioBuffer = Buffer.from(arrayBuffer);
      } else {
        const retryErr = await retryResponse.text().catch(() => "");
        throw new Error(
          `FonadaLabs TTS API returned HTTP error for ${cleanLanguage}: ${errBody || retryErr}`
        );
      }
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      throw new Error("FonadaLabs TTS returned empty audio payload.");
    }

    // Save audio file locally and upload to Supabase
    const localAudioDir = path.join(process.cwd(), "public", "audio");
    await ensureDirExists(localAudioDir);
    const filePath = path.join(localAudioDir, filename);
    await fs.promises.writeFile(filePath, audioBuffer);

    const supabaseResult = await uploadVoiceoverToSupabase(audioBuffer, filename, seriesId);

    return {
      audioUrl: supabaseResult?.publicUrl || `/audio/${filename}`,
      storagePath: supabaseResult?.storagePath,
      durationSeconds: estimatedDuration,
      format: "wav",
    };
  } catch (err: any) {
    throw new Error(`FonadaLabs TTS synthesis failed: ${err?.message}`);
  }
}

// Deepgram Speech-to-Text Caption & Word-level Timestamp Generator
async function generateDeepgramCaptions(
  audioUrl: string,
  scriptText: string,
  wordsPerBatch: number,
  durationSeconds: number,
  languageCode?: string
): Promise<{ words: SubtitleWord[]; batches: SubtitleBatch[]; transcript: string }> {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  let langParam = "detect_language=true";
  if (languageCode) {
    const l = languageCode.toLowerCase();
    if (l.startsWith("hi")) langParam = "language=hi";
    else if (l.startsWith("ta")) langParam = "language=ta";
    else if (l.startsWith("te")) langParam = "language=te";
    else if (l.startsWith("es")) langParam = "language=es";
    else if (l.startsWith("de")) langParam = "language=de";
    else if (l.startsWith("en")) langParam = "language=en";
  }

  if (apiKey && apiKey.trim().length > 0 && !apiKey.includes("placeholder")) {
    try {
      const endpoint = `https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&punctuate=true&utterances=true&${langParam}`;
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

/**
 * Resolves background music track from series metadata, uploads track to Supabase Storage,
 * and returns a guaranteed public HTTPS URL for Remotion video rendering.
 */
async function resolveBackgroundMusicUrl(
  bgMusicText?: string | null,
  bgMusicTracks?: string[] | null,
  seriesId?: string
): Promise<string | undefined> {
  if (!bgMusicText && (!bgMusicTracks || bgMusicTracks.length === 0)) {
    return undefined;
  }

  // 1. Direct HTTP URL
  if (bgMusicText && (bgMusicText.startsWith("http://") || bgMusicText.startsWith("https://"))) {
    return bgMusicText;
  }

  // 2. Identify track file name from series metadata
  let trackFileName = "dark-suspense-drone.mp3";
  const raw = `${bgMusicText || ""} ${(bgMusicTracks || []).join(" ")}`.toLowerCase();

  if (raw.includes("cyberpunk") || raw.includes("neon")) {
    trackFileName = "cyberpunk-neon-drive.mp3";
  } else if (raw.includes("lofi") || raw.includes("chill") || raw.includes("midnight")) {
    trackFileName = "lofi-midnight-chill.mp3";
  } else if (raw.includes("phonk") || raw.includes("drift") || raw.includes("aggressive")) {
    trackFileName = "aggressive-drift-phonk.mp3";
  } else if (raw.includes("epic") || raw.includes("orchestra") || raw.includes("cinematic")) {
    trackFileName = "epic-cinematic-orchestra.mp3";
  } else if (raw.includes("titan") || raw.includes("motivational") || raw.includes("rise")) {
    trackFileName = "titan-motivational-rise.mp3";
  } else if (raw.includes("dark") || raw.includes("suspense") || raw.includes("shadow")) {
    trackFileName = "dark-suspense-drone.mp3";
  }

  // 3. Upload track to Supabase Storage bucket 'audio' if not present, to ensure a public HTTPS URL
  try {
    const localMusicPath = path.join(process.cwd(), "public", "backgroundmusic", trackFileName);
    if (fs.existsSync(localMusicPath)) {
      const musicBuffer = await fs.promises.readFile(localMusicPath);
      const storagePath = `bg-music/${trackFileName}`;

      await supabase.storage
        .from("audio")
        .upload(storagePath, musicBuffer, {
          contentType: "audio/mpeg",
          upsert: true,
        });

      const { data: publicUrlData } = supabase.storage
        .from("audio")
        .getPublicUrl(storagePath);

      if (publicUrlData?.publicUrl) {
        console.log(`[Music Resolver] 🎵 Resolved background music CDN URL: ${publicUrlData.publicUrl} (Track: ${trackFileName})`);
        return publicUrlData.publicUrl;
      }
    }
  } catch (err: any) {
    console.warn("[Music Resolver] Supabase background music sync notice:", err?.message);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${appUrl}/backgroundmusic/${trackFileName}`;
}

// Scene Image Generator (Using OpenAI ChatGPT DALL-E 3 HD 4K & Replicate / Neural AI Image Synthesis)
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
  let generatorUsed = "none";

  // 1. Primary: OpenAI ChatGPT DALL-E 3 HD (https://platform.openai.com)
  const openaiApiKey = process.env.OPENAI_API_KEY?.trim();
  const imageQuality = process.env.IMAGE_QUALITY === "standard" ? "standard" : "hd";

  if (openaiApiKey && openaiApiKey.length > 10 && !openaiApiKey.includes("placeholder")) {
    console.log(`[Image Generator] 🎨 Generating Scene #${sceneIndex} using OpenAI DALL-E 3 (${imageQuality.toUpperCase()} 4K Quality)...`);
    try {
      // DALL-E 3 supports 1024x1792 (perfect 9:16 vertical aspect ratio for Shorts / Reels)
      const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `9:16 vertical portrait aspect ratio. Masterpiece cinematic photography, ultra high resolution 4K, photorealistic details, volumetric lighting, cinematic masterpiece: ${enrichedPrompt.slice(0, 3800)}`,
          n: 1,
          size: "1024x1792",
          quality: imageQuality,
          response_format: "b64_json",
        }),
      });

      if (openaiRes.ok) {
        const data = await openaiRes.json();
        const b64 = data?.data?.[0]?.b64_json;
        if (b64) {
          buffer = Buffer.from(b64, "base64");
          generatorUsed = `openai-dalle-3-${imageQuality}`;
          console.log(`[Image Generator] ✅ Scene #${sceneIndex} successfully generated with OpenAI DALL-E 3 HD (4K Quality)!`);
        }
      } else {
        const errText = await openaiRes.text();
        console.warn(`[Image Generator] OpenAI DALL-E 3 returned status ${openaiRes.status}:`, errText);

        // Fallback to DALL-E 2 if DALL-E 3 fails
        console.log(`[Image Generator] Trying OpenAI DALL-E 2 fallback for Scene #${sceneIndex}...`);
        const dalle2Res = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "dall-e-2",
            prompt: `Vertical portrait scene: ${enrichedPrompt.slice(0, 950)}`,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
          }),
        });

        if (dalle2Res.ok) {
          const d2Data = await dalle2Res.json();
          const d2B64 = d2Data?.data?.[0]?.b64_json;
          if (d2B64) {
            buffer = Buffer.from(d2B64, "base64");
            generatorUsed = "openai-dalle-2";
            console.log(`[Image Generator] ✅ Scene #${sceneIndex} generated with OpenAI DALL-E 2!`);
          }
        }
      }
    } catch (openaiErr: any) {
      console.warn(`[Image Generator] OpenAI API exception for Scene #${sceneIndex}:`, openaiErr?.message);
    }
  }

  // 2. Secondary: Replicate SDXL Lightning 9:16 (if configured)
  const replicateToken = process.env.REPLICATE_API_TOKEN?.trim();
  if (!buffer && replicateToken && replicateToken.length > 5 && !replicateToken.includes("placeholder")) {
    try {
      console.log(`[Image Generator] Generating Scene #${sceneIndex} using Replicate SDXL Lightning...`);
      const repRes = await fetch("https://api.replicate.com/v1/models/bytedance/sdxl-lightning-4step/predictions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${replicateToken}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify({
          input: {
            prompt: `${enrichedPrompt}, 9:16 vertical portrait, highly detailed`,
            width: 720,
            height: 1280,
            num_outputs: 1,
          },
        }),
      });

      if (repRes.ok) {
        const repData = await repRes.json();
        const outputUrl = Array.isArray(repData.output) ? repData.output[0] : repData.output;
        if (outputUrl && typeof outputUrl === "string") {
          const imgFetch = await fetch(outputUrl);
          if (imgFetch.ok) {
            const ab = await imgFetch.arrayBuffer();
            buffer = Buffer.from(ab);
            generatorUsed = "replicate-sdxl";
            console.log(`[Image Generator] ✅ Scene #${sceneIndex} generated with Replicate SDXL!`);
          }
        }
      }
    } catch (repErr: any) {
      console.warn(`[Image Generator] Replicate generation notice:`, repErr?.message);
    }
  }

  // 3. Tertiary: High-Resolution 9:16 Neural AI Image Synthesis
  if (!buffer) {
    try {
      console.log(`[Image Generator] Generating Scene #${sceneIndex} using Neural AI Image Synthesis...`);
      const seed = Math.floor(Math.random() * 1000000);
      const encodedPrompt = encodeURIComponent(
        `${enrichedPrompt}, 9:16 vertical portrait aspect ratio`
      );
      const aiSynthesisUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=720&height=1280&nologo=true&seed=${seed}`;

      const res = await fetch(aiSynthesisUrl);
      if (res.ok) {
        const ab = await res.arrayBuffer();
        buffer = Buffer.from(ab);
        generatorUsed = "neural-ai-synthesis";
      }
    } catch (err: any) {
      console.warn("AI scene image synthesis fetch failed:", err?.message);
    }
  }

  if (!buffer) {
    throw new Error(
      `Failed to generate image for Scene #${sceneIndex}. Please ensure your OPENAI_API_KEY is configured in .env.local (from https://platform.openai.com/api-keys).`
    );
  }

  // Save local copy to public/generated-images/
  await fs.promises.writeFile(localPath, buffer);

  // Upload directly to Supabase Storage bucket 'images'
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
        ["Hindi", "Tamil", "Telugu"].some((l) => language.toLowerCase().includes(l.toLowerCase()));

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
        audioData.durationSeconds || scriptData.targetDurationSeconds,
        seriesData.language_code || seriesData.language
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
        modelUsed: "openai-dalle-synthesis",
        generatedAt: new Date().toISOString(),
      };
    });

    // =========================================================================
    // STEP 6: Create Remotion Video Composition & Render MP4 via AWS Lambda
    // =========================================================================
    const remotionVideoData = await step.run("create-remotion-video", async (): Promise<RenderVideoResult> => {
      // Resolve background music track to public HTTPS CDN URL
      const resolvedBgMusicUrl = await resolveBackgroundMusicUrl(
        seriesData.bg_music,
        seriesData.bg_music_tracks,
        seriesData.id
      );
      const bgMusicVolume = (seriesData.bg_music_volume ?? 22) / 100;

      console.log(`[Remotion Video Composition] 🎬 Rendering video with ${imagesData.imageUrls.length} scenes, Voice: "${audioData.voiceName}", Music: "${seriesData.bg_music || "None"}" (${resolvedBgMusicUrl ? "Active @ " + Math.round(bgMusicVolume * 100) + "% vol" : "Disabled"})`);

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
        bgMusicUrl: resolvedBgMusicUrl,
        bgMusicVolume,
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
        metadata: {
          image_provider: "openai-dalle-3-hd",
          image_quality: process.env.IMAGE_QUALITY || "hd",
          script_provider: "google-gemini",
          voice_provider: audioData.provider,
          bg_music_track: seriesData.bg_music,
          bg_music_volume: seriesData.bg_music_volume ?? 22,
          caption_style: captionData.captionStyle,
        },
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
    // STEP 8: Sleep/Wait Until Exact Scheduled Publish Time (or Immediate for Test Execution)
    // =========================================================================
    const scheduleWaitResult = await step.run("wait-for-publish-schedule", async () => {
      const isImmediate = (event.data as any)?.immediateDispatch === true;
      const targetPublishIso = (event.data as any)?.targetPublishTime;

      let publishDate: Date;
      if (targetPublishIso) {
        publishDate = new Date(targetPublishIso);
      } else {
        // Calculate today's publish time from series publish_time (supports 24h & 12h)
        const [pubHours, pubMins] = parsePublishTimeToHoursMinutes(seriesData.publish_time);

        const now = new Date();
        publishDate = new Date(now);
        publishDate.setHours(pubHours, pubMins, 0, 0);

        // If today's publish time has already passed by more than 10 minutes and not immediate, schedule for tomorrow
        if (publishDate.getTime() < now.getTime() - 10 * 60 * 1000 && !isImmediate) {
          publishDate.setDate(publishDate.getDate() + 1);
        }
      }

      const msUntilPublish = publishDate.getTime() - Date.now();

      return {
        isImmediate,
        publishTime: seriesData.publish_time || "18:30",
        publishDate: publishDate.toISOString(),
        msUntilPublish,
        shouldSleep: !isImmediate && msUntilPublish > 10000,
      };
    });

    // Sleep until exact publish time if needed (e.g. video was pre-generated 2 hours early)
    if (scheduleWaitResult.shouldSleep) {
      console.log(
        `[Inngest Scheduler] Pre-generated reel 2 hours early. Sleeping until exact publish time: ${scheduleWaitResult.publishDate}`
      );
      await step.sleepUntil("wait-until-scheduled-publish-time", new Date(scheduleWaitResult.publishDate));
    }

    // =========================================================================
    // STEP 9: Dispatch to Configured Platforms (Email, YouTube, Instagram, TikTok)
    // =========================================================================
    const dispatchResults = await step.run("dispatch-to-all-configured-platforms", async () => {
      const targetUserId = userId || seriesData.user_id;
      const configuredChannels =
        seriesData.channels && Array.isArray(seriesData.channels) && seriesData.channels.length > 0
          ? seriesData.channels
          : ["email", "youtube", "instagram", "tiktok"];

      const publishPayload = {
        reelId: savedResult.reelId || reelId,
        seriesId: seriesData.id,
        userId: targetUserId,
        userEmail: (event.data as any)?.userEmail,
        videoTitle: scriptData.videoTitle,
        seriesTitle: seriesData.title,
        niche: seriesData.niche,
        hook: scriptData.hook,
        videoUrl: remotionVideoData.videoUrl || audioData.audioUrl,
        thumbnailUrl: imagesData.imageUrls[0],
        durationSeconds: audioData.durationSeconds || scriptData.targetDurationSeconds,
        voiceName: audioData.voiceName,
        captionStyle: captionData.captionStyle,
        targetChannels: configuredChannels,
      };

      const result = await dispatchAllConfiguredPlatforms(publishPayload);
      return result;
    });

    // =========================================================================
    // STEP 10: Mark Reel Published & Increment Series Stats in Supabase
    // =========================================================================
    const finalizationResult = await step.run("mark-reel-published-and-update-stats", async () => {
      const targetReelId = savedResult.reelId || reelId;

      // 1. Update reel status to 'published'
      if (targetReelId) {
        await supabase
          .from("reels")
          .update({
            status: "published",
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", targetReelId);
      }

      // 2. Increment published_videos on series
      await supabase
        .from("series")
        .update({
          published_videos: (seriesData.published_videos || 0) + 1,
          scheduled_videos: Math.max(0, (seriesData.scheduled_videos || 1) - 1),
          updated_at: new Date().toISOString(),
        })
        .eq("id", seriesData.id);

      return {
        reelId: targetReelId,
        seriesId: seriesData.id,
        status: "published",
        publishedAt: new Date().toISOString(),
        totalPublished: (seriesData.published_videos || 0) + 1,
      };
    });

    return {
      success: true,
      message: "Video Reel generated, scheduled, and dispatched to all configured platforms successfully!",
      seriesId: seriesData.id,
      series: seriesData,
      script: scriptData,
      audio: audioData,
      captions: captionData,
      images: imagesData,
      renderedVideo: remotionVideoData,
      saved: savedResult,
      schedule: scheduleWaitResult,
      dispatched: dispatchResults,
      final: finalizationResult,
    };
  }
);

/**
 * Helper to parse any publish_time format (24h "13:00", 12h "1:00 PM", "1pm", "09:30")
 */
export function parsePublishTimeToHoursMinutes(timeStr?: string | null): [number, number] {
  if (!timeStr) return [18, 30]; // default 6:30 PM

  const clean = timeStr.trim().toLowerCase();
  const isPM = clean.includes("pm");
  const isAM = clean.includes("am");

  const digits = clean.replace(/[^0-9:]/g, "").split(":");
  let hours = parseInt(digits[0], 10) || 0;
  let minutes = digits.length > 1 ? parseInt(digits[1], 10) || 0 : 0;

  if (isPM && hours < 12) {
    hours += 12;
  } else if (isAM && hours === 12) {
    hours = 0;
  }

  hours = Math.max(0, Math.min(23, hours));
  minutes = Math.max(0, Math.min(59, minutes));

  return [hours, minutes];
}

// =============================================================================
// 3. Daily Automated Background Cron Job (Runs every 15 mins to check active series)
// Evaluates active series and triggers video generation 2 hours before publish time
// =============================================================================
export const scheduleDailySeriesPublisher = inngest.createFunction(
  {
    id: "schedule-daily-series-publisher",
    name: "Schedule Daily Series Publisher",
    triggers: [
      { cron: "*/15 * * * *" }, // Runs every 15 minutes
      { event: "series/schedule.cron.check" }, // Manual / real-time trigger support
    ],
  },
  async ({ step }) => {
    const scheduledDispatches = await step.run("evaluate-and-dispatch-active-series", async () => {
      // 1. Fetch all active series
      const { data: activeSeries, error } = await supabase
        .from("series")
        .select("*")
        .eq("status", "active");

      if (error || !activeSeries || activeSeries.length === 0) {
        return {
          totalEvaluated: 0,
          dispatchedCount: 0,
          message: "No active series currently scheduled.",
        };
      }

      const now = new Date();
      const dispatchedSeries: Array<{
        seriesId: string;
        title: string;
        publishTime: string;
        generationWindow: string;
        targetPublishTime: string;
      }> = [];

      for (const series of activeSeries) {
        try {
          const [pubHours, pubMins] = parsePublishTimeToHoursMinutes(series.publish_time);

          // Target publish time today
          let targetPublish = new Date(now);
          targetPublish.setHours(pubHours, pubMins, 0, 0);

          // If today's publish time has already passed by more than 10 mins, target is tomorrow
          const hasPassedToday = targetPublish.getTime() < now.getTime() - 10 * 60 * 1000;
          if (hasPassedToday) {
            targetPublish.setDate(targetPublish.getDate() + 1);
          }

          const msUntilPublish = targetPublish.getTime() - now.getTime();
          // Generation is scheduled 2 hours (120 mins) before publish time
          const msUntilGeneration = msUntilPublish - 2 * 60 * 60 * 1000;

          // Generation is due if:
          // 1. We are within 15 minutes before generation time OR already in the 2-hour pre-generation window
          // 2. AND publish time is still in the future
          const isGenerationDue = msUntilPublish > 0 && msUntilGeneration <= 15 * 60 * 1000;

          if (isGenerationDue) {
            // Check if a reel was already generated for this series in the last 18 hours
            const eighteenHoursAgo = new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString();
            const { data: recentReels } = await supabase
              .from("reels")
              .select("id, created_at")
              .eq("series_id", series.id)
              .gte("created_at", eighteenHoursAgo)
              .limit(1);

            if (!recentReels || recentReels.length === 0) {
              console.log(
                `[Daily Cron Publisher] 🚀 Dispatched video generation for Series "${series.title}" (Publish time: ${series.publish_time || "18:30"}, Target: ${targetPublish.toISOString()})`
              );

              await inngest.send({
                name: "video/generate.reel",
                data: {
                  seriesId: series.id,
                  userId: series.user_id,
                  targetPublishTime: targetPublish.toISOString(),
                  immediateDispatch: false,
                  scheduledByCron: true,
                  triggeredAt: now.toISOString(),
                },
              });

              dispatchedSeries.push({
                seriesId: series.id,
                title: series.title,
                publishTime: series.publish_time || "18:30",
                generationWindow: msUntilGeneration <= 0 ? "Within 2h publish window (immediate generate)" : "2 hours before publish",
                targetPublishTime: targetPublish.toISOString(),
              });
            }
          }
        } catch (err: any) {
          console.warn(`[Daily Cron Publisher] Error evaluating series ${series.id}:`, err?.message);
        }
      }

      return {
        totalEvaluated: activeSeries.length,
        dispatchedCount: dispatchedSeries.length,
        dispatchedSeries,
        checkedAt: now.toISOString(),
      };
    });

    return {
      success: true,
      result: scheduledDispatches,
    };
  }
);


