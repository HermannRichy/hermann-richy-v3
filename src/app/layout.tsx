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

export const metadata: Metadata = {
  title: "Hermann Richy — Développeur Fullstack",
  description:
    "Développeur fullstack basé à Cotonou, BJ. Je construis des interfaces React/Next.js rapides et les API solides qui tiennent derrière.",
  openGraph: {
    title: "Hermann Richy — Développeur Fullstack",
    description:
      "Interfaces React/Next.js, animations GSAP, API Node.js. Vite. Bien. Animé.",
    type: "website",
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
