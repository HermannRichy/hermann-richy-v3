import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { adminGate } from "@/lib/admin-path";
import { auth } from "@/lib/auth";

/** Session de la requête (dédupliquée entre layout et page). */
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

/** Admin connecté avec double authentification (sinon 404 ou page Sécurité). */
export async function requireAdmin({ allowWithout2fa = false } = {}) {
  const session = await getSession();
  if (!session) return adminGate() ? notFound() : redirect("/admin/connexion");
  if (!allowWithout2fa && !session.user.twoFactorEnabled) redirect("/admin/securite");
  return session;
}
