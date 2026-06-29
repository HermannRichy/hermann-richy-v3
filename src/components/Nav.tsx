"use client";

import { useState, useRef } from "react";
import { IconMenu, IconX } from "@tabler/icons-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const StarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 100 100" aria-hidden="true">
        <path
            d="M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z"
            fill="#CDF22B"
            id="starNav"
        />
    </svg>
);

const navLinks = [
    { href: "#apropos", label: "À propos" },
    { href: "#projets", label: "Projets" },
    { href: "#services", label: "Services" },
    { href: "#process", label: "Processus" },
];

export default function Nav() {
    const navRef = useRef<HTMLElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    useGSAP(
        () => {
            // Entrée initiale
            gsap.fromTo(
                navRef.current,
                { y: -80, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.9,
                    ease: "power3.out",
                    delay: 1.2,
                    onComplete: () => {
                        const showNav = () =>
                            gsap.to(navRef.current, {
                                y: 0,
                                autoAlpha: 1,
                                duration: 0.4,
                                ease: "power2.out",
                                overwrite: true,
                            });
                        const hideNav = () =>
                            gsap.to(navRef.current, {
                                y: -120,
                                autoAlpha: 0,
                                duration: 0.3,
                                ease: "power2.in",
                                overwrite: true,
                            });

                        ScrollTrigger.create({
                            start: 80,
                            end: "max",
                            // Retour au-dessus de 80px → réapparaît
                            onLeaveBack: showNav,
                            onUpdate: (self) => {
                                if (self.direction === 1) hideNav();
                                else showNav();
                            },
                        });
                    },
                },
            );

            gsap.to("#starNav", {
                scale: 1.05,
                repeat: -1,
                duration: 1,
                ease: "power3.out",
                yoyo: true,
            });
        },
        { scope: navRef },
    );

    return (
        <>
            <nav
                ref={navRef}
                className="fixed top-4.5 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2 bg-dark border-[2.5px] border-dark rounded-full py-2 pr-2 pl-3 lg:pl-4.5 shadow-nav w-4/5 max-w-xs lg:w-auto lg:max-w-none opacity-0"
            >
                {/* Logo — flex-1 on mobile/tablet to push hamburger right */}
                <a
                    href="#top"
                    className="flex items-center gap-2 no-underline flex-1 lg:flex-none lg:mr-1.5"
                >
                    <StarIcon />
                    <div className="flex flex-col leading-none">
                        <span className="font-display text-[15px] lg:text-[19px] uppercase text-white tracking-[0.02em]">
                            Hermann Richy
                        </span>
                        <span className="font-mono text-[10px] uppercase text-lime/60 tracking-widest mt-1">
                            Frontend Master
                        </span>
                    </div>
                </a>

                {/* Nav links — desktop only */}
                <div className="hidden lg:flex items-center gap-0.5">
                    {navLinks.map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            className="text-sm font-medium text-white/75 no-underline px-3.5 py-2.5 rounded-full hover:text-white transition-colors"
                        >
                            {label}
                        </a>
                    ))}
                </div>

                {/* CTA — desktop only */}
                <a
                    href="#contact"
                    className="hidden lg:flex font-sans font-bold text-sm text-dark bg-lime no-underline px-5 py-3 rounded-full whitespace-nowrap"
                >
                    Me contacter
                </a>

                {/* Hamburger — mobile + tablet */}
                <button
                    onClick={() => setIsOpen((v) => !v)}
                    className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full bg-lime text-dark cursor-pointer border-none flex-none"
                    aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <IconX size={18} /> : <IconMenu size={18} />}
                </button>
            </nav>

            {/* Mobile + tablet menu overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-90 bg-dark flex flex-col items-center justify-center gap-8 lg:hidden">
                    {navLinks.map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            onClick={() => setIsOpen(false)}
                            className="font-display text-[clamp(2.5rem,10vw,4rem)] uppercase text-white no-underline leading-none"
                        >
                            {label}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        onClick={() => setIsOpen(false)}
                        className="mt-4 font-sans font-bold text-base text-dark bg-lime no-underline px-8 py-4 rounded-full"
                    >
                        Me contacter
                    </a>
                </div>
            )}
        </>
    );
}
