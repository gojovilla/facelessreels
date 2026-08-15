import { renderMediaOnLambda, getRenderProgress, AwsRegion } from "@remotion/lambda/client";
import { MainVideoReelProps } from "@/remotion/types";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import fs from "fs";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export interface RenderVideoResult {
  videoUrl: string;
  renderId: string;
  bucketName?: string;
  renderedVia: "aws-lambda" | "local-remotion-engine" | "cloud-renderer";
  durationSeconds: number;
}

// Check if AWS Lambda credentials are valid and provided
export function hasAwsLambdaConfigured(): boolean {
  const accessKey =
    process.env.REMOTION_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretKey =
    process.env.REMOTION_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME;
  const bucketName = process.env.REMOTION_LAMBDA_BUCKET_NAME;

  return !!(
    accessKey &&
    !accessKey.includes("placeholder") &&
    secretKey &&
    !secretKey.includes("placeholder") &&
    functionName &&
    bucketName
  );
}

// Upload local video buffer to Supabase Storage bucket 'renders'
async function uploadRenderedVideoToSupabase(
  buffer: Buffer,
  filename: string,
  seriesId: string
): Promise<{ publicUrl: string; storagePath: string }> {
  const storagePath = `${seriesId}/${filename}`;

  const { data, error } = await supabase.storage
    .from("renders")
    .upload(storagePath, buffer, {
      contentType: "video/mp4",
      upsert: true,
    });

  if (error) {
    // If 'renders' bucket not accessible, fallback to 'voiceovers' under renders/ prefix
    const { error: fbErr } = await supabase.storage
      .from("voiceovers")
      .upload(`renders/${storagePath}`, buffer, {
        contentType: "video/mp4",
        upsert: true,
      });

    if (fbErr) {
      throw new Error(`Failed to upload rendered video to Supabase: ${error.message}`);
    }

    const { data: fbUrl } = supabase.storage
      .from("voiceovers")
      .getPublicUrl(`renders/${storagePath}`);

    return { publicUrl: fbUrl.publicUrl, storagePath: `renders/${storagePath}` };
  }

  const { data: publicUrlData } = supabase.storage
    .from("renders")
    .getPublicUrl(storagePath);

  return {
    publicUrl: publicUrlData.publicUrl,
    storagePath,
  };
}

/**
 * Render Remotion Video Composition locally using standalone worker
 */
async function renderRemotionLocally(
  props: MainVideoReelProps,
  seriesId: string
): Promise<RenderVideoResult> {
  const renderId = `local-render-${Date.now()}`;
  const tmpDir = os.tmpdir();
  const propsFilePath = path.join(tmpDir, `remotion-props-${renderId}.json`);
  const outputMp4Path = path.join(tmpDir, `remotion-output-${renderId}.mp4`);

  try {
    fs.writeFileSync(propsFilePath, JSON.stringify(props), "utf-8");

    const scriptPath = path.resolve(process.cwd(), "scripts/render-remotion.js");
    console.log(`[Remotion Local Engine] Executing render script: ${scriptPath}`);

    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [scriptPath, propsFilePath, outputMp4Path],
      {
        timeout: 240000, // 4 minutes maximum
        maxBuffer: 50 * 1024 * 1024,
      }
    );

    console.log(`[Remotion Local Engine] Output:`, stdout);

    if (!fs.existsSync(outputMp4Path)) {
      throw new Error(`Render completed but MP4 output not found at ${outputMp4Path}. Stderr: ${stderr}`);
    }

    const mp4Buffer = fs.readFileSync(outputMp4Path);
    const filename = `rendered-reel-${seriesId}-${Date.now()}.mp4`;

    const uploadRes = await uploadRenderedVideoToSupabase(mp4Buffer, filename, seriesId);

    // Clean up temporary files
    try {
      if (fs.existsSync(propsFilePath)) fs.unlinkSync(propsFilePath);
      if (fs.existsSync(outputMp4Path)) fs.unlinkSync(outputMp4Path);
    } catch {}

    return {
      videoUrl: uploadRes.publicUrl,
      renderId,
      renderedVia: "local-remotion-engine",
      durationSeconds: props.durationInSeconds || 40,
    };
  } catch (err: any) {
    console.error("[Remotion Local Engine] Local render error:", err);
    throw err;
  }
}

