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
            <PageHeader kanji="記事" eyebrow="Studio · Blog"
                back={
                    <Link href="/admin/articles" className="inline-flex items-center gap-2 self-start font-mono text-2xs text-lime no-underline transition-all hover:gap-3">
                        ← Articles
                    </Link>
                }
                title="Nouvel article"
            />
            <PostEditor initial={{ title: "", slug: "", excerpt: "", content: "", coverUrl: "", tags: [], status: "draft", publishedAt: null, seoTitle: "", seoDescription: "" }} />
        </div>
    );
}
