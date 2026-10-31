import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const display = readFile(join(process.cwd(), "src", "app", "fonts", "BlackSansaFree-Regular.otf"));
// Texte courant et caractères absents de la police d'affichage (accents) : aucune police téléchargée au rendu.
const sans = readFile(join(process.cwd(), "src", "app", "fonts", "Geist-Regular.ttf"));

const STAR = "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

type Theme = "dark" | "brand" | "cream";
const THEMES: Record<Theme, { bg: string; fg: string; accent: string; muted: string }> = {
    dark: { bg: "#0d0d0d", fg: "#ffffff", accent: "#cdf22b", muted: "rgba(255,255,255,0.55)" },
    brand: { bg: "#1e45fb", fg: "#ffffff", accent: "#cdf22b", muted: "rgba(255,255,255,0.7)" },
    cream: { bg: "#f5f4ef", fg: "#0d0d0d", accent: "#1e45fb", muted: "#46463f" },
};

/** Image de partage (Open Graph / Twitter) aux couleurs du portfolio. */
export async function ogImage({ eyebrow, title, subtitle, theme = "dark" }: { eyebrow: string; title: string; subtitle?: string; theme?: Theme }) {
    const t = THEMES[theme];
    const size = title.length > 60 ? 64 : title.length > 34 ? 84 : 112;
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: t.bg, color: t.fg, padding: "60px 72px", position: "relative", fontFamily: "Sans" }}>
                <svg width="260" height="260" viewBox="0 0 100 100" style={{ position: "absolute", top: 40, right: 50, opacity: theme === "cream" ? 0.12 : 0.2 }}>
                    <path d={STAR} fill={t.accent} />
                </svg>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, letterSpacing: 4, color: t.accent }}>
                    <svg width="26" height="26" viewBox="0 0 100 100">
                        <path d={STAR} fill={t.accent} />
                    </svg>
                    {eyebrow.toUpperCase()}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                    <div style={{ display: "flex", fontFamily: "Display", fontSize: size, lineHeight: 0.92, textTransform: "uppercase", maxWidth: 1000 }}>{title}</div>
                    {subtitle && <div style={{ display: "flex", fontSize: 30, color: t.muted, maxWidth: 940, lineHeight: 1.3 }}>{subtitle}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 28 }}>
                    <span style={{ fontFamily: "Display", textTransform: "uppercase" }}>Hermann Richy</span>
                    <span style={{ color: t.muted }}>hermannrichy.dev</span>
                </div>
            </div>
        ),
        { ...OG_SIZE, fonts: [
                { name: "Display", data: await display, style: "normal", weight: 400 },
                { name: "Sans", data: await sans, style: "normal", weight: 500 },
            ],
        },
    );
}

/** Icône carrée (favicon PNG, apple-touch-icon, PWA). */
export function iconImage(size: number) {
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0d", borderRadius: size * 0.22 }}>
                <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 100 100">
                    <path d={STAR} fill="#cdf22b" />
                </svg>
            </div>
        ),
        { width: size, height: size },
    );
}
