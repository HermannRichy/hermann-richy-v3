import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Sans_JP } from "next/font/google";
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

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-noto-jp",
  display: "swap",
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://hermannrichy.dev";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: "Hermann Richy — Développeur Fullstack & Frontend Master",
    template: "%s — Hermann Richy",
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
    googleBot: { index: true, follow: true },
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    siteName: "Hermann Richy",
    title: "Hermann Richy — Développeur Fullstack & Frontend Master",
    description:
      "Interfaces React/Next.js pixel perfect, animations GSAP, backends multi-stack et IA agentique. Basé à Cotonou, Bénin.",
    images: [
      {
        url: "/og-img.jpg",
        width: 1200,
        height: 630,
        alt: "Hermann Richy — Développeur Fullstack & Frontend Master",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Hermann Richy — Développeur Fullstack & Frontend Master",
    description:
      "Interfaces React/Next.js pixel perfect, animations GSAP, backends multi-stack et IA agentique.",
    images: ["/og-img.jpg"],
  },

  alternates: {
    canonical: APP_URL,
  },
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
