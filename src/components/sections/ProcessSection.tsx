"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import {
    IconTarget,
    IconHierarchy,
    IconPalette,
    IconCode,
    IconGauge,
    IconRocket,
    type TablerIcon,
} from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

const KATAKANA =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

interface Step {
    icon: TablerIcon;
    num: string;
    title: string;
    desc: string;
}

const steps: Step[] = [
    {
        num: "01",
        title: "Cadrage & Stratégie",
        desc: "Analyse du besoin, définition des objectifs business, ciblage de l'audience et spécifications techniques.",
        icon: IconTarget,
    },
    {
        num: "02",
        title: "Architecture & API",
        desc: "Modélisation de la base de données, choix de la stack (Next.js/Node), et conception des routes API/GraphQL.",
        icon: IconHierarchy,
    },
    {
        num: "03",
        title: "UI Design & Motion",
        desc: "Maquettes Figma, design system, écriture du storytelling visuel et planification des cinématiques de scroll.",
        icon: IconPalette,
    },
    {
        num: "04",
        title: "Développement Craft",
        desc: "Codage frontend et backend propre, typé avec TypeScript, et intégration des animations fluides via GSAP.",
        icon: IconCode,
    },
    {
        num: "05",
        title: "Audit & Optimisation",
        desc: "Chasse aux millisecondes. Optimisation du rendu SSR/ISR, compression, SEO technique et objectif 100% Lighthouse.",
        icon: IconGauge,
    },
    {
        num: "06",
        title: "Déploiement & Suivi",
        desc: "Mise en production sécurisée (Vercel/Docker), monitoring des logs, analytics et accompagnement post-lancement.",
        icon: IconRocket,
    },
];

export default function ProcessSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);

    useGSAP(
        () => {
            // Animation identique à celle de ServicesSection : cascade au scroll
            gsap.to(".reveal-item", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
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
                text: "09 — Processus",
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
            id="process"
            className="relative overflow-hidden bg-cream text-dark px-4 sm:px-8 lg:px-14 py-16 lg:py-30"
        >
            {/* Ligne organique bg */}
            <svg
                aria-hidden="true"
                viewBox="0 0 1440 400"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                style={{ opacity: 0.12 }}
            >
                <path
                    d="M-60,300 C200,80 460,340 740,170 C1020,0 1260,280 1520,110"
                    fill="none"
                    stroke="#1E45FB"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            {/* Watermark japonais arrière-plan */}
            <div
                aria-hidden="true"
                className="absolute bottom-0 right-0 select-none pointer-events-none overflow-hidden"
            >
                <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-dark/5 leading-none whitespace-nowrap">
                    制作工程
                </span>
            </div>

            <div className="max-w-310 mx-auto">
                {/* En-tête avec les états initiaux Tailwind */}
                <div className="reveal-item mb-12 opacity-0 translate-y-8">
                    <p
                        ref={labelRef}
                        className="font-mono text-2xs tracking-[0.14em] uppercase text-brand"
                    >
                        09 — プロセス
                    </p>
                    <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.9] mt-4 mb-0">
                        Ma méthode
                    </h2>
                </div>

                {/* Configuration responsive demandée : grid-cols-1 (mobile) / sm:grid-cols-2 (tablette) / lg:grid-cols-3 (desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {steps.map(({ icon: StepIcon, num, title, desc }) => (
                        <div
                            key={num}
                            className="reveal-item bg-white border-brutal rounded-[22px] p-8 shadow-brutal opacity-0 translate-y-8 flex flex-col"
                        >
                            {/* Header de la carte avec l'icône et son numéro de step */}
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center justify-center w-15.5 h-15.5 bg-brand rounded-2xl">
                                    <StepIcon
                                        size={32}
                                        className="text-white"
                                    />
                                </div>
                                <span className="font-display text-[32px] text-zinc-300 font-black leading-none">
                                    {num}
                                </span>
                            </div>

                            {/* Contenu textuel */}
                            <h3 className="font-display text-[24px] uppercase mt-0 mb-2.5 font-bold leading-tight">
                                {title}
                            </h3>
                            <p className="text-sm sm:text-base leading-[1.55] text-muted m-0 flex-1">
                                {desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
