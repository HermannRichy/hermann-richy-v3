import type { Metadata } from "next";
import Nav from "@/components/Nav";
import FooterSection from "@/components/sections/FooterSection";
import { IconArrowLeft } from "@tabler/icons-react";

export const metadata: Metadata = {
    title: "Blog — Hermann Richy",
    description:
        "Pensées sur le code, l'IA, les interfaces et l'artisanat du web.",
};

const StarPath =
    "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

export default function BlogPage() {
    return (
        <main className="bg-dark text-white font-sans antialiased w-full min-h-screen">
            <Nav />

            {/* Header */}
            <section className="relative overflow-hidden px-4 sm:px-8 lg:px-14 pt-36 pb-20 lg:pt-48 lg:pb-28">
                <svg
                    width="180"
                    height="180"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                    className="absolute top-24 right-8 lg:right-14 opacity-15"
                >
                    <path d={StarPath} fill="#CDF22B" />
                </svg>

                <div className="max-w-310 mx-auto">
                    <p className="font-mono text-2xs tracking-[0.14em] uppercase text-lime mb-4">
                        ✦ Journal
                    </p>
                    <h1 className="font-display text-[clamp(4rem,14vw,9rem)] uppercase leading-[0.84] m-0">
                        Blog
                    </h1>
                    <p className="text-white/50 font-mono text-sm mt-6 max-w-lg">
                        Pensées sur le code, l&apos;IA, les interfaces et
                        l&apos;artisanat du web.
                    </p>
                </div>
            </section>

            {/* Article — Prélude */}
            <section className="px-4 sm:px-8 lg:px-14 pb-28 lg:pb-40">
                <div className="max-w-310 mx-auto">
                    <div className="border-t border-white/10 pt-10">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="font-mono text-2xs tracking-widest uppercase text-lime">
                                01
                            </span>
                            <span className="font-mono text-2xs text-white/30">
                                —
                            </span>
                            <time
                                dateTime="2026-06-30"
                                className="font-mono text-2xs text-white/40"
                            >
                                2026.06.30
                            </time>
                            <span className="font-mono text-2xs text-white/30">
                                · 2 min
                            </span>
                        </div>

                        {/* Titre */}
                        <h2 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] uppercase leading-[0.88] m-0 mb-10">
                            Prélude
                        </h2>

                        {/* Contenu */}
                        <div className="max-w-2xl space-y-6 text-white/75 text-lg leading-[1.7]">
                            <p>
                                Les dernières versions cassent toujours quelque
                                chose. Une API dépréciée, un comportement qui
                                change silencieusement, une doc qui n&apos;a
                                pas encore suivi. Je passe des heures
                                là-dedans — pour que vous n&apos;ayez pas à le
                                faire.
                            </p>
                            <p>
                                Ce blog, c&apos;est le raccourci que
                                j&apos;aurais voulu avoir. Des tips et astuces
                                concrets, testés sur les vraies dernières
                                versions : Next.js App Router, Tailwind v4,
                                GSAP 3.x, les LLM via API, Go, Python — ce
                                qui marche réellement, pas ce qui marchait il
                                y a dix-huit mois.
                            </p>
                            <p className="text-white/40 font-mono text-sm border-l-2 border-lime/40 pl-5">
                                Pas de tutoriel recyclé. Pas de
                                &ldquo;ça dépend&rdquo; sans réponse.
                                Juste ce qui fonctionne — avec le pourquoi.
                            </p>
                            <p>
                                Je me tracasse avec les breaking changes, les
                                migrations, les configs qui ne font que trois
                                lignes dans la doc mais qui prennent deux
                                heures à comprendre. Vous, vous repartez avec
                                la solution directe et du temps récupéré.
                            </p>
                            <p>
                                Premier article à venir. En attendant —
                                bienvenue.
                            </p>
                        </div>

                        {/* Signature */}
                        <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                            <span className="font-display text-xl uppercase text-white/60">
                                Hermann Richy
                            </span>
                            <a
                                href="/"
                                className="flex items-center gap-2 font-mono text-2xs text-lime no-underline hover:gap-3 transition-all duration-300"
                            >
                                <IconArrowLeft size={14} />
                                Retour au portfolio
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <FooterSection />
        </main>
    );
}
