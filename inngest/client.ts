import { Inngest } from "inngest";

// Initialize and export the Inngest client
export const inngest = new Inngest({
  id: "facelessreels",
  isDev: process.env.NODE_ENV !== "production" || process.env.INNGEST_DEV === "1",
});
