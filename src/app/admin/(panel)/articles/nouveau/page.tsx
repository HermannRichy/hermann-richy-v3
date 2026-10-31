import type { Metadata } from "next";
import Link from "next/link";

import { PostEditor } from "@/components/admin/post-editor";
import { PageHeader } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/server/session";

export const metadata: Metadata = { title: "Nouvel article" };

export default async function NewPostPage() {
    await requireAdmin();
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                back={
                    <Link href="/admin/articles" className="self-start text-sm font-extrabold underline underline-offset-4">
                        ← Articles
                    </Link>
                }
                title="Nouvel article"
            />
            <PostEditor initial={{ title: "", slug: "", excerpt: "", content: "", coverUrl: "", tags: [], status: "draft", publishedAt: null, seoTitle: "", seoDescription: "" }} />
        </div>
    );
}
