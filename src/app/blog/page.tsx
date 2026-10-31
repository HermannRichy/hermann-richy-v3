import type { Metadata } from "next";

import BlogShell from "@/components/blog/BlogShell";
import { getAllTags, getPublishedPosts } from "@/lib/content/posts";

export const revalidate = 300;

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Tips et astuces concrets basés sur les vraies dernières versions : Next.js App Router, Tailwind v4, GSAP, LLM via API - ce qui marche réellement.",
    alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/rss.xml" } },
    openGraph: {
        title: "Blog - Hermann Richy",
        description:
            "Tips et astuces concrets basés sur les vraies dernières versions. Je me tracasse avec les breaking changes pour que vous n'ayez pas à le faire.",
    },
    twitter: { card: "summary_large_image" },
};

export default async function BlogPage() {
    const [posts, tags] = await Promise.all([getPublishedPosts(), getAllTags()]);
    return (
        <BlogShell
            eyebrow="✦ Journal"
            title="Blog"
            intro={<>Pensées sur le code, l&apos;IA, les interfaces et l&apos;artisanat du web.</>}
            posts={posts}
            tags={tags}
        />
    );
}
