import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const blackSansa = localFont({
    src: "./fonts/BlackSansaFree-Regular.otf",
    variable: "--font-black-sansa",
    display: "swap",
});

const satoshi = localFont({
    src: "./fonts/Satoshi-Variable.ttf",
    variable: "--font-satoshi",
    display: "swap",
    weight: "300 900",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});

// Noto Sans JP hébergée localement, réduite aux caractères japonais utilisés sur le site
// (Google Fonts faisait échouer le build Turbopack). Nouveau kanji → régénérer le sous-ensemble.
const notoSansJP = localFont({
    src: [
        { path: "./fonts/NotoSansJP-700-subset.woff2", weight: "700", style: "normal" },
        { path: "./fonts/NotoSansJP-900-subset.woff2", weight: "900", style: "normal" },
    ],
    variable: "--font-noto-jp",
    display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hermannrichy.site";

export const metadata: Metadata = {
    metadataBase: new URL(APP_URL),

    title: {
        default: "Hermann Richy - Développeur Fullstack & Frontend Master",
        template: "%s - Hermann Richy",
    },
    description:
        "Développeur fullstack basé à Cotonou, Bénin. Interfaces React/Next.js pixel perfect, animations GSAP, backends Node.js/Go/Python et IA agentique au cœur de chaque projet.",
    keywords: [
        "développeur fullstack",
        "frontend",
        "React",
        "Next.js",
        "GSAP",
        "TypeScript",
        "Node.js",
        "Cotonou",
        "Bénin",
        "Hermann Richy",
        "Frontend Master",
    ],
    authors: [{ name: "Hermann Richy", url: APP_URL }],
    creator: "Hermann Richy",
    publisher: "Hermann Richy",

    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },

    openGraph: {
        type: "website",
        locale: "fr_FR",
        url: APP_URL,
        siteName: "Hermann Richy",
        title: "Hermann Richy - Développeur Fullstack & Frontend Master",
        description:
            "Interfaces React/Next.js pixel perfect, animations GSAP, backends multi-stack et IA agentique. Basé à Cotonou, Bénin.",
    },

    twitter: {
        card: "summary_large_image",
        title: "Hermann Richy - Développeur Fullstack & Frontend Master",
        description:
            "Interfaces React/Next.js pixel perfect, animations GSAP, backends multi-stack et IA agentique.",
    },

    applicationName: "Hermann Richy",
    category: "technology",
    formatDetection: { telephone: false, email: false, address: false },
    // Chaque page définit sa propre URL canonique ; le flux RSS du blog est annoncé partout.
    alternates: { types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: "Blog - Hermann Richy" }] } },
    // Images Open Graph / Twitter et icônes : générées par les fichiers opengraph-image, twitter-image, icon et apple-icon.
};

export const viewport: Viewport = {
    themeColor: "#1e45fb",
    colorScheme: "light",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="fr"
            className={`${blackSansa.variable} ${satoshi.variable} ${jetbrainsMono.variable} ${notoSansJP.variable}`}
        >
            <body className="min-h-full">{children}</body>
        </html>
    );
}
