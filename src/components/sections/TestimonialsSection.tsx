"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// delay supprimé — stagger géré par ScrollTrigger.batch()
const testimonials = [
  {
    quote: "Hermann a transformé notre idée en une expérience qui impressionne à chaque scroll. Du grand art.",
    name: "Aïcha K.",
    role: "CEO, Studio Nova",
    bg: "bg-brand",
    color: "text-white",
    avatarBg: "bg-dark",
    shadow: "shadow-brutal",
    accent: "text-lime",
    roleColor: "text-white/70",
  },
  {
    quote: "Front impeccable et back carré. Rapide, rigoureux, créatif — un vrai fullstack de confiance.",
    name: "David M.",
    role: "CTO, FinPay",
    bg: "bg-dark",
    color: "text-white",
    avatarBg: "bg-brand",
    shadow: "shadow-brutal-blue",
    accent: "text-lime",
    roleColor: "text-white/70",
  },
  {
    quote: "Livraison dans les temps, code impeccable et un sens du détail rare. Je recommande les yeux fermés.",
    name: "Sarah B.",
    role: "Founder, Vibe",
    bg: "bg-lime",
    color: "text-dark",
    avatarBg: "bg-dark",
    shadow: "shadow-brutal",
    accent: "text-brand",
    roleColor: "text-muted",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set("[data-reveal]", { autoAlpha: 1, y: 0 });
        return;
      }

      // Les 3 cards d'un même grid entrent à peu près ensemble → batch idéal
      ScrollTrigger.batch(gsap.utils.toArray<HTMLElement>("[data-reveal]"), {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.1 }
          ),
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream px-4 sm:px-8 lg:px-14 py-16 lg:py-30">
      {/* Japanese watermark */}
      <div aria-hidden="true" className="absolute bottom-0 right-0 select-none pointer-events-none overflow-hidden">
        <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-dark/5 leading-none whitespace-nowrap">
          お客様の声
        </span>
      </div>

      <div className="max-w-310 mx-auto">
        <div data-reveal className="mb-12">
          <p className="font-mono text-2xs tracking-[0.14em] uppercase text-brand">
            05 — Témoignages
          </p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.9] mt-4 mb-0">
            Ils en parlent
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map(({ quote, name, role, bg, color, avatarBg, shadow, accent, roleColor }) => (
            <div
              key={name}
              data-reveal
              className={`${bg} ${color} border-brutal rounded-5.5 p-8 ${shadow} flex flex-col`}
            >
              <i className={`ti ti-quote text-[40px] ${accent}`} />
              <p className="text-lg sm:text-[19px] leading-normal mt-4.5 mb-6.5 flex-1">
                {quote}
              </p>
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-full ${avatarBg} shrink-0`} />
                <div>
                  <p className="font-bold text-[15px] m-0">{name}</p>
                  <p className={`text-2xs ${roleColor} m-0`}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
