import { NextResponse } from "next/server";
import { sendVideoReadyEmail, resolveUserEmail } from "@/lib/plunk";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const to = searchParams.get("to") || "safarstories.studio@gmail.com";
    const title = searchParams.get("title") || "The Ancient Roman Concrete Secret";

    const result = await sendVideoReadyEmail({
      to,
      recipientName: "Faceless Creator",
      videoTitle: title,
      seriesTitle: "Cosmic & Historical Mysteries",
      niche: "Historical Mysteries",
      hook: "Roman concrete has survived underwater for 2,000 years, and scientists just unlocked why.",
      durationSeconds: 45,
      thumbnailUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1080",
      videoUrl: "https://apxmdkzbgfooagqbgqdc.supabase.co/storage/v1/object/public/renders/876c2260-0e05-4b8d-8ecd-83aceed6ec2e/rendered-reel-876c2260-0e05-4b8d-8ecd-83aceed6ec2e-1786730645319.mp4",
      reelId: "test-reel-id",
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      voiceName: "Deepgram Aura (Arcas Baritone)",
      captionStyle: "Hormozi Viral Pop",
    });

    return NextResponse.json({
      success: result.success,
      recipient: to,
      message: result.simulated
        ? "Email generated and simulated (Set PLUNK_API_KEY to send live emails)"
        : "Email sent successfully via Plunk!",
      details: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to send test email" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { userId, userEmail, videoTitle, seriesTitle, hook, videoUrl, thumbnailUrl, reelId } = body;

    let targetEmail = userEmail;
    let targetName = body.recipientName;

    if (!targetEmail && userId) {
      const resolved = await resolveUserEmail(userId);
      targetEmail = resolved.email;
      targetName = resolved.name || targetName;
    }

    if (!targetEmail) {
      return NextResponse.json(
        { success: false, error: "Recipient email or userId is required" },
        { status: 400 }
      );
    }

    const result = await sendVideoReadyEmail({
      to: targetEmail,
      recipientName: targetName || "Creator",
      videoTitle: videoTitle || "Automated Viral Video Reel",
      seriesTitle: seriesTitle || "Automated Series",
      niche: body.niche || "Viral",
      hook: hook || "Did you know this shocking secret?",
      durationSeconds: body.durationSeconds || 45,
      thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1080",
      videoUrl: videoUrl,
      reelId: reelId || "sample-reel",
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      voiceName: body.voiceName || "Deepgram Neural",
      captionStyle: body.captionStyle || "Hormozi Pop",
    });

    return NextResponse.json({
      success: result.success,
      recipient: targetEmail,
      details: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
