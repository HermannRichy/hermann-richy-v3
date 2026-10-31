import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

import { adminGate } from "@/lib/admin-path";

const notFound = (request: NextRequest) => NextResponse.rewrite(new URL("/_introuvable", request.url));

/**
 * - Adresse secrète de connexion (ADMIN_PATH) réécrite vers /admin/connexion.
 * - /admin/connexion, /admin/mot-de-passe et /admin sans session : 404 quand ADMIN_PATH est défini.
 * - Vérification optimiste ; la vraie vérification (session, 2FA) est faite côté serveur.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const gate = adminGate();
  const hasSession = Boolean(getSessionCookie(request, { cookiePrefix: "hr" }));

  if (gate && (pathname === gate || pathname.startsWith(`${gate}/`))) {
    const rest = pathname.slice(gate.length);
    if (rest === "" || rest === "/") return NextResponse.rewrite(new URL(`/admin/connexion${search}`, request.url));
    if (rest === "/mot-de-passe") return NextResponse.rewrite(new URL(`/admin/mot-de-passe${search}`, request.url));
    return notFound(request);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const isAuthPage = pathname.startsWith("/admin/connexion") || pathname.startsWith("/admin/mot-de-passe");
    if (gate) {
      if (isAuthPage || !hasSession) return notFound(request);
    } else if (!isAuthPage && !hasSession) {
      return NextResponse.redirect(new URL("/admin/connexion", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/|.*\\.(?:ico|png|jpg|jpeg|svg|webp|gif|avif|txt|xml|webmanifest|woff2?|ttf|otf)$).*)"],
};
