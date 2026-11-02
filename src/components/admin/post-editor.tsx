"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { savePostAction } from "@/app/admin/actions";
import { RichEditor } from "@/components/admin/rich-editor";
import { ImageField } from "@/components/admin/image-field";
import { SubmitButton, TextareaField, TextField } from "@/components/form/fields";
import { readingMinutes, slugify } from "@/lib/content/text";
import { cn } from "@/lib/utils";
import { SITE_HOST } from "@/config/site";

export type EditablePost = {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverUrl: string;
    tags: string[];
    status: "draft" | "published";
    publishedAt: string | null; // ISO
    seoTitle: string;
    seoDescription: string;
};

/** ISO → valeur d'un <input type="datetime-local"> dans le fuseau du navigateur. */
const toLocalInput = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** Éditeur d'article : éditeur riche (Tiptap), image de couverture, tags, publication programmée et SEO. */
export function PostEditor({ initial }: { initial: EditablePost }) {
    const router = useRouter();
    const [post, setPost] = useState(initial);
    const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
    const [publishAt, setPublishAt] = useState(toLocalInput(initial.publishedAt));
    const [tagDraft, setTagDraft] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [dirty, setDirty] = useState(false);
    const [pending, startTransition] = useTransition();

    const set = <K extends keyof EditablePost>(key: K, value: EditablePost[K]) => {
        setPost((p) => ({ ...p, [key]: value, ...(key === "title" && !slugTouched ? { slug: slugify(String(value)) } : {}) }));
        setDirty(true);
        if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: "" }));
    };

    // Avertit avant de quitter la page avec des modifications non enregistrées.
    useEffect(() => {
        if (!dirty) return;
        const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener("beforeunload", onLeave);
        return () => window.removeEventListener("beforeunload", onLeave);
    }, [dirty]);

    const addTag = (raw: string) => {
        const t = raw.trim().replace(/,$/, "");
        if (!t || post.tags.includes(t) || post.tags.length >= 8) return setTagDraft("");
        set("tags", [...post.tags, t.slice(0, 30)]);
        setTagDraft("");
    };

    const save = (status: "draft" | "published") =>
        startTransition(async () => {
            const iso = publishAt ? new Date(publishAt).toISOString() : undefined;
            const res = await savePostAction({ ...post, status, publishedAt: iso, coverUrl: post.coverUrl });
            if (!res.ok) {
                setErrors(res.errors ?? {});
                toast.error(res.error);
                return;
            }
            setDirty(false);
            setErrors({});
            toast.success(res.message ?? "Enregistré");
            setPost((p) => ({ ...p, status, id: res.id, slug: res.slug }));
            if (!post.id) router.replace(`/admin/articles/${res.id}`);
            else router.refresh();
        });

    // Ctrl/Cmd + S : enregistrer sans changer le statut.
    const saveRef = useRef(save);
    useEffect(() => {
        saveRef.current = save;
    });
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                saveRef.current(post.status);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [post.status]);

    const scheduled = publishAt && new Date(publishAt) > new Date();
    const minutes = readingMinutes(post.content);

    return (
        <div className="grid gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="flex min-w-0 flex-col gap-5">
                <section className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 sm:p-6">
                    <TextField label="Titre" value={post.title} onChange={(e) => set("title", e.target.value)} error={errors.title} maxLength={140} placeholder="Ce qui casse vraiment avec Next.js 16" />
                    <TextField
                        label="Slug (adresse)"
                        value={post.slug}
                        onChange={(e) => {
                            setSlugTouched(true);
                            set("slug", slugify(e.target.value) || e.target.value.toLowerCase());
                        }}
                        error={errors.slug}
                        hint={`${SITE_HOST}/blog/${post.slug || "…"}`}
                        addon={<span className="flex min-h-[52px] items-center rounded-[14px] border border-white/15 bg-white/5 px-3 font-mono text-sm font-bold">/blog/</span>}
                    />
                    <TextareaField label="Résumé" value={post.excerpt} onChange={(e) => set("excerpt", e.target.value)} error={errors.excerpt} maxLength={320} hint={`${post.excerpt.length}/320 · affiché dans la liste et les partages`} className="[&_textarea]:min-h-24" />
                </section>

                <section className="flex min-w-0 flex-col rounded-[22px] border border-white/10 bg-white/[0.03]">
                    <RichEditor value={post.content} onChange={(html) => set("content", html)} placeholder="Écrivez votre article… Collez ou déposez une image pour l'envoyer." />
                    {errors.content && (
                        <p role="alert" className="px-4 py-3 text-[13px] font-bold text-[#ff8a8a]">
                            {errors.content}
                        </p>
                    )}
                </section>
            </div>

            <aside className="flex flex-col gap-5 xl:sticky xl:top-6 xl:self-start">
                <section className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="font-display text-xl leading-none uppercase">Publication</h2>
                        <span className={cn("rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wider uppercase", post.status === "draft" ? "border-white/25 text-white/80" : scheduled ? "border-[#ffb347]/40 bg-[#ffb347]/15 text-[#ffcf8a]" : "border-lime bg-lime text-dark")}>
                            {post.status === "draft" ? "Brouillon" : scheduled ? "Programmé" : "Publié"}
                        </span>
                    </div>
                    <TextField
                        label="Date de publication"
                        type="datetime-local"
                        value={publishAt}
                        onChange={(e) => {
                            setPublishAt(e.target.value);
                            setDirty(true);
                        }}
                        hint="Vide = maintenant. Une date future programme la publication."
                    />
                    <div className="flex flex-col gap-2.5">
                        <SubmitButton type="button" pending={pending} pendingLabel="Enregistrement…" onClick={() => save("published")} className="w-full">
                            {post.status === "published" ? "Mettre à jour" : scheduled ? "Programmer" : "Publier"}
                        </SubmitButton>
                        <SubmitButton type="button" tone="white" pending={pending} pendingLabel="…" onClick={() => save("draft")} className="w-full">
                            {post.status === "published" ? "Repasser en brouillon" : "Enregistrer le brouillon"}
                        </SubmitButton>
                    </div>
                    <p className="font-mono text-[11px] text-white/50">
                        {minutes} min de lecture · Ctrl / ⌘ + S pour enregistrer{dirty ? " · modifications non enregistrées" : ""}
                    </p>
                </section>

                <section className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <h2 className="font-display text-xl leading-none uppercase">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((t) => (
                            <button key={t} type="button" onClick={() => set("tags", post.tags.filter((x) => x !== t))} className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1 font-mono text-[11px] tracking-wider text-dark uppercase" aria-label={`Retirer ${t}`}>
                                {t} <span aria-hidden="true">×</span>
                            </button>
                        ))}
                        {post.tags.length === 0 && <span className="text-sm text-white/50">Aucun tag.</span>}
                    </div>
                    <TextField
                        label="Ajouter un tag"
                        value={tagDraft}
                        onChange={(e) => (e.target.value.endsWith(",") ? addTag(e.target.value) : setTagDraft(e.target.value))}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addTag(tagDraft);
                            }
                        }}
                        onBlur={() => tagDraft && addTag(tagDraft)}
                        hint="Entrée ou virgule pour valider · 8 maximum"
                        error={errors.tags}
                        placeholder="Next.js"
                    />
                </section>

                <section className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <h2 className="font-display text-xl leading-none uppercase">Image de couverture</h2>
                    <ImageField label="Adresse de l'image" value={post.coverUrl} onChange={(v) => set("coverUrl", v)} folder="blog" error={errors.coverUrl} hint="Facultatif. Sinon, une image de partage est générée avec le titre." />
                </section>

                <details className="group rounded-[22px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <summary className="cursor-pointer list-none font-display text-xl leading-none uppercase">
                        SEO <span className="text-sm font-semibold text-white/50">(facultatif)</span>
                    </summary>
                    <div className="mt-4 flex flex-col gap-4">
                        <TextField label="Titre SEO" value={post.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} maxLength={70} hint={`${post.seoTitle.length}/70 · sinon le titre`} error={errors.seoTitle} />
                        <TextareaField label="Description SEO" value={post.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} maxLength={170} hint={`${post.seoDescription.length}/170 · sinon le résumé`} error={errors.seoDescription} className="[&_textarea]:min-h-24" />
                    </div>
                </details>
            </aside>
        </div>
    );
}
