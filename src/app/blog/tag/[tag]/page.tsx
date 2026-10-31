import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogShell from "@/components/blog/BlogShell";
import { getAllTags, getPublishedPosts, tagSlug } from "@/lib/content/posts";

export const revalidate = 300;

async function resolve(slug: string) {
    const tags = await getAllTags();
    return { tags, tag: tags.find((t) => tagSlug(t.tag) === slug)?.tag };
}

export async function generateStaticParams() {
    return (await getAllTags()).map((t) => ({ tag: tagSlug(t.tag) }));
}

export async function generateMetadata({ params }: PageProps<"/blog/tag/[tag]">): Promise<Metadata> {
    const { tag } = await resolve((await params).tag);
    if (!tag) return {};
    return { title: `${tag} - Blog`, description: `Articles sur ${tag} : tips concrets testés sur les dernières versions.`, alternates: { canonical: `/blog/tag/${tagSlug(tag)}` } };
}

export default async function TagPage({ params }: PageProps<"/blog/tag/[tag]">) {
    const { tags, tag } = await resolve((await params).tag);
    if (!tag) notFound();
    const posts = await getPublishedPosts(tag);
    return <BlogShell eyebrow="✦ Thème" title={tag} intro={`${posts.length} article${posts.length > 1 ? "s" : ""}`} posts={posts} tags={tags} activeTag={tag} />;
}
