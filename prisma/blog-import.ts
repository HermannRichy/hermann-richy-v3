/**
 * Import des articles rédigés dans prisma/posts (un .json de métadonnées + un .md de contenu par article).
 *   pnpm blog:import            → ajoute les articles absents (publiés immédiatement), sans toucher aux existants
 *   pnpm blog:import --force    → met aussi à jour le contenu des articles déjà présents (même slug)
 * Le Markdown est converti en HTML nettoyé, exactement comme un article écrit dans l'éditeur.
 */
import "dotenv/config";

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import { markdownToHtml } from "../src/lib/content/render";
import { readingMinutes } from "../src/lib/content/text";

type Meta = { title: string; excerpt: string; tags: string[]; seoTitle?: string; seoDescription?: string; coverUrl?: string; draft?: boolean };

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL! }) });
const DIR = join(process.cwd(), "prisma", "posts");

async function main() {
  const force = process.argv.includes("--force");
  const slugs = (await readdir(DIR)).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  const site = (process.env.NEXT_PUBLIC_APP_URL ?? "https://hermannrichy.site").replace(/\/$/, "");

  for (const slug of slugs) {
    const meta = JSON.parse(await readFile(join(DIR, `${slug}.json`), "utf8")) as Meta;
    const markdown = await readFile(join(DIR, `${slug}.md`), "utf8");
    const content = await markdownToHtml(markdown);
    const data = {
      title: meta.title,
      excerpt: meta.excerpt,
      content,
      format: "html",
      tags: meta.tags,
      coverUrl: meta.coverUrl ?? null,
      seoTitle: meta.seoTitle ?? null,
      seoDescription: meta.seoDescription ?? null,
      readingMinutes: readingMinutes(markdown),
    };

    const existing = await db.post.findUnique({ where: { slug }, select: { id: true } });
    if (existing && !force) {
      console.log(`= ${slug} : déjà présent (relancer avec --force pour mettre à jour)`);
      continue;
    }
    if (existing) {
      await db.post.update({ where: { slug }, data });
      console.log(`↻ ${slug} : mis à jour`);
    } else {
      await db.post.create({ data: { ...data, slug, status: meta.draft ? "draft" : "published", publishedAt: meta.draft ? null : new Date() } });
      console.log(`+ ${slug} : ${meta.draft ? "brouillon créé" : "publié"} → ${site}/blog/${slug}`);
    }
  }
  console.log("\nLe site se met à jour dans les 5 minutes (ou redéployez pour un affichage immédiat).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
