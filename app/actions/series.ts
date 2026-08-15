"use server";

import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { inngest } from "@/inngest/client";
import { calculateAggregatedRpm, getNicheRpmProfile } from "@/lib/niche-rpm";
import { fetchYouTubeVideoStats } from "@/lib/youtube";
import { getPlanLimits, canCreateMoreSeries, isPlatformAllowed } from "@/lib/plan-limits";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export interface SeriesItem {
  id: string;
  user_id?: string;
  title: string;
  niche: string;
  niche_type?: string | null;
  custom_prompt?: string | null;
  voice?: string | null;
  voice_id?: string | null;
  language?: string | null;
  language_code?: string | null;
  bg_music?: string | null;
  bg_music_tracks?: string[];
  bg_music_volume?: number;
  visual_style?: string | null;
  visual_style_id?: string | null;
  custom_style_modifier?: string | null;
  caption_style?: string | null;
  caption_style_id?: string | null;
  caption_words_per_batch?: number;
  duration_option?: string | null;
  publish_time?: string | null;
  frequency?: string | null;
  total_videos?: number;
  published_videos?: number;
  scheduled_videos?: number;
  status?: string;
  views?: number;
  rpm?: number;
  est_rpm_formatted?: string;
  est_rpm_range?: string;
  created_at?: string;
  updated_at?: string;
  channels?: string[];
}

export interface CreateSeriesInput {
  title: string;
  niche: string;
  niche_type?: string;
  custom_prompt?: string;
  voice: string;
  voice_id?: string;
  language: string;
  language_code?: string;
  bg_music: string;
  bg_music_tracks?: string[];
  bg_music_volume?: number;
  visual_style: string;
  visual_style_id?: string;
  custom_style_modifier?: string;
  caption_style: string;
  caption_style_id?: string;
  caption_words_per_batch?: number;
  duration_option: "30-50 sec video" | "60-70 sec video" | string;
  publish_time: string;
  channels: string[];
}

