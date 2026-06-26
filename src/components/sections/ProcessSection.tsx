"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const steps = [
  { icon: "ti-compass", num: "01", title: "Découverte",    desc: "On cadre l'objectif, l'audience et les contraintes du projet." },
  { icon: "ti-pencil",  num: "02", title: "Design",        desc: "Maquette Figma, direction visuelle et prototype interactif." },
  { icon: "ti-code",    num: "03", title: "Développement", desc: "Front, back et animations GSAP, intégrés et testés de bout en bout." },
  { icon: "ti-rocket",  num: "04", title: "Lancement",     desc: "Déploiement, optimisation finale et suivi post-mise en ligne." },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set("[data-reveal]", { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.set("[data-reveal]", { autoAlpha: 0, y: 30 });
    ScrollTrigger.batch(gsap.utils.toArray<HTMLElement>("[data-reveal]", sectionRef.current), {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.08 }),
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream px-4 sm:px-8 lg:px-14 pt-10 pb-16 lg:pb-30">
      {/* Japanese watermark */}
      <div aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 right-0 select-none pointer-events-none overflow-hidden">
        <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-dark/5 leading-none whitespace-nowrap">
          制作工程
        </span>
      </div>

      <div className="max-w-310 mx-auto">
        <div data-reveal className="mb-12">
          <p className="font-mono text-2xs tracking-[0.14em] uppercase text-brand">
            06 — Process
          </p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.9] mt-4 mb-0">
            Ma méthode
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(({ icon, num, title, desc }) => (
            <div key={num} data-reveal className="border-t-[3px] border-dark pt-5.5">
              <div className="flex justify-between items-center mb-4.5">
                <i className={`ti ${icon} text-[34px] text-brand`} />
                <span className="font-display text-[36px] text-muted-light">{num}</span>
              </div>
              <h3 className="font-display text-[26px] uppercase mt-0 mb-2">{title}</h3>
              <p className="text-[15px] leading-[1.55] text-muted m-0">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
