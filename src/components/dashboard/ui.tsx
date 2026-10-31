import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const STAR_PATH = "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

/** Classes partagées du dashboard (style du portfolio : pilules, contours fins, citron). */
export const ui = {
    btn: "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-[2.5px] px-5 font-sans text-sm font-bold no-underline transition-[transform,color,border-color,background-color] duration-300 hover:scale-[1.02]",
    primary: "border-lime bg-lime text-dark",
    outline: "border-white/25 bg-transparent text-white hover:border-lime hover:text-lime",
    danger: "border-white/25 bg-transparent text-white hover:border-[#ff6b6b] hover:bg-[#ff6b6b]/10 hover:text-[#ff8a8a]",
    icon: "inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-lime hover:text-lime",
    card: "rounded-[22px] border border-white/10 bg-white/[0.03]",
    pill: "inline-flex min-h-10 items-center rounded-full border px-4 font-mono text-[12px] tracking-wider uppercase transition-colors",
};

export function Panel({ title, children, className, action }: { title?: string; children: ReactNode; className?: string; action?: ReactNode }) {
    return (
        <section className={cn("flex min-w-0 flex-col gap-4 p-4 sm:p-6", ui.card, className)}>
            {(title || action) && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {title && <h2 className="font-display text-xl uppercase leading-none sm:text-2xl">{title}</h2>}
                    {action}
                </div>
            )}
            {children}
        </section>
    );
}

/** Titre de page : étiquette mono citron, titre en police d'affichage, filigrane japonais (comme les sections du portfolio). */
export function PageHeader({ title, description, actions, back, eyebrow = "Studio", kanji }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; back?: ReactNode; eyebrow?: string; kanji?: string }) {
    return (
        <div className="relative flex flex-col gap-3">
            {kanji && (
                <span aria-hidden="true" className="pointer-events-none absolute -top-6 right-0 select-none font-jp text-[clamp(3.5rem,10vw,7rem)] leading-none font-black whitespace-nowrap text-white/[0.04]">
                    {kanji}
                </span>
            )}
            {back}
            <div className="relative flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
                <div className="flex min-w-0 flex-col gap-3">
                    <p className="font-mono text-2xs tracking-[0.14em] text-lime uppercase">✦ {eyebrow}</p>
                    <h1 className="m-0 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.9] uppercase break-words">{title}</h1>
                    {description && <div className="text-[15px] text-white/55">{description}</div>}
                </div>
                {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
            </div>
        </div>
    );
}

/** Chiffre clé (comme la section « chiffres » du portfolio). */
export function Stat({ label, value, tone = "white", hint, className }: { label: string; value: ReactNode; tone?: "white" | "blue" | "black"; hint?: string; className?: string }) {
    const tones = { white: "border-white/10 bg-white/[0.03] text-white", blue: "border-brand bg-brand text-white", black: "border-lime bg-lime text-dark" } as const;
    return (
        <div className={cn("flex min-w-0 flex-col gap-2 rounded-[22px] border p-4 sm:p-5", tones[tone], className)}>
            <span className={cn("font-display text-[clamp(2.4rem,6vw,3.5rem)] leading-[0.85] break-words", tone === "white" ? "text-lime" : "")}>{value}</span>
            <span className="font-mono text-[11px] tracking-widest uppercase opacity-70">{label}</span>
            {hint && <span className="text-xs opacity-60">{hint}</span>}
        </div>
    );
}

const BADGE_TONES = {
    white: "border-white/25 text-white/80",
    blue: "border-brand bg-brand text-white",
    lime: "border-lime bg-lime text-dark",
    dark: "border-white bg-white text-dark",
    warn: "border-[#ffb347]/40 bg-[#ffb347]/15 text-[#ffcf8a]",
    muted: "border-white/10 bg-white/10 text-white/60",
} as const;

export function Badge({ children, tone = "white" }: { children: ReactNode; tone?: keyof typeof BADGE_TONES }) {
    return <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wider whitespace-nowrap uppercase", BADGE_TONES[tone])}>{children}</span>;
}

export const fmtDate = (d: Date) => d.toLocaleString("fr-FR", { timeZone: "Africa/Porto-Novo", dateStyle: "medium", timeStyle: "short" });