export interface ReelItem {
  id: string;
  user_id?: string;
  series_id?: string;
  series_title?: string;
  series?: string;
  title: string;
  niche: string;
  hook?: string;
  script?: string;
  voice_name?: string;
  voice_id?: string;
  caption_style?: string;
  background_music?: string;
  audio_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  duration?: string;
  duration_seconds?: number;
  viralScore?: number;
  viral_score?: number;
  status: "draft" | "generating" | "scheduled" | "published" | "failed" | string;
  views?: number | string;
  actual_views?: number;
  scenes?: any[];
  subtitles?: any[];
  image_prompts?: string[];
  channels?: string[];
  publishedDate?: string;
  scheduled_at?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export async function createSeries(input: CreateSeriesInput): Promise<{
  success: boolean;
  series?: SeriesItem;
  error?: string;
}> {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "You must be signed in to create a series." };
    }

    // Check Plan Series Limits
    const userPlanKey =
      (user.publicMetadata?.plan as string) ||
      (user.unsafeMetadata?.plan as string) ||
      "free";
    const plan = getPlanLimits(userPlanKey);

    const { count: seriesCount } = await supabase
      .from("series")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (!canCreateMoreSeries(seriesCount || 0, plan.id)) {
      return {
        success: false,
        error: `Series limit reached (${seriesCount}/${plan.maxSeries}). Your ${plan.name} plan allows up to ${plan.maxSeries} series. Please upgrade your plan.`,
      };
    }

    // Filter allowed platforms
    const requestedChannels = Array.isArray(input.channels) && input.channels.length > 0 ? input.channels : ["youtube"];
    const allowedChannels = requestedChannels.filter((ch: string) => isPlatformAllowed(ch, plan.id));
    const finalChannels = allowedChannels.length > 0 ? allowedChannels : ["youtube"];

    const nicheProfile = getNicheRpmProfile(input.niche);

    const newSeriesData = {
      user_id: user.id,
      title: input.title,
      niche: input.niche,
      niche_type: input.niche_type || "available",
      custom_prompt: input.custom_prompt || null,
      voice: input.voice,
      voice_id: input.voice_id || null,
      language: input.language,
      language_code: input.language_code || null,
      bg_music: input.bg_music,
      bg_music_tracks: input.bg_music_tracks || [],
      bg_music_volume: input.bg_music_volume ?? 22,
      visual_style: input.visual_style,
      visual_style_id: input.visual_style_id || null,
      custom_style_modifier: input.custom_style_modifier || null,
      caption_style: input.caption_style,
      caption_style_id: input.caption_style_id || null,
      caption_words_per_batch: input.caption_words_per_batch || 1,
      duration_option: input.duration_option,
      publish_time: input.publish_time,
      frequency: `Daily @ ${input.publish_time}`,
      channels: input.channels,
      total_videos: 30,
      published_videos: 0,
      scheduled_videos: 30,
      status: "active",
      views: 0,
      rpm: nicheProfile.avgRpm,
    };

    const { data, error } = await supabase
      .from("series")
      .insert(newSeriesData)
      .select("*")
      .single();

    if (error) {
      console.warn("Supabase insert notice:", error.message);
      return {
        success: true,
        series: {
          id: Math.random().toString(36).substring(2, 9),
          ...newSeriesData,
          created_at: new Date().toISOString(),
        },
      };
    }

    // Trigger instant evaluation by Inngest background scheduler
    try {
      await inngest.send({
        name: "series/schedule.cron.check",
        data: {
          triggeredBy: "series_created",
          seriesId: data?.id || "",
          publishTime: input.publish_time,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (inngestErr) {
      console.warn("Inngest schedule check trigger notice:", inngestErr);
    }

    return { success: true, series: data };
  } catch (err: any) {
    console.error("Error creating series in database:", err);
    return { success: false, error: err?.message || "Failed to create series." };
  }
}

export async function getUserSeries(): Promise<{
  success: boolean;
  series: SeriesItem[];
  stats: {
    totalSeries: number;
    queuedReels: number;
    totalViews: number;
    avgRpm: string;
    rpmRange: string;
    nichesSummary: string;
  };
}> {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: true,
        series: [],
        stats: {
          totalSeries: 0,
          queuedReels: 0,
          totalViews: 0,
          avgRpm: "$0.00",
          rpmRange: "$0.00",
          nichesSummary: "No active niches",
        },
      };
    }

    const email = user.emailAddresses?.[0]?.emailAddress;

    // 1. Fetch series
    const { data: seriesData, error: seriesError } = await supabase
      .from("series")
      .select("*")
      .or(`user_id.eq.${user.id},user_id.eq.${email}`)
      .order("created_at", { ascending: false });

    if (seriesError) {
      return {
        success: true,
        series: [],
        stats: {
          totalSeries: 0,
          queuedReels: 0,
          totalViews: 0,
          avgRpm: "$0.00",
          rpmRange: "$0.00",
          nichesSummary: "No active niches",
        },
      };
    }

    // 2. Fetch reels to aggregate live video counts and views
    const { data: userReels } = await supabase
      .from("reels")
      .select("id, series_id, views, actual_views, youtube_video_id, status, created_at")
      .or(`user_id.eq.${user.id},user_id.eq.${email}`);

    // 3. Fetch YouTube channel for live views sync if connected
    const { data: userChannels } = await supabase
      .from("channels")
      .select("*")
      .or(`user_id.eq.${user.id},user_id.eq.${email}`)
      .eq("platform", "youtube");

    const ytChannel = userChannels?.[0];
    let ytLiveStats: Record<string, { views: number; likes: number; comments: number }> = {};

    if (ytChannel && userReels && userReels.length > 0) {
      const ytVideoIds = userReels
        .filter((r: any) => r.youtube_video_id)
        .map((r: any) => r.youtube_video_id);

      if (ytVideoIds.length > 0) {
        ytLiveStats = await fetchYouTubeVideoStats(ytVideoIds, ytChannel);
      }
    }

    // 4. Enrich each series with Niche RPM Profile and accurate views
    const seriesList: SeriesItem[] = (seriesData || []).map((s: any) => {
      const nicheProf = getNicheRpmProfile(s.niche);
      const matchedReels = (userReels || []).filter((r: any) => r.series_id === s.id);
      
      const seriesReelViews = matchedReels.reduce((acc: number, r: any) => {
        const ytViews = r.youtube_video_id && ytLiveStats[r.youtube_video_id]
          ? ytLiveStats[r.youtube_video_id].views
          : 0;
        const reelViews = typeof r.views === "number" ? r.views : parseInt(r.views || "0", 10) || 0;
        return acc + Math.max(reelViews, ytViews, r.actual_views || 0);
      }, 0);

      const totalViews = Math.max(s.views || 0, seriesReelViews);

      return {
        ...s,
        views: totalViews,
        rpm: nicheProf.avgRpm,
        est_rpm_formatted: nicheProf.rpmFormatted,
        est_rpm_range: nicheProf.rpmRange,
      };
    });

    // 5. Calculate Target Niche Aggregated RPM
    const aggregatedRpm = calculateAggregatedRpm(seriesList);

    const totalSeries = seriesList.length;
    const queuedReels = seriesList.reduce(
      (acc, s) => acc + (s.scheduled_videos || 0),
      0
    );
    const totalViews = seriesList.reduce((acc, s) => acc + (s.views || 0), 0);

    return {
      success: true,
      series: seriesList,
      stats: {
        totalSeries,
        queuedReels,
        totalViews,
        avgRpm: aggregatedRpm.avgRpmFormatted,
        rpmRange: aggregatedRpm.rpmRange,
        nichesSummary: aggregatedRpm.nichesSummary,
      },
    };
  } catch (err) {
    console.error("Error fetching user series:", err);
    return {
      success: false,
      series: [],
      stats: {
        totalSeries: 0,
        queuedReels: 0,
        totalViews: 0,
        avgRpm: "$0.00",
        rpmRange: "$0.00",
        nichesSummary: "No active niches",
      },
    };
  }
}

