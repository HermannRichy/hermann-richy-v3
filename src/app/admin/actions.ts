"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { isTone } from "@/lib/content/project-shared";
import { readingMinutes, slugify } from "@/lib/content/text";
import { db } from "@/lib/server/db";
import { rateLimit, retryMessage } from "@/lib/server/rate-limit";
import { requireAdmin } from "@/lib/server/session";

type Result<T = object> = ({ ok: true; message?: string } & T) | { ok: false; error: string; errors?: Record<string, string> };

const errorsOf = (e: z.ZodError) => Object.fromEntries(e.issues.map((i) => [String(i.path[0] ?? "form"), i.message]));

async function guard(action: string, limit = 60) {
    const session = await requireAdmin();
    const r = await rateLimit(`admin:${action}:${session.user.id}`, limit, 60);
    if (!r.ok) throw new Error(retryMessage(r.retryAfter));
    return session;
}

const slugField = z
    .string()
    .trim()
    .min(2, "Slug trop court.")
    .max(80, "80 caractères maximum.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Minuscules, chiffres et tirets uniquement.");
const optionalUrl = z
    .string()
    .trim()
    .max(500)
    .refine((v) => !v || /^https?:\/\//.test(v) || v.startsWith("/"), "Adresse invalide (https://… ou /…).")
    .transform((v) => v || null);

// ─── Articles ──────────────────────────────────────────────────────────────────

const postSchema = z.object({
    id: z.string().max(40).optional(),
    title: z.string().trim().min(3, "Titre trop court.").max(140, "140 caractères maximum."),
    slug: slugField,
    excerpt: z.string().trim().min(20, "Résumé trop court (20 caractères minimum).").max(320, "320 caractères maximum."),
    content: z.string().max(200_000, "Article trop long."),
    coverUrl: optionalUrl,
    tags: z.array(z.string().trim().min(1).max(30)).max(8, "8 tags maximum."),
    status: z.enum(["draft", "published"]),
    publishedAt: z.string().max(40).optional(),
    seoTitle: z.string().trim().max(70, "70 caractères maximum.").optional(),
    seoDescription: z.string().trim().max(170, "170 caractères maximum.").optional(),
});

export type PostInput = z.input<typeof postSchema>;

export async function savePostAction(input: PostInput): Promise<Result<{ id: string; slug: string }>> {
    try {
        await guard("post");
    } catch (e) {
        return { ok: false, error: (e as Error).message };
    }
    const parsed = postSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Certains champs sont à corriger.", errors: errorsOf(parsed.error) };
    const d = parsed.data;
    if (d.status === "published" && d.content.trim().length < 50) return { ok: false, error: "Contenu trop court pour publier.", errors: { content: "50 caractères minimum pour publier." } };

    const clash = await db.post.findFirst({ where: { slug: d.slug, NOT: d.id ? { id: d.id } : undefined }, select: { id: true } });
    if (clash) return { ok: false, error: "Ce slug est déjà utilisé.", errors: { slug: "Déjà utilisé par un autre article." } };

    const previous = d.id ? await db.post.findUnique({ where: { id: d.id }, select: { slug: true, publishedAt: true } }) : null;
    const date = d.publishedAt ? new Date(d.publishedAt) : null;
    const publishedAt = d.status === "published" ? (date && !Number.isNaN(date.getTime()) ? date : (previous?.publishedAt ?? new Date())) : date && !Number.isNaN(date.getTime()) ? date : null;

    const data = {
        title: d.title,
        slug: d.slug,
        excerpt: d.excerpt,
        content: d.content,
        coverUrl: d.coverUrl,
        tags: [...new Set(d.tags)],
        status: d.status,
        publishedAt,
        readingMinutes: readingMinutes(d.content),
        seoTitle: d.seoTitle || null,
        seoDescription: d.seoDescription || null,
    };
    const post = d.id ? await db.post.update({ where: { id: d.id }, data }) : await db.post.create({ data });

    revalidatePath("/blog", "layout");
    revalidatePath("/sitemap.xml");
    if (previous?.slug && previous.slug !== post.slug) revalidatePath(`/blog/${previous.slug}`);
    revalidatePath("/admin/articles");
    const scheduled = post.status === "published" && post.publishedAt && post.publishedAt > new Date();
    return { ok: true, id: post.id, slug: post.slug, message: post.status === "draft" ? "Brouillon enregistré" : scheduled ? "Publication programmée" : "Article publié" };
}

export async function deletePostAction(id: string): Promise<Result> {
    try {
        await guard("post-delete", 20);
    } catch (e) {
        return { ok: false, error: (e as Error).message };
    }
    const post = await db.post.delete({ where: { id } }).catch(() => null);
    if (!post) return { ok: false, error: "Article introuvable." };
    revalidatePath("/blog", "layout");
    revalidatePath("/admin/articles");
    return { ok: true, message: "Article supprimé" };
}

// ─── Projets ───────────────────────────────────────────────────────────────────

const projectSchema = z.object({
    id: z.string().max(40).optional(),
    title: z.string().trim().min(2, "Titre trop court.").max(80, "80 caractères maximum."),
    slug: slugField,
    description: z.string().trim().min(20, "Description trop courte.").max(400, "400 caractères maximum."),
    imageUrl: z
        .string()
        .trim()
        .min(1, "Ajoutez une image.")
        .max(500)
        .refine((v) => /^https:\/\//.test(v) || v.startsWith("/"), "Adresse d'image invalide."),
    url: optionalUrl,
    photoBg: z.string().refine(isTone, "Couleur invalide."),
    featured: z.boolean(),
    published: z.boolean(),
    wip: z.boolean(),
    year: z
        .number()
        .int()
        .min(2000, "Année invalide.")
        .max(2100, "Année invalide.")
        .nullable(),
    tags: z.array(z.object({ label: z.string().trim().min(1).max(30), tone: z.string().refine(isTone) })).max(8, "8 tags maximum."),
});

export type ProjectInput = z.input<typeof projectSchema>;

const revalidateProjects = () => {
    revalidatePath("/");
    revalidatePath("/projets");
    revalidatePath("/admin/projets");
};

export async function saveProjectAction(input: ProjectInput): Promise<Result<{ id: string }>> {
    try {
        await guard("project");
    } catch (e) {
        return { ok: false, error: (e as Error).message };
    }
    const parsed = projectSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Certains champs sont à corriger.", errors: errorsOf(parsed.error) };
    const { id, ...d } = parsed.data;
    const clash = await db.project.findFirst({ where: { slug: d.slug, NOT: id ? { id } : undefined }, select: { id: true } });
    if (clash) return { ok: false, error: "Ce slug est déjà utilisé.", errors: { slug: "Déjà utilisé par un autre projet." } };

    let project;
    if (id) project = await db.project.update({ where: { id }, data: d });
    else {
        // Nouveau projet : en tête de liste.
        const first = await db.project.findFirst({ orderBy: { sortOrder: "asc" }, select: { sortOrder: true } });
        project = await db.project.create({ data: { ...d, sortOrder: (first?.sortOrder ?? 10) - 10 } });
    }
    revalidateProjects();
    return { ok: true, id: project.id, message: "Projet enregistré" };
}

export async function deleteProjectAction(id: string): Promise<Result> {
    try {
        await guard("project-delete", 20);
    } catch (e) {
        return { ok: false, error: (e as Error).message };
    }
    const p = await db.project.delete({ where: { id } }).catch(() => null);
    if (!p) return { ok: false, error: "Projet introuvable." };
    revalidateProjects();
    return { ok: true, message: "Projet supprimé" };
}

export async function toggleProjectAction(id: string, field: "featured" | "published"): Promise<Result> {
    try {
        await guard("project-toggle");
    } catch (e) {
        return { ok: false, error: (e as Error).message };
    }
    if (field !== "featured" && field !== "published") return { ok: false, error: "Champ invalide." };
    const p = await db.project.findUnique({ where: { id }, select: { featured: true, published: true } });
    if (!p) return { ok: false, error: "Projet introuvable." };
    await db.project.update({ where: { id }, data: { [field]: !p[field] } });
    revalidateProjects();
    return { ok: true };
}

/** Déplace un projet d'un cran (échange d'ordre avec son voisin). */
export async function moveProjectAction(id: string, direction: "up" | "down"): Promise<Result> {
    try {
        await guard("project-move", 120);
    } catch (e) {
        return { ok: false, error: (e as Error).message };
    }
    const all = await db.project.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], select: { id: true } });
    const i = all.findIndex((p) => p.id === id);
    const j = direction === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= all.length) return { ok: true };
    [all[i], all[j]] = [all[j], all[i]];
    await db.$transaction(all.map((p, idx) => db.project.update({ where: { id: p.id }, data: { sortOrder: idx * 10 } })));
    revalidateProjects();
    return { ok: true };
}

