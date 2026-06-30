"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

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

export default function TimeLine() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useGSAP(
        () => {
            const cards = gsap.utils.toArray<HTMLElement>(".timeline-card");
            const totalMilestones = cards.length;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: `+=${totalMilestones * 100}%`,
                    pin: true,
                    scrub: 1,
                    // Calcul dynamique de l'index actif en fonction de la progression globale du scroll
                    onUpdate: (self) => {
                        const progress = self.progress; // Valeur entre 0 et 1
                        // On divise la progression en segments égaux selon le nombre d'éléments
                        const index = Math.min(
                            Math.floor(progress * totalMilestones),
                            totalMilestones - 1,
                        );
                        setActiveIndex(index);
                    },
                },
            });

            // Configuration initiale : toutes les cartes (sauf la 1ère) sont cachées en bas
            gsap.set(cards.slice(1), { opacity: 0, y: 60, scale: 0.95 });

            // Enchaînement des animations d'apparition/disparition
            cards.forEach((card, index) => {
                if (index === 0) return;

                tl.to(
                    cards[index - 1],
                    {
                        opacity: 0,
                        y: -60,
                        scale: 0.95,
                        duration: 1,
                        ease: "power1.inOut",
                    },
                    `card-${index}`,
                )

                    .to(
                        card,
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 1,
                            ease: "power1.inOut",
                        },
                        `card-${index}`,
                    );
            });
        },
        { scope: sectionRef },
    );

    return (
        <div
            ref={sectionRef}
            className="w-full h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row items-center justify-center relative overflow-hidden px-4 md:px-16 gap-8"
        >
            {/* Conteneur principal des cartes (Largeur max contrôlée) */}
            <div className="w-full max-w-4xl relative flex items-center justify-center h-112.5 md:h-75">
                {milestones.map((item, index) => (
                    <div
                        key={index}
                        className="timeline-card absolute w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center gap-6 md:gap-8 will-change-transform"
                    >
                        {/* Badge de l'année */}
                        <div className="md:w-1/4 shrink-0">
                            <span className="inline-block bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold px-5 py-2 rounded-full text-sm tracking-wide">
                                {item.year}
                            </span>
                        </div>

                        {/* Contenu textuel */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                                <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    {item.title}
                                </h3>
                                <span className="text-zinc-300 dark:text-zinc-700 hidden md:inline">
                                    |
                                </span>
                                <span className="text-sm md:text-base font-semibold text-zinc-500 dark:text-zinc-400">
                                    {item.company} —{" "}
                                    <span className="font-normal italic text-xs md:text-sm">
                                        {item.role}
                                    </span>
                                </span>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation par points (Dots) - À droite sur Desktop, en bas sur Mobile */}
            <div className="flex md:flex-col gap-3 justify-center items-center z-10">
                {milestones.map((_, index) => (
                    <div
                        key={index}
                        className={`
              rounded-full transition-all duration-300 ease-out
              ${
                  activeIndex === index
                      ? "bg-blue-600 dark:bg-blue-400 w-8 h-2 md:w-2 md:h-8" // Dot actif : étiré
                      : "bg-zinc-300 dark:bg-zinc-700 w-2 h-2 hover:bg-zinc-400 dark:hover:bg-zinc-500" // Dot inactif : petit cercle
              }
            `}
                    />
                ))}
            </div>
        </div>
    );
}
