import type { Metadata } from "next";
import Link from "next/link";

import { MessageActions } from "@/components/admin/message-actions";
import { Badge, fmtDate, PageHeader } from "@/components/dashboard/ui";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

const FILTERS = [
    { id: "", label: "Boîte de réception" },
    { id: "nouveaux", label: "Non lus" },
    { id: "archives", label: "Archivés" },
] as const;

export default async function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
    await requireAdmin();
    const sp = await searchParams;
    const filter = typeof sp.filtre === "string" ? sp.filtre : "";
    const messages = await db.contactMessage.findMany({
        where: filter === "nouveaux" ? { status: "new" } : filter === "archives" ? { status: "archived" } : { status: { not: "archived" } },
        orderBy: { createdAt: "desc" },
        take: 100,
    });

    return (
        <div className="flex flex-col gap-6">
            <PageHeader kanji="連絡" eyebrow="Studio · Contact" title="Messages" description="Formulaire de contact du portfolio." />
            <nav className="flex flex-wrap gap-2" aria-label="Filtrer">
                {FILTERS.map((f) => (
                    <Link
                        key={f.id}
                        href={f.id ? `/admin/messages?filtre=${f.id}` : "/admin/messages"}
                        aria-current={filter === f.id ? "page" : undefined}
                        className={cn("inline-flex min-h-10 items-center rounded-full border px-4 font-mono text-[12px] tracking-wider uppercase no-underline transition-colors", filter === f.id ? "border-lime bg-lime text-dark" : "border-white/20 text-white/70 hover:border-lime hover:text-lime")}
                    >
                        {f.label}
                    </Link>
                ))}
            </nav>
            {messages.length === 0 ? (
                <p className="rounded-[22px] border border-dashed border-white/20 p-8 text-center font-bold text-white/50">Aucun message.</p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {messages.map((m) => (
                        <li id={m.id} key={m.id} className={cn("flex scroll-mt-24 flex-col gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 sm:p-5", m.status === "new" ? "border-lime/40" : "")}>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[17px] font-bold">{m.name}</span>
                                        {m.status === "new" && <Badge tone="lime">Nouveau</Badge>}
                                        {m.status === "archived" && <Badge tone="muted">Archivé</Badge>}
                                        {!m.emailSent && <Badge tone="warn">E-mail non envoyé</Badge>}
                                    </div>
                                    <a href={`mailto:${m.email}`} className="text-sm font-semibold break-all text-lime underline underline-offset-2">
                                        {m.email}
                                    </a>
                                </div>
                                <span className="text-xs font-semibold whitespace-nowrap text-white/50">{fmtDate(m.createdAt)}</span>
                            </div>
                            <div>
                                <div className="font-bold">{m.title}</div>
                                {m.types.length > 0 && <div className="mt-1 text-xs font-bold text-[#b9a3ff]">{m.types.join(" · ")}</div>}
                                <p className="mt-2 text-[15px] leading-relaxed whitespace-pre-line">{m.message}</p>
                            </div>
                            <MessageActions id={m.id} status={m.status} email={m.email} title={m.title} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
