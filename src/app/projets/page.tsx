import type { Metadata } from "next";
import Nav from "@/components/Nav";
import FooterSection from "@/components/sections/FooterSection";
import { ProjectCard } from "@/components/sections/ProjectsSection";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
    title: "Projets",
    description:
        "Toutes mes réalisations : plateformes, SaaS, outils et sites vitrines livrés pour des clients au Bénin et en Afrique.",
    openGraph: {
        title: "Projets — Hermann Richy",
        description:
            "Toutes mes réalisations : plateformes, SaaS, outils et sites vitrines livrés pour des clients au Bénin et en Afrique.",
        images: [{ url: "/og-img.jpg", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        images: ["/og-img.jpg"],
    },
};

const StarPath =
    "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

export default function ProjetsPage() {
    return (
        <main className="bg-cream text-dark font-sans antialiased w-full min-h-screen">
            <Nav />

            {/* Header */}
            <section className="relative overflow-hidden px-4 sm:px-8 lg:px-14 pt-36 pb-16 lg:pt-48 lg:pb-20">
                <svg
                    width="180"
                    height="180"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                    className="absolute top-24 right-8 lg:right-14 opacity-10"
                >
                    <path d={StarPath} fill="#1E45FB" />
                </svg>

                <div className="max-w-310 mx-auto">
                    <h1 className="font-display text-[clamp(3rem,10vw,6.5rem)] uppercase leading-[0.9] m-0">
                        Tous mes projets
                    </h1>
                    <p className="text-muted text-sm sm:text-base mt-6 max-w-lg">
                        Plateformes, SaaS, outils et sites vitrines — livrés
                        pour des clients et mes propres initiatives, au Bénin et
                        en Afrique.
                    </p>
                </div>
            </section>

            {/* Grid */}
            <section className="px-4 sm:px-8 lg:px-14 pb-28 lg:pb-36">
                <div className="max-w-310 mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((proj) => (
                        <ProjectCard
                            key={proj.id}
                            proj={proj}
                            className="w-full"
                        />
                    ))}
                </div>
            </section>

            <FooterSection />
        </main>
    );
}
