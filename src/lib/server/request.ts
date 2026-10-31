import { createHash } from "node:crypto";

import { headers } from "next/headers";

import { SITE_URL } from "@/config/site";

/** IP du client derrière le proxy de l'hébergeur (Vercel). */
export async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return h.get("x-real-ip");
}

/** Empreinte salée de l'IP : jamais stockée en clair. */
export function hashIp(ip: string | null) {
  if (!ip) return null;
  return createHash("sha256").update(`${process.env.IP_HASH_SALT ?? process.env.BETTER_AUTH_SECRET ?? ""}:${ip}`).digest("hex").slice(0, 32);
}

/** Origines autorisées pour les requêtes qui modifient des données. */
export function allowedOrigins() {
  const list = new Set([SITE_URL, SITE_URL.replace("://", "://www.")]);
  if (process.env.BETTER_AUTH_URL) list.add(process.env.BETTER_AUTH_URL.replace(/\/$/, ""));
  if (process.env.VERCEL_URL) list.add(`https://${process.env.VERCEL_URL}`);
  if (process.env.NODE_ENV !== "production") list.add("http://localhost:3000");
  return list;
}

/** Protection CSRF des route handlers (les server actions ont déjà leur propre vérification). */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") === "same-origin";
  return allowedOrigins().has(origin);
}
