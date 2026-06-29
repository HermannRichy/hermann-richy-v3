"use client";

import { useRef } from "react";
import {
    IconMapPin,
    IconStack2,
    IconSchool,
    IconBriefcase,
} from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const KATAKANA =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

const StarPath =
    "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

const cards: { icon: TablerIcon; label: string }[] = [
    { icon: IconMapPin, label: "Cotonou, Bénin" },
    { icon: IconStack2, label: "Fullstack & IA" },
    { icon: IconSchool, label: "4 ans formateur" },
    { icon: IconBriefcase, label: "CEO & Lead Dev" },
];

export default function AboutSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            // 1. Révélation du titre (Mot par mot)
            const titleSplit = new SplitText("[data-split-title]", {
                type: "words",
                autoSplit: true, // Gère le responsive nativement
            });

            gsap.fromTo(
                titleSplit.words,
                { yPercent: 100, autoAlpha: 0 },
                {
                    yPercent: 0,
                    autoAlpha: 1,
                    duration: 0.8,
                    ease: "power4.out",
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: "[data-split-title]",
                        start: "top 85%",
                    },
                },
            );

            // 2. Révélation des paragraphes (Ligne par ligne)
            const textSplit = new SplitText("[data-split-text]", {
                type: "lines",
                autoSplit: true,
            });

            // Standard moderne : on anime via un fromTo pour écraser tout comportement React latent
            gsap.fromTo(
                textSplit.lines,
                { autoAlpha: 0, y: 20 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    stagger: 0.06,
                    scrollTrigger: {
                        trigger: "[data-split-text]",
                        start: "top 80%",
                    },
                },
            );

            // 3. Effet ScrambleText sur le label
            gsap.to("[data-scramble]", {
                duration: 1.5,
                scrambleText: {
                    text: "02 — À propos",
                    chars: KATAKANA,
                    revealDelay: 0.3,
                    speed: 0.5,
                },
                scrollTrigger: {
                    trigger: "[data-scramble]",
                    start: "top 90%",
                    once: true,
                },
            });

            // 4. Barres de compétences
            gsap.utils
                .toArray<HTMLElement>("[data-split]", sectionRef.current)
                .forEach((el) => {
                    gsap.to(el, {
                        width: (el.getAttribute("data-split") || "0") + "%",
                        duration: 1.2,
                        ease: "power3.inOut",
                        scrollTrigger: { trigger: el, start: "top 90%" },
                    });
                });

            // 5. Cartes d'infos (Révélation en cascade)
            gsap.set("[data-card-reveal]", { autoAlpha: 0, y: 20 });
            ScrollTrigger.batch("[data-card-reveal]", {
                start: "top 88%",
                once: true,
                onEnter: (batch) =>
                    gsap.to(batch, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out",
                        stagger: 0.08,
                    }),
            });

            // Parallaxe Étoile
            gsap.utils
                .toArray<HTMLElement>("[data-parallax]", sectionRef.current)
                .forEach((el) => {
                    const amt = parseFloat(
                        el.getAttribute("data-parallax") || "40",
                    );
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
        },
        { scope: sectionRef },
    );

    return (
        <section
            ref={sectionRef}
            id="apropos"
            className="relative overflow-hidden bg-cream px-4 sm:px-8 lg:px-14 py-16 lg:py-30"
        >
            {/* Japanese watermark */}
            <div
                aria-hidden="true"
                className="absolute bottom-0 right-0 select-none pointer-events-none overflow-hidden"
            >
                <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-dark/5 leading-none whitespace-nowrap">
                    開発者
                </span>
            </div>

            <div className="max-w-310 mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-18 items-start">
                {/* ── Left ── */}
                <div>
                    <p
                        data-scramble
                        className="font-mono text-2xs tracking-[0.14em] uppercase text-brand"
                    >
                        02 — 自己紹介
                    </p>
                    <h2
                        data-split-title
                        className="font-display text-[clamp(3rem,8vw,5rem)] uppercase leading-[0.88] mt-4 mb-0 overflow-hidden"
                    >
                        Derriere
                        <br />
                        l&apos;ecran
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
                <div>
                    {/* RETRAIT DE LA CLASSE 'invisible' : GSAP gère l'opacité de départ de manière propre */}
                    <p
                        data-split-text
                        className="text-xl sm:text-2xl lg:text-[26px] leading-[1.45] text-dark font-medium mt-0 mb-6"
                    >
                        Je suis Hermann Richy, développeur fullstack basé à
                        Cotonou. 5 ans à traverser le web — de
                        l&apos;HTML/CSS au fullstack JS/TS, avec Go, Python
                        et Laravel côté serveur, et l&apos;IA agentique au
                        cœur des projets. Chaque interface se démarque,
                        chaque backend tient la charge.
                    </p>
                    <p
                        data-split-text
                        className="text-base sm:text-lg leading-[1.6] text-muted mb-8 max-w-150"
                    >
                        Pendant 4 ans, j&apos;ai formé des développeurs aux
                        centres FuturCraft Institut (Godomey) et Cefora
                        Formation (Agla). Depuis janvier&nbsp;2024, je dirige
                        Digital Innovation en tant que CEO. Depuis
                        mai&nbsp;2024, Responsable Web chez Programme FUTUR.
                        50&nbsp;projets développés — chacun pixel perfect.
                    </p>

                    {/* Frontend / Backend split bar */}
                    <div className="mb-9 max-w-140">
                        <div className="flex justify-between font-mono text-[12px] uppercase tracking-[0.08em] text-muted mb-2.5">
                            <span>Frontend</span>
                            <span>Backend</span>
                        </div>
                        <div className="flex h-12 border-brutal rounded-xl overflow-hidden">
                            <div
                                data-split="55"
                                style={{ width: 0 }}
                                className="bg-brand"
                            />
                            <div
                                data-split="45"
                                style={{ width: 0 }}
                                className="bg-lime border-l-[2.5px] border-dark"
                            />
                        </div>
                    </div>

                    {/* Info cards */}
                    <div className="grid grid-cols-2 gap-3.5 max-w-140">
                        {cards.map(({ icon: CardIcon, label }) => (
                            <div
                                key={label}
                                data-card-reveal
                                className="flex items-center gap-3 bg-white border-2 border-dark rounded-[14px] px-4 sm:px-4.5 py-4"
                            >
                                <CardIcon
                                    size={22}
                                    className="text-brand flex-none"
                                />
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
