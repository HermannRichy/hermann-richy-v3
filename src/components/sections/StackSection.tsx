"use client";

import { useRef, useState, useEffect } from "react";
import {
    IconBrandReact,
    IconBrandTypescript,
    IconBolt,
    IconBrandTailwind,
    IconBrandNodejs,
    IconDatabase,
    IconApi,
    IconBrandPython,
    IconBrandGolang,
    IconBrain,
    IconRobot,
    IconCode,
    IconBrandFigma,
    IconBrandVite,
    IconBrandFirebase,
    IconBrandDocker,
    IconBrandGraphql,
    IconBrandMongodb,
    IconBrandPhp,
    IconServer,
    IconTerminal2,
    IconCpu,
    IconBrandRedux,
    IconBrandNextjs,
    IconPackage,
} from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

// Chaque pill tombe d'une hauteur aléatoire, avec rotation et délai propres
function gravityFall(container: HTMLDivElement | null) {
    const pills =
        container?.querySelectorAll<HTMLElement>(".skill-pill");
    if (!pills || pills.length === 0) return;

    gsap.killTweensOf(Array.from(pills));

    Array.from(pills).forEach((pill) => {
        const startY = gsap.utils.random(-120, -420);
        const startX = gsap.utils.random(-30, 30);
        const startRot = gsap.utils.random(-35, 35);
        const endRot = gsap.utils.random(-5, 5);
        const dur = gsap.utils.random(0.65, 1.25);
        const delay = gsap.utils.random(0, 0.65);

        gsap.fromTo(
            pill,
            { y: startY, x: startX, rotation: startRot, opacity: 0 },
            {
                y: 0,
                x: 0,
                rotation: endRot,
                opacity: 1,
                duration: dur,
                delay,
                ease: "bounce.out",
                clearProps: "x",
            },
        );
    });
}

// Sortie : chaque pill s'envole dans une direction aléatoire
function gravityExit(
    pills: NodeListOf<HTMLElement>,
    onDone: () => void,
) {
    const tl = gsap.timeline({ onComplete: onDone });
    Array.from(pills).forEach((pill, i) => {
        tl.to(
            pill,
            {
                y: gsap.utils.random(-60, -140),
                x: gsap.utils.random(-25, 25),
                rotation: gsap.utils.random(-25, 25),
                opacity: 0,
                duration: 0.22,
                ease: "power3.in",
            },
            i * 0.018,
        );
    });
}

const KATAKANA =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

interface Skill {
    icon: TablerIcon;
    label: string;
}

interface Category {
    id: string;
    label: string;
    dotClass: string;
    pillClass: string;
    iconClass: string;
    tabActiveClass: string;
    skills: Skill[];
}

