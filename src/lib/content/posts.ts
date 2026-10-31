import type { Prisma } from "@/generated/prisma/client";
import { db, hasDatabase } from "@/lib/server/db";

export type PostSummary = {
    slug: string;
    title: string;
    excerpt: string;
    tags: string[];
    coverUrl: string | null;
    publishedAt: Date;
    readingMinutes: number;
};

export type PostFull = PostSummary & { content: string; format: string; seoTitle: string | null; seoDescription: string | null; updatedAt: Date };

/** Articles visibles : publiés, date de publication atteinte (les dates futures = programmés). */
const visible = (): Prisma.PostWhereInput => ({ status: "published", publishedAt: { lte: new Date() } });

const summary = { slug: true, title: true, excerpt: true, tags: true, coverUrl: true, publishedAt: true, readingMinutes: true } as const;

export async function getPublishedPosts(tag?: string): Promise<PostSummary[]> {
    if (!hasDatabase()) return [];
    try {
        const rows = await db.post.findMany({
            where: { ...visible(), ...(tag ? { tags: { has: tag } } : {}) },
            orderBy: { publishedAt: "desc" },
            select: summary,
        });
        return rows.map((r) => ({ ...r, publishedAt: r.publishedAt! }));
    } catch (e) {
        console.error("[blog] lecture impossible", (e as Error).message);
        return [];
    }
}

export async function getPost(slug: string): Promise<PostFull | null> {
    if (!hasDatabase()) return null;
    const row = await db.post.findFirst({ where: { slug, ...visible() } });
    if (!row) return null;
    return { ...row, publishedAt: row.publishedAt! };
}

/** Article précédent et suivant (ordre chronologique). */
export async function getNeighbours(publishedAt: Date) {
    const [prev, next] = await Promise.all([
        db.post.findFirst({ where: { ...visible(), publishedAt: { lt: publishedAt } }, orderBy: { publishedAt: "desc" }, select: { slug: true, title: true } }),
        db.post.findFirst({ where: { status: "published", publishedAt: { gt: publishedAt, lte: new Date() } }, orderBy: { publishedAt: "asc" }, select: { slug: true, title: true } }),
    ]);
    return { prev, next };
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
    const posts = await getPublishedPosts();
    const map = new Map<string, number>();
    for (const p of posts) for (const t of p.tags) map.set(t, (map.get(t) ?? 0) + 1);
    return [...map.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "fr"));
}

export { fmtLongDate, fmtPostDate, readingMinutes, slugify, tagSlug } from "./text";
