import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

import { PostStatus } from "@/components/admin/post-status";
import { Badge, fmtDate, PageHeader, Panel, Stat } from "@/components/dashboard/ui";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
    await requireAdmin();
    const now = new Date();
    const [published, scheduled, drafts, projects, featured, unread, messages, recentPosts] = await Promise.all([
        db.post.count({ where: { status: "published", publishedAt: { lte: now } } }),
        db.post.count({ where: { status: "published", publishedAt: { gt: now } } }),
        db.post.count({ where: { status: "draft" } }),
        db.project.count({ where: { published: true } }),
        db.project.count({ where: { published: true, featured: true } }),
        db.contactMessage.count({ where: { status: "new" } }),
        db.contactMessage.findMany({ where: { status: { not: "archived" } }, orderBy: { createdAt: "desc" }, take: 5 }),
        db.post.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, title: true, status: true, publishedAt: true, updatedAt: true } }),
    ]);

    return (
        <div className="flex flex-col gap-6 sm:gap-8">
            <PageHeader kanji="管理" eyebrow="Studio · Vue d'ensemble"
                title="Tableau de bord"
                description="Blog, projets et messages du portfolio."
                actions={
                    <Link href="/admin/articles/nouveau" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-[2.5px] border-lime bg-lime px-5 font-sans text-sm font-bold text-dark no-underline transition-transform duration-300 hover:scale-[1.02]">
                        <IconPlus size={18} stroke={2.5} /> Nouvel article
                    </Link>
                }
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
                <Stat label="Articles publiés" value={published} tone="blue" />
                <Stat label="Programmés" value={scheduled} />
                <Stat label="Brouillons" value={drafts} />
                <Stat label="Projets visibles" value={projects} hint={`${featured} sur l'accueil`} tone="black" />
                <Stat label="Messages non lus" value={unread} className="col-span-2 md:col-span-1" />
            </div>

            <div className="grid gap-5 sm:gap-6 xl:grid-cols-2">
                <Panel title="Derniers messages" action={<Link href="/admin/messages" className="font-mono text-2xs tracking-wider text-lime uppercase no-underline">Tout voir</Link>}>
                    {messages.length === 0 ? (
                        <p className="text-[15px] text-white/50">Aucun message.</p>
                    ) : (
                        <ul className="flex flex-col divide-y-2 divide-white/10">
                            {messages.map((m) => (
                                <li key={m.id} className="py-3 first:pt-0 last:pb-0">
                                    <Link href={`/admin/messages#${m.id}`} className="flex flex-col gap-1">
                                        <span className="flex flex-wrap items-center gap-2">
                                            <span className="font-bold">{m.name}</span>
                                            {m.status === "new" && <Badge tone="lime">Nouveau</Badge>}
                                        </span>
                                        <span className="truncate text-sm font-semibold">{m.title}</span>
                                        <span className="text-xs text-white/50">{fmtDate(m.createdAt)}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>
                <Panel title="Articles récents" action={<Link href="/admin/articles" className="font-mono text-2xs tracking-wider text-lime uppercase no-underline">Tout voir</Link>}>
                    {recentPosts.length === 0 ? (
                        <p className="text-[15px] text-white/50">Aucun article.</p>
                    ) : (
                        <ul className="flex flex-col divide-y-2 divide-white/10">
                            {recentPosts.map((p) => (
                                <li key={p.id} className="py-3 first:pt-0 last:pb-0">
                                    <Link href={`/admin/articles/${p.id}`} className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="min-w-0 flex-1 truncate font-bold">{p.title}</span>
                                        <PostStatus status={p.status} publishedAt={p.publishedAt} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>
            </div>
        </div>
    );
}
