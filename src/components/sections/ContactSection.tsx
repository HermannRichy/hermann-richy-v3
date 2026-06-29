"use client";

import { useRef } from "react";
import {
    IconMail,
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandX,
} from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const StarPath =
    "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

const socials: {
    icon: TablerIcon;
    label: string;
    href: string;
    handle: string;
}[] = [
    {
        icon: IconBrandGithub,
        label: "GitHub",
        href: "https://github.com",
        handle: "GitHub",
    },
    {
        icon: IconBrandLinkedin,
        label: "LinkedIn",
        href: "https://linkedin.com",
        handle: "LinkedIn",
    },
    {
        icon: IconBrandX,
        label: "X",
        href: "https://x.com",
        handle: "Twitter / X",
    },
];

export default function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const starRef = useRef<SVGSVGElement>(null);

    useGSAP(
        () => {
            // Animation d'apparition simple en cascade au scroll
            gsap.to(".reveal-item", {
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

            // Parallaxe fluide sur le SVG d'étoile en arrière-plan
            if (starRef.current) {
                gsap.to(starRef.current, {
                    y: 100,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            }
        },
        { scope: sectionRef },
    );

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="relative overflow-hidden bg-dark text-white px-4 sm:px-8 lg:px-14 py-20 lg:py-32.5"
        >
            {/* Étoile avec parallaxe */}
            <svg
                ref={starRef}
                width="260"
                height="260"
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="absolute -top-16 -right-12 z-1 opacity-85 will-change-transform"
            >
                <path d={StarPath} fill="#1E45FB" />
            </svg>

            {/* Watermark japonais */}
            <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 select-none pointer-events-none overflow-hidden"
            >
                <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-white/5 leading-none whitespace-nowrap">
                    一緒に作ろう
                </span>
            </div>

            <div className="max-w-310 mx-auto relative z-2">
                <div className="reveal-item opacity-0 translate-y-8">
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
                        dispo pour lui donner vie — pixel perfect.
                    </p>

                    {/* Conteneur des boutons */}
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Bouton Email - Toujours déplié avec fond vert */}
                        <a
                            href="mailto:hermannrichy15@gmail.com"
                            className="flex items-center gap-2.5 font-sans font-bold text-base sm:text-[17px] text-dark bg-lime no-underline border-[2.5px] border-lime rounded-full px-7 py-4 transition-transform duration-300 hover:scale-[1.02]"
                        >
                            <IconMail size={20} />
                            hermannrichy15@gmail.com
                        </a>

                        {/* Liens Réseaux Sociaux - Deviennent verts et dévoilent le texte au hover */}
                        {socials.map(
                            ({ icon: SocialIcon, label, href, handle }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-center h-14 w-14 hover:w-auto hover:justify-start font-sans font-bold text-base sm:text-[17px] text-white bg-transparent no-underline border-[2.5px] border-white/30 rounded-full px-4 hover:px-7 transition-all duration-300 ease-out hover:border-lime hover:bg-lime hover:text-dark hover:scale-[1.02]"
                                >
                                    <SocialIcon
                                        size={20}
                                        className="shrink-0"
                                    />

                                    {/* Le texte se déploie horizontalement et apparaît en fondu uniquement au hover */}
                                    <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2.5 transition-all duration-300 ease-out whitespace-nowrap">
                                        {handle}
                                    </span>
                                </a>
                            ),
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
