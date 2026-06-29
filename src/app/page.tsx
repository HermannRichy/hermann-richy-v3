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

export default function Portfolio() {
    return (
        <main className="bg-cream text-dark font-sans antialiased w-full relative">
            <Nav />
            <HeroSection />
            <StorySection />
            <AboutSection />
            <TimelineSection />
            <ProjectsSection />
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
