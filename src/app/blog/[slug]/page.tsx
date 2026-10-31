import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Markdown from "@/components/blog/Markdown";
import Nav from "@/components/Nav";
import FooterSection from "@/components/sections/FooterSection";
import { SITE_URL } from "@/config/site";
import { fmtLongDate, getNeighbours, getPost, getPublishedPosts, tagSlug } from "@/lib/content/posts";

export const revalidate = 300;

export async function generateStaticParams() {
    return (await getPublishedPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
    const post = await getPost((await params).slug);
    if (!post) return {};
    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt;
    return {
        title,
        description,
        alternates: { canonical: `/blog/${post.slug}` },
        openGraph: { type: "article", title, description, publishedTime: post.publishedAt.toISOString(), modifiedTime: post.updatedAt.toISOString(), authors: ["Hermann Richy"], tags: post.tags },
        twitter: { card: "summary_large_image", title, description },
    };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
    const post = await getPost((await params).slug);
    if (!post) notFound();
    const { prev, next } = await getNeighbours(post.publishedAt);
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: { "@type": "Person", name: "Hermann Richy", url: SITE_URL },
        image: post.coverUrl ?? `${SITE_URL}/blog/${post.slug}/opengraph-image`,
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        keywords: post.tags.join(", "),
        inLanguage: "fr",
    };

    return (
        <main className="bg-dark text-white font-sans antialiased w-full min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
            <Nav />

            <article className="px-4 sm:px-8 lg:px-14 pt-36 pb-24 lg:pt-48 lg:pb-32">
                <div className="max-w-310 mx-auto">
                    <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-2xs text-lime no-underline hover:gap-3 transition-all duration-300 mb-10">
                        <IconArrowLeft size={14} /> Tous les articles
                    </Link>

                    <header className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-2xs mb-7">
                            <time dateTime={post.publishedAt.toISOString()} className="text-white/50">
                                {fmtLongDate(post.publishedAt)}
                            </time>
                            <span className="text-white/30">· {post.readingMinutes} min de lecture</span>
                            {post.tags.map((t) => (
                                <Link key={t} href={`/blog/tag/${tagSlug(t)}`} className="no-underline uppercase tracking-wider text-[11px] text-lime border border-lime/40 rounded-full px-2.5 py-1 hover:bg-lime hover:text-dark transition-colors">
                                    {t}
                                </Link>
                            ))}
                        </div>
                        <h1 className="font-display text-[clamp(2.75rem,9vw,6.5rem)] uppercase leading-[0.88] m-0 break-words">{post.title}</h1>
                        <p className="text-white/60 text-lg sm:text-xl leading-relaxed mt-7 mb-0">{post.excerpt}</p>
                    </header>

                    {post.coverUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.coverUrl} alt="" className="mt-12 w-full max-w-4xl aspect-[1200/630] object-cover rounded-[22px] border border-white/10" />
                    )}

                    <div className="max-w-2xl mt-14">
                        <Markdown>{post.content}</Markdown>
                    </div>

                    <footer className="max-w-2xl mt-16 pt-8 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                        <span className="font-display text-xl uppercase text-white/60">Hermann Richy</span>
                        <Link href="/#contact" className="font-mono text-2xs text-lime no-underline">
                            Un projet ? Parlons-en →
                        </Link>
                    </footer>

                    {(prev || next) && (
                        <nav aria-label="Autres articles" className="grid gap-4 sm:grid-cols-2 mt-16 max-w-4xl">
                            {prev ? (
                                <Link href={`/blog/${prev.slug}`} className="group no-underline text-white border border-white/10 rounded-[18px] p-5 hover:border-lime transition-colors">
                                    <span className="flex items-center gap-2 font-mono text-2xs text-white/40"><IconArrowLeft size={14} /> Précédent</span>
                                    <span className="block font-display uppercase text-2xl mt-3 group-hover:text-lime">{prev.title}</span>
                                </Link>
                            ) : <span className="hidden sm:block" />}
                            {next && (
                                <Link href={`/blog/${next.slug}`} className="group no-underline text-white border border-white/10 rounded-[18px] p-5 sm:text-right hover:border-lime transition-colors">
                                    <span className="flex items-center gap-2 sm:justify-end font-mono text-2xs text-white/40">Suivant <IconArrowRight size={14} /></span>
                                    <span className="block font-display uppercase text-2xl mt-3 group-hover:text-lime">{next.title}</span>
                                </Link>
                            )}
                        </nav>
                    )}
                </div>
            </article>

            <FooterSection />
        </main>
    );
}
