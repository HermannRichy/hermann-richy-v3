/**
 * Données initiales :
 * - compte admin ADMIN_EMAIL, sans mot de passe → activation par l'admin lui-même
 *   (page de connexion → « Première connexion : activer mon compte », ou pnpm admin:link) ;
 * - import des projets de src/data/projects.ts (uniquement ceux absents de la base) ;
 * - premier article « Prélude » si le blog est vide.
 *   pnpm db:seed
 */
import "dotenv/config";

import { randomUUID } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import { projects } from "../src/data/projects";
import { fromStatic } from "../src/lib/content/project-shared";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL! }) });

const PRELUDE = `Les dernières versions cassent toujours quelque chose. Une API dépréciée, un comportement qui change silencieusement, une doc qui n'a pas encore suivi. Je passe des heures là-dedans, pour que vous n'ayez pas à le faire.

Ce blog, c'est le raccourci que j'aurais voulu avoir. Des tips et astuces concrets, testés sur les vraies dernières versions : Next.js App Router, Tailwind v4, GSAP 3.x, les LLM via API, Go, Python : ce qui marche réellement, pas ce qui marchait il y a dix-huit mois.

> Pas de tutoriel recyclé. Pas de « ça dépend » sans réponse. Juste ce qui fonctionne, avec le pourquoi.

Je me tracasse avec les breaking changes, les migrations, les configs qui ne font que trois lignes dans la doc mais qui prennent deux heures à comprendre. Vous, vous repartez avec la solution directe et du temps récupéré.

Premier article à venir. En attendant, bienvenue.`;

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "hermannrichy15@gmail.com").trim().toLowerCase();
  await db.user.upsert({
    where: { email },
    create: { id: randomUUID(), email, name: "Hermann Richy", emailVerified: true },
    update: {},
  });

  let imported = 0;
  for (const [i, p] of projects.entries()) {
    const data = fromStatic(p, i);
    const exists = await db.project.findUnique({ where: { slug: data.slug }, select: { id: true } });
    if (exists) continue;
    await db.project.create({ data });
    imported++;
  }

  if ((await db.post.count()) === 0) {
    await db.post.create({
      data: {
        slug: "prelude",
        title: "Prélude",
        excerpt: "Pourquoi ce blog : des tips concrets, testés sur les vraies dernières versions, pour que vous n'ayez pas à vous battre avec les breaking changes.",
        content: PRELUDE,
        format: "markdown",
        tags: ["Journal"],
        status: "published",
        publishedAt: new Date("2026-06-30T09:00:00Z"),
        readingMinutes: 2,
      },
    });
  }

  const site = (process.env.NEXT_PUBLIC_APP_URL ?? "https://hermannrichy.site").replace(/\/$/, "");
  const gate = process.env.ADMIN_PATH?.trim().replace(/^\/+|\/+$/g, "");
  console.log(`Admin : ${email}`);
  console.log(`Projets importés : ${imported}`);
  console.log(`Activation : ${site}/${gate || "admin/connexion"} → « Première connexion : activer mon compte » (ou pnpm admin:link)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
