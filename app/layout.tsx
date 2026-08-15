import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { AuthSyncHandler } from "@/components/auth-sync-handler";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FacelessReels.ai — AI Short Video Generator & Auto-Scheduler",
  description:
    "Generate viral faceless shorts in seconds with AI voiceovers, dynamic captions, and cinematic b-roll. Auto-schedule 30 days of content to YouTube Shorts, Instagram Reels, TikTok, and Email video digests on complete autopilot.",
  keywords: [
    "AI video generator",
    "faceless reels",
    "auto scheduler",
    "YouTube shorts AI",
    "TikTok scheduler",
    "Instagram reels automation",
    "faceless channel automation",
    "AI voiceover shorts",
    "email video newsletter",
  ],
  authors: [{ name: "FacelessReels Team" }],
  openGraph: {
    title: "FacelessReels.ai — AI Short Video Generator & Auto-Scheduler",
    description:
      "Generate and auto-schedule 30 days of viral faceless shorts for YouTube, Instagram, TikTok & Email on autopilot.",
    type: "website",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#8b5cf6",
          borderRadius: "0.75rem",
        },
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#090a0f] text-slate-900 dark:text-slate-100 selection:bg-purple-500/30 selection:text-purple-200 transition-colors duration-150">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AuthSyncHandler />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
