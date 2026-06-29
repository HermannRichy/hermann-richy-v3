"use client";

import { useRef, useState } from "react";
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
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

const KATAKANA =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

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

const PROJECT_TYPES = [
    "Site vitrine",
    "Application web",
    "SaaS",
    "E-commerce",
    "API / Backend",
    "IA & Automatisation",
    "Animation / Motion",
    "Formation",
    "Autre...",
];

export default function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const starRef = useRef<SVGSVGElement>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        title: "",
        types: [] as string[],
        message: "",
    });
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");

    function toggleType(type: string) {
        setForm((f) => ({
            ...f,
            types: f.types.includes(type)
                ? f.types.filter((t) => t !== type)
                : [...f.types, type],
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error();
            setStatus("success");
            setForm({ name: "", email: "", title: "", types: [], message: "" });
        } catch {
            setStatus("error");
        }
    }

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

    useGSAP(() => {
        if (!labelRef.current) return;
        gsap.to(labelRef.current, {
            duration: 1.5,
            scrambleText: {
                text: "10 — Contact",
                chars: KATAKANA,
                revealDelay: 0.3,
                speed: 0.5,
            },
            scrollTrigger: {
                trigger: labelRef.current,
                start: "top 90%",
                once: true,
            },
        });
    });

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
                    <p
                        ref={labelRef}
                        className="font-mono text-2xs tracking-[0.14em] uppercase text-lime"
                    >
                        10 — 連絡
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start mt-5">
                        {/* ── Gauche ── */}
                        <div>
                            <h2 className="font-display text-[clamp(3rem,10vw,8rem)] uppercase leading-[0.84] mt-0 mb-0">
                                Travaillons
                                <br />
                                <span className="text-lime">ensemble</span>
                            </h2>
                            <p className="text-lg sm:text-xl leading-normal text-white/80 max-w-140 mt-8 mb-10">
                                Un projet web ambitieux, du front au back ? Je
                                suis dispo pour lui donner vie — pixel perfect.
                            </p>

                            <div className="flex flex-wrap gap-3 items-center">
                                <a
                                    href="mailto:hermannrichy15@gmail.com"
                                    className="flex items-center gap-2 font-sans font-bold text-sm text-dark bg-lime no-underline border-[2.5px] border-lime rounded-full px-5 py-3 transition-transform duration-300 hover:scale-[1.02]"
                                >
                                    <IconMail size={17} />
                                    hermannrichy15@gmail.com
                                </a>
                                {socials.map(
                                    ({
                                        icon: SocialIcon,
                                        label,
                                        href,
                                        handle,
                                    }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            aria-label={label}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center justify-center h-11 w-11 hover:w-auto hover:justify-start font-sans font-bold text-sm text-white bg-transparent no-underline border-[2.5px] border-white/30 rounded-full px-3 hover:px-5 transition-all duration-300 ease-out hover:border-lime hover:bg-lime hover:text-dark hover:scale-[1.02]"
                                        >
                                            <SocialIcon
                                                size={18}
                                                className="shrink-0"
                                            />
                                            <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-out whitespace-nowrap">
                                                {handle}
                                            </span>
                                        </a>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* ── Droite — Formulaire ── */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            {/* Nom + Email côte à côte */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Votre nom"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            name: e.target.value,
                                        }))
                                    }
                                    required
                                    className="bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-lime transition-colors text-sm font-sans w-full"
                                />
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            email: e.target.value,
                                        }))
                                    }
                                    required
                                    className="bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-lime transition-colors text-sm font-sans w-full"
                                />
                            </div>

                            {/* Titre du projet */}
                            <input
                                type="text"
                                placeholder="Titre du projet"
                                value={form.title}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        title: e.target.value,
                                    }))
                                }
                                required
                                className="bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-lime transition-colors text-sm font-sans w-full"
                            />

                            {/* Type de projet — multi-select pills */}
                            <div>
                                <p className="font-mono text-2xs tracking-widest uppercase text-white/40 mb-3">
                                    Type de projet
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {PROJECT_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => toggleType(type)}
                                            className={`font-sans text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                                                form.types.includes(type)
                                                    ? "bg-lime text-dark border-lime"
                                                    : "bg-transparent text-white/60 border-white/20 hover:border-white/50 hover:text-white"
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <textarea
                                placeholder="Décrivez votre projet…"
                                rows={4}
                                value={form.message}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        message: e.target.value,
                                    }))
                                }
                                required
                                className="bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-lime transition-colors text-sm font-sans w-full resize-none"
                            />
                            <button
                                type="submit"
                                disabled={
                                    status === "loading" || status === "success"
                                }
                                className="flex items-center justify-center font-sans font-bold text-sm text-dark bg-lime px-5 py-4 rounded-full disabled:opacity-60 transition-opacity cursor-pointer border-none"
                            >
                                {status === "idle" && "Envoyer le message"}
                                {status === "loading" && "Envoi en cours…"}
                                {status === "success" && "Message envoyé ✓"}
                                {status === "error" && "Réessayer"}
                            </button>
                            {status === "error" && (
                                <p className="text-red-400 text-sm font-mono m-0">
                                    Erreur lors de l&apos;envoi. Réessayez ou
                                    écrivez directement.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
