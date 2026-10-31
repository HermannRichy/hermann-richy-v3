import { IconPlus } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ProjectRowActions } from "@/components/admin/project-row";
import { Badge, PageHeader } from "@/components/dashboard/ui";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";

export const metadata: Metadata = { title: "Projets" };
export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
    await requireAdmin();
    const projects = await db.project.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
    return (
        <div className="flex flex-col gap-6">
            <PageHeader kanji="作品集" eyebrow="Studio · Portfolio"
                title="Projets"
                description={`${projects.length} projet${projects.length > 1 ? "s" : ""} · l'ordre est celui du site`}
                actions={
                    <Link href="/admin/projets/nouveau" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-[2.5px] border-lime bg-lime px-5 font-sans text-sm font-bold text-dark no-underline transition-transform duration-300 hover:scale-[1.02]">
                        <IconPlus size={18} stroke={2.5} /> Nouveau projet
                    </Link>
                }
            />
            {projects.length === 0 ? (
                <p className="rounded-[22px] border border-dashed border-white/20 p-8 text-center font-bold text-white/50">Aucun projet. Lancez pnpm db:seed pour importer les projets existants.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {projects.map((p, i) => (
                        <li key={p.id} className={`flex flex-col gap-3 rounded-[22px] border border-white/10 bg-white/[0.03] p-3 sm:flex-row sm:items-center ${p.published ? "" : "opacity-70"}`}>
                            <Link href={`/admin/projets/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3.5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.imageUrl} alt="" className="h-16 w-22 flex-none rounded-xl border border-white/10 object-cover object-top sm:h-18 sm:w-24" />
                                <span className="min-w-0">
                                    <span className="flex flex-wrap items-center gap-2">
                                        <span className="font-display text-xl uppercase leading-none">{p.title}</span>
                                        {p.featured && <Badge tone="lime">Accueil</Badge>}
                                        {!p.published && <Badge tone="muted">Masqué</Badge>}
                                        {p.wip && <Badge tone="warn">En dév.</Badge>}
                                    </span>
                                    <span className="mt-1 line-clamp-1 block text-[13px] font-semibold text-white/50">{p.description}</span>
                                </span>
                            </Link>
                            <ProjectRowActions id={p.id} title={p.title} featured={p.featured} published={p.published} first={i === 0} last={i === projects.length - 1} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
