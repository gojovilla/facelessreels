import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FileText, ArrowLeft, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Terms of Service — FacelessReels AI",
  description:
    "Terms of Service, acceptable use policy, and YouTube API Services terms for FacelessReels AI.",
};

export default function TermsOfServicePage() {
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

        {/* Header */}
        <div className="space-y-3 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <FileText className="w-4 h-4" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Last Updated: August 18, 2026 • Application Name: <strong>FacelessReels AI</strong>
          </p>
        </div>

        {/* Terms Content */}
        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-8">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or using <strong>FacelessReels AI</strong> at <code className="text-purple-300">https://facelessreels-three.vercel.app</code>, you agree to be bound by these Terms of Service. If you do not agree, you must not use our services.
            </p>
          </section>

          {/* Section 2: Application Purpose */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Application Description & Purpose</h2>
            <p>
              <strong>FacelessReels AI</strong> is a web application that provides AI-assisted video creation, captioning, neural voiceover synthesis, and content scheduling tools. The service allows users to generate faceless video reels and automatically distribute them to their own authorized social media accounts including YouTube Shorts, Instagram Reels, TikTok, and Email video digests.
            </p>
          </section>

          {/* Section 3: YouTube API Services Terms */}
          <section className="p-6 rounded-2xl bg-gradient-to-r from-red-950/20 via-[#0e111a] to-transparent border border-red-500/20 space-y-3">
            <h2 className="text-xl font-bold text-white">3. YouTube API Services Agreement</h2>
            <p>
              FacelessReels AI utilizes YouTube API Services to facilitate video uploads to your connected YouTube channel.
            </p>
            <p className="text-xs">
              By using our YouTube integration, you acknowledge and agree that you are also bound by the{" "}
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
            <p className="text-xs">
              You may revoke FacelessReels AI&apos;s access to your YouTube data at any time via your account settings or via the{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 underline"
              >
                Google Security Settings page
              </a>.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Acceptable Use & Content Guidelines</h2>
            <p>
              You agree not to use FacelessReels AI to generate, upload, or distribute any content that:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Violates any applicable local, national, or international laws.</li>
              <li>Infringes on copyright, trademark, privacy, or publicity rights of any party.</li>
              <li>Contains hate speech, harassment, threats, or promotes violence.</li>
              <li>Constitutes spam, deceptive commercial practices, or malware dissemination.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Intellectual Property Rights</h2>
            <p>
              <strong>Your Content:</strong> You retain full ownership and commercial rights to the video reels generated using your account, subject to third-party platform terms where you publish.
            </p>
            <p>
              <strong>Platform IP:</strong> All software, code, logos, and UI designs of FacelessReels AI remain the exclusive intellectual property of FacelessReels AI Inc.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Contact Information</h2>
            <p>
              For legal notices, DMCA inquiries, or support questions regarding these Terms, contact us at:
            </p>
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-xs space-y-1">
              <p><strong>App:</strong> FacelessReels AI</p>
              <p><strong>Email:</strong> <a href="mailto:support@facelessreels.ai" className="text-purple-400 underline">support@facelessreels.ai</a></p>
              <p><strong>Domain:</strong> <a href="https://facelessreels-three.vercel.app" className="text-purple-400 underline">https://facelessreels-three.vercel.app</a></p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
