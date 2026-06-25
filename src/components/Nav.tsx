"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { IconMenu, IconX } from "@tabler/icons-react";

const StarIcon = () => (
    <svg width="22" height="22" viewBox="0 0 100 100" aria-hidden="true">
        <path
            d="M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z"
            fill="#CDF22B"
        />
    </svg>
);

const navLinks = [
    { href: "#apropos", label: "À propos" },
    { href: "#projets", label: "Projets" },
    { href: "#services", label: "Services" },
    { href: "/blog", label: "Blog" },
];

export default function Nav() {
    const navRef = useRef<HTMLElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        gsap.fromTo(
            navRef.current,
            { y: -80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 1.2 },
        );
    }, []);

    return (
        <>
            <nav
                ref={navRef}
                className="fixed top-4.5 left-1/2 -translate-x-1/2 z-100 flex items-center gap-1.5 bg-dark border-[2.5px] border-dark rounded-full py-2 pr-2 pl-3 md:pl-4.5 shadow-nav max-w-[calc(100%-32px)] opacity-0"
            >
                {/* Logo */}
                <a
                    href="#top"
                    className="flex items-center gap-2 md:gap-2.5 no-underline mr-1 md:mr-1.5"
                >
                    <StarIcon />
                    <span className="font-display text-sm md:text-[19px] uppercase text-white tracking-[0.02em]">
                        Hermann Richy
                    </span>
                </a>

                {/* Nav links — desktop only */}
                <div className="hidden md:flex items-center gap-0.5">
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
                    className="hidden md:flex font-sans font-bold text-sm text-dark bg-lime no-underline px-5 py-3 rounded-full whitespace-nowrap"
                >
                    Me contacter
                </a>

                {/* Hamburger — mobile only */}
                <button
                    onClick={() => setIsOpen((v) => !v)}
                    className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-lime text-dark ml-1 cursor-pointer border-none"
                    aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <IconX size={18} /> : <IconMenu size={18} />}
                </button>
            </nav>

            {/* Mobile menu overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-90 bg-dark flex flex-col items-center justify-center gap-8 md:hidden">
                    {navLinks.map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            onClick={() => setIsOpen(false)}
                            className="font-display text-[clamp(2.5rem,12vw,4rem)] uppercase text-white no-underline leading-none"
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
