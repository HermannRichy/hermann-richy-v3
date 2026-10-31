import type { Metadata } from "next";

import { TwoFactorSetup } from "@/components/admin/two-factor-setup";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { requireAdmin } from "@/lib/server/session";

export const metadata: Metadata = { title: "Sécurité" };
export const dynamic = "force-dynamic";

export default async function SecurityPage() {
    const session = await requireAdmin({ allowWithout2fa: true });
    return (
        <div className="flex flex-col gap-6">
            <PageHeader kanji="安全" eyebrow="Studio · Compte" title="Sécurité" description="Protégez l'accès au dashboard." />
            <Panel title="Double authentification">
                <TwoFactorSetup enabled={Boolean(session.user.twoFactorEnabled)} />
            </Panel>
        </div>
    );
}
