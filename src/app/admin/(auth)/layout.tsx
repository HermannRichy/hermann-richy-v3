import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppToaster } from "@/components/admin/toaster";

export const metadata: Metadata = { title: "Connexion", robots: { index: false, follow: false, nocache: true } };

/** Page de connexion autonome de l'admin. */
export default function AdminAuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-dvh flex-col bg-dark font-sans text-white antialiased">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(30,69,251,0.35),transparent_45%)]" aria-hidden="true" />
            <header className="relative flex items-center justify-between gap-4 px-4 py-5 sm:px-8">
                <span className="font-display text-2xl uppercase">Richy</span>
                <span className="rounded-full bg-lime px-3 py-1 text-[11px] font-extrabold tracking-[0.08em] text-dark">STUDIO</span>
            </header>
            <div className="relative flex flex-1 items-start justify-center px-4 pt-4 pb-12 sm:items-center sm:px-6 sm:pb-20">
                <div className="w-full max-w-[460px] rounded-[28px] border-[2.5px] border-white bg-white p-5 text-dark shadow-[8px_8px_0_#CDF22B] sm:p-8 sm:shadow-[12px_12px_0_#CDF22B]">{children}</div>
            </div>
            <p className="relative px-4 pb-6 text-center font-mono text-xs text-white/50">Accès réservé · Double authentification obligatoire</p>
            <AppToaster />
        </div>
    );
}
