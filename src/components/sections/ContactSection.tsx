"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    IconMail,
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandX,
} from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const StarPath =
    "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

const socials: { icon: TablerIcon; label: string; href: string }[] = [
    { icon: IconBrandGithub,   label: "GitHub",   href: "https://github.com/" },
    { icon: IconBrandLinkedin, label: "LinkedIn", href: "https://linkedin.com/" },
    { icon: IconBrandX,        label: "X",        href: "https://x.com/" },
];

export default function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (reduced) {
                gsap.set("[data-reveal]", { autoAlpha: 1, y: 0 });
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

            // Parallax star
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
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="relative overflow-hidden bg-dark text-white px-4 sm:px-8 lg:px-14 py-20 lg:py-32.5"
        >
            <svg
                data-parallax="100"
                width="260"
                height="260"
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="absolute -top-16 -right-12 z-1 opacity-85"
            >
                <path d={StarPath} fill="#1E45FB" />
            </svg>

            {/* Japanese watermark */}
            <div aria-hidden="true" className="absolute bottom-0 left-0 select-none pointer-events-none overflow-hidden">
                <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-white/5 leading-none whitespace-nowrap">
                    一緒に作ろう
                </span>
            </div>

            <div className="max-w-310 mx-auto relative z-2">
                <div data-reveal>
                    <p className="font-mono text-2xs tracking-[0.14em] uppercase text-lime">
                        07 — Contact
                    </p>
                    <h2 className="font-display text-[clamp(3rem,10vw,8rem)] uppercase leading-[0.84] mt-5 mb-0">
                        Travaillons
                        <br />
                        <span className="text-lime">ensemble</span>
                    </h2>
                    <p className="text-lg sm:text-xl leading-normal text-white/80 max-w-140 mt-8 mb-10">
                        Un projet web ambitieux, du front au back ? Je suis
                        dispo pour le donner vie — pixel perfect.
                    </p>

                    <div className="flex flex-wrap gap-4 items-center">
                        <a
                            href="mailto:hermannrichy15@gmail.com"
                            className="flex items-center gap-2.5 font-sans font-bold text-base sm:text-[17px] text-dark bg-lime no-underline border-[2.5px] border-lime rounded-full px-7 py-4 sm:py-4.25"
                        >
                            <IconMail size={20} />
                            hermannrichy15@gmail.com
                        </a>

                        <div className="flex gap-2.5">
                            {socials.map(({ icon: SocialIcon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-13.5 h-13.5 border-[2.5px] border-white/30 rounded-full text-white no-underline hover:border-white/60 transition-colors"
                                >
                                    <SocialIcon size={24} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
