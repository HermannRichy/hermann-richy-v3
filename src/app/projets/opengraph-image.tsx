import { getProjects } from "@/lib/content/projects";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Projets - Hermann Richy";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image() {
    const count = (await getProjects()).length;
    return ogImage({ eyebrow: `${count} réalisations`, title: "Tous mes projets", subtitle: "Plateformes, SaaS, outils et sites vitrines livrés au Bénin et en Afrique.", theme: "cream" });
}
