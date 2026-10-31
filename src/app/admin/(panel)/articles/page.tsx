import { IconExternalLink, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";

import { deletePostAction } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/confirm-button";
import { PostStatus } from "@/components/admin/post-status";
import { fmtDate, PageHeader } from "@/components/dashboard/ui";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Articles" };
export const dynamic = "force-dynamic";

const FILTERS = [
    { id: "", label: "Tous" },
    { id: "publies", label: "Publiés" },
    { id: "programmes", label: "Programmés" },
    { id: "brouillons", label: "Brouillons" },
] as const;

export default async function PostsPage({ searchParams }: PageProps<"/admin/articles">) {
    await requireAdmin();
    const sp = await searchParams;
    const filter = typeof sp.filtre === "string" ? sp.filtre : "";
    const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
    const now = new Date();
    const where: Prisma.PostWhereInput = {
        ...(filter === "publies" ? { status: "published", publishedAt: { lte: now } } : filter === "programmes" ? { status: "published", publishedAt: { gt: now } } : filter === "brouillons" ? { status: "draft" } : {}),
        ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { excerpt: { contains: q, mode: "insensitive" } }, { tags: { has: q } }] } : {}),
    };
    const posts = await db.post.findMany({ where, orderBy: [{ updatedAt: "desc" }], select: { id: true, title: true, slug: true, status: true, publishedAt: true, updatedAt: true, tags: true, readingMinutes: true } });

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Articles"
                description={`${posts.length} article${posts.length > 1 ? "s" : ""}`}
                actions={
                    <Link href="/admin/articles/nouveau" className="inline-flex min-h-11 items-center gap-2 rounded-[14px] border-[3px] border-dark bg-brand px-4 text-sm font-extrabold text-white shadow-[3px_3px_0_#0d0d0d] transition-transform hover:-translate-y-0.5">
                        <IconPlus size={18} stroke={2.5} /> Nouvel article
                    </Link>
                }
            />

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <nav className="flex flex-wrap gap-2" aria-label="Filtrer">
                    {FILTERS.map((f) => (
                        <Link
                            key={f.id}
                            href={f.id ? `/admin/articles?filtre=${f.id}` : "/admin/articles"}
                            aria-current={filter === f.id ? "page" : undefined}
                            className={cn("inline-flex min-h-10 items-center rounded-full border-[2.5px] border-dark px-4 text-sm font-extrabold", filter === f.id ? "bg-dark text-lime" : "bg-white")}
                        >
                            {f.label}
                        </Link>
                    ))}
                </nav>
                <form role="search" className="flex gap-2">
                    {filter && <input type="hidden" name="filtre" value={filter} />}
                    <input name="q" type="search" defaultValue={q} placeholder="Titre, résumé, tag…" aria-label="Rechercher" className="min-h-11 w-full min-w-0 rounded-[14px] border-[3px] border-dark bg-white px-4 text-base font-semibold outline-none focus:shadow-[3px_3px_0_#1E45FB] lg:w-72" />
                    <button className="min-h-11 rounded-[14px] border-[3px] border-dark bg-dark px-4 font-extrabold text-lime">OK</button>
                </form>
            </div>

            {posts.length === 0 ? (
                <p className="rounded-[20px] border-[3px] border-dashed border-dark bg-white p-8 text-center font-bold text-muted">Aucun article ici.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {posts.map((p) => (
                        <li key={p.id} className="flex flex-col gap-3 rounded-[20px] border-[3px] border-dark bg-white p-4 shadow-[4px_4px_0_#0d0d0d] md:flex-row md:items-center md:justify-between">
                            <Link href={`/admin/articles/${p.id}`} className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-center gap-2">
                                    <span className="text-[17px] font-extrabold">{p.title}</span>
                                    <PostStatus status={p.status} publishedAt={p.publishedAt} />
                                </span>
                                <span className="mt-1 block text-[13px] font-semibold text-muted">
                                    /blog/{p.slug} · {p.readingMinutes} min · modifié le {fmtDate(p.updatedAt)}
                                    {p.publishedAt ? ` · ${p.publishedAt > now ? "prévu le" : "publié le"} ${fmtDate(p.publishedAt)}` : ""}
                                </span>
                                {p.tags.length > 0 && <span className="mt-1.5 block text-xs font-bold text-brand">{p.tags.join(" · ")}</span>}
                            </Link>
                            <div className="flex flex-wrap gap-1.5">
                                <Link href={`/admin/articles/${p.id}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-[12px] border-[2.5px] border-dark bg-white px-3 text-sm font-extrabold">
                                    <IconPencil size={16} stroke={2.5} /> Modifier
                                </Link>
                                {p.status === "published" && p.publishedAt && p.publishedAt <= now && (
                                    <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1.5 rounded-[12px] border-[2.5px] border-dark bg-white px-3 text-sm font-extrabold" aria-label="Voir l'article">
                                        <IconExternalLink size={16} stroke={2.5} />
                                    </a>
                                )}
                                <ActionButton action={deletePostAction.bind(null, p.id)} confirm={`Supprimer définitivement « ${p.title} » ?`} label="Supprimer" className="hover:bg-[#FFE9E9]">
                                    <IconTrash size={16} stroke={2.5} />
                                </ActionButton>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
