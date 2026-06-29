"use client";

import { useRef } from "react";
import {
    IconBrandReact,
    IconBrandTypescript,
    IconBolt,
    IconBrandTailwind,
    IconBrandNodejs,
    IconDatabase,
    IconApi,
    IconCloud,
} from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SkillBar {
    icon: TablerIcon;
    label: string;
    value: number;
}

const frontend: SkillBar[] = [
    { icon: IconBrandReact, label: "React / Next.js", value: 95 },
    { icon: IconBrandTypescript, label: "TypeScript", value: 90 },
    { icon: IconBolt, label: "GSAP / Motion", value: 88 },
    { icon: IconBrandTailwind, label: "Tailwind / CSS", value: 92 },
];

const backend: SkillBar[] = [
    { icon: IconBrandNodejs, label: "Node.js / Express", value: 85 },
    { icon: IconDatabase, label: "PostgreSQL / Prisma", value: 80 },
    { icon: IconApi, label: "API REST / tRPC", value: 82 },
    { icon: IconCloud, label: "Docker / Deploy", value: 75 },
];

function BarGroup({
    skills,
    barColor,
    dotColor,
    title,
}: {
    skills: SkillBar[];
    barColor: string;
    dotColor: string;
    title: string;
}) {
    return (
        <div className="reveal-group opacity-0 translate-y-8">
            <div className="flex items-center gap-2.5 mb-6">
                <span className={`w-3 h-3 rounded-full ${dotColor}`} />
                <span className="font-display text-[26px] uppercase">
                    {title}
                </span>
            </div>
            <div className="flex flex-col gap-4.5">
                {skills.map((s) => {
                    const SkillIcon = s.icon;
                    return (
                        <div key={s.label}>
                            <div className="mb-1.75">
                                <span className="flex items-center gap-2 font-semibold text-sm sm:text-[15px]">
                                    <SkillIcon
                                        size={20}
                                        className="text-lime flex-none"
                                    />
                                    {s.label}
                                </span>
                            </div>
                            <div className="h-2.5 bg-[#1F1F1F] rounded-full overflow-hidden">
                                <div
                                    style={{ width: `${s.value}%` }}
                                    className={`skill-bar w-0 h-full ${barColor} rounded-full origin-left`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function StackSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            // 1. Animation d'apparition des blocs de texte et groupes (Stagger simple)
            gsap.to(".reveal-group", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                },
            });

            // 2. Animation de remplissage des barres de progression au format "scaleX" (plus performant que animer le width)
            gsap.from(".skill-bar", {
                scaleX: 0,
                duration: 1.2,
                ease: "power3.out",
                stagger: 0.05,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
            });
        },
        { scope: sectionRef },
    );

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-dark text-white px-4 sm:px-8 lg:px-14 py-16 lg:py-30"
        >
            {/* Japanese watermark */}
            <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
            >
                <span className="font-jp font-black text-[clamp(4rem,16vw,12rem)] text-white/5 leading-none whitespace-nowrap">
                    技術スタック
                </span>
            </div>

            <div className="max-w-310 mx-auto">
                <div className="reveal-group mb-12 opacity-0 translate-y-8">
                    <p className="font-mono text-2xs tracking-[0.14em] uppercase text-lime">
                        03 — Stack technique
                    </p>
                    <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.9] mt-4 mb-0">
                        Mes outils
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
                    <BarGroup
                        skills={frontend}
                        barColor="bg-brand"
                        dotColor="bg-brand"
                        title="Frontend"
                    />
                    <BarGroup
                        skills={backend}
                        barColor="bg-lime"
                        dotColor="bg-lime"
                        title="Backend"
                    />
                </div>
            </div>
        </section>
    );
}
