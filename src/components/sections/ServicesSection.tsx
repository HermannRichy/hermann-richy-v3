"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    IconCode,
    IconServerBolt,
    IconBolt,
    IconGauge,
} from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const services: {
    icon: TablerIcon;
    title: string;
    desc: string;
    iconBg: string;
    delay?: number;
}[] = [
    {
        icon: IconCode,
        title: "Développement Frontend",
        desc: "Interfaces React / Next.js propres, typées et maintenables, du composant à l'app complète.",
        iconBg: "bg-brand",
    },
    {
        icon: IconServerBolt,
        title: "Backend & API",
        desc: "API REST / tRPC, base de données et logique métier solides avec Node.js.",
        iconBg: "bg-purple",
        delay: 100,
    },
    {
        icon: IconBolt,
        title: "Animation & Motion",
        desc: "Micro-interactions et storytelling au scroll avec GSAP, pour des sites qui prennent vie.",
        iconBg: "bg-brand",
    },
    {
        icon: IconGauge,
        title: "Performance & SEO",
        desc: "Des sites taillés pour le 100/100 Lighthouse : rapides, accessibles, bien référencés.",
        iconBg: "bg-purple",
        delay: 100,
    },
];

export default function ServicesSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (reduced) {
                gsap.set("[data-reveal]", { opacity: 1, transform: "none" });
                return;
            }
            gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
                const d = parseFloat(el.getAttribute("data-delay") || "0") / 1000;
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
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            id="services"
            className="relative overflow-hidden bg-lime text-dark px-4 sm:px-8 lg:px-14 py-16 lg:py-30"
        >
            {/* Japanese watermark */}
            <div aria-hidden="true" className="absolute bottom-0 right-0 select-none pointer-events-none overflow-hidden">
                <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-dark/5 leading-none whitespace-nowrap">
                    サービス
                </span>
            </div>

            <div className="max-w-310 mx-auto">
                <div data-reveal className="mb-12">
                    <p className="font-mono text-2xs tracking-[0.14em] uppercase text-brand">
                        04 — Services
                    </p>
                    <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.9] mt-4 mb-0">
                        Ce que je fais
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {services.map(({ icon: ServiceIcon, title, desc, iconBg, delay }) => (
                        <div
                            key={title}
                            data-reveal
                            {...(delay ? { "data-delay": delay } : {})}
                            className="bg-white border-brutal rounded-[22px] p-8 shadow-brutal"
                        >
                            <div className={`flex items-center justify-center w-15.5 h-15.5 ${iconBg} rounded-2xl mb-5`}>
                                <ServiceIcon size={32} className="text-white" />
                            </div>
                            <h3 className="font-display text-[26px] sm:text-[30px] uppercase mt-0 mb-2.5">
                                {title}
                            </h3>
                            <p className="text-sm sm:text-base leading-[1.55] text-muted m-0">
                                {desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
