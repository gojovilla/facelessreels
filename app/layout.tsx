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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        ...dark,
        variables: {
          colorPrimary: "#8b5cf6",
          colorBackground: "#0f111c",
          borderRadius: "0.75rem",
        },
        elements: {
          card: "border border-white/10 shadow-2xl backdrop-blur-xl bg-[#0f111c]/90",
          formButtonPrimary:
            "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 transition-opacity text-white font-semibold",
          footerActionLink: "text-purple-400 hover:text-purple-300",
          headerTitle: "text-white font-bold",
          headerSubtitle: "text-slate-400",
          socialButtonsBlockButton:
            "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white",
          socialButtonsBlockButtonText: "text-white font-medium",
          formFieldLabel: "text-slate-300 text-xs",
          formFieldInput:
            "bg-black/50 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500",
          dividerLine: "bg-white/10",
          dividerText: "text-slate-500 text-xs",
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#090a0f] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
          <AuthSyncHandler />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
