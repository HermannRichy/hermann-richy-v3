"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const StarPath =
    "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

const lines = [
    {
        key: "l1",
        era: "2021",
        text: "Decouverte du web : HTML5 & CSS3",
        special: false,
    },
    { key: "l2", era: "2022", text: "PHP, Bootstrap & JS", special: false },
    { key: "l3", era: "2023", text: "React & Firebase", special: false },
    {
        key: "l4",
        era: "2024",
        text: "Next.js, Node.js & Shadcn/UI",
        special: false,
    },
    { key: "l5", era: "2025", text: "GSAP & Three.js", special: false },
    {
        key: "l6",
        era: "2026",
        text: null,
        special: true,
        accent: "Pixel perfect.",
        after: " Now & 4ever.",
    },
];

export default function StorySection() {
    const sectionStoryRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const storyLines = gsap.utils.toArray<HTMLElement>(
                "[data-story-line]",
                sectionStoryRef.current,
            );
            if (!storyLines.length) return;

            // 1. On cible les enfants directs (l'année span, le texte, etc.)
            // Nous utilisons "*" pour cibler tous les éléments enfants de chaque ligne
            storyLines.forEach((l) => {
                gsap.set(l.children, { autoAlpha: 0, x: -20 });
            });

            const stl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionStoryRef.current,
                    start: "top top",
                    end: `+=${storyLines.length * 150}%`, // Augmenté légèrement pour donner du temps au scroll
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            // 2. On anime les enfants avec un effet de cascade (stagger)
            storyLines.forEach((l, index) => {
                stl.to(
                    l.children,
                    {
                        autoAlpha: 1,
                        x: 0,
                        duration: 1,
                        ease: "power2.out",
                        stagger: 0.3, // Crée le décalage "un à un" entre l'année et le texte
                    },
                    index * 1.5, // Espace le déclenchement de chaque gros bloc de ligne
                );
            });
        },
        { scope: sectionStoryRef },
    );

    return (
        <section
            ref={sectionStoryRef}
            id="intro"
            className="relative overflow-hidden bg-dark text-white min-h-screen flex items-center px-4 sm:px-8 lg:px-14 py-10"
        >
            <svg
                data-parallax="80"
                width="220"
                height="220"
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="absolute -bottom-12 -right-10 opacity-50"
            >
                <path d={StarPath} fill="#1E45FB" />
            </svg>

            <div
                aria-hidden="true"
                className="absolute bottom-0 right-0 select-none pointer-events-none overflow-hidden"
            >
                <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-white/5 leading-none whitespace-nowrap">
                    進化
                </span>
            </div>

            <div className="max-w-310 mx-auto w-full relative z-2">
                <p className="font-mono text-2xs tracking-[0.14em] uppercase text-lime mb-10">
                    {"// Parcours technique"}
                </p>

                <div className="flex flex-col gap-2">
                    {lines.map(({ key, era, text, accent, after, special }) => (
                        <div
                            key={key}
                            data-story-line
                            // Ajout de invisible pour éviter le flash blanc au chargement
                            className={[
                                "font-display uppercase leading-[0.98] invisible",
                                "text-[clamp(2.25rem,8vw,4rem)]",
                                special ? "text-brand" : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            style={
                                special
                                    ? { WebkitTextStroke: "2px #CDF22B" }
                                    : undefined // Suppression de l'opacité inline en dur
                            }
                        >
                            {special ? (
                                <>
                                    {/* On isole chaque morceau dans un span pour le stagger */}
                                    <span className="text-lime">{accent}</span>
                                    <span>{after}</span>
                                </>
                            ) : (
                                <>
                                    {era && (
                                        <span
                                            className="block font-mono tracking-[0.18em] uppercase mb-1"
                                            style={{
                                                fontSize:
                                                    "clamp(0.6rem,1.2vw,0.75rem)",
                                                fontWeight: 400,
                                                color: "rgba(205,242,43,0.6)",
                                                WebkitTextStroke: 0,
                                            }}
                                        >
                                            {era} —
                                        </span>
                                    )}
                                    {/* Enveloppé dans un span pour apparaître après l'ère */}
                                    <span className="block">{text}</span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
