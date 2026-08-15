import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { helloWorld, generateVideoReel, scheduleDailySeriesPublisher } from "@/inngest/functions";

// Create and export the Next.js App Router API route handlers for Inngest
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, generateVideoReel, scheduleDailySeriesPublisher],
});

