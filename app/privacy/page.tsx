import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ShieldCheck, Lock, ExternalLink, ArrowLeft, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — FacelessReels AI",
  description:
    "Privacy Policy and Google API Services User Data Policy disclosure for FacelessReels AI.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="dark bg-[#090a0f] text-slate-100 min-h-screen flex flex-col [color-scheme:dark]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 space-y-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to FacelessReels AI</span>
        </Link>

        {/* Title Header */}
        <div className="space-y-3 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Last Updated: August 18, 2026 • Application Name: <strong>FacelessReels AI</strong>
          </p>
        </div>

        {/* Privacy Content */}
        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-8">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Introduction & Application Purpose</h2>
            <p>
              Welcome to <strong>FacelessReels AI</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). FacelessReels AI is an AI-driven short video creation and publishing platform operating at <code className="text-purple-300">https://facelessreels-three.vercel.app</code>.
            </p>
            <p>
              We respect your privacy and are committed to protecting any personal and third-party data you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          {/* Section 2: Google & YouTube API Services Compliance */}
          <section className="p-6 rounded-2xl bg-gradient-to-r from-red-950/20 via-purple-950/20 to-transparent border border-red-500/20 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-400" />
              2. Google API Services & YouTube Data API Policy
            </h2>
            <p>
              FacelessReels AI uses <strong>YouTube API Services</strong> to allow users to schedule and publish video reels to their verified YouTube channels.
            </p>
            <div className="space-y-2 text-xs">
              <p>
                <strong>Google Scopes Requested:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <code className="text-purple-300">https://www.googleapis.com/auth/youtube.upload</code>: Used solely to upload video reels generated and approved by you directly to your YouTube channel.
                </li>
                <li>
                  <code className="text-purple-300">https://www.googleapis.com/auth/youtube.readonly</code>: Used solely to retrieve basic channel details (such as channel title and thumbnail) and confirm successful video uploads.
                </li>
              </ul>
            </div>

            <p className="text-xs">
              <strong>Google API Limited Use Disclosure:</strong> FacelessReels AI&apos;s use and transfer to any other app of information received from Google APIs adheres to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 underline hover:text-purple-300 inline-flex items-center gap-0.5"
              >
                Google API Services User Data Policy <ExternalLink className="w-3 h-3" />
              </a>
              , including the Limited Use requirements.
            </p>

            <p className="text-xs">
              By using our YouTube publishing integration, you also agree to be bound by the{" "}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 underline hover:text-red-300 inline-flex items-center gap-0.5"
              >
                YouTube Terms of Service <ExternalLink className="w-3 h-3" />
              </a>{" "}
              and the{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 underline hover:text-purple-300 inline-flex items-center gap-0.5"
              >
                Google Privacy Policy <ExternalLink className="w-3 h-3" />
              </a>.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account Information:</strong> Name, email address, and authentication credentials provided via Clerk / Google Sign-In.
              </li>
              <li>
                <strong>Creator Content:</strong> Video generation prompts, selected visual styles, voice selections, generated scripts, and rendered video assets.
              </li>
              <li>
                <strong>Connected Social Tokens:</strong> OAuth access and refresh tokens for connected platforms (YouTube, Instagram, TikTok) stored securely using industry-standard AES-256 encryption.
              </li>
              <li>
                <strong>Technical Logs:</strong> IP address, browser type, operating system, and usage telemetry to maintain system uptime and detect fraud.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. How We Use Your Information</h2>
            <p>We use collected data strictly to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Operate, generate, render, and schedule your video reels.</li>
              <li>Upload approved videos to your selected distribution channels on your behalf.</li>
              <li>Manage your account, subscription tier, billing, and support inquiries.</li>
              <li>Maintain platform security and prevent unauthorized access.</li>
            </ul>
            <p>
              <strong>We DO NOT sell, rent, or trade your personal data or Google user data to any third party, advertisers, or data brokers.</strong>
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Revocation of Access & Data Deletion</h2>
            <p>
              You may revoke FacelessReels AI&apos;s access to your YouTube or Google account at any time by:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Disconnecting your channel directly from your <strong>FacelessReels AI Dashboard → Settings</strong>.</li>
              <li>
                Visiting the{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 underline hover:text-purple-300"
                >
                  Google Security Permissions Page
                </a>{" "}
                and removing access for <strong>FacelessReels AI</strong>.
              </li>
            </ol>
            <p>
              Upon disconnection or account deletion, all stored OAuth tokens are immediately and permanently purged from our database.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our compliance with Google API policies, please contact us at:
            </p>
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-xs space-y-1">
              <p><strong>Application:</strong> FacelessReels AI</p>
              <p><strong>Email:</strong> <a href="mailto:support@facelessreels.ai" className="text-purple-400 underline">support@facelessreels.ai</a></p>
              <p><strong>Website:</strong> <a href="https://facelessreels-three.vercel.app" className="text-purple-400 underline">https://facelessreels-three.vercel.app</a></p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
