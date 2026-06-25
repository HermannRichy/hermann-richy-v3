"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const StarPath =
  "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

const lines = [
  { key: "l1", era: "2021", text: "PHP & Bootstrap",     special: false },
  { key: "l2", era: "2022", text: "React & Firebase",    special: false },
  { key: "l3", era: "2023", text: "Next.js & Node.js",   special: false },
  { key: "l4", era: "2024", text: "GSAP & Three.js",     special: false },
  { key: "l5", era: null,   text: null,                  special: true,  accent: "Pixel perfect.", after: " Toujours." },
];

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set("[data-story-line]", { autoAlpha: 1, x: 0 });
      return;
    }

    const storyLines = gsap.utils.toArray<HTMLElement>("[data-story-line]");
    if (!storyLines.length) return;

    gsap.set(storyLines, { autoAlpha: 0, x: -40 });

    const stl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=" + storyLines.length * 360,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    storyLines.forEach((l) => {
      stl.to(l, { autoAlpha: 1, x: 0, duration: 1, ease: "none" });
      stl.to({}, { duration: 0.3 });
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="relative overflow-hidden bg-dark text-white min-h-screen flex items-center px-4 sm:px-8 lg:px-14 py-20"
    >
      <svg
        data-parallax="80"
        width="220"
        height="220"
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute -bottom-12 -right-10 opacity-50"
      >
        <path d={StarPath} fill="#1E45FB" />
      </svg>

      {/* Japanese watermark */}
      <div aria-hidden="true" className="absolute bottom-0 right-0 select-none pointer-events-none overflow-hidden">
        <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-white/5 leading-none whitespace-nowrap">
          進化
        </span>
      </div>

      <div className="max-w-310 mx-auto w-full relative z-2">
        <p className="font-mono text-2xs tracking-[0.14em] uppercase text-lime mb-10">
          // Parcours technique
        </p>

        <div className="flex flex-col gap-2">
          {lines.map(({ key, era, text, accent, after, special }) => (
            <div
              key={key}
              data-story-line
              className={[
                "font-display uppercase leading-[0.98]",
                "text-[clamp(2.25rem,8vw,5.5rem)]",
                special ? "text-brand" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={special ? { WebkitTextStroke: "2px #CDF22B" } : undefined}
            >
              {special ? (
                <>
                  <span className="text-lime">{accent}</span>
                  {after}
                </>
              ) : (
                <>
                  {era && (
                    <span
                      className="block font-mono tracking-[0.18em] uppercase mb-1"
                      style={{
                        fontSize: "clamp(0.6rem,1.2vw,0.75rem)",
                        fontWeight: 400,
                        color: "rgba(205,242,43,0.6)",
                        WebkitTextStroke: 0,
                      }}
                    >
                      {era} —
                    </span>
                  )}
                  {text}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
