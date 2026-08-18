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
  title: "FacelessReels AI — Automated Short Video Generator & YouTube Scheduler",
  description:
    "FacelessReels AI is an automated short video generator and YouTube scheduler. Generate viral faceless reels in seconds with AI voiceovers, dynamic captions, and cinematic b-roll. Auto-schedule content to YouTube Shorts, Instagram Reels, TikTok, and Email digests.",
  keywords: [
    "FacelessReels AI",
    "AI video generator",
    "faceless reels",
    "YouTube shorts automation",
    "YouTube auto scheduler",
    "TikTok scheduler",
    "Instagram reels automation",
    "faceless channel automation",
    "AI voiceover shorts",
    "email video newsletter",
  ],
  authors: [{ name: "FacelessReels AI Team" }],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  openGraph: {
    title: "FacelessReels AI — Automated Short Video Generator & YouTube Scheduler",
    description:
      "FacelessReels AI generates and auto-schedules viral faceless shorts for YouTube, Instagram, TikTok & Email on autopilot.",
    type: "website",
    siteName: "FacelessReels AI",
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
      <head><script defer data-tracker="c3a33781-ece4-435f-8532-117b5b00cd98" data-hosts="facelessreels-three.vercel.app" src="https://www.webtracky.com/analytics.js"></script></head>
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
