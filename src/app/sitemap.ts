import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";
import { getAllTags, getPublishedPosts, tagSlug } from "@/lib/content/posts";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [posts, tags] = await Promise.all([getPublishedPosts(), getAllTags()]);
    return [
        { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
        { url: `${SITE_URL}/projets`, changeFrequency: "monthly", priority: 0.8 },
        { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
        ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.publishedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
        ...tags.map((t) => ({ url: `${SITE_URL}/blog/tag/${tagSlug(t.tag)}`, changeFrequency: "weekly" as const, priority: 0.4 })),
    ];
}
