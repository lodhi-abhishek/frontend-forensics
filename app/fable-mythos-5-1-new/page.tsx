import React from "react";
import type { Metadata } from "next";
import "./fonts.css";
import "./theme.css";

import { SiteHeader } from "./components/SiteHeader";
import { SideNavToc } from "./components/SideNavToc";
import { HeroSection } from "./components/HeroSection";
import { IntroSection } from "./components/IntroSection";
import { PerformanceSection } from "./components/PerformanceSection";
import { TestimonialsCarousel } from "./components/TestimonialsCarousel";
import { ScienceSection } from "./components/ScienceSection";
import { SafetySection } from "./components/SafetySection";
import { MythosSection } from "./components/MythosSection";
import { CostAvailability } from "./components/CostAvailability";
import { FootnotesAndCta } from "./components/FootnotesAndCta";
import { SiteFooter } from "./components/SiteFooter";

export const metadata: Metadata = {
  title: "Claude Fable 5.1 and Claude Mythos 5.1 \u2014 Anthropic",
  description:
    "We're introducing Claude Fable 5.1 and Claude Mythos 5.1. They're the world's most advanced models for coding and knowledge work—and their research capabilities offer an early glimpse of how AI models will contribute to scientific progress.",
  openGraph: {
    title: "Claude Fable 5.1 and Claude Mythos 5.1 \u2014 Anthropic",
    description:
      "We're introducing Claude Fable 5.1 and Claude Mythos 5.1. The world's most advanced models for coding and knowledge work.",
    images: ["/fable-mythos/hero/poster.png"],
  },
};

export default function FableMythosNewPage() {
  return (
    <div className="fable-new-page relative min-h-screen bg-[#faf9f5] text-[#141413] antialiased selection:bg-[#788c5d]/20 selection:text-[#141413]">
      {/* Sticky Global Navigation */}
      <SiteHeader />

      {/* Floating Scroll-Spy Table of Contents */}
      <SideNavToc />

      {/* Interactive Flocking Hero Header */}
      <HeroSection />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <IntroSection />
        <PerformanceSection />
        <TestimonialsCarousel />
        <ScienceSection />
        <SafetySection />
        <MythosSection />
        <CostAvailability />
        <FootnotesAndCta />
      </main>

      {/* Global Site Footer */}
      <SiteFooter />
    </div>
  );
}
