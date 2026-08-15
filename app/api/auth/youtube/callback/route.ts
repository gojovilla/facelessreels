import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

/**
 * GET /api/auth/youtube/callback
 * Handles the Google OAuth callback, exchanges code for tokens,
 * fetches the real YouTube channel information, and persists to Supabase.
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const userId = searchParams.get("state");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const redirectUri = `${appUrl}/api/auth/youtube/callback`;

  if (error || !code || !userId) {
    console.error("[YouTube Callback Error]:", { error, codeExists: Boolean(code), userIdExists: Boolean(userId) });
    const errRedirect = new URL("/dashboard/settings", req.url);
    errRedirect.searchParams.set("error", error || "access_denied");
    return NextResponse.redirect(errRedirect);
  }

  try {
    const rawClientId = process.env.GOOGLE_CLIENT_ID;
    const rawClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const clientId = rawClientId ? rawClientId.replace(/\s+/g, "").trim() : "";
    const clientSecret = rawClientSecret ? rawClientSecret.replace(/\s+/g, "").trim() : "";

    if (!clientId || !clientSecret) {
      throw new Error("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing in environment variables.");
    }

    // 1. Exchange authorization code for access & refresh tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("[YouTube Token Exchange Failed]:", errText);
      throw new Error(`Token exchange failed: ${errText}`);
    }

    const tokenData = await tokenRes.json();
    const { access_token, refresh_token, expires_in, scope } = tokenData;

    // 2. Fetch authenticated YouTube Channel Profile
    let channelTitle = "My YouTube Channel";
    let channelHandle = "";
    let avatarUrl: string | null = null;
    let channelId = "";
    let subscriberCount = "0";
    let videoCount = "0";

    try {
      const ytRes = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "application/json",
          },
        }
      );

      if (ytRes.ok) {
        const ytData = await ytRes.json();
        const item = ytData.items?.[0];

        if (item) {
          channelTitle = item.snippet?.title || channelTitle;
          channelHandle = item.snippet?.customUrl || "";
          avatarUrl = item.snippet?.thumbnails?.default?.url || item.snippet?.thumbnails?.high?.url || null;
          channelId = item.id || "";
          subscriberCount = item.statistics?.subscriberCount || "0";
          videoCount = item.statistics?.videoCount || "0";
        }
      } else {
        console.warn("[YouTube API Notice] channels list returned non-200, using basic profile info");
      }
    } catch (ytErr) {
      console.warn("[YouTube API Info]:", ytErr);
    }

    // 3. Persist / Upsert into Supabase `public.channels`
    const { data: existing } = await supabase
      .from("channels")
      .select("id")
      .eq("user_id", userId)
      .eq("platform", "youtube")
      .limit(1);

    const payload = {
      user_id: userId,
      platform: "youtube",
      channel_name: channelTitle,
      channel_handle: channelHandle || undefined,
      avatar_url: avatarUrl,
      access_token: access_token,
      refresh_token: refresh_token || undefined,
      token_expires_at: new Date(Date.now() + (expires_in || 3600) * 1000).toISOString(),
      is_active: true,
      metadata: {
        channel_id: channelId,
        subscriber_count: subscriberCount,
        video_count: videoCount,
        scope,
        connected_via: "google_oauth_v3",
        verified: true,
        connected_at: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    };

    if (existing && existing.length > 0) {
      await supabase
        .from("channels")
        .update(payload)
        .eq("id", existing[0].id);
    } else {
      await supabase.from("channels").insert({
        ...payload,
        created_at: new Date().toISOString(),
      });
    }

    // 4. Redirect to Settings with success notification
    const successRedirect = new URL("/dashboard/settings", req.url);
    successRedirect.searchParams.set("connected", "youtube");
    successRedirect.searchParams.set("channel", encodeURIComponent(channelTitle));
    return NextResponse.redirect(successRedirect);
  } catch (err: any) {
    console.error("[YouTube Callback Exception]:", err);
    const errRedirect = new URL("/dashboard/settings", req.url);
    errRedirect.searchParams.set("error", encodeURIComponent(err?.message || "oauth_failed"));
    return NextResponse.redirect(errRedirect);
  }
}
