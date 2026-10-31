import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppToaster } from "@/components/admin/toaster";
import { STAR_PATH } from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "Connexion", robots: { index: false, follow: false, nocache: true } };

/** Page de connexion autonome, dans l'univers du portfolio (fond sombre, étoile, filigrane japonais). */
export default function AdminAuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-dvh flex-col overflow-hidden bg-dark font-sans text-white antialiased">
            <svg width="420" height="420" viewBox="0 0 100 100" aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 opacity-[0.12]">
                <path d={STAR_PATH} fill="#1E45FB" />
            </svg>
            <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 select-none font-jp text-[clamp(4rem,14vw,10rem)] leading-none font-black whitespace-nowrap text-white/[0.04]">
                管理室
            </span>
            <header className="relative flex items-center gap-2.5 px-4 py-6 sm:px-8">
                <svg width="22" height="22" viewBox="0 0 100 100" aria-hidden="true">
                    <path d={STAR_PATH} fill="#CDF22B" />
                </svg>
                <span className="flex flex-col leading-none">
                    <span className="font-display text-[19px] tracking-[0.02em] uppercase">Hermann Richy</span>
                    <span className="mt-1 font-mono text-[10px] tracking-widest text-lime/60 uppercase">Studio</span>
                </span>
            </header>
            <div className="relative flex flex-1 items-start justify-center px-4 pt-6 pb-16 sm:items-center sm:px-6">
                <div className="w-full max-w-[460px] rounded-[28px] border border-white/10 bg-[#141414] p-6 sm:p-9">{children}</div>
            </div>
            <p className="relative px-4 pb-6 text-center font-mono text-[11px] tracking-widest text-white/35 uppercase">Accès réservé · Double authentification</p>
            <AppToaster />
        </div>
    );
}
