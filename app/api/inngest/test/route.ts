import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

// GET or POST /api/inngest/test - Dispatches test/hello.world event to Inngest
export async function GET() {
  try {
    const { ids } = await inngest.send({
      name: "test/hello.world",
      data: {
        name: "Creator",
        time: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Event 'test/hello.world' dispatched successfully to Inngest!",
      eventIds: ids,
      inngestEndpoint: "/api/inngest",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to dispatch Inngest event",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { ids } = await inngest.send({
      name: "test/hello.world",
      data: {
        name: body.name || "Creator",
        time: new Date().toISOString(),
        ...body,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Event 'test/hello.world' dispatched successfully to Inngest!",
      eventIds: ids,
      inngestEndpoint: "/api/inngest",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to dispatch Inngest event",
      },
      { status: 500 }
    );
  }
}
