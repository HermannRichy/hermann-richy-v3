import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { StaffLogin } from "@/components/admin/staff-login";
import { adminResetPath } from "@/lib/admin-path";
import { getSession } from "@/lib/server/session";

export const metadata: Metadata = { title: "Connexion", robots: { index: false, follow: false } };

async function Login({ searchParams }: { searchParams: PageProps<"/admin/connexion">["searchParams"] }) {
  const [sp, session] = await Promise.all([searchParams, getSession()]);
  // Déjà connecté : directement au tableau de bord.
  if (session) redirect("/admin");
  return <StaffLogin startAt2fa={sp.etape === "2fa"} resetPath={adminResetPath()} />;
}

export default function AdminLoginPage(props: PageProps<"/admin/connexion">) {
  return (
    <Suspense fallback={<div className="h-[420px] animate-pulse rounded-2xl bg-cream" />}>
      <Login searchParams={props.searchParams} />
    </Suspense>
  );
}
