import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

/** Client Prisma unique (node-postgres : fonctionne avec Neon et un PostgreSQL local). */
function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL manquant");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }), log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"] });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/** La base est-elle configurée ? (le site public reste fonctionnel sans elle) */
export const hasDatabase = () => Boolean(process.env.DATABASE_URL);
