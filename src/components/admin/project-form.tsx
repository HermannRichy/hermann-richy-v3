"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { saveProjectAction } from "@/app/admin/actions";
import { ProjectCard } from "@/components/sections/ProjectsSection";
import { ImageField } from "@/components/admin/image-field";
import { Checkbox, SelectField, SubmitButton, TextareaField, TextField } from "@/components/form/fields";
import { TONES, toProject, type StoredTag, type Tone } from "@/lib/content/project-shared";
import { slugify } from "@/lib/content/text";

export type EditableProject = {
    id?: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    url: string;
    photoBg: Tone;
    featured: boolean;
    published: boolean;
    wip: boolean;
    year: string;
    tags: StoredTag[];
};

const TONE_KEYS = Object.keys(TONES) as Tone[];

/** Formulaire de projet avec aperçu de la carte telle qu'affichée sur le site. */
export function ProjectForm({ initial }: { initial: EditableProject }) {
    const router = useRouter();
    const [p, setP] = useState(initial);
    const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
    const [tagLabel, setTagLabel] = useState("");
    const [tagTone, setTagTone] = useState<Tone>("brand");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pending, startTransition] = useTransition();

    const set = <K extends keyof EditableProject>(key: K, value: EditableProject[K]) => {
        setP((s) => ({ ...s, [key]: value, ...(key === "title" && !slugTouched ? { slug: slugify(String(value)) } : {}) }));
        if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: "" }));
    };

    const addTag = () => {
        const label = tagLabel.trim();
        if (!label || p.tags.length >= 8 || p.tags.some((t) => t.label === label)) return;
        set("tags", [...p.tags, { label: label.slice(0, 30), tone: tagTone }]);
        setTagLabel("");
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const res = await saveProjectAction({ ...p, year: p.year ? Number(p.year) : null, url: p.url });
            if (!res.ok) {
                setErrors(res.errors ?? {});
                toast.error(res.error);
                return;
            }
            toast.success(res.message ?? "Enregistré");
            if (!p.id) router.replace(`/admin/projets/${res.id}`);
            else router.refresh();
        });
    };

    const preview = toProject({
        id: "preview",
        slug: p.slug || "apercu",
        title: p.title || "Titre du projet",
        description: p.description || "Description du projet.",
        imageUrl: p.imageUrl || "/og-img.jpg",
        url: p.url || null,
        photoBg: p.photoBg,
        featured: p.featured,
        published: p.published,
        wip: p.wip,
        year: p.year ? Number(p.year) : null,
        tags: p.tags,
        sortOrder: 0,
        createdAt: new Date(0),
        updatedAt: new Date(0),
    });

    return (
        <form onSubmit={submit} noValidate className="grid gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
            <div className="flex min-w-0 flex-col gap-5">
                <section className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 sm:p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <TextField label="Titre" value={p.title} onChange={(e) => set("title", e.target.value)} error={errors.title} maxLength={80} />
                        <TextField
                            label="Slug"
                            value={p.slug}
                            onChange={(e) => {
                                setSlugTouched(true);
                                set("slug", slugify(e.target.value) || e.target.value.toLowerCase());
                            }}
                            error={errors.slug}
                        />
                    </div>
                    <TextareaField label="Description" value={p.description} onChange={(e) => set("description", e.target.value)} error={errors.description} maxLength={400} hint={`${p.description.length}/400`} className="[&_textarea]:min-h-28" />
                    <div className="grid gap-4 md:grid-cols-[1fr_160px]">
                        <TextField label="Lien du site" value={p.url} onChange={(e) => set("url", e.target.value)} error={errors.url} placeholder="https://…" inputMode="url" optional />
                        <TextField label="Année" value={p.year} onChange={(e) => set("year", e.target.value.replace(/\D/g, "").slice(0, 4))} error={errors.year} inputMode="numeric" placeholder="2026" optional />
                    </div>
                </section>

                <section className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 sm:p-6">
                    <h2 className="font-display text-xl leading-none uppercase">Image</h2>
                    <ImageField label="Capture du projet" value={p.imageUrl} onChange={(v) => set("imageUrl", v)} folder="projects" error={errors.imageUrl} hint="Format conseillé : 1200 × 900." aspect="aspect-[4/3]" />
                    <SelectField label="Fond de la vignette" value={p.photoBg} onChange={(e) => set("photoBg", e.target.value as Tone)} className="max-w-xs">
                        {TONE_KEYS.map((t) => (
                            <option key={t} value={t}>
                                {TONES[t].label}
                            </option>
                        ))}
                    </SelectField>
                </section>

                <section className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 sm:p-6">
                    <h2 className="font-display text-xl leading-none uppercase">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                            <button key={t.label} type="button" onClick={() => set("tags", p.tags.filter((x) => x.label !== t.label))} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${TONES[t.tone].bg} ${TONES[t.tone].color}`} aria-label={`Retirer ${t.label}`}>
                                {t.label} <span aria-hidden="true">×</span>
                            </button>
                        ))}
                        {p.tags.length === 0 && <span className="text-sm text-white/50">Aucun tag.</span>}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[1fr_160px_auto] sm:items-end">
                        <TextField
                            label="Nouveau tag"
                            value={tagLabel}
                            onChange={(e) => setTagLabel(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addTag();
                                }
                            }}
                            placeholder="Next.js"
                        />
                        <SelectField label="Couleur" value={tagTone} onChange={(e) => setTagTone(e.target.value as Tone)}>
                            {TONE_KEYS.map((t) => (
                                <option key={t} value={t}>
                                    {TONES[t].label}
                                </option>
                            ))}
                        </SelectField>
                        <button type="button" onClick={addTag} className="min-h-[54px] rounded-full border-[2.5px] border-lime bg-lime px-5 font-bold text-dark">
                            Ajouter
                        </button>
                    </div>
                    {errors.tags && <p className="text-[13px] font-bold text-[#ff8a8a]">{errors.tags}</p>}
                </section>
            </div>

            <aside className="flex flex-col gap-5 xl:sticky xl:top-6 xl:self-start">
                <section className="flex flex-col gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <h2 className="font-display text-xl leading-none uppercase">Affichage</h2>
                    <Checkbox checked={p.published} onChange={(e) => set("published", e.target.checked)} label="Visible sur le site" />
                    <Checkbox checked={p.featured} onChange={(e) => set("featured", e.target.checked)} label="Mis en avant sur l'accueil" />
                    <Checkbox checked={p.wip} onChange={(e) => set("wip", e.target.checked)} label="En développement" />
                    <SubmitButton pending={pending} pendingLabel="Enregistrement…" className="w-full">
                        Enregistrer
                    </SubmitButton>
                </section>
                <section className="flex flex-col gap-3 rounded-[22px] border border-white/15 bg-brand p-4 sm:p-5">
                    <h2 className="font-display text-xl leading-none text-white uppercase">Aperçu</h2>
                    <ProjectCard proj={preview} className="block w-full" />
                </section>
            </aside>
        </form>
    );
}
