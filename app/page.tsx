import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { LiveGeneratorDemo } from "@/components/live-generator-demo";
import { ChannelMatrix } from "@/components/channel-matrix";
import { FeaturesGrid } from "@/components/features-grid";
import { HowItWorks } from "@/components/how-it-works";
import { SchedulerShowcase } from "@/components/scheduler-showcase";
import { NichesShowcase } from "@/components/niches-showcase";
import { PricingSection } from "@/components/pricing-section";
import { Testimonials } from "@/components/testimonials";
import { FAQSection } from "@/components/faq-section";
import { CTABanner } from "@/components/cta-banner";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="dark bg-[#090a0f] text-slate-100 min-h-screen flex flex-col selection:bg-purple-500/30 selection:text-purple-200 [color-scheme:dark]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Landing Flow */}
      <main className="flex-1 flex flex-col">
        {/* 1. Hero Section with Value Prop & Proof */}
        <HeroSection />

        {/* 2. Interactive Live Studio Sandbox */}
        <LiveGeneratorDemo />

        {/* 3. 4-Channel Distribution Matrix (YouTube, IG, TikTok, Email) */}
        <ChannelMatrix />

        {/* 4. Complete AI Production Suite Features */}
        <FeaturesGrid />

        {/* 5. 3-Step "How It Works" Visual Journey */}
        <HowItWorks />

        {/* 6. Dedicated Content Scheduler & Calendar */}
        <SchedulerShowcase />

        {/* 7. Trending High-RPM Niches & Templates */}
        <NichesShowcase />

        {/* 8. Pricing Plans with Monthly/Annual toggle */}
        <PricingSection />

        {/* 9. Social Proof & Creator Testimonials */}
        <Testimonials />

        {/* 10. Monetization & Technical FAQs */}
        <FAQSection />

        {/* 11. High-Converting Final CTA Banner */}
        <CTABanner />
      </main>

      {/* 12. Comprehensive 5-Column Rich Footer */}
      <Footer />
    </div>
  );
}
