"use client";

import { useRef } from "react";
import Image from "next/image";
import { IconMapPin, IconArrowUpRight } from "@tabler/icons-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const StarPath =
    "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

const ROTATE_WORDS = [
    "pixel perfect",
    "dopées à l'IA",
    "qui se démarquent",
    "qui tiennent la route",
    "mémorables",
];

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const img1Ref = useRef<HTMLDivElement>(null);
    const img2Ref = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!titleRef.current) return;

            // --- Photo + fade initiaux ---
            gsap.set(titleRef.current, { autoAlpha: 1 });
            gsap.set("[data-hero-fade]", { autoAlpha: 0, y: 20 });
            gsap.set("[data-hero-photo]", { autoAlpha: 0, y: 30 });

            // --- SplitText ---
            const split = SplitText.create(titleRef.current, {
                type: "lines",
                mask: "lines",
                deepSlice: true,
            });

            // --- Timeline principale ---
            gsap.timeline({ defaults: { ease: "power4.out" } })
                .from(split.lines, {
                    yPercent: 115,
                    duration: 1.05,
                    stagger: 0.12,
                })
                .to(
                    "[data-hero-fade]",
                    { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09 },
                    "-=0.6",
                )
                .to(
                    "[data-hero-photo]",
                    { autoAlpha: 1, y: 0, duration: 0.9 },
                    "-=0.7",
                );

            // --- Parallax ---
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

            // --- Rotateur ---
            const rot =
                sectionRef.current?.querySelector<HTMLElement>("[data-rotate]");
            if (!rot) return;

            let i = 0;
            const timer = setInterval(() => {
                i = (i + 1) % ROTATE_WORDS.length;
                gsap.to(rot, {
                    opacity: 0,
                    duration: 0.22,
                    onComplete: () => {
                        rot.textContent = ROTATE_WORDS[i];
                        gsap.to(rot, { opacity: 1, duration: 0.22 });
                    },
                });
            }, 2200);

            // --- Image flip + badge toutes les 3s ---
            gsap.set(img1Ref.current, { rotation: -2, transformPerspective: 900 });
            gsap.set(img2Ref.current, { rotation: 3, x: 8, y: 4, transformPerspective: 900 });

            const BADGE_TEXTS = ["✦ open to work", "✦ Frontend Master"];
            let badgeIdx = 0;
            let isFront1 = true;

            const flipInterval = setInterval(() => {
                const front = isFront1 ? img1Ref.current : img2Ref.current;
                const back  = isFront1 ? img2Ref.current : img1Ref.current;
                isFront1 = !isFront1;

                gsap.timeline()
                    .to(front, { rotateY: 90, duration: 0.28, ease: "power2.in" })
                    .set(front, { zIndex: 1 })
                    .set(back, { zIndex: 2, rotateY: -90 })
                    .to(back, { rotateY: 0, duration: 0.28, ease: "power2.out" })
                    .to(badgeRef.current, { opacity: 0, y: -5, duration: 0.15 }, 0.08)
                    .add(() => {
                        badgeIdx = (badgeIdx + 1) % BADGE_TEXTS.length;
                        if (badgeRef.current) {
                            badgeRef.current.textContent = BADGE_TEXTS[badgeIdx];
                        }
                    }, 0.32)
                    .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.15 }, 0.32);
            }, 3000);

            return () => {
                clearInterval(timer);
                clearInterval(flipInterval);
            };
        },
        { scope: sectionRef },
    );

    return (
        <section
            ref={sectionRef}
            id="top"
            className="relative overflow-hidden bg-brand text-white pt-30 sm:pt-37.5 pb-0"
        >
            {/* Étoile tournante bg */}
            <svg
                data-parallax="120"
                width="160"
                height="160"
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="hidden lg:block absolute top-32.5 left-[46%] z-1 opacity-90 animate-[hr-spin_22s_linear_infinite]"
            >
                <path d={StarPath} fill="#2E54FF" />
            </svg>

            {/* Grille de contenu */}
            <div className="relative z-2 max-w-310 mx-auto px-4 sm:px-8 lg:px-14 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
                {/* ── Gauche ── */}
                <div>
                    <div
                        data-hero-fade
                        className="flex flex-wrap items-center gap-3 mb-6"
                    >
                        <span className="font-mono text-2xs tracking-[0.12em] uppercase text-lime font-bold">
                            {"// The Frontend Master"}
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-2xs text-white/65">
                            <IconMapPin size={15} />
                            Cotonou, BJ
                        </span>
                    </div>

                    <h1
                        ref={titleRef}
                        data-hero-title
                        className="font-display font-normal uppercase m-0 tracking-[-0.005em] text-[clamp(3.5rem,12vw,7.75rem)] leading-[0.82]"
                        style={{ willChange: "transform" }}
                    >
                        Hermann
                        <br />
                        Richy
                    </h1>

                    <p
                        data-hero-fade
                        className="text-xl sm:text-2xl leading-[1.45] text-white/92 max-w-135 mt-6 mb-0"
                    >
                        Je construis des interfaces{" "}
                        <span
                            data-rotate
                            className="text-lime font-bold inline-block transition-opacity duration-220"
                        >
                            pixel perfect
                        </span>{" "}
                        <br className="hidden sm:block" /> des backends
                        multi-stack et l&apos;IA au cœur de chaque projet.
                    </p>

                    <div data-hero-fade className="flex flex-wrap gap-3.5 mt-9">
                        <a
                            href="#projets"
                            className="flex items-center gap-2 font-sans font-bold text-base text-dark bg-lime no-underline border-brutal rounded-full px-7 py-3.75 shadow-brutal-sm"
                        >
                            Voir mes projets <IconArrowUpRight size={19} />
                        </a>
                        <a
                            href="#contact"
                            className="font-sans font-bold text-base text-white no-underline border-[2.5px] border-white rounded-full px-7 py-3.75"
                        >
                            Me contacter
                        </a>
                    </div>
                </div>

                {/* ── Droite — Photo ── */}
                <div data-hero-photo className="relative mt-10 lg:mt-0">
                    <div
                        data-parallax="-50"
                        className="absolute -top-5 -right-5 w-25 h-25 sm:w-32.5 sm:h-32.5 z-1"
                    >
                        <svg
                            viewBox="0 0 120 120"
                            className="animate-[hr-float_5s_ease-in-out_infinite]"
                            aria-hidden="true"
                        >
                            <g>
                                <ellipse
                                    cx="60"
                                    cy="60"
                                    rx="18"
                                    ry="54"
                                    fill="#CDF22B"
                                />
                                <ellipse
                                    cx="60"
                                    cy="60"
                                    rx="18"
                                    ry="54"
                                    transform="rotate(60 60 60)"
                                    fill="#CDF22B"
                                />
                                <ellipse
                                    cx="60"
                                    cy="60"
                                    rx="18"
                                    ry="54"
                                    transform="rotate(120 60 60)"
                                    fill="#CDF22B"
                                />
                                <circle cx="60" cy="60" r="15" fill="#1E45FB" />
                            </g>
                        </svg>
                    </div>

                    {/* hero2 — derrière, rotation gérée par GSAP */}
                    <div ref={img2Ref} className="absolute inset-0 z-1 border-[3px] border-dark rounded-6.5 overflow-hidden">
                        <Image
                            src="/hero2.png"
                            alt=""
                            fill
                            sizes="(max-width: 1024px) 90vw, 42vw"
                            loading="eager"
                            className="object-cover object-top"
                            aria-hidden="true"
                        />
                    </div>

                    {/* hero1 — devant, rotation gérée par GSAP */}
                    <div ref={img1Ref} className="relative z-2 border-[3px] border-dark rounded-6.5 overflow-hidden shadow-[10px_10px_0_#0D0D0D] w-full h-80 sm:h-105 lg:h-125">
                        <Image
                            src="/hero1.png"
                            alt="Hermann Richy"
                            fill
                            sizes="(max-width: 1024px) 90vw, 42vw"
                            priority
                            className="object-cover object-top"
                        />
                    </div>

                    <div ref={badgeRef} className="absolute -bottom-4 -left-4 z-3 bg-dark text-lime font-mono text-2xs px-4.5 py-3 rounded-full border-[2.5px] border-lime -rotate-3 whitespace-nowrap">
                        ✦ open to work
                    </div>
                </div>
            </div>

            {/* Filigrane japonais */}
            <div
                aria-hidden="true"
                className="absolute bottom-16 left-0 right-0 flex justify-center overflow-hidden select-none pointer-events-none"
            >
                <span className="font-jp font-black text-[clamp(4.5rem,16vw,11rem)] text-white/5 leading-none whitespace-nowrap">
                    フロントエンドの達人
                </span>
            </div>

            {/* Marquee */}
            <div className="mt-16 bg-lime border-y-[3px] border-dark overflow-hidden py-3">
                <div className="flex w-max animate-[hr-marquee_24s_linear_infinite] font-display text-2xl sm:text-[28px] uppercase text-dark whitespace-nowrap">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <span key={i}>
                            React&nbsp;&nbsp;✦&nbsp;&nbsp;Next.js&nbsp;&nbsp;✦&nbsp;&nbsp;TypeScript&nbsp;&nbsp;✦&nbsp;&nbsp;Node.js&nbsp;&nbsp;✦&nbsp;&nbsp;GSAP&nbsp;&nbsp;✦&nbsp;&nbsp;PostgreSQL&nbsp;&nbsp;✦&nbsp;&nbsp;Three.js&nbsp;&nbsp;✦&nbsp;&nbsp;Performance&nbsp;&nbsp;✦&nbsp;&nbsp;
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