const categories: Category[] = [
    {
        id: "frontend",
        label: "Frontend",
        dotClass: "bg-brand",
        pillClass: "bg-brand/10 border-brand/25 text-white/85",
        iconClass: "text-blue-400",
        tabActiveClass: "bg-brand text-white border-brand",
        skills: [
            { icon: IconBrandReact, label: "React" },
            { icon: IconBrandNextjs, label: "Next.js" },
            { icon: IconBrandTypescript, label: "TypeScript" },
            { icon: IconBolt, label: "GSAP / Motion" },
            { icon: IconBrandTailwind, label: "Tailwind CSS" },
            { icon: IconCode, label: "Three.js / WebGL" },
            { icon: IconBrandFigma, label: "Figma" },
            { icon: IconBrandVite, label: "Vite" },
            { icon: IconBrandRedux, label: "Zustand / Redux" },
            { icon: IconPackage, label: "SWR / React Query" },
            { icon: IconBolt, label: "Framer Motion" },
            { icon: IconCode, label: "HTML / CSS" },
        ],
    },
    {
        id: "backend",
        label: "Backend",
        dotClass: "bg-lime",
        pillClass: "bg-lime/10 border-lime/20 text-lime",
        iconClass: "text-lime",
        tabActiveClass: "bg-lime text-dark border-lime",
        skills: [
            { icon: IconBrandNodejs, label: "Node.js / Express" },
            { icon: IconBrandGolang, label: "Go" },
            { icon: IconBrandPython, label: "Python" },
            { icon: IconBrandPhp, label: "Laravel / PHP" },
            { icon: IconDatabase, label: "PostgreSQL" },
            { icon: IconBrandDocker, label: "Docker / CI-CD" },
            { icon: IconDatabase, label: "Redis" },
            { icon: IconBrandMongodb, label: "MongoDB" },
            { icon: IconBrandGraphql, label: "GraphQL / REST" },
            { icon: IconBrandFirebase, label: "Firebase" },
            { icon: IconServer, label: "Prisma / ORM" },
            { icon: IconTerminal2, label: "Bash / Linux" },
        ],
    },
    {
        id: "ia",
        label: "IA & Auto",
        dotClass: "bg-violet-400",
        pillClass: "bg-violet-400/10 border-violet-400/20 text-violet-300",
        iconClass: "text-violet-300",
        tabActiveClass: "bg-violet-400 text-white border-violet-400",
        skills: [
            { icon: IconBrain, label: "OpenAI GPT-4o" },
            { icon: IconBrain, label: "Google Gemini" },
            { icon: IconRobot, label: "Claude (Anthropic)" },
            { icon: IconCpu, label: "LangChain" },
            { icon: IconCode, label: "Hugging Face" },
            { icon: IconTerminal2, label: "Puppeteer / Scraping" },
            { icon: IconApi, label: "DeepL API" },
            { icon: IconRobot, label: "Cursor / Antigravity" },
            { icon: IconCode, label: "Pipelines Python" },
            { icon: IconServer, label: "Make / Zapier" },
            { icon: IconCode, label: "BeautifulSoup" },
            { icon: IconCpu, label: "Agents autonomes" },
        ],
    },
];

export default function StackSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);
    const pillsRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState(0);
    const isFirstRender = useRef(true);

    useGSAP(
        () => {
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

            // Chute initiale avec gravité simulée
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 75%",
                once: true,
                onEnter: () => gravityFall(pillsRef.current),
            });
        },
        { scope: sectionRef },
    );

    useGSAP(() => {
        if (!labelRef.current) return;
        gsap.to(labelRef.current, {
            duration: 1.5,
            scrambleText: {
                text: "05 — Stack",
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

    // Chute gravitationnelle des nouvelles pills après changement de tab
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        gravityFall(pillsRef.current);
    }, [activeTab]);

    function switchTab(index: number) {
        if (index === activeTab) return;
        const pills =
            pillsRef.current?.querySelectorAll<HTMLElement>(".skill-pill");
        if (pills && pills.length > 0) {
            gravityExit(pills, () => setActiveTab(index));
        } else {
            setActiveTab(index);
        }
    }

    const cat = categories[activeTab];

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-dark text-white px-4 sm:px-8 lg:px-14 py-16 lg:py-30"
        >
            {/* Watermark japonais */}
            <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
            >
                <span className="font-jp font-black text-[clamp(4rem,16vw,12rem)] text-white/5 leading-none whitespace-nowrap">
                    技術スタック
                </span>
            </div>

            <div className="max-w-310 mx-auto">
                {/* En-tête */}
                <div className="reveal-group mb-10 opacity-0 translate-y-8">
                    <p
                        ref={labelRef}
                        className="font-mono text-2xs tracking-[0.14em] uppercase text-lime"
                    >
                        05 — 技術スタック
                    </p>
                    <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.9] mt-4 mb-0">
                        Mes outils
                    </h2>
                </div>

                {/* Tabs */}
                <div className="reveal-group flex flex-wrap gap-3 mb-10 opacity-0 translate-y-8">
                    {categories.map((c, i) => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => switchTab(i)}
                            className={`font-display text-sm sm:text-base uppercase px-5 py-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
                                activeTab === i
                                    ? c.tabActiveClass
                                    : "bg-transparent text-white/45 border-white/20 hover:text-white hover:border-white/50"
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>

                {/* Pills */}
                <div ref={pillsRef} className="flex flex-wrap gap-3">
                    {cat.skills.map((s) => {
                        const SkillIcon = s.icon;
                        return (
                            <span
                                key={s.label}
                                className={`skill-pill flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-sans font-medium opacity-0 ${cat.pillClass}`}
                            >
                                <SkillIcon
                                    size={15}
                                    className={`flex-none ${cat.iconClass}`}
                                />
                                {s.label}
                            </span>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
