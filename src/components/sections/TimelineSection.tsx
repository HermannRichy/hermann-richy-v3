"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

const KATAKANA =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

interface Milestone {
    year: string;
    title: string;
    company: string;
    role: string;
    desc: string;
}

const milestones: Milestone[] = [
    {
        year: "2021",
        title: "PHP & Bootstrap",
        company: "Freelance",
        role: "Développeur Web",
        desc: "Premières missions clients, fondamentaux serveur, initiation à l'architecture web.",
    },
    {
        year: "2022",
        title: "React, Tailwind & Firebase",
        company: "FuturCraft Institut — Godomey",
        role: "Dev & Formateur",
        desc: "Passage au frontend moderne. Début de la formation des développeurs juniors.",
    },
    {
        year: "2023",
        title: "Next.js & Node.js / Express",
        company: "Cefora Formation — Agla",
        role: "Formateur & Lead Dev",
        desc: "Stack fullstack professionnelle. Lead dev sur projets clients complexes.",
    },
    {
        year: "Jan 2024",
        title: "CEO — Digital Innovation",
        company: "Digital Innovation",
        role: "CEO",
        desc: "Fondation et direction de la startup tech. Pilotage des équipes et des projets.",
    },
    {
        year: "Mai 2024",
        title: "Responsable Web",
        company: "Programme FUTUR",
        role: "Lead Dev",
        desc: "Direction technique des projets web. GSAP & Three.js au cœur des productions.",
    },
];

export default function TimelineSection() {
    const sectionTimelineRef = useRef<HTMLElement>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useGSAP(
        () => {
            const cards = gsap.utils.toArray<HTMLElement>(
                ".data-timeline-card",
            );
            const totalMilestones = cards.length;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionTimelineRef.current,
                    start: "top top",
                    end: `+=${totalMilestones * 100}%`,
                    pin: true,
                    scrub: 1,
                    onUpdate: (self) => {
                        const index = Math.min(
                            Math.floor(self.progress * totalMilestones),
                            totalMilestones - 1,
                        );
                        setActiveIndex(index);
                    },
                },
            });

            gsap.set(cards.slice(1), { opacity: 0, y: 60, scale: 0.95 });

            cards.forEach((card, index) => {
                if (index === 0) return;

                tl.to(cards[index - 1], {
                    opacity: 0,
                    y: -60,
                    scale: 0.95,
                    duration: 0.5,
                    ease: "power1.in",
                }).to(card, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power1.out",
                });
            });
        },
        { scope: sectionTimelineRef },
    );

    useGSAP(() => {
        if (!labelRef.current) return;
        gsap.to(labelRef.current, {
            duration: 1.5,
            scrambleText: {
                text: "03 — Chronologie",
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
            ref={sectionTimelineRef}
            id="parcours"
            className="relative overflow-hidden bg-zinc-950 text-white h-screen w-full"
        >
            {/* Header fixe */}
            <div className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-8 lg:px-14 pt-10">
                <p ref={labelRef} className="font-mono text-xs tracking-[0.14em] uppercase text-lime-400 m-0">
                    03 — 年表
                </p>
            </div>

            {/* Conteneur des cartes empilées */}
            <div className="absolute inset-0 z-2">
                {milestones.map((m, i) => (
                    <div
                        key={m.year}
                        className="data-timeline-card absolute inset-0 flex items-center px-4 sm:px-8 lg:px-14"
                        style={{
                            willChange: "transform, opacity",
                            opacity: i === 0 ? 1 : 0,
                        }}
                    >
                        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-6 lg:gap-16 items-center">
                            {/* Numéro géant décoratif */}
                            <div className="hidden lg:block text-right select-none">
                                <span
                                    className="font-bold leading-none text-white/5 tabular-nums"
                                    style={{
                                        fontSize: "clamp(5rem,12vw,9rem)",
                                    }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                            </div>

                            {/* Contenu textuel */}
                            <div className="w-full">
                                <span className="font-mono text-xs tracking-[0.18em] uppercase text-lime-400/70 block mb-4">
                                    {m.year}
                                </span>

                                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                    <h3
                                        className="font-bold uppercase leading-[0.9] m-0 text-white"
                                        style={{
                                            fontSize:
                                                "clamp(1.6rem,4.5vw,3rem)",
                                        }}
                                    >
                                        {m.title}
                                    </h3>
                                    <span className="font-mono text-xs tracking-wide uppercase bg-lime-400 text-zinc-950 px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap self-start mt-1">
                                        {m.role}
                                    </span>
                                </div>

                                <p className="font-mono text-sm text-white/60 mb-5">
                                    {m.company}
                                </p>

                                <p className="text-lg sm:text-xl leading-[1.55] text-white/70 mb-0 max-w-2xl">
                                    {m.desc}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Barre de navigation (Dots) — pilotée par activeIndex */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                {milestones.map((_, i) => (
                    <div
                        key={i}
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                            width: activeIndex === i ? "20px" : "8px",
                            backgroundColor:
                                activeIndex === i
                                    ? "#CDF22B"
                                    : "rgba(255,255,255,0.25)",
                        }}
                    />
                ))}
            </div>
        </section>
    );
}
