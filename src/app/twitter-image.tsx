import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Hermann Richy - Développeur Fullstack & Frontend Master";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
    return ogImage({ eyebrow: "Développeur fullstack · Cotonou", title: "Frontend Master", subtitle: "Interfaces Next.js pixel perfect, animations GSAP, backends multi-stack et IA agentique.", theme: "brand" });
}