/**
 * Render Remotion Video Composition into MP4 using AWS Lambda or Local Remotion Engine
 */
export async function renderRemotionVideo(
  props: MainVideoReelProps,
  seriesId: string
): Promise<RenderVideoResult> {
  const region = (process.env.REMOTION_AWS_REGION || process.env.AWS_REGION || "us-east-1") as AwsRegion;
  const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME || "";
  const bucketName = process.env.REMOTION_LAMBDA_BUCKET_NAME || "";
  const serveUrl = process.env.REMOTION_SERVE_URL || "";

  const durationInSeconds = Math.max(10, props.durationInSeconds || 40);
  const totalFrames = Math.ceil(durationInSeconds * (props.fps || 30));

  // 1. If AWS Lambda is fully configured, attempt render on AWS Lambda
  if (hasAwsLambdaConfigured() && serveUrl) {
    try {
      console.log(`[AWS Lambda] Initiating render for series: ${seriesId} on function: ${functionName}`);

      const render = await renderMediaOnLambda({
        region,
        functionName,
        serveUrl,
        composition: "FacelessVideoReel",
        inputProps: props as any,
        codec: "h264",
        imageFormat: "jpeg",
        maxRetries: 3,
        privacy: "public",
        outName: `reel-${seriesId}-${Date.now()}.mp4`,
      });

      console.log(`[AWS Lambda] Dispatched render job: ${render.renderId}`);

      // Poll until render is complete on AWS Lambda
      let isDone = false;
      let outputUrl = "";
      let attempts = 0;

      while (!isDone && attempts < 90) {
        attempts++;
        await new Promise((r) => setTimeout(r, 2500));

        const progress = await getRenderProgress({
          renderId: render.renderId,
          bucketName: render.bucketName,
          functionName,
          region,
        });

        if (progress.done) {
          isDone = true;
          outputUrl = progress.outputFile || "";
          console.log(`[AWS Lambda] Render finished! File: ${outputUrl}`);
        } else if (progress.fatalErrorEncountered) {
          throw new Error(
            `AWS Lambda Remotion render failed: ${progress.errors[0]?.message || "Unknown error"}`
          );
        }
      }

      if (outputUrl) {
        // Download and cache copy in Supabase Storage
        const res = await fetch(outputUrl);
        if (res.ok) {
          const ab = await res.arrayBuffer();
          const buffer = Buffer.from(ab);
          const filename = `rendered-lambda-${seriesId}-${Date.now()}.mp4`;
          const supabaseResult = await uploadRenderedVideoToSupabase(buffer, filename, seriesId);

          return {
            videoUrl: supabaseResult.publicUrl,
            renderId: render.renderId,
            bucketName: render.bucketName,
            renderedVia: "aws-lambda",
            durationSeconds: durationInSeconds,
          };
        }

        return {
          videoUrl: outputUrl,
          renderId: render.renderId,
          bucketName: render.bucketName,
          renderedVia: "aws-lambda",
          durationSeconds: durationInSeconds,
        };
      }
    } catch (lambdaErr: any) {
      console.warn("[AWS Lambda] AWS Lambda render notice (falling back to Local Remotion Engine):", lambdaErr?.message);
    }
  }

  // 2. High-Speed Remotion Engine (Generates real .mp4 video and uploads to Supabase)
  console.log(`[Remotion Engine] Rendering complete MP4 video locally for series: ${seriesId}`);
  return await renderRemotionLocally(props, seriesId);
}
