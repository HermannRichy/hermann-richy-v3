// Utilitaires de texte purs (utilisables côté navigateur et serveur).

/** Temps de lecture (≈ 220 mots / min ; blocs de code comptés à moitié). Accepte HTML ou Markdown. */
export function readingMinutes(content: string) {
    const codeBlocks = [...(content.match(/```[\s\S]*?```/g) ?? []), ...(content.match(/<pre[\s\S]*?<\/pre>/g) ?? [])].join(" ");
    const prose = content.replace(/```[\s\S]*?```/g, " ").replace(/<pre[\s\S]*?<\/pre>/g, " ");
    const words = (s: string) => s.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round((words(prose) + words(codeBlocks) / 2) / 220));
}

export function slugify(input: string) {
    return input
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
}

export const tagSlug = (tag: string) => slugify(tag);

export const fmtPostDate = (d: Date) => d.toLocaleDateString("fr-FR", { timeZone: "Africa/Porto-Novo", day: "2-digit", month: "2-digit", year: "numeric" }).split("/").reverse().join(".");
export const fmtLongDate = (d: Date) => d.toLocaleDateString("fr-FR", { timeZone: "Africa/Porto-Novo", day: "numeric", month: "long", year: "numeric" });
