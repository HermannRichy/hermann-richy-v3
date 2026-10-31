import { IconExternalLink, IconTrash } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { deletePostAction } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/confirm-button";
import { PostEditor } from "@/components/admin/post-editor";
import { PageHeader } from "@/components/dashboard/ui";
import { markdownToHtml } from "@/lib/content/render";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";

export const metadata: Metadata = { title: "Modifier l'article" };
export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: PageProps<"/admin/articles/[id]">) {
    await requireAdmin();
    const post = await db.post.findUnique({ where: { id: (await params).id } });
    if (!post) notFound();
    // Ancien article en Markdown : converti en HTML pour l'éditeur (enregistré en HTML ensuite).
    const content = post.format === "markdown" ? await markdownToHtml(post.content) : post.content;
    const live = post.status === "published" && post.publishedAt && post.publishedAt <= new Date();
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                back={
                    <Link href="/admin/articles" className="self-start text-sm font-extrabold underline underline-offset-4">
                        ← Articles
                    </Link>
                }
                title={post.title}
                actions={
                    <>
                        {live && (
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-[14px] border-[3px] border-dark bg-white px-4 text-sm font-extrabold shadow-[3px_3px_0_#0d0d0d]">
                                <IconExternalLink size={17} stroke={2.5} /> Voir l&apos;article
                            </a>
                        )}
                        <ActionButton action={deletePostAction.bind(null, post.id)} confirm={`Supprimer définitivement « ${post.title} » ?`} redirectTo="/admin/articles" className="min-h-11 rounded-[14px] border-[3px] px-4 hover:bg-[#FFE9E9]">
                            <IconTrash size={17} stroke={2.5} /> Supprimer
                        </ActionButton>
                    </>
                }
            />
            <PostEditor
                key={post.updatedAt.toISOString()}
                initial={{
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt,
                    content,
                    coverUrl: post.coverUrl ?? "",
                    tags: post.tags,
                    status: post.status,
                    publishedAt: post.publishedAt?.toISOString() ?? null,
                    seoTitle: post.seoTitle ?? "",
                    seoDescription: post.seoDescription ?? "",
                }}
            />
        </div>
    );
}
