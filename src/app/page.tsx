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
import { getProjects } from "@/lib/content/projects";

// Régénérée au plus toutes les 5 min (et immédiatement après une modification dans le dashboard).
export const revalidate = 300;

export default async function Portfolio() {
    const projects = await getProjects();
    return (
        <main className="bg-cream text-dark font-sans antialiased w-full relative">
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
