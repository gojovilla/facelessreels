import Plunk from "@plunk/node";
import { createClerkClient } from "@clerk/backend";

// Initialize Plunk client lazily
function getPlunkClient(): { client: Plunk | null; isPublicKey: boolean } {
  const apiKey = process.env.PLUNK_API_KEY || process.env.NEXT_PUBLIC_PLUNK_API_KEY;
  if (!apiKey || apiKey === "your_plunk_api_key_here") {
    return { client: null, isPublicKey: false };
  }

  // Check if user accidentally supplied a Public API Key (starts with pk_)
  if (apiKey.startsWith("pk_")) {
    console.warn(
      "[Plunk Warning] You supplied a Public API Key (pk_...). Sending transactional emails requires a Secret API Key (starts with sk_...). Get it from https://useplunk.com -> Project Settings -> API Keys."
    );
    return { client: null, isPublicKey: true };
  }

  return { client: new Plunk(apiKey), isPublicKey: false };
}

export interface VideoReadyEmailParams {
  to: string;
  recipientName?: string;
  videoTitle: string;
  seriesTitle?: string;
  niche?: string;
  hook?: string;
  durationSeconds?: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  reelId?: string;
  appUrl?: string;
  voiceName?: string;
  captionStyle?: string;
}

/**
 * Generate a responsive, ultra-premium HTML email template for video completion notifications
 */
