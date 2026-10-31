import Link from "next/link";
import type { ReactNode } from "react";

import Nav from "@/components/Nav";
import FooterSection from "@/components/sections/FooterSection";
import { fmtPostDate, tagSlug, type PostSummary } from "@/lib/content/posts";

const StarPath = "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

/** En-tête + liste des articles (page Blog et pages de tag). */
export default function BlogShell({ eyebrow, title, intro, posts, tags, activeTag }: { eyebrow: string; title: string; intro: ReactNode; posts: PostSummary[]; tags: { tag: string; count: number }[]; activeTag?: string }) {
    return (
        <main className="bg-dark text-white font-sans antialiased w-full min-h-screen">
            <Nav />

            <section className="relative overflow-hidden px-4 sm:px-8 lg:px-14 pt-36 pb-14 lg:pt-48 lg:pb-20">
                <svg width="180" height="180" viewBox="0 0 100 100" aria-hidden="true" className="absolute top-24 right-8 lg:right-14 opacity-15">
                    <path d={StarPath} fill="#CDF22B" />
                </svg>
                <div className="max-w-310 mx-auto">
                    <p className="font-mono text-2xs tracking-[0.14em] uppercase text-lime mb-4">{eyebrow}</p>
                    <h1 className="font-display text-[clamp(3.5rem,14vw,9rem)] uppercase leading-[0.84] m-0 break-words">{title}</h1>
                    <div className="text-white/50 font-mono text-sm mt-6 max-w-xl">{intro}</div>

                    {tags.length > 0 && (
                        <nav aria-label="Thèmes" className="flex flex-wrap gap-2 mt-10">
                            <Link href="/blog" className={`no-underline font-mono text-2xs px-3.5 py-2 rounded-full border transition-colors ${!activeTag ? "bg-lime text-dark border-lime" : "border-white/20 text-white/70 hover:border-lime hover:text-lime"}`}>
                                Tout
                            </Link>
                            {tags.map(({ tag, count }) => (
                                <Link
                                    key={tag}
                                    href={`/blog/tag/${tagSlug(tag)}`}
                                    className={`no-underline font-mono text-2xs px-3.5 py-2 rounded-full border transition-colors ${activeTag === tag ? "bg-lime text-dark border-lime" : "border-white/20 text-white/70 hover:border-lime hover:text-lime"}`}
                                >
                                    {tag} <span className="opacity-60">{count}</span>
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>
            </section>

            <section className="px-4 sm:px-8 lg:px-14 pb-28 lg:pb-40">
                <div className="max-w-310 mx-auto">
                    {posts.length === 0 ? (
                        <p className="border-t border-white/10 pt-10 font-mono text-sm text-white/40">Premier article à venir.</p>
                    ) : (
                        <ol className="list-none p-0 m-0">
                            {posts.map((p, i) => (
                                <li key={p.slug} className="border-t border-white/10">
                                    <Link href={`/blog/${p.slug}`} className="group no-underline text-white grid gap-4 py-9 sm:py-11 lg:grid-cols-[120px_minmax(0,1fr)_auto] lg:gap-10">
                                        <div className="flex lg:flex-col items-center lg:items-start gap-3 font-mono text-2xs">
                                            <span className="text-lime tracking-widest">{String(posts.length - i).padStart(2, "0")}</span>
                                            <time dateTime={p.publishedAt.toISOString()} className="text-white/40">
                                                {fmtPostDate(p.publishedAt)}
                                            </time>
                                            <span className="text-white/30">· {p.readingMinutes} min</span>
                                        </div>
                                        <div className="min-w-0">
                                            <h2 className="font-display text-[clamp(2rem,6vw,4rem)] uppercase leading-[0.9] m-0 transition-colors group-hover:text-lime">{p.title}</h2>
                                            <p className="text-white/60 text-base sm:text-lg leading-relaxed mt-4 mb-0 max-w-2xl">{p.excerpt}</p>
                                            {p.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-5">
                                                    {p.tags.map((t) => (
                                                        <span key={t} className="font-mono text-[11px] uppercase tracking-wider text-white/50 border border-white/15 rounded-full px-2.5 py-1">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span aria-hidden="true" className="hidden lg:flex size-14 items-center justify-center rounded-full border border-white/20 text-2xl transition-all group-hover:bg-lime group-hover:text-dark group-hover:border-lime group-hover:-rotate-45">
                                            →
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </section>

            <FooterSection />
        </main>
    );
}
