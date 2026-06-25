"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface SkillBar {
    icon: TablerIcon;
    label: string;
    value: number;
}

const frontend: SkillBar[] = [
    { icon: IconBrandReact,      label: "React / Next.js",    value: 95 },
    { icon: IconBrandTypescript, label: "TypeScript",          value: 90 },
    { icon: IconBolt,            label: "GSAP / Motion",       value: 88 },
    { icon: IconBrandTailwind,   label: "Tailwind / CSS",      value: 92 },
];

const backend: SkillBar[] = [
    { icon: IconBrandNodejs, label: "Node.js / Express",    value: 85 },
    { icon: IconDatabase,    label: "PostgreSQL / Prisma",   value: 80 },
    { icon: IconApi,         label: "API REST / tRPC",       value: 82 },
    { icon: IconCloud,       label: "Docker / Deploy",       value: 75 },
];

function BarGroup({
    skills,
    barColor,
    dotColor,
    title,
    delay,
}: {
    skills: SkillBar[];
    barColor: string;
    dotColor: string;
    title: string;
    delay?: number;
}) {
    return (
        <div data-reveal {...(delay ? { "data-delay": delay } : {})}>
            <div className="flex items-center gap-2.5 mb-6">
                <span className={`w-3 h-3 rounded-full ${dotColor}`} />
                <span className="font-display text-[26px] uppercase">{title}</span>
            </div>
            <div className="flex flex-col gap-4.5">
                {skills.map((s) => {
                    const SkillIcon = s.icon;
                    return (
                        <div key={s.label}>
                            <div className="mb-1.75">
                                <span className="flex items-center gap-2 font-semibold text-sm sm:text-[15px]">
                                    <SkillIcon size={20} className="text-lime flex-none" />
                                    {s.label}
                                </span>
                            </div>
                            <div className="h-2.5 bg-[#1F1F1F] rounded-full overflow-hidden">
                                <div
                                    data-bar={`${s.value}%`}
                                    className={`w-0 h-full ${barColor} rounded-full`}
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
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (reduced) {
                gsap.set("[data-reveal]", { opacity: 1, transform: "none" });
                gsap.utils.toArray<HTMLElement>("[data-bar]").forEach((el) => {
                    el.style.width = el.getAttribute("data-bar") || "0%";
                });
                return;
            }

            // Reveal
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

            // Skill bars
            gsap.utils.toArray<HTMLElement>("[data-bar]").forEach((el) => {
                gsap.to(el, {
                    width: el.getAttribute("data-bar") ?? "0%",
                    duration: 1.1,
                    ease: "power3.out",
                    scrollTrigger: { trigger: el, start: "top 92%" },
                });
            });
        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} className="relative overflow-hidden bg-dark text-white px-4 sm:px-8 lg:px-14 py-16 lg:py-30">
            {/* Japanese watermark */}
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
                <span className="font-jp font-black text-[clamp(4rem,16vw,12rem)] text-white/5 leading-none whitespace-nowrap">
                    技術スタック
                </span>
            </div>

            <div className="max-w-310 mx-auto">
                <div data-reveal className="mb-12">
                    <p className="font-mono text-2xs tracking-[0.14em] uppercase text-lime">
                        03 — Stack technique
                    </p>
                    <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.9] mt-4 mb-0">
                        Mes outils
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
                    <BarGroup skills={frontend} barColor="bg-brand" dotColor="bg-brand" title="Frontend" />
                    <BarGroup skills={backend}  barColor="bg-lime"  dotColor="bg-lime"  title="Backend" delay={120} />
                </div>
            </div>
        </section>
    );
}