// ─── Messages ──────────────────────────────────────────────────────────────────

export async function setMessageStatusAction(id: string, status: "new" | "read" | "archived"): Promise<Result> {
    try {
        await guard("message");
    } catch (e) {
        return { ok: false, error: (e as Error).message };
    }
    if (!["new", "read", "archived"].includes(status)) return { ok: false, error: "Statut invalide." };
    await db.contactMessage.update({ where: { id }, data: { status } }).catch(() => null);
    revalidatePath("/admin", "layout");
    return { ok: true };
}

export async function deleteMessageAction(id: string): Promise<Result> {
    try {
        await guard("message-delete", 30);
    } catch (e) {
        return { ok: false, error: (e as Error).message };
    }
    await db.contactMessage.delete({ where: { id } }).catch(() => null);
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Message supprimé" };
}

// ─── Images (Vercel Blob) ──────────────────────────────────────────────────────

const IMAGE_TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/avif": "avif", "image/gif": "gif" };
const MAX_IMAGE = 4 * 1024 * 1024;

export async function uploadImageAction(form: FormData): Promise<Result<{ url: string }>> {
    try {
        await guard("upload", 30);
    } catch (e) {
        return { ok: false, error: (e as Error).message };
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) return { ok: false, error: "Envoi d'images non configuré (BLOB_READ_WRITE_TOKEN). Collez une adresse d'image à la place." };
    const file = form.get("file");
    const folder = form.get("folder") === "projects" ? "projects" : "blog";
    if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Aucun fichier." };
    const ext = IMAGE_TYPES[file.type];
    if (!ext) return { ok: false, error: "Format accepté : PNG, JPG, WebP, AVIF ou GIF." };
    if (file.size > MAX_IMAGE) return { ok: false, error: "Image trop lourde (4 Mo maximum)." };
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
    const blob = await put(`${folder}/${base}.${ext}`, file, { access: "public", contentType: file.type, addRandomSuffix: true });
    return { ok: true, url: blob.url };
}
