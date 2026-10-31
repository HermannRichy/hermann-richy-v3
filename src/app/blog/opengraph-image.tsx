import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Blog - Hermann Richy";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
    return ogImage({ eyebrow: "Journal", title: "Blog", subtitle: "Tips concrets testés sur les vraies dernières versions : Next.js, Tailwind, GSAP, LLM." });
}
