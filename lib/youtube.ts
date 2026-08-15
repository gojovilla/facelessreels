/**
 * YouTube Data API v3 Publisher Module
 * Handles token auto-refresh, resumable video uploading, tags, titles, descriptions, and Shorts publishing.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://apxmdkzbgfooagqbgqdc.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export interface YouTubeUploadOptions {
  userId: string;
  videoUrl: string;
  title: string;
  description: string;
  tags?: string[];
  privacyStatus?: "public" | "private" | "unlisted";
  seriesTitle?: string;
  niche?: string;
}

export interface YouTubeUploadResult {
  success: boolean;
  published: boolean;
  videoId?: string;
  videoUrl?: string;
  channelName?: string;
  channelHandle?: string;
  publishedAt: string;
  message: string;
  error?: string;
  details?: Record<string, any>;
}

/**
 * Ensures we have a valid, unexpired Google OAuth access token.
 * If expired or expiring within 60s, automatically refreshes via refresh_token.
 */
export async function getValidYouTubeAccessToken(channel: any): Promise<string> {
  const now = new Date();
  const tokenExpiresAt = channel.token_expires_at ? new Date(channel.token_expires_at) : null;
  const isExpiredOrExpiring = !tokenExpiresAt || tokenExpiresAt.getTime() - now.getTime() < 60 * 1000;

  // If token is still valid, return it
  if (!isExpiredOrExpiring && channel.access_token) {
    return channel.access_token;
  }

  // If we have a refresh token, exchange it for a new access token
  if (channel.refresh_token) {
    const rawClientId = process.env.GOOGLE_CLIENT_ID;
    const rawClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const clientId = rawClientId ? rawClientId.replace(/\s+/g, "").trim() : "";
    const clientSecret = rawClientSecret ? rawClientSecret.replace(/\s+/g, "").trim() : "";

    if (!clientId || !clientSecret) {
      console.warn("[YouTube Publisher] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET for token refresh, using existing token");
      return channel.access_token;
    }

    console.log(`[YouTube Publisher] Refreshing expired access token for channel "${channel.channel_name}"...`);

    const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: channel.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      const newAccessToken = refreshData.access_token;
      const expiresIn = refreshData.expires_in || 3600;
      const newExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

      // Update in Supabase
      await supabase
        .from("channels")
        .update({
          access_token: newAccessToken,
          token_expires_at: newExpiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", channel.id);

      console.log("[YouTube Publisher] Access token successfully refreshed and updated in Supabase.");
      return newAccessToken;
    } else {
      const errText = await refreshRes.text();
      console.error("[YouTube Publisher] Token refresh failed:", errText);
    }
  }

  return channel.access_token;
}

/**
 * Uploads a video directly to YouTube using Google Data API v3 Resumable Upload protocol.
 */
export async function uploadVideoToYouTube(
  options: YouTubeUploadOptions
): Promise<YouTubeUploadResult> {
  const { userId, videoUrl, title, description, tags = [], privacyStatus = "public" } = options;

  // 1. Fetch connected YouTube channel for user
  const { data: channel, error: channelErr } = await supabase
    .from("channels")
    .select("*")
    .eq("user_id", userId)
    .eq("platform", "youtube")
    .eq("is_active", true)
    .limit(1)
    .single();

  if (channelErr || !channel) {
    return {
      success: false,
      published: false,
      publishedAt: new Date().toISOString(),
      message: "No active YouTube channel connected in Settings. Connect your YouTube account in Dashboard -> Settings.",
      error: "CHANNEL_NOT_CONNECTED",
    };
  }

  if (!channel.access_token && !channel.refresh_token) {
    return {
      success: false,
      published: false,
      publishedAt: new Date().toISOString(),
      message: `YouTube channel "${channel.channel_name}" is connected but has no OAuth tokens. Please re-authorize in Settings.`,
      error: "MISSING_OAUTH_TOKENS",
    };
  }

  try {
    // 2. Obtain valid access token
    const accessToken = await getValidYouTubeAccessToken(channel);

    // 3. Download the rendered video file from storage/CDN
    console.log(`[YouTube Publisher] Downloading video from ${videoUrl} for YouTube upload...`);
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video file from URL (${videoResponse.status} ${videoResponse.statusText})`);
    }

    const videoArrayBuffer = await videoResponse.arrayBuffer();
    const videoBuffer = Buffer.from(videoArrayBuffer);
    const videoSizeBytes = videoBuffer.length;

    console.log(`[YouTube Publisher] Downloaded video (${(videoSizeBytes / (1024 * 1024)).toFixed(2)} MB). Initiating YouTube upload...`);

    // Format title and tags for YouTube Shorts
    const formattedTitle = title.includes("#Shorts") ? title : `${title.slice(0, 80)} #Shorts`;
    const finalTags = Array.from(new Set([...tags, "Shorts", "shorts", "viral", "ai"]));

    // 4. Step 1 of Resumable Upload: Initiate session metadata
    const metadataPayload = {
      snippet: {
        title: formattedTitle,
        description: description || `${title}\n\nCreated with FacelessReels AI. #shorts #viral`,
        tags: finalTags,
        categoryId: "22", // People & Blogs / Entertainment
        defaultLanguage: "en",
      },
      status: {
        privacyStatus: privacyStatus,
        selfDeclaredMadeForKids: false,
        embeddable: true,
      },
    };

    const initUploadRes = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Type": "video/mp4",
          "X-Upload-Content-Length": videoSizeBytes.toString(),
        },
        body: JSON.stringify(metadataPayload),
      }
    );

    if (!initUploadRes.ok) {
      const errText = await initUploadRes.text();
      console.error("[YouTube Publisher] Failed to initiate YouTube upload session:", errText);
      throw new Error(`YouTube API upload session initiation failed: ${errText}`);
    }

    const uploadLocation = initUploadRes.headers.get("Location");
    if (!uploadLocation) {
      throw new Error("YouTube API did not return an upload session Location URL.");
    }

    // 5. Step 2 of Resumable Upload: Stream / PUT the binary video buffer
    console.log("[YouTube Publisher] Uploading video binary data to YouTube...");
    const uploadRes = await fetch(uploadLocation, {
      method: "PUT",
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": videoSizeBytes.toString(),
      },
      body: videoBuffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("[YouTube Publisher] YouTube binary upload failed:", errText);
      throw new Error(`YouTube video data upload failed: ${errText}`);
    }

    const uploadData = await uploadRes.json();
    const videoId = uploadData.id;
    const publishedShortsUrl = `https://youtube.com/shorts/${videoId}`;

    console.log(`[YouTube Publisher] 🎉 Video successfully published to YouTube! Video ID: ${videoId} (${publishedShortsUrl})`);

    return {
      success: true,
      published: true,
      videoId,
      videoUrl: publishedShortsUrl,
      channelName: channel.channel_name,
      channelHandle: channel.channel_handle,
      publishedAt: new Date().toISOString(),
      message: `Successfully uploaded to YouTube Shorts on channel "${channel.channel_name}"!`,
      details: {
        videoId,
        youtubeUrl: publishedShortsUrl,
        channelId: channel.id,
        channelName: channel.channel_name,
        channelHandle: channel.channel_handle,
        privacyStatus,
        uploadStatus: uploadData.status?.uploadStatus || "uploaded",
        rawResponse: uploadData,
      },
    };
  } catch (err: any) {
    console.error("[YouTube Publisher Error]:", err);
    return {
      success: false,
      published: false,
      channelName: channel?.channel_name,
      channelHandle: channel?.channel_handle,
      publishedAt: new Date().toISOString(),
      message: `YouTube upload failed: ${err?.message || "Unknown error"}`,
      error: err?.message || "UPLOAD_FAILED",
    };
  }
}

