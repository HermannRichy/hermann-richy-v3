"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Nav from "@/components/Nav";
import HeroSection from "@/components/sections/HeroSection";
import StorySection from "@/components/sections/StorySection";
import AboutSection from "@/components/sections/AboutSection";
import TimelineSection from "@/components/sections/TimelineSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import StackSection from "@/components/sections/StackSection";
import ServicesSection from "@/components/sections/ServicesSection";
import NumbersSection from "@/components/sections/NumbersSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";

gsap.registerPlugin(ScrollTrigger);

export default function Portfolio() {
  useEffect(() => {
    // Global refresh after all components have mounted and fonts loaded
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    const t1 = setTimeout(refresh, 400);
    const t2 = setTimeout(refresh, 1600);
    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="bg-cream text-dark font-sans antialiased w-full relative">
      <Nav />
      <HeroSection />
      <StorySection />
      <AboutSection />
      <TimelineSection />
      <ProjectsSection />
      <StackSection />
      <ServicesSection />
      <NumbersSection />
      <TestimonialsSection />
      <ProcessSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
}
