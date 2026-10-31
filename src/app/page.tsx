import Nav from "@/components/Nav";
import HeroSection from "@/components/sections/HeroSection";
import StorySection from "@/components/sections/StorySection";
import AboutSection from "@/components/sections/AboutSection";
import TimelineSection from "@/components/sections/TimelineSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import StackSection from "@/components/sections/StackSection";
import ServicesSection from "@/components/sections/ServicesSection";
import NumbersSection from "@/components/sections/NumbersSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";
import type { Metadata } from "next";

import { SITE_URL } from "@/config/site";
import { getProjects } from "@/lib/content/projects";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Régénérée au plus toutes les 5 min (et immédiatement après une modification dans le dashboard).
export const revalidate = 300;

/** Données structurées : la personne et le site. */
const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": `${SITE_URL}/#person`,
            name: "Hermann Richy",
            alternateName: "Hermann Ulrich Hounnouvi",
            url: SITE_URL,
            image: `${SITE_URL}/opengraph-image`,
            jobTitle: "Développeur Fullstack & Frontend",
            worksFor: { "@type": "Organization", name: "Digital Innovation", url: "https://digitalinnovation.bj" },
            address: { "@type": "PostalAddress", addressLocality: "Cotonou", addressCountry: "BJ" },
            knowsAbout: ["Next.js", "React", "TypeScript", "GSAP", "Node.js", "Go", "Python", "IA agentique"],
            sameAs: ["https://github.com/HermannRichy"],
        },
        { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: "Hermann Richy", inLanguage: "fr", publisher: { "@id": `${SITE_URL}/#person` } },
    ],
};

export default async function Portfolio() {
    const projects = await getProjects();
    return (
        <main className="bg-cream text-dark font-sans antialiased w-full relative">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
            <Nav />
            <HeroSection />
            <StorySection />
            <AboutSection />
            <TimelineSection />
            <ProjectsSection projects={projects} />
            <StackSection />
            <ServicesSection />
            <NumbersSection />
            <TestimonialsSection />
            <ProcessSection />
            <ContactSection />
            <FooterSection />
        </main>
    );
}
