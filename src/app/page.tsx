"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

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

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Word rotator
  useEffect(() => {
    const words = ["pixel perfect", "qui se démarquent", "qui tiennent la route", "mémorables"];
    let i = 0;
    const rot = document.querySelector<HTMLElement>("[data-rotate]");
    if (!rot) return;
    const reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = setInterval(() => {
      i = (i + 1) % words.length;
      rot.style.opacity = "0";
      setTimeout(() => {
        rot.textContent = words[i];
        rot.style.opacity = "1";
      }, 220);
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  useGSAP(
    () => {
      const reduced =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // ── Hero intro ────────────────────────────────────────────
      const htl = gsap.timeline({ defaults: { ease: "power4.out" } });
      htl
        .set("[data-hero-line]", { yPercent: 115 })
        .to("[data-hero-line]", {
          yPercent: 0,
          duration: 1.05,
          stagger: 0.12,
        })
        .to(
          "[data-hero-fade]",
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 },
          "-=0.6"
        )
        .to(
          "[data-hero-photo]",
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.7"
        );

      if (reduced) {
        gsap.set(
          "[data-reveal],[data-hero-line],[data-hero-fade],[data-hero-photo]",
          { opacity: 1, transform: "none" }
        );
        gsap.set("[data-story-line]", { opacity: 1, x: 0 });
        // Show all timeline cards in flow (not stacked) for reduced motion
        gsap.utils.toArray<HTMLElement>("[data-timeline-card]").forEach((el) => {
          gsap.set(el, { opacity: 1, y: 0, position: "relative" });
        });
        gsap.utils.toArray<HTMLElement>("[data-bar]").forEach((el) => {
          el.style.width = el.getAttribute("data-bar") || "0%";
        });
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          el.style.width = (el.getAttribute("data-split") || "0") + "%";
        });
        return;
      }

      // ── Generic scroll reveals ─────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const d = (parseFloat(el.getAttribute("data-delay") || "0")) / 1000;
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: d,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ── Parallax ───────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amt = parseFloat(el.getAttribute("data-parallax") || "40");
        const host = el.closest("section") || el;
        gsap.to(el, {
          y: amt,
          ease: "none",
          scrollTrigger: {
            trigger: host,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // ── Parcours technique — pinned lines ─────────────────────
      const storyLines = gsap.utils.toArray<HTMLElement>(
        "#intro [data-story-line]"
      );
      if (storyLines.length) {
        // Lines start hidden and off-position
        gsap.set(storyLines, { opacity: 0, x: -40 });

        const stl = gsap.timeline({
          scrollTrigger: {
            trigger: "#intro",
            start: "top top",
            end: "+=" + storyLines.length * 360,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        storyLines.forEach((l) => {
          stl.to(l, { opacity: 1, x: 0, duration: 1, ease: "none" });
          stl.to({}, { duration: 0.3 }); // brief hold before next line
        });
      }

      // ── Horizontal projects scroll ──────────────────────────────
      const track = document.querySelector<HTMLElement>("[data-h-track]");
      const stage = document.querySelector<HTMLElement>("[data-h-stage]");
      if (track && stage && window.innerWidth > 920) {
        const getDist = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + 80);
        gsap.to(track, {
          x: () => -getDist(),
          ease: "none",
          scrollTrigger: {
            trigger: "#projets",
            start: "top top",
            end: () => "+=" + getDist(),
            scrub: 1,
            pin: stage,
            invalidateOnRefresh: true,
          },
        });
      }

      // ── Skill bars ─────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-bar]").forEach((el) => {
        gsap.to(el, {
          width: el.getAttribute("data-bar") ?? "0%",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      // ── 60/40 split bars ───────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        gsap.to(el, {
          width: (el.getAttribute("data-split") || "0") + "%",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      // ── Number counters ────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            const target = parseFloat(el.getAttribute("data-count") || "0");
            const suffix = el.getAttribute("data-suffix") || "";
            const dur = 1300;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / dur, 1);
              const ease = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.round(target * ease) + suffix;
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          },
        });
      });

      // ── Parcours professionnel — pinned one by one ─────────────
      const timelineCards = gsap.utils.toArray<HTMLElement>(
        "#parcours [data-timeline-card]"
      );

      if (timelineCards.length) {
        // All cards invisible except first
        gsap.set(timelineCards, { opacity: 0, y: 60 });
        gsap.set(timelineCards[0], { opacity: 1, y: 0 });

        const ttl = gsap.timeline({
          scrollTrigger: {
            trigger: "#parcours",
            start: "top top",
            end: "+=" + (timelineCards.length - 1) * 700,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        timelineCards.forEach((card, i) => {
          if (i >= timelineCards.length - 1) return;
          // Current card slides up and out
          ttl.to(card, { opacity: 0, y: -60, duration: 1, ease: "none" });
          // Next card slides up from below — starts at same time
          ttl.to(timelineCards[i + 1], { opacity: 1, y: 0, duration: 1, ease: "none" }, "<");
          // Brief hold before next transition
          ttl.to({}, { duration: 0.5 });
        });
      }

      // ── Refresh & safety net ────────────────────────────────────
      const refresh = () => {
        ScrollTrigger.refresh();
        // Ensure elements in viewport are visible
        const vh = window.innerHeight || 800;
        document
          .querySelectorAll<HTMLElement>("[data-reveal]")
          .forEach((el) => {
            const r = el.getBoundingClientRect();
            if (
              r.top < vh * 0.95 &&
              r.bottom > 0 &&
              parseFloat(getComputedStyle(el).opacity) < 0.05
            ) {
              el.style.transition = "opacity .5s ease, transform .5s ease";
              el.style.opacity = "1";
              el.style.transform = "none";
            }
          });
      };

      window.addEventListener("load", refresh);
      if (document.fonts?.ready) document.fonts.ready.then(refresh);
      const t1 = setTimeout(refresh, 400);
      const t2 = setTimeout(refresh, 1600);

      return () => {
        window.removeEventListener("load", refresh);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="bg-cream text-dark font-sans antialiased w-full relative">
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
