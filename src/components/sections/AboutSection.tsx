"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { IconMapPin, IconStack2, IconSchool, IconBriefcase } from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const StarPath =
    "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

const cards: { icon: TablerIcon; label: string }[] = [
    { icon: IconMapPin,    label: "Cotonou, Bénin" },
    { icon: IconStack2,    label: "Fullstack JS/TS" },
    { icon: IconSchool,    label: "4 ans formateur" },
    { icon: IconBriefcase, label: "CEO & Lead Dev" },
];

export default function AboutSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            gsap.set("[data-reveal]", { autoAlpha: 1, y: 0 });
            gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
                el.style.width = (el.getAttribute("data-split") || "0") + "%";
            });
            return;
        }

        ScrollTrigger.batch(gsap.utils.toArray<HTMLElement>("[data-reveal]"), {
            start: "top 88%",
            once: true,
            onEnter: (batch) =>
                gsap.fromTo(
                    batch,
                    { autoAlpha: 0, y: 30 },
                    { autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.1 }
                ),
        });

        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
            gsap.to(el, {
                width: (el.getAttribute("data-split") || "0") + "%",
                duration: 1.2,
                ease: "power3.inOut",
                scrollTrigger: { trigger: el, start: "top 90%" },
            });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
            const amt = parseFloat(el.getAttribute("data-parallax") || "40");
            gsap.to(el, {
                y: amt,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });
        });
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            id="apropos"
            className="relative overflow-hidden bg-cream px-4 sm:px-8 lg:px-14 py-16 lg:py-30"
        >
            {/* Japanese watermark */}
            <div aria-hidden="true" className="absolute bottom-0 right-0 select-none pointer-events-none overflow-hidden">
                <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-dark/5 leading-none whitespace-nowrap">
                    開発者
                </span>
            </div>

            <div className="max-w-310 mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-18 items-start">
                {/* ── Left ── */}
                <div data-reveal>
                    <p className="font-mono text-2xs tracking-[0.14em] uppercase text-brand">
                        01 — À propos
                    </p>
                    <h2 className="font-display text-[clamp(3rem,8vw,5rem)] uppercase leading-[0.88] mt-4 mb-0">
                        Derrière
                        <br />
                        l&apos;écran
                    </h2>
                    <svg
                        data-parallax="-40"
                        width="120"
                        height="120"
                        viewBox="0 0 100 100"
                        className="mt-8 hidden sm:block"
                        aria-hidden="true"
                    >
                        <path d={StarPath} fill="#1E45FB" />
                    </svg>
                </div>

                {/* ── Right ── */}
                <div data-reveal>
                    <p className="text-xl sm:text-2xl lg:text-[26px] leading-[1.45] text-dark font-medium mt-0 mb-6">
                        Je suis Hermann Richy, développeur fullstack basé à
                        Cotonou. 5 ans à traverser le web — du PHP&nbsp;&amp;&nbsp;Bootstrap
                        à React, Next.js, Node.js et aujourd&apos;hui GSAP&nbsp;&amp;&nbsp;Three.js.
                        Chaque projet livre une interface qui se démarque et une API
                        qui tient la charge.
                    </p>
                    <p className="text-base sm:text-lg leading-[1.6] text-muted mb-8 max-w-150">
                        Pendant 4 ans, j&apos;ai formé des développeurs aux centres
                        FuturCraft Institut (Godomey) et Cefora Formation (Agla).
                        Depuis janvier&nbsp;2024, je dirige Digital Innovation en tant
                        que CEO. Depuis mai&nbsp;2024, Responsable Web chez Programme
                        FUTUR. 50&nbsp;projets développés — chacun pixel perfect.
                    </p>

                    {/* Frontend / Backend split bar */}
                    <div className="mb-9 max-w-140">
                        <div className="flex justify-between font-mono text-[12px] uppercase tracking-[0.08em] text-muted mb-2.5">
                            <span>Frontend</span>
                            <span>Backend</span>
                        </div>
                        <div className="flex h-12 border-brutal rounded-xl overflow-hidden">
                            <div data-split="60" className="w-0 bg-brand" />
                            <div data-split="40" className="w-0 bg-lime border-l-[2.5px] border-dark" />
                        </div>
                    </div>

                    {/* Info cards */}
                    <div className="grid grid-cols-2 gap-3.5 max-w-140">
                        {cards.map(({ icon: CardIcon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 bg-white border-2 border-dark rounded-[14px] px-4 sm:px-4.5 py-4"
                            >
                                <CardIcon size={22} className="text-brand flex-none" />
                                <span className="font-semibold text-sm sm:text-[15px]">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
