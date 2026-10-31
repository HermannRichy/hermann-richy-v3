import type { Metadata } from "next";
import Link from "next/link";

import { ProjectForm } from "@/components/admin/project-form";
import { PageHeader } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/server/session";

export const metadata: Metadata = { title: "Nouveau projet" };

export default async function NewProjectPage() {
    await requireAdmin();
    return (
        <div className="flex flex-col gap-6">
            <PageHeader kanji="作品集" eyebrow="Studio · Portfolio"
                back={
                    <Link href="/admin/projets" className="inline-flex items-center gap-2 self-start font-mono text-2xs text-lime no-underline transition-all hover:gap-3">
                        ← Projets
                    </Link>
                }
                title="Nouveau projet"
            />
            <ProjectForm initial={{ title: "", slug: "", description: "", imageUrl: "", url: "", photoBg: "brand", featured: true, published: true, wip: false, year: String(new Date().getFullYear()), tags: [] }} />
        </div>
    );
}
