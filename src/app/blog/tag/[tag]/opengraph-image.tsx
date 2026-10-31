import { getAllTags, tagSlug } from "@/lib/content/posts";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Thème du blog de Hermann Richy";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ tag: string }> }) {
    const slug = (await params).tag;
    const t = (await getAllTags()).find((x) => tagSlug(x.tag) === slug);
    return ogImage({ eyebrow: "Blog · Thème", title: t?.tag ?? "Blog", subtitle: t ? `${t.count} article${t.count > 1 ? "s" : ""}` : undefined });
}
