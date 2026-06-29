"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const StarPath =
    "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

const stats = [
    { count: 5, suffix: "+", label: "Années d'expérience web" },
    { count: 50, suffix: "+", label: "Projets développés" },
    { count: 4, suffix: "+", label: "Années à former les devs" },
    { count: 98, suffix: "", label: "Score Lighthouse moyen" },
];

export default function NumbersSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            // 1. Animation d'apparition des blocs de statistiques en cascade
            gsap.to(".reveal-stat", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                },
            });

            // 2. Compteur incrémentiel natif avec GSAP (Remplace le requestAnimationFrame manuel)
            gsap.utils.toArray<HTMLElement>(".count-number").forEach((el) => {
                const targetValue = parseInt(
                    el.getAttribute("data-target") || "0",
                    10,
                );

                // Objet temporaire pour stocker la valeur pendant l'animation
                const counter = { val: 0 };

                gsap.to(counter, {
                    val: targetValue,
                    duration: 1.5,
                    ease: "power3.out",
                    snap: { val: 1 }, // Force des nombres entiers (arrondis) à chaque étape
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                    },
                    onUpdate: () => {
                        el.textContent = counter.val.toString();
                    },
                });
            });
        },
        { scope: sectionRef },
    );

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-brand text-white px-4 sm:px-8 lg:px-14 py-20 lg:py-25"
        >
            <svg
                data-parallax="60"
                width="180"
                height="180"
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="absolute -top-8 -left-8 opacity-35"
            >
                <path d={StarPath} fill="#CDF22B" />
            </svg>

            {/* Japanese watermark */}
            <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
            >
                <span className="font-jp font-black text-[clamp(5rem,18vw,13rem)] text-white/5 leading-none whitespace-nowrap">
                    実績
                </span>
            </div>

            <div className="max-w-310 mx-auto grid grid-cols-2 lg:grid-cols-4 gap-5 relative z-2">
                {stats.map(({ count, suffix, label }) => (
                    <div
                        key={label}
                        className="reveal-stat opacity-0 translate-y-8"
                    >
                        <div className="font-display text-[clamp(3.5rem,10vw,6rem)] leading-[0.85] text-lime">
                            {/* Le chiffre de départ est à 0 pour l'animation, la cible est stockée dans data-target */}
                            <span className="count-number" data-target={count}>
                                0
                            </span>
                            <span>{suffix}</span>
                        </div>
                        <p className="text-sm sm:text-base text-white/85 mt-3 mb-0 max-w-50">
                            {label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
