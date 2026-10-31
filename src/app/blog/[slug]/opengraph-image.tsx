import { getPost } from "@/lib/content/posts";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Article du blog de Hermann Richy";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const post = await getPost((await params).slug);
    return ogImage({ eyebrow: post?.tags[0] ? `Blog · ${post.tags[0]}` : "Blog", title: post?.title ?? "Blog", subtitle: post ? `${post.readingMinutes} min de lecture` : undefined });
}
