import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/youtube
 * Initiates the Google / YouTube Data API v3 OAuth flow
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", "/dashboard/settings");
      return NextResponse.redirect(signInUrl);
    }

    const rawClientId = process.env.GOOGLE_CLIENT_ID;
    const clientId = rawClientId ? rawClientId.replace(/\s+/g, "").trim() : "";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const redirectUri = `${appUrl}/api/auth/youtube/callback`;

    // If Google Client ID is not configured yet in .env, redirect with guide indicator
    if (!clientId || clientId.length === 0 || clientId.includes("placeholder")) {
      const settingsUrl = new URL("/dashboard/settings", req.url);
      settingsUrl.searchParams.set("setup_youtube", "1");
      return NextResponse.redirect(settingsUrl);
    }

    const scopes = [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" ");

    // Google OAuth 2.0 Authorization Endpoint
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId.trim());
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", scopes);
    googleAuthUrl.searchParams.set("access_type", "offline"); // Crucial for getting refresh_token for background video uploads
    googleAuthUrl.searchParams.set("prompt", "consent");
    googleAuthUrl.searchParams.set("state", userId);

    return NextResponse.redirect(googleAuthUrl.toString());
  } catch (err: any) {
    console.error("[YouTube OAuth Init Error]:", err);
    return NextResponse.redirect(new URL("/dashboard/settings?error=oauth_init_failed", req.url));
  }
}