export function generateVideoReadyEmailHtml(params: VideoReadyEmailParams): string {
  const appUrl = params.appUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const watchUrl = `${appUrl}/dashboard/videos?reelId=${params.reelId || ""}`;
  const downloadUrl = params.videoUrl || watchUrl;
  const currentYear = new Date().getFullYear();
  const duration = params.durationSeconds ? `${Math.round(params.durationSeconds)}s` : "40s";
  const recipientName = params.recipientName || "Creator";

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Your AI Video is Ready! 🎬</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #070913; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; }
    
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
      .button-full { width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #070913; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- PREHEADER TEXT (Invisible preview in inbox) -->
  <div style="display: none; font-size: 1px; color: #070913; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    🎬 Your viral video "${params.videoTitle}" has been generated, rendered in 1080x1920 HD, and is ready for publishing!
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #070913; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 32px 12px;">
        
        <!-- MAIN WRAPPER CONTAINER -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="container" style="max-width: 600px; background-color: #0d1020; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.12); overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);">
          
          <!-- TOP GRADIENT ACCENT BAR -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #9333ea 0%, #3b82f6 50%, #06b6d4 100%); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- HEADER SECTION (LOGO + BADGE) -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, #7e22ce, #3b82f6); border-radius: 10px; width: 36px; height: 36px; text-align: center; vertical-align: middle;">
                          <span style="font-size: 18px; line-height: 36px; color: #ffffff;">⚡</span>
                        </td>
                        <td style="padding-left: 12px;">
                          <span style="font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">FacelessReels<span style="color: #a855f7;">.ai</span></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="background-color: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.35); color: #c084fc; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Video Ready
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO BANNER -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: center;" class="mobile-padding">
              <div style="display: inline-block; background-color: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 50px; padding: 6px 14px; margin-bottom: 16px;">
                <span style="color: #4ade80; font-size: 12px; font-weight: 700;">✅ Generation &amp; 1080x1920 MP4 Render Complete</span>
              </div>
              <h1 style="margin: 0 0 10px 0; font-size: 26px; font-weight: 800; color: #ffffff; line-height: 1.25; letter-spacing: -0.5px;">
                Your AI Video Reel is Ready! 🎬
              </h1>
              <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                Hey <strong style="color: #f1f5f9;">${recipientName}</strong>, your new high-retention automated short has been generated with AI narration, synchronized animated captions, and dynamic visuals.
              </p>
            </td>
          </tr>

          <!-- VIDEO THUMBNAIL PREVIEW CARD -->
          <tr>
            <td style="padding: 10px 32px 24px 32px;" class="mobile-padding" align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #12162b; border-radius: 18px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden;">
                ${
                  params.thumbnailUrl
                    ? `
                <tr>
                  <td align="center" style="padding: 16px 16px 8px 16px;">
                    <a href="${watchUrl}" target="_blank" style="text-decoration: none; display: block; position: relative;">
                      <img src="${params.thumbnailUrl}" alt="${params.videoTitle}" width="240" style="width: 100%; max-width: 240px; height: auto; aspect-ratio: 9/16; border-radius: 14px; object-fit: cover; border: 1px solid rgba(255, 255, 255, 0.15); display: block; margin: 0 auto; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);" />
                    </a>
                  </td>
                </tr>
                `
                    : ""
                }
                
                <!-- VIDEO TITLE & SERIES INFO -->
                <tr>
                  <td style="padding: 16px 20px 20px 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td>
                          <span style="font-size: 11px; font-weight: 700; color: #a855f7; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${params.seriesTitle || params.niche || "Automated Series"}
                          </span>
                          <h3 style="margin: 4px 0 10px 0; font-size: 17px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                            ${params.videoTitle}
                          </h3>
                        </td>
                      </tr>
                      
                      ${
                        params.hook
                          ? `
                      <tr>
                        <td style="background-color: rgba(168, 85, 247, 0.1); border-left: 3px solid #a855f7; padding: 10px 14px; border-radius: 8px; margin-bottom: 12px;">
                          <span style="font-size: 10px; font-weight: 700; color: #c084fc; text-transform: uppercase;">⚡ 3-Second Viral Hook:</span>
                          <p style="margin: 4px 0 0 0; font-size: 13px; color: #e2e8f0; font-style: italic; line-height: 1.4;">
                            &ldquo;${params.hook}&rdquo;
                          </p>
                        </td>
                      </tr>
                      `
                          : ""
                      }

                      <!-- METADATA CHIPS TABLE -->
                      <tr>
                        <td style="padding-top: 14px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="padding: 6px 0; font-size: 12px; color: #94a3b8; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                ⏱️ <strong>Duration:</strong> ${duration}
                              </td>
                              <td style="padding: 6px 0; font-size: 12px; color: #94a3b8; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: right;">
                                🎙️ <strong>Voice:</strong> ${params.voiceName || "Deepgram Neural"}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; font-size: 12px; color: #94a3b8;">
                                ✨ <strong>Captions:</strong> ${params.captionStyle || "Hormozi Pop"}
                              </td>
                              <td style="padding: 6px 0; font-size: 12px; color: #94a3b8; text-align: right;">
                                📐 <strong>Format:</strong> 9:16 Vertical HD
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- PRIMARY CALL-TO-ACTION BUTTONS -->
          <tr>
            <td style="padding: 8px 32px 32px 32px;" class="mobile-padding" align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <!-- WATCH BUTTON -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="background: linear-gradient(135deg, #9333ea 0%, #6366f1 100%); border-radius: 14px; box-shadow: 0 8px 24px rgba(147, 51, 234, 0.35);">
                          <a href="${watchUrl}" target="_blank" style="display: block; padding: 15px 24px; font-size: 15px; font-weight: 700; color: #ffffff; text-decoration: none; text-align: center; letter-spacing: -0.2px;">
                            ▶ Watch Video in Studio &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${
                  params.videoUrl
                    ? `
                <tr>
                  <td align="center">
                    <!-- DOWNLOAD MP4 BUTTON -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="background-color: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 14px;">
                          <a href="${downloadUrl}" target="_blank" download style="display: block; padding: 13px 24px; font-size: 14px; font-weight: 600; color: #38bdf8; text-decoration: none; text-align: center;">
                            ⬇ Download 1080x1920 MP4 Video
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `
                    : ""
                }
              </table>
            </td>
          </tr>

          <!-- AUTO-SCHEDULER STATUS CALLOUT -->
          <tr>
            <td style="padding: 0 32px 28px 32px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 14px; padding: 14px 18px;">
                <tr>
                  <td width="30" valign="top" style="padding-right: 12px; font-size: 18px;">
                    🚀
                  </td>
                  <td>
                    <span style="font-size: 12px; font-weight: 700; color: #60a5fa; text-transform: uppercase;">Autopilot Publishing Queue</span>
                    <p style="margin: 3px 0 0 0; font-size: 12px; color: #cbd5e1; line-height: 1.4;">
                      This video is marked as <strong style="color: #4ade80;">Scheduled</strong> in your content dashboard and is ready for multi-platform dispatching to YouTube Shorts, Instagram Reels, and TikTok.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 24px 32px; background-color: #080a15; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;" class="mobile-padding">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b;">
                Sent automatically by your <strong>FacelessReels AI</strong> Inngest Video Generation Engine.
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                &copy; ${currentYear} FacelessReels AI. All rights reserved. &bull; <a href="${appUrl}/dashboard" target="_blank" style="color: #a855f7; text-decoration: none;">Dashboard</a> &bull; <a href="${appUrl}/dashboard/videos" target="_blank" style="color: #a855f7; text-decoration: none;">All Videos</a>
              </p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send email notification to user once video is generated using Plunk
 */
export async function sendVideoReadyEmail(
  params: VideoReadyEmailParams
): Promise<{ success: boolean; messageId?: string; error?: string; simulated?: boolean }> {
  try {
    if (!params.to || !params.to.includes("@")) {
      console.warn("[Plunk Email] Invalid or missing recipient email:", params.to);
      return { success: false, error: "Missing or invalid recipient email address" };
    }

    const htmlBody = generateVideoReadyEmailHtml(params);
    const subject = `🎬 Your Video "${params.videoTitle}" is Ready for Publishing!`;

    const apiKey =
      process.env.PLUNK_API_KEY ||
      process.env.PLUNK_API_Secret_KEY ||
      process.env.PLUNK_SECRET_KEY ||
      process.env.NEXT_PUBLIC_PLUNK_API_KEY;

    if (!apiKey || apiKey === "your_plunk_api_key_here") {
      console.log(
        `[Plunk Email Simulation] No PLUNK_API_KEY detected in env. Email simulated successfully for: ${params.to}`
      );
      console.log(`[Plunk Email Simulation] Subject: ${subject}`);
      console.log(`[Plunk Email Simulation] Video URL: ${params.videoUrl || "N/A"}`);
      return {
        success: true,
        simulated: true,
        messageId: `simulated-plunk-${Date.now()}`,
      };
    }

    if (apiKey.startsWith("pk_")) {
      return {
        success: false,
        error:
          "You configured a Plunk Public Key (pk_...) instead of a Secret Key (sk_...). Please copy the Secret API Key (sk_...) from https://useplunk.com (Project Settings -> API Keys) and paste it into PLUNK_API_KEY in .env.local.",
      };
    }

    // Construct exact Plunk Next API payload according to user specification
    const payload: Record<string, any> = {
      to: params.to,
      subject,
      body: htmlBody,
    };

    // Include from only if explicitly configured in environment
    if (process.env.PLUNK_FROM_EMAIL && process.env.PLUNK_FROM_EMAIL.trim().length > 0) {
      payload.from = process.env.PLUNK_FROM_EMAIL.trim();
    }

    console.log(`[Plunk Email] Sending video notification to: ${params.to} via https://next-api.useplunk.com/v1/send...`);

    const response = await fetch("https://next-api.useplunk.com/v1/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success !== false) {
      console.log("[Plunk Email] Dispatched via Plunk Next API successfully!", data);
      return {
        success: true,
        messageId: data.id || data.data?.id || `plunk-${Date.now()}`,
      };
    }

    // Handle missing or unverified domain gracefully (before custom domain is configured in Plunk)
    if (
      response.status === 422 ||
      response.status === 403 ||
      data.error?.message?.includes("sender email") ||
      data.error?.message?.includes("Domain")
    ) {
      const reason = data.error?.message || "Domain not yet verified in Plunk";
      console.log(`[Plunk Email Notice] ${reason}. Email simulated successfully for ${params.to}.`);
      return {
        success: true,
        simulated: true,
        messageId: `simulated-plunk-${Date.now()}`,
      };
    }

    const errorMessage =
      data.error?.message || data.message || `Plunk API returned HTTP ${response.status}`;

    console.warn("[Plunk Email Notice]", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  } catch (error: any) {
    console.error("[Plunk Email Error] Failed to send email:", error?.message || error);
    return {
      success: false,
      error: error?.message || "Failed to send Plunk email notification",
    };
  }
}

/**
 * Resolves user email from Clerk SDK or fallback event email
 */
export async function resolveUserEmail(
  userId?: string,
  eventEmail?: string
): Promise<{ email: string | null; name?: string }> {
  if (eventEmail && eventEmail.includes("@")) {
    return { email: eventEmail };
  }

  if (!userId) {
    return { email: null };
  }

  try {
    const clerkSecret = process.env.CLERK_SECRET_KEY;
    if (clerkSecret) {
      const clerk = createClerkClient({ secretKey: clerkSecret });
      const user = await clerk.users.getUser(userId);

      const primaryEmail =
        user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ||
        user.emailAddresses[0]?.emailAddress;

      const fullName =
        user.firstName || user.username
          ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || undefined
          : undefined;

      if (primaryEmail) {
        return { email: primaryEmail, name: fullName };
      }
    }
  } catch (clerkErr: any) {
    console.warn("[Plunk User Lookup] Clerk lookup notice:", clerkErr?.message);
  }

  return { email: null };
}
