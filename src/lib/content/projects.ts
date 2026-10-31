import { projects as staticProjects, type Project } from "@/data/projects";
import { db, hasDatabase } from "@/lib/server/db";

import { toProject } from "./project-shared";

export * from "./project-shared";

/** Projets publiés, triés. Repli sur src/data/projects.ts si la base est absente, vide ou indisponible. */
export async function getProjects(): Promise<Project[]> {
    if (!hasDatabase()) return staticProjects;
    try {
        const rows = await db.project.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
        return rows.length ? rows.map(toProject) : staticProjects;
    } catch (e) {
        console.error("[projets] lecture impossible, repli statique", (e as Error).message);
        return staticProjects;
    }
}

