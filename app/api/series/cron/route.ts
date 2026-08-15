import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export const dynamic = "force-dynamic";

/**
 * GET or POST /api/series/cron
 * Triggers an instant evaluation of all active series schedules
 */
export async function GET(req: NextRequest) {
  try {
    const result = await inngest.send({
      name: "series/schedule.cron.check",
      data: {
        triggeredBy: "api_endpoint",
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Scheduled series publisher check triggered successfully via Inngest!",
      ids: result.ids,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Cron trigger error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to trigger cron check" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