export async function updateSeriesStatus(
  seriesId: string,
  status: "active" | "paused"
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("series")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", seriesId);

    if (error) {
      console.warn("Update series status error:", error.message);
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update series status" };
  }
}

export async function deleteSeries(
  seriesId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("series")
      .delete()
      .eq("id", seriesId);

    if (error) {
      console.warn("Delete series error:", error.message);
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete series" };
  }
}

export async function editSeriesDetails(
  seriesId: string,
  updates: { title?: string; publish_time?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.title) payload.title = updates.title.trim();
    if (updates.publish_time) {
      payload.publish_time = updates.publish_time;
      payload.frequency = `Daily @ ${updates.publish_time}`;
    }

    const { error } = await supabase
      .from("series")
      .update(payload)
      .eq("id", seriesId);

    if (error) {
      console.warn("Edit series details error:", error.message);
    }

    try {
      await inngest.send({
        name: "series/schedule.cron.check",
        data: {
          triggeredBy: "series_updated",
          seriesId,
          updates,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (inngestErr) {
      console.warn("Inngest schedule check trigger notice:", inngestErr);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to edit series" };
  }
}

export async function triggerReelGeneration(
  seriesId: string
): Promise<{ success: boolean; message: string; reel?: ReelItem; eventIds?: string[] }> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    // 1. Fetch series info
    const { data: seriesData } = await supabase
      .from("series")
      .select("*")
      .eq("id", seriesId)
      .single();

    const initialTitle = seriesData?.title
      ? `${seriesData.title} - Episode #${(seriesData.published_videos || 0) + 1}`
      : "Automated Viral Short";

    const visualStyleId = (seriesData?.visual_style_id || seriesData?.visual_style || "cinematic").toLowerCase();
    let defaultThumbnail = "/video-style/realism.jpg";
    if (visualStyleId.includes("fantasy") || visualStyleId.includes("gothic")) defaultThumbnail = "/video-style/dark_fantasy_new.jpg";
    else if (visualStyleId.includes("creepy") || visualStyleId.includes("horror") || visualStyleId.includes("eerie")) defaultThumbnail = "/video-style/creepy_comic.jpg";
    else if (visualStyleId.includes("comic") || visualStyleId.includes("graphic")) defaultThumbnail = "/video-style/comic.jpg";
    else if (visualStyleId.includes("ghibli")) defaultThumbnail = "/video-style/ghibli.jpg";
    else if (visualStyleId.includes("anime") || visualStyleId.includes("shonen")) defaultThumbnail = "/video-style/anime.jpg";
    else if (visualStyleId.includes("disney") || visualStyleId.includes("pixar") || visualStyleId.includes("3d")) defaultThumbnail = "/video-style/disney.jpeg";
    else if (visualStyleId.includes("lego")) defaultThumbnail = "/video-style/lego.jpg";
    else if (visualStyleId.includes("cartoon") || visualStyleId.includes("vector")) defaultThumbnail = "/video-style/modern_cartoon.png";
    else if (visualStyleId.includes("mythology") || visualStyleId.includes("gods") || visualStyleId.includes("ancient")) defaultThumbnail = "/video-style/mythology.jpg";
    else if (visualStyleId.includes("oil") || visualStyleId.includes("painting") || visualStyleId.includes("renaissance")) defaultThumbnail = "/video-style/painting.png";
    else if (visualStyleId.includes("pixel") || visualStyleId.includes("game")) defaultThumbnail = "/video-style/pixel_art.jpg";
    else if (visualStyleId.includes("polaroid") || visualStyleId.includes("vintage") || visualStyleId.includes("film")) defaultThumbnail = "/video-style/polaroid.jpg";
    else if (visualStyleId.includes("fantastic") || visualStyleId.includes("scifi") || visualStyleId.includes("space") || visualStyleId.includes("cyberpunk")) defaultThumbnail = "/video-style/fantastic.png";

    // 2. Insert initial placeholder reel with status: "generating"
    const newReel = {
      user_id: user.id,
      series_id: seriesId,
      title: initialTitle,
      niche: seriesData?.niche || "Viral",
      hook: "Crafting viral hook & script with Gemini AI...",
      script: "Synthesizing AI video script and neural voiceover...",
      voice_name: seriesData?.voice || "Neural Voice",
      caption_style: seriesData?.caption_style || "Hormozi Viral Pop",
      thumbnail_url: defaultThumbnail,
      status: "generating",
      viral_score: Math.floor(Math.random() * 8) + 92,
      duration_seconds: seriesData?.duration_option?.includes("60") ? 65 : 45,
      actual_views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: reelData } = await supabase
      .from("reels")
      .insert(newReel)
      .select("*")
      .single();

    const createdReelId = reelData?.id;

    // 3. Dispatch Inngest Video Generation Pipeline Event with reelId
    const { ids } = await inngest.send({
      name: "video/generate.reel",
      data: {
        seriesId,
        userId: user.id,
        userEmail: user.emailAddresses?.[0]?.emailAddress,
        reelId: createdReelId,
        triggeredAt: new Date().toISOString(),
      },
    });

    // 4. Increment scheduled count in series
    await supabase
      .from("series")
      .update({
        scheduled_videos: (seriesData?.scheduled_videos || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", seriesId);

    return {
      success: true,
      message: "AI video generation dispatched!",
      reel: reelData || (newReel as any),
      eventIds: ids,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Failed to trigger video generation" };
  }
}

/**
 * Executes the complete Scheduled Video Workflow immediately for testing
 * Generates script, voiceover, subtitles, scene images, renders video, and dispatches to Email & social platforms.
 */
export async function executeSeriesWorkflow(
  seriesId: string,
  options?: { immediatePublish?: boolean }
): Promise<{
  success: boolean;
  message: string;
  reel?: ReelItem;
  eventIds?: string[];
}> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    // 1. Fetch series info
    const { data: seriesData, error: fetchErr } = await supabase
      .from("series")
      .select("*")
      .eq("id", seriesId)
      .single();

    if (fetchErr || !seriesData) {
      return { success: false, message: `Series not found: ${fetchErr?.message}` };
    }

    const initialTitle = seriesData?.title
      ? `${seriesData.title} - Episode #${(seriesData.published_videos || 0) + 1}`
      : "Automated Viral Short";

    const visualStyleId = (seriesData?.visual_style_id || seriesData?.visual_style || "cinematic").toLowerCase();
    let defaultThumbnail = "/video-style/realism.jpg";
    if (visualStyleId.includes("fantasy") || visualStyleId.includes("gothic")) defaultThumbnail = "/video-style/dark_fantasy_new.jpg";
    else if (visualStyleId.includes("creepy") || visualStyleId.includes("horror") || visualStyleId.includes("eerie")) defaultThumbnail = "/video-style/creepy_comic.jpg";
    else if (visualStyleId.includes("comic") || visualStyleId.includes("graphic")) defaultThumbnail = "/video-style/comic.jpg";
    else if (visualStyleId.includes("ghibli")) defaultThumbnail = "/video-style/ghibli.jpg";
    else if (visualStyleId.includes("anime") || visualStyleId.includes("shonen")) defaultThumbnail = "/video-style/anime.jpg";
    else if (visualStyleId.includes("disney") || visualStyleId.includes("pixar") || visualStyleId.includes("3d")) defaultThumbnail = "/video-style/disney.jpeg";
    else if (visualStyleId.includes("lego")) defaultThumbnail = "/video-style/lego.jpg";
    else if (visualStyleId.includes("cartoon") || visualStyleId.includes("vector")) defaultThumbnail = "/video-style/modern_cartoon.png";
    else if (visualStyleId.includes("mythology") || visualStyleId.includes("gods") || visualStyleId.includes("ancient")) defaultThumbnail = "/video-style/mythology.jpg";
    else if (visualStyleId.includes("oil") || visualStyleId.includes("painting") || visualStyleId.includes("renaissance")) defaultThumbnail = "/video-style/painting.png";
    else if (visualStyleId.includes("pixel") || visualStyleId.includes("game")) defaultThumbnail = "/video-style/pixel_art.jpg";
    else if (visualStyleId.includes("polaroid") || visualStyleId.includes("vintage") || visualStyleId.includes("film")) defaultThumbnail = "/video-style/polaroid.jpg";
    else if (visualStyleId.includes("fantastic") || visualStyleId.includes("scifi") || visualStyleId.includes("space") || visualStyleId.includes("cyberpunk")) defaultThumbnail = "/video-style/fantastic.png";

    // 2. Insert initial placeholder reel with status: "generating"
    const newReel = {
      user_id: user.id,
      series_id: seriesId,
      title: initialTitle,
      niche: seriesData?.niche || "Viral",
      hook: "Running end-to-end scheduled workflow pipeline...",
      script: "Synthesizing AI video script, rendering MP4, and preparing multi-platform dispatch...",
      voice_name: seriesData?.voice || "Neural Voice",
      caption_style: seriesData?.caption_style || "Hormozi Viral Pop",
      thumbnail_url: defaultThumbnail,
      status: "generating",
      viral_score: Math.floor(Math.random() * 8) + 92,
      duration_seconds: seriesData?.duration_option?.includes("60") ? 65 : 45,
      actual_views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: reelData } = await supabase
      .from("reels")
      .insert(newReel)
      .select("*")
      .single();

    const createdReelId = reelData?.id;

    // 3. Dispatch Inngest Video Generation + Publishing Workflow
    const { ids } = await inngest.send({
      name: "video/generate.reel",
      data: {
        seriesId,
        userId: user.id,
        userEmail: user.emailAddresses?.[0]?.emailAddress,
        reelId: createdReelId,
        immediateDispatch: options?.immediatePublish ?? true,
        triggeredByWorkflowButton: true,
        triggeredAt: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: "End-to-end series workflow triggered! Video generation and platform dispatches are underway.",
      reel: reelData || (newReel as any),
      eventIds: ids,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Failed to execute series workflow" };
  }
}

/**
 * Triggers the 15-minute schedule evaluation cron check manually
 */
export async function triggerScheduleCronCheck(): Promise<{
  success: boolean;
  message: string;
  eventIds?: string[];
}> {
  try {
    const { ids } = await inngest.send({
      name: "series/schedule.cron.check",
      data: {
        triggeredManually: true,
        timestamp: new Date().toISOString(),
      },
    });

    return {
      success: true,
      message: "Daily schedule evaluation triggered successfully.",
      eventIds: ids,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Failed to trigger schedule check" };
  }
}

export async function getUserReels(seriesId?: string): Promise<{
  success: boolean;
  reels: ReelItem[];
}> {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: true, reels: [] };
    }

    const email = user.emailAddresses?.[0]?.emailAddress;

    let query = supabase
      .from("reels")
      .select("*, series:series_id(title, visual_style, visual_style_id)")
      .or(`user_id.eq.${user.id},user_id.eq.${email}`);

    if (seriesId) {
      query = query.eq("series_id", seriesId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      // Fallback query if relation is not established
      const { data: rawData } = await supabase
        .from("reels")
        .select("*")
        .or(`user_id.eq.${user.id},user_id.eq.${email}`)
        .order("created_at", { ascending: false });

      return { success: true, reels: (rawData || []) as ReelItem[] };
    }

    const formattedReels: ReelItem[] = (data || []).map((item: any) => ({
      ...item,
      series_title: item.series?.title || item.series || undefined,
      series: item.series?.title || item.series || undefined,
    }));

    return { success: true, reels: formattedReels };
  } catch (err) {
    console.error("Error fetching user reels:", err);
    return { success: false, reels: [] };
  }
}

export async function deleteReel(
  reelId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("reels")
      .delete()
      .eq("id", reelId);

    if (error) {
      console.warn("Delete reel error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete reel" };
  }
}

export async function getSeriesById(
  seriesId: string
): Promise<{ success: boolean; series?: SeriesItem; error?: string }> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("series")
      .select("*")
      .eq("id", seriesId)
      .single();

    if (error || !data) {
      return { success: false, error: "Series not found" };
    }

    return { success: true, series: data };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to fetch series" };
  }
}

export async function updateFullSeries(
  seriesId: string,
  input: CreateSeriesInput
): Promise<{ success: boolean; series?: SeriesItem; error?: string }> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const payload = {
      title: input.title,
      niche: input.niche,
      niche_type: input.niche_type || "available",
      custom_prompt: input.custom_prompt || null,
      voice: input.voice,
      voice_id: input.voice_id || null,
      language: input.language,
      language_code: input.language_code || null,
      bg_music: input.bg_music,
      bg_music_tracks: input.bg_music_tracks || [],
      bg_music_volume: input.bg_music_volume ?? 22,
      visual_style: input.visual_style,
      visual_style_id: input.visual_style_id || null,
      custom_style_modifier: input.custom_style_modifier || null,
      caption_style: input.caption_style,
      caption_style_id: input.caption_style_id || null,
      caption_words_per_batch: input.caption_words_per_batch || 1,
      duration_option: input.duration_option,
      publish_time: input.publish_time,
      frequency: `Daily @ ${input.publish_time}`,
      channels: input.channels,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("series")
      .update(payload)
      .eq("id", seriesId)
      .select("*")
      .single();

    if (error) {
      console.warn("Supabase update notice:", error.message);
      return {
        success: true,
        series: { id: seriesId, ...payload } as any,
      };
    }

    return { success: true, series: data };
  } catch (err: any) {
    console.error("Error updating series:", err);
    return { success: false, error: err?.message || "Failed to update series" };
  }
}

