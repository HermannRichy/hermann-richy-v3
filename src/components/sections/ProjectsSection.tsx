"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IconArrowUpRight, IconArrowRight } from "@tabler/icons-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const projects = [
    {
        id: "proj-1",
        title: "Nexa Commerce",
        desc: "E-commerce headless, panier temps réel et API de paiement maison.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            { label: "Node.js", bg: "bg-purple", color: "text-white" },
            { label: "2025",    bg: "bg-card",   color: "text-dark", mono: true },
        ],
        photoBg: "bg-brand",
    },
    {
        id: "proj-2",
        title: "Lumen Studio",
        desc: "Site vitrine immersif, scènes 3D et transitions au scroll.",
        tags: [
            { label: "React",    bg: "bg-brand", color: "text-white" },
            { label: "Three.js", bg: "bg-dark",  color: "text-lime" },
            { label: "2025",     bg: "bg-card",  color: "text-dark", mono: true },
        ],
        photoBg: "bg-lime",
    },
    {
        id: "proj-3",
        title: "Pulse Dashboard",
        desc: "App analytics temps réel, websockets et graphes animés.",
        tags: [
            { label: "Next.js",    bg: "bg-brand",  color: "text-white" },
            { label: "PostgreSQL", bg: "bg-purple",  color: "text-white" },
            { label: "2024",       bg: "bg-card",   color: "text-dark", mono: true },
        ],
        photoBg: "bg-dark",
    },
    {
        id: "proj-4",
        title: "Vibe Festival",
        desc: "Landing événementiel rapide, billetterie et compte à rebours.",
        tags: [
            { label: "Astro", bg: "bg-brand", color: "text-white" },
            { label: "GSAP",  bg: "bg-dark",  color: "text-lime" },
            { label: "2024",  bg: "bg-card",  color: "text-dark", mono: true },
        ],
        photoBg: "bg-purple",
    },
];

function ProjectCard({ proj }: { proj: (typeof projects)[0] }) {
    return (
        <a
            href="#"
            className="block no-underline text-dark bg-white border-brutal rounded-[22px] overflow-hidden shadow-brutal flex-none w-[82vw] sm:w-110"
        >
            <div className={`w-full h-50 sm:h-65 ${proj.photoBg}`} />
            <div className="p-5 sm:px-6.5 sm:py-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-display text-2xl sm:text-[32px] uppercase m-0 leading-[0.95]">
                        {proj.title}
                    </h3>
                    <IconArrowUpRight size={24} />
                </div>
                <p className="text-sm sm:text-[15px] text-muted mt-2.5 mb-4">
                    {proj.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                    {proj.tags.map((tag) => (
                        <span
                            key={tag.label}
                            className={`${tag.bg} ${tag.color} font-semibold text-xs px-3.25 py-1.5 rounded-full ${tag.mono ? "font-mono" : ""}`}
                        >
                            {tag.label}
                        </span>
                    ))}
                </div>
            </div>
        </a>
    );
}

export default function ProjectsSection() {
    const sectionRef  = useRef<HTMLElement>(null);
    const stageRef    = useRef<HTMLDivElement>(null);
    const trackRef    = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!trackRef.current || !stageRef.current) return;

        const mm = gsap.matchMedia();

        mm.add(
            { reduceMotion: "(prefers-reduced-motion: reduce)" },
            (ctx) => {
                const { reduceMotion } = ctx.conditions!;
                if (reduceMotion) return;

                const track   = trackRef.current!;
                const stage   = stageRef.current!;
                const getDist = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);

                gsap.to(track, {
                    x: () => -getDist(),
                    ease: "none",
                    scrollTrigger: {
                        trigger: stage,
                        start: "top top",
                        end: () => "+=" + getDist(),
                        scrub: 1,
                        pin: true,
                        invalidateOnRefresh: true,
                        anticipatePin: 1,
                    },
                });
            }
        );

        return () => mm.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="projets"
            className="relative bg-brand text-white overflow-hidden"
        >
            {/* Japanese watermark */}
            <div
                aria-hidden="true"
                className="absolute top-0 right-0 select-none pointer-events-none overflow-hidden"
            >
                <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-white/5 leading-none whitespace-nowrap">
                    作品集
                </span>
            </div>

            <div
                ref={stageRef}
                className="bg-brand min-h-screen flex flex-col justify-center py-16 pl-4 sm:pl-8 lg:pl-14"
            >
                {/* Header */}
                <div className="flex flex-wrap justify-between items-end gap-5 pr-4 sm:pr-8 lg:pr-14 mb-10">
                    <div>
                        <p className="font-mono text-2xs tracking-[0.14em] uppercase text-lime">
                            02 — Projets sélectionnés
                        </p>
                        <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.9] mt-4 mb-0">
                            Travaux recents
                        </h2>
                    </div>
                    <span className="flex items-center gap-2.5 font-mono text-2xs text-white/70 uppercase">
                        Scroll <IconArrowRight size={18} />
                    </span>
                </div>

                {/* Cards track — always flex-row for horizontal scroll on all screen sizes */}
                <div
                    ref={trackRef}
                    className="flex flex-row gap-6 pr-4 sm:pr-8 lg:pr-14 w-max"
                    style={{ willChange: "transform" }}
                >
                    {projects.map((proj) => (
                        <ProjectCard key={proj.id} proj={proj} />
                    ))}

                    <a
                        href="#"
                        className="no-underline text-white border-[2.5px] border-dashed border-white/40 rounded-[22px] flex flex-col items-center justify-center gap-4 py-10 w-[82vw] sm:w-75 flex-none"
                    >
                        <IconArrowRight size={40} className="text-lime" />
                        <span className="font-display text-[26px] uppercase">
                            Tout voir
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
}
