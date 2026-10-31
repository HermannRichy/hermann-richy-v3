import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { getPost } from "@/lib/content/posts";

export const alt = "Article du blog de Hermann Richy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const display = readFile(join(process.cwd(), "src", "app", "fonts", "BlackSansaFree-Regular.otf"));

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
    const post = await getPost((await params).slug);
    const title = post?.title ?? "Blog";
    const fontSize = title.length > 60 ? 64 : title.length > 34 ? 84 : 110;
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0d0d0d", color: "#fff", padding: "64px 72px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26, color: "#cdf22b", letterSpacing: 4 }}>
                    <span>✦ BLOG</span>
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>{post?.tags[0]?.toUpperCase() ?? ""}</span>
                </div>
                <div style={{ display: "flex", fontFamily: "Display", fontSize, lineHeight: 0.92, textTransform: "uppercase" }}>{title}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 28 }}>
                    <span style={{ fontFamily: "Display", textTransform: "uppercase" }}>Hermann Richy</span>
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>hermannrichy.dev</span>
                </div>
            </div>
        ),
        { ...size, fonts: [{ name: "Display", data: await display, style: "normal", weight: 400 }] },
    );
}
