import { IconMapPin, IconStack2, IconBolt, IconGauge } from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";

const StarPath =
    "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

const cards: { icon: TablerIcon; label: string }[] = [
    { icon: IconMapPin, label: "Cotonou, Bénin" },
    { icon: IconStack2, label: "Fullstack JS/TS" },
    { icon: IconBolt, label: "Motion & GSAP" },
    { icon: IconGauge, label: "Perf 100/100" },
];

export default function AboutSection() {
    return (
        <section
            id="apropos"
            className="bg-cream px-4 sm:px-8 lg:px-14 py-16 lg:py-30"
        >
            <div className="max-w-310 mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-18 items-start">
                {/* ── Left ── */}
                <div data-reveal>
                    <p className="font-mono text-2xs tracking-[0.14em] uppercase text-brand">
                        01 — À propos
                    </p>
                    <h2 className="font-display text-[clamp(3rem,8vw,5rem)] uppercase leading-[0.88] mt-4 mb-0">
                        Derrière
                        <br />
                        l&apos;écran
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
                <div data-reveal>
                    <p className="text-xl sm:text-2xl lg:text-[26px] leading-[1.45] text-dark font-medium mt-0 mb-6">
                        Je suis Hermann Richy, développeur fullstack basé à
                        Cotonou, avec une vraie préférence pour le frontend. Je
                        transforme des idées en produits complets — de
                        l&apos;interface qui marque à l&apos;API qui tient la
                        charge.
                    </p>
                    <p className="text-base sm:text-lg leading-[1.6] text-muted mb-8 max-w-150">
                        Côté pile : React / Next.js et animation GSAP. Côté face
                        : Node.js, bases de données et API typées. Mon obsession
                        reste la même partout — vite, propre, mémorable.
                    </p>

                    {/* Frontend / Backend split bar */}
                    <div className="mb-9 max-w-140">
                        <div className="flex justify-between font-mono text-[12px] uppercase tracking-[0.08em] text-muted mb-2.5">
                            <span>Frontend</span>
                            <span>Backend</span>
                        </div>
                        <div className="flex h-12 border-brutal rounded-xl overflow-hidden">
                            <div
                                data-split="60"
                                className="w-0 bg-brand"
                            />
                            <div
                                data-split="40"
                                className="w-0 bg-lime border-l-[2.5px] border-dark"
                            />
                        </div>
                    </div>

                    {/* Info cards */}
                    <div className="grid grid-cols-2 gap-3.5 max-w-140">
                        {cards.map(({ icon: CardIcon, label }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3 bg-white border-2 border-dark rounded-[14px] px-4 sm:px-4.5 py-4"
                            >
                                <CardIcon size={22} className="text-brand flex-none" />
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
