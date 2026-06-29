"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const testimonials = [
    {
        quote: "Hermann a transformé notre idée en une expérience qui impressionne à chaque scroll. Du grand art.",
        name: "Aïcha K.",
        role: "CEO, Studio Nova",
        bg: "bg-brand",
        color: "text-white",
        avatarBg: "bg-dark",
        shadow: "shadow-brutal",
        accent: "text-lime",
        roleColor: "text-white/70",
    },
    {
        quote: "Front impeccable et back carré. Rapide, rigoureux, créatif — un vrai fullstack de confiance.",
        name: "David M.",
        role: "CTO, FinPay",
        bg: "bg-dark",
        color: "text-white",
        avatarBg: "bg-brand",
        shadow: "shadow-brutal-blue",
        accent: "text-lime",
        roleColor: "text-white/70",
    },
    {
        quote: "Livraison dans les temps, code impeccable et un sens du détail rare. Je recommande les yeux fermés.",
        name: "Sarah B.",
        role: "Founder, Vibe",
        bg: "bg-lime",
        color: "text-dark",
        avatarBg: "bg-dark",
        shadow: "shadow-brutal",
        accent: "text-brand",
        roleColor: "text-muted",
    },
    {
        quote: "Une maîtrise technique impressionnante sur Next.js et GSAP. Nos conversions ont bondi de 40%.",
        name: "Marc L.",
        role: "Growth Marketer, Nexa",
        bg: "bg-purple",
        color: "text-white",
        avatarBg: "bg-lime",
        shadow: "shadow-brutal",
        accent: "text-lime",
        roleColor: "text-white/70",
    },
    {
        quote: "Esprit d'équipe, force de proposition et code ultra-propre. Un atout majeur pour notre produit headless.",
        name: "Elena R.",
        role: "Product Manager, Pulse",
        bg: "bg-white",
        color: "text-dark",
        avatarBg: "bg-brand",
        shadow: "shadow-brutal",
        accent: "text-brand",
        roleColor: "text-muted",
    },
    {
        quote: "Il a formé nos équipes frontend aux animations modernes. Pédagogue, expert et passionné.",
        name: "Saliou D.",
        role: "Engineering Lead, TechHub",
        bg: "bg-brand",
        color: "text-white",
        avatarBg: "bg-purple",
        shadow: "shadow-brutal-blue",
        accent: "text-lime",
        roleColor: "text-white/70",
    },
];

export default function TestimonialsSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            const track = containerRef.current;

            // Calcul de la moitié de la largeur du rail (puisqu'on a doublé la liste dans le DOM)
            const scrollWidth = track.scrollWidth / 2;

            // Animation de défilement infini linéaire
            const loop = gsap.to(track, {
                x: -scrollWidth,
                duration: 35, // Augmenter pour ralentir, baisser pour accélérer
                ease: "none",
                repeat: -1, // Infini
            });

            // OPTIONNEL : Met en pause le défilement au survol de la souris
            track.addEventListener("mouseenter", () => loop.pause());
            track.addEventListener("mouseleave", () => loop.play());
        },
        { scope: containerRef },
    );

    return (
        <section className="relative overflow-hidden bg-cream py-16 lg:py-24 w-full">
            {/* Watermark japonais */}
            <div
                aria-hidden="true"
                className="absolute bottom-0 right-0 select-none pointer-events-none overflow-hidden"
            >
                <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-dark/5 leading-none whitespace-nowrap">
                    お客様の声
                </span>
            </div>

            {/* Titre fixe centré au-dessus */}
            <div className="max-w-310 mx-auto px-4 sm:px-8 lg:px-14 mb-16">
                <p className="font-mono text-2xs tracking-[0.14em] uppercase text-brand">
                    05 — Témoignages
                </p>
                <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.9] mt-4 mb-0">
                    Ils en parlent
                </h2>
            </div>

            {/* Zone de masque de l'écran complet */}
            <div className="w-full overflow-hidden select-none">
                {/* Le rail qui va défiler */}
                <div
                    ref={containerRef}
                    className="flex flex-row gap-6 w-max px-3"
                    style={{ willChange: "transform" }}
                >
                    {/* On affiche la liste deux fois pour créer la transition visuelle infinie sans coupure */}
                    {[...testimonials, ...testimonials].map((item, index) => (
                        <div
                            key={index}
                            className={`${item.bg} ${item.color} border-brutal rounded-5.5 p-8 ${item.shadow} flex flex-col w-[85vw] sm:w-100 shrink-0`}
                        >
                            <i
                                className={`ti ti-quote text-[40px] ${item.accent}`}
                            />
                            <p className="text-base sm:text-lg leading-normal mt-4 mb-6 flex-1">
                                {item.quote}
                            </p>
                            <div className="flex items-center gap-3.5">
                                <div
                                    className={`w-12 h-12 rounded-full ${item.avatarBg} shrink-0`}
                                />
                                <div>
                                    <p className="font-bold text-[15px] m-0">
                                        {item.name}
                                    </p>
                                    <p
                                        className={`text-2xs ${item.roleColor} m-0`}
                                    >
                                        {item.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
