"use client";

import { useRef } from "react";
import {
    IconCode,
    IconServerBolt,
    IconBolt,
    IconGauge,
    IconBrain,
} from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

const KATAKANA =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

const services: {
    icon: TablerIcon;
    title: string;
    desc: string;
    iconBg: string;
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
        desc: "API REST / GraphQL, base de données et logique métier solides avec Node.js.",
        iconBg: "bg-purple",
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
    },
    {
        icon: IconBrain,
        title: "IA & Automatisation",
        desc: "Intégration LLM (OpenAI, Gemini), agents IA, scraping + réécriture SEO, pipelines de traitement automatisé pour le web.",
        iconBg: "bg-dark",
    },
];

export default function ServicesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);

    useGSAP(
        () => {
            // Animation simple et fluide de tous les éléments ayant la classe `.reveal-item`
            gsap.to(".reveal-item", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.5, // Crée l'effet de cascade d'apparition entre chaque carte
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%", // Déclenche dès que le haut de la section arrive à 85% de l'écran
                },
            });
        },
        { scope: sectionRef },
    );

    useGSAP(() => {
        if (!labelRef.current) return;
        gsap.to(labelRef.current, {
            duration: 1.5,
            scrambleText: {
                text: "06 — Services",
                chars: KATAKANA,
                revealDelay: 0.3,
                speed: 0.5,
            },
            scrollTrigger: {
                trigger: labelRef.current,
                start: "top 90%",
                once: true,
            },
        });
    });

    return (
        <section
            ref={sectionRef}
            id="services"
            className="relative overflow-hidden bg-lime text-dark px-4 sm:px-8 lg:px-14 py-16 lg:py-30"
        >
            {/* Japanese watermark */}
            <div
                aria-hidden="true"
                className="absolute bottom-0 right-0 select-none pointer-events-none overflow-hidden"
            >
                <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-dark/5 leading-none whitespace-nowrap">
                    サービス
                </span>
            </div>

            <div className="max-w-310 mx-auto">
                {/* En-tête avec classes d'état initiales */}
                <div className="reveal-item mb-12 opacity-0 translate-y-8">
                    <p
                        ref={labelRef}
                        className="font-mono text-2xs tracking-[0.14em] uppercase text-brand"
                    >
                        06 — サービス
                    </p>
                    <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.9] mt-4 mb-0">
                        Ce que je fais
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {services.map(
                        ({ icon: ServiceIcon, title, desc, iconBg }) => (
                            <div
                                key={title}
                                className="reveal-item bg-white border-brutal rounded-[22px] p-8 shadow-brutal opacity-0 translate-y-8"
                            >
                                <div
                                    className={`flex items-center justify-center w-15.5 h-15.5 ${iconBg} rounded-2xl mb-5`}
                                >
                                    <ServiceIcon
                                        size={32}
                                        className="text-white"
                                    />
                                </div>
                                <h3 className="font-display text-[26px] sm:text-[30px] uppercase mt-0 mb-2.5">
                                    {title}
                                </h3>
                                <p className="text-sm sm:text-base leading-[1.55] text-muted m-0">
                                    {desc}
                                </p>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </section>
    );
}
