import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

import { AppToaster } from "@/components/admin/toaster";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";
import { adminLoginPath } from "@/lib/admin-path";
import { db } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/session";

export const metadata: Metadata = { title: { default: "Studio", template: "%s · Studio" }, robots: { index: false, follow: false, nocache: true } };

async function Shell({ children }: { children: ReactNode }) {
    const session = await requireAdmin({ allowWithout2fa: true });
    const [unread, drafts] = await Promise.all([db.contactMessage.count({ where: { status: "new" } }), db.post.count({ where: { status: "draft" } })]);
    const items: NavItem[] = [
        { href: "/admin", label: "Tableau de bord", icon: "dashboard", group: "content" },
        { href: "/admin/articles", label: "Articles", icon: "posts", group: "content", badge: drafts ? `${drafts} brouillon${drafts > 1 ? "s" : ""}` : undefined },
        { href: "/admin/projets", label: "Projets", icon: "projects", group: "content" },
        { href: "/admin/messages", label: "Messages", icon: "messages", group: "content", badge: unread ? String(unread) : undefined },
        { href: "/admin/securite", label: "Sécurité", icon: "security", group: "account" },
    ];
    return (
        <DashboardShell
            badge="STUDIO"
            home="/admin"
            items={items}
            groups={[
                { id: "content", label: "Contenu" },
                { id: "account", label: "Compte" },
            ]}
            user={{ name: session.user.name, email: session.user.email, role: "Admin" }}
            signOutTo={adminLoginPath()}
            links={[
                { href: "/", label: "Voir le site" },
                { href: "/blog", label: "Voir le blog" },
            ]}
        >
            {children}
        </DashboardShell>
    );
}

function ShellSkeleton() {
    return (
        <div className="min-h-dvh bg-cream" aria-busy="true">
            <div className="fixed inset-x-0 top-0 h-16 border-b-[3px] border-dark bg-dark lg:inset-y-0 lg:right-auto lg:h-auto lg:w-[288px] lg:border-r-[3px] lg:border-b-0" />
            <div className="pt-16 lg:pt-0 lg:pl-[288px]">
                <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
                    <div className="h-12 w-64 animate-pulse rounded-2xl bg-white" />
                    <div className="h-96 animate-pulse rounded-[24px] bg-white" />
                </div>
            </div>
        </div>
    );
}

export default function PanelLayout({ children }: { children: ReactNode }) {
    return (
        <div className="font-sans antialiased">
            <Suspense fallback={<ShellSkeleton />}>
                <Shell>{children}</Shell>
            </Suspense>
            <AppToaster />
        </div>
    );
}
