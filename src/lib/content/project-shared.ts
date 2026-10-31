import type { Prisma } from "@/generated/prisma/client";
import type { Project, ProjectTag } from "@/data/projects";

/** Couleurs disponibles pour les tags et le fond des vignettes. */
export const TONES = {
    brand: { bg: "bg-brand", color: "text-white", label: "Bleu" },
    dark: { bg: "bg-dark", color: "text-lime", label: "Noir" },
    purple: { bg: "bg-purple", color: "text-white", label: "Violet" },
    lime: { bg: "bg-lime", color: "text-dark", label: "Citron" },
    card: { bg: "bg-card", color: "text-dark", label: "Beige" },
} as const;

export type Tone = keyof typeof TONES;
export type StoredTag = { label: string; tone: Tone };

export const isTone = (v: unknown): v is Tone => typeof v === "string" && v in TONES;

type ProjectRow = Prisma.ProjectGetPayload<object>;

/** Ligne en base → format utilisé par les composants du site. */
export function toProject(row: ProjectRow): Project {
    const stored = (Array.isArray(row.tags) ? row.tags : []) as StoredTag[];
    const tags: ProjectTag[] = stored.filter((t) => t && typeof t.label === "string").map((t) => ({ label: t.label, ...pick(t.tone) }));
    if (row.wip) tags.push({ label: "En développement", bg: "bg-lime", color: "text-dark" });
    if (row.year) tags.push({ label: String(row.year), bg: "bg-card", color: "text-dark", mono: true });
    return {
        id: row.slug,
        title: row.title,
        desc: row.description,
        tags,
        image: row.imageUrl,
        url: row.url ?? undefined,
        photoBg: TONES[isTone(row.photoBg) ? row.photoBg : "brand"].bg,
        featured: row.featured,
    };
}

const pick = (tone: unknown) => {
    const t = TONES[isTone(tone) ? tone : "brand"];
    return { bg: t.bg, color: t.color };
};

/** Projet statique → données à enregistrer (import initial). */
export function fromStatic(p: Project, index: number) {
    const year = p.tags.find((t) => t.mono && /^\d{4}$/.test(t.label));
    const wip = p.tags.some((t) => t.label === "En développement");
    const tags: StoredTag[] = p.tags
        .filter((t) => !t.mono && t.label !== "En développement")
        .map((t) => ({ label: t.label, tone: (Object.entries(TONES).find(([, v]) => v.bg === t.bg)?.[0] ?? "brand") as Tone }));
    const photoBg = (Object.entries(TONES).find(([, v]) => v.bg === p.photoBg)?.[0] ?? "brand") as Tone;
    return {
        slug: p.id,
        title: p.title,
        description: p.desc,
        imageUrl: p.image,
        url: p.url ?? null,
        photoBg,
        featured: p.featured,
        wip,
        year: year ? Number(year.label) : null,
        tags,
        sortOrder: index * 10,
    };
}
