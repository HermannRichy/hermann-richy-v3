import { IconTrash } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteProjectAction } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/confirm-button";
import { ProjectForm } from "@/components/admin/project-form";
import { PageHeader } from "@/components/dashboard/ui";
import { isTone, type StoredTag } from "@/lib/content/project-shared";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";

export const metadata: Metadata = { title: "Modifier le projet" };
export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: PageProps<"/admin/projets/[id]">) {
    await requireAdmin();
    const p = await db.project.findUnique({ where: { id: (await params).id } });
    if (!p) notFound();
    return (
        <div className="flex flex-col gap-6">
            <PageHeader kanji="作品集" eyebrow="Studio · Portfolio"
                back={
                    <Link href="/admin/projets" className="inline-flex items-center gap-2 self-start font-mono text-2xs text-lime no-underline transition-all hover:gap-3">
                        ← Projets
                    </Link>
                }
                title={p.title}
                actions={
                    <ActionButton action={deleteProjectAction.bind(null, p.id)} confirm={`Supprimer définitivement « ${p.title} » ?`} redirectTo="/admin/projets" className="min-h-11 rounded-[14px] border-[3px] px-4 hover:border-[#ff6b6b] hover:text-[#ff8a8a]">
                        <IconTrash size={17} stroke={2.5} /> Supprimer
                    </ActionButton>
                }
            />
            <ProjectForm
                key={p.updatedAt.toISOString()}
                initial={{
                    id: p.id,
                    title: p.title,
                    slug: p.slug,
                    description: p.description,
                    imageUrl: p.imageUrl,
                    url: p.url ?? "",
                    photoBg: isTone(p.photoBg) ? p.photoBg : "brand",
                    featured: p.featured,
                    published: p.published,
                    wip: p.wip,
                    year: p.year ? String(p.year) : "",
                    tags: (Array.isArray(p.tags) ? p.tags : []) as StoredTag[],
                }}
            />
        </div>
    );
}
