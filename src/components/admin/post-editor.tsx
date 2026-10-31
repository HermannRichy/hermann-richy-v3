"use client";

import { IconBold, IconCode, IconH2, IconH3, IconItalic, IconLink, IconList, IconListNumbers, IconPhoto, IconQuote, IconSourceCode } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { savePostAction, uploadImageAction } from "@/app/admin/actions";
import Markdown from "@/components/blog/Markdown";
import { ImageField } from "@/components/admin/image-field";
import { SubmitButton, TextareaField, TextField } from "@/components/form/fields";
import { readingMinutes, slugify } from "@/lib/content/text";
import { cn } from "@/lib/utils";

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

type Tool = { icon: typeof IconBold; label: string; apply: (sel: string) => { text: string; cursor?: number }; block?: boolean };

const TOOLS: Tool[] = [
    { icon: IconH2, label: "Titre de section", block: true, apply: (s) => ({ text: `## ${s || "Titre"}` }) },
    { icon: IconH3, label: "Sous-titre de section", block: true, apply: (s) => ({ text: `### ${s || "Sous-titre"}` }) },
    { icon: IconBold, label: "Gras", apply: (s) => ({ text: `**${s || "texte"}**` }) },
    { icon: IconItalic, label: "Italique", apply: (s) => ({ text: `_${s || "texte"}_` }) },
    { icon: IconLink, label: "Lien", apply: (s) => ({ text: `[${s || "texte"}](https://)` }) },
    { icon: IconCode, label: "Code en ligne", apply: (s) => ({ text: `\`${s || "code"}\`` }) },
    { icon: IconSourceCode, label: "Bloc de code", block: true, apply: (s) => ({ text: `\`\`\`ts\n${s || "// code"}\n\`\`\`` }) },
    { icon: IconList, label: "Liste", block: true, apply: (s) => ({ text: (s || "élément").split("\n").map((l) => `- ${l}`).join("\n") }) },
    { icon: IconListNumbers, label: "Liste numérotée", block: true, apply: (s) => ({ text: (s || "élément").split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n") }) },
    { icon: IconQuote, label: "Citation", block: true, apply: (s) => ({ text: `> ${s || "citation"}` }) },
];

/** Éditeur d'article : Markdown avec barre d'outils, aperçu, image de couverture, tags, statut et SEO. */
export function PostEditor({ initial }: { initial: EditablePost }) {
    const router = useRouter();
    const [post, setPost] = useState(initial);
    const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
    const [publishAt, setPublishAt] = useState(toLocalInput(initial.publishedAt));
    const [tagDraft, setTagDraft] = useState("");
    const [tab, setTab] = useState<"write" | "preview">("write");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [dirty, setDirty] = useState(false);
    const [pending, startTransition] = useTransition();
    const [uploading, startUpload] = useTransition();
    const area = useRef<HTMLTextAreaElement>(null);
    const fileInput = useRef<HTMLInputElement>(null);

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

    const insert = (tool: Tool) => {
        const el = area.current;
        if (!el) return;
        const { selectionStart: a, selectionEnd: b, value } = el;
        const { text } = tool.apply(value.slice(a, b));
        const before = value.slice(0, a);
        const prefix = tool.block && before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
        const next = before + prefix + text + value.slice(b);
        set("content", next);
        requestAnimationFrame(() => {
            el.focus();
            const pos = before.length + prefix.length + text.length;
            el.setSelectionRange(pos, pos);
        });
    };

    const insertImage = (file: File) =>
        startUpload(async () => {
            const form = new FormData();
            form.set("file", file);
            form.set("folder", "blog");
            const res = await uploadImageAction(form);
            if (!res.ok) return void toast.error(res.error);
            const el = area.current;
            const at = el?.selectionStart ?? post.content.length;
            const md = `\n\n![Description de l'image](${res.url})\n\n`;
            set("content", post.content.slice(0, at) + md + post.content.slice(at));
            toast.success("Image insérée");
        });

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
                <section className="flex flex-col gap-4 rounded-[22px] border-[3px] border-dark bg-white p-4 shadow-[5px_5px_0_#0d0d0d] sm:p-6">
                    <TextField label="Titre" value={post.title} onChange={(e) => set("title", e.target.value)} error={errors.title} maxLength={140} placeholder="Ce qui casse vraiment avec Next.js 16" />
                    <TextField
                        label="Slug (adresse)"
                        value={post.slug}
                        onChange={(e) => {
                            setSlugTouched(true);
                            set("slug", slugify(e.target.value) || e.target.value.toLowerCase());
                        }}
                        error={errors.slug}
                        hint={`hermannrichy.dev/blog/${post.slug || "…"}`}
                        addon={<span className="flex min-h-[52px] items-center rounded-[14px] border-[3px] border-dark bg-cream px-3 font-mono text-sm font-bold">/blog/</span>}
                    />
                    <TextareaField label="Résumé" value={post.excerpt} onChange={(e) => set("excerpt", e.target.value)} error={errors.excerpt} maxLength={320} hint={`${post.excerpt.length}/320 · affiché dans la liste et les partages`} className="[&_textarea]:min-h-24" />
                </section>

                <section className="flex min-w-0 flex-col rounded-[22px] border-[3px] border-dark bg-white shadow-[5px_5px_0_#0d0d0d]">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b-[3px] border-dark p-2.5 sm:p-3">
                        <div role="tablist" className="flex gap-1.5">
                            {(["write", "preview"] as const).map((t) => (
                                <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("min-h-10 rounded-[12px] px-3.5 text-sm font-extrabold", tab === t ? "bg-dark text-lime" : "hover:bg-cream")}>
                                    {t === "write" ? "Écrire" : "Aperçu"}
                                </button>
                            ))}
                        </div>
                        <span className="font-mono text-xs text-muted">{minutes} min de lecture</span>
                    </div>

                    {tab === "write" ? (
                        <>
                            <div className="flex flex-wrap gap-1 border-b-2 border-muted-light p-2" role="toolbar" aria-label="Mise en forme">
                                {TOOLS.map((t) => (
                                    <button key={t.label} type="button" onClick={() => insert(t)} title={t.label} aria-label={t.label} className="flex size-10 items-center justify-center rounded-[10px] hover:bg-cream">
                                        <t.icon size={19} stroke={2.25} aria-hidden="true" />
                                    </button>
                                ))}
                                <button type="button" onClick={() => fileInput.current?.click()} disabled={uploading} title="Insérer une image" aria-label="Insérer une image" className="flex size-10 items-center justify-center rounded-[10px] hover:bg-cream disabled:opacity-50">
                                    <IconPhoto size={19} stroke={2.25} aria-hidden="true" />
                                </button>
                                <input
                                    ref={fileInput}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) insertImage(f);
                                        e.target.value = "";
                                    }}
                                />
                            </div>
                            <label htmlFor="content" className="sr-only">
                                Contenu (Markdown)
                            </label>
                            <textarea
                                id="content"
                                ref={area}
                                value={post.content}
                                onChange={(e) => set("content", e.target.value)}
                                spellCheck
                                placeholder={"Écrivez en Markdown.\n\n## Un titre\n\nDu texte, **du gras**, `du code`…"}
                                className="min-h-[55vh] w-full resize-y rounded-b-[19px] p-4 font-mono text-[15px] leading-relaxed outline-none sm:p-5"
                            />
                        </>
                    ) : (
                        <div className="min-h-[55vh] rounded-b-[19px] bg-dark p-5 sm:p-8">
                            {post.content.trim() ? <Markdown>{post.content}</Markdown> : <p className="font-mono text-sm text-white/40">Rien à afficher pour l&apos;instant.</p>}
                        </div>
                    )}
                    {errors.content && (
                        <p role="alert" className="px-4 pb-4 text-[13px] font-bold text-[#C62828]">
                            {errors.content}
                        </p>
                    )}
                </section>
            </div>

            <aside className="flex flex-col gap-5 xl:sticky xl:top-6 xl:self-start">
                <section className="flex flex-col gap-4 rounded-[22px] border-[3px] border-dark bg-white p-4 shadow-[5px_5px_0_#1E45FB] sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-extrabold">Publication</h2>
                        <span className={cn("rounded-full border-2 border-dark px-2.5 py-0.5 text-xs font-extrabold", post.status === "draft" ? "bg-white" : scheduled ? "bg-[#FFF4E5]" : "bg-lime")}>
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
                    <p className="font-mono text-[11px] text-muted">Ctrl / ⌘ + S pour enregistrer{dirty ? " · modifications non enregistrées" : ""}</p>
                </section>

                <section className="flex flex-col gap-4 rounded-[22px] border-[3px] border-dark bg-white p-4 shadow-[5px_5px_0_#0d0d0d] sm:p-5">
                    <h2 className="text-lg font-extrabold">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((t) => (
                            <button key={t} type="button" onClick={() => set("tags", post.tags.filter((x) => x !== t))} className="inline-flex items-center gap-1.5 rounded-full border-2 border-dark bg-lime px-2.5 py-1 text-xs font-extrabold" aria-label={`Retirer ${t}`}>
                                {t} <span aria-hidden="true">×</span>
                            </button>
                        ))}
                        {post.tags.length === 0 && <span className="text-sm text-muted">Aucun tag.</span>}
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

                <section className="flex flex-col gap-4 rounded-[22px] border-[3px] border-dark bg-white p-4 shadow-[5px_5px_0_#0d0d0d] sm:p-5">
                    <h2 className="text-lg font-extrabold">Image de couverture</h2>
                    <ImageField label="Adresse de l'image" value={post.coverUrl} onChange={(v) => set("coverUrl", v)} folder="blog" error={errors.coverUrl} hint="Facultatif. Sinon, une image de partage est générée avec le titre." />
                </section>

                <details className="group rounded-[22px] border-[3px] border-dark bg-white p-4 shadow-[5px_5px_0_#0d0d0d] sm:p-5">
                    <summary className="cursor-pointer list-none text-lg font-extrabold">
                        SEO <span className="text-sm font-semibold text-muted">(facultatif)</span>
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