/**
 * Fetches real live video statistics (views, likes, comments) for given YouTube video IDs
 */
export async function fetchYouTubeVideoStats(
  videoIds: string[],
  channel: any
): Promise<Record<string, { views: number; likes: number; comments: number }>> {
  const result: Record<string, { views: number; likes: number; comments: number }> = {};
  if (!videoIds || videoIds.length === 0 || !channel) return result;

  try {
    const accessToken = await getValidYouTubeAccessToken(channel);
    const ids = videoIds.slice(0, 50).join(",");
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (res.ok) {
      const data = await res.json();
      for (const item of data.items || []) {
        result[item.id] = {
          views: parseInt(item.statistics?.viewCount || "0", 10),
          likes: parseInt(item.statistics?.likeCount || "0", 10),
          comments: parseInt(item.statistics?.commentCount || "0", 10),
        };
      }
    }
  } catch (err: any) {
    console.warn("[YouTube Publisher] Failed to fetch video stats:", err?.message);
  }

  return result;
}

/**
 * Fetches total channel statistics (views, subscribers, video count) from YouTube Data API
 */
export async function fetchYouTubeChannelStats(channel: any): Promise<{
  totalViews: number;
  subscribers: number;
  videoCount: number;
}> {
  try {
    const accessToken = await getValidYouTubeAccessToken(channel);
    const res = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const item = data.items?.[0];
      if (item) {
        const totalViews = parseInt(item.statistics?.viewCount || "0", 10);
        const subscribers = parseInt(item.statistics?.subscriberCount || "0", 10);
        const videoCount = parseInt(item.statistics?.videoCount || "0", 10);

        // Update in channels table
        await supabase
          .from("channels")
          .update({
            metadata: {
              ...(channel.metadata || {}),
              total_views: totalViews,
              subscribers,
              video_count: videoCount,
              last_synced_at: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          })
          .eq("id", channel.id);

        return { totalViews, subscribers, videoCount };
      }
    }
  } catch (err: any) {
    console.warn("[YouTube Publisher] Failed to fetch channel stats:", err?.message);
  }

  return { totalViews: 0, subscribers: 0, videoCount: 0 };
}
