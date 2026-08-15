import { Inngest } from "inngest";

// Initialize and export the Inngest client
export const inngest = new Inngest({
  id: "facelessreels",
  eventKey: process.env.INNGEST_EVENT_KEY,
  isDev: process.env.NODE_ENV !== "production" && process.env.INNGEST_DEV === "1",
});
