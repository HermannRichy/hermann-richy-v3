"use client";

import { IconPhotoUp, IconX } from "@tabler/icons-react";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { uploadImageAction } from "@/app/admin/actions";
import { TextField } from "@/components/form/fields";

type Props = { label: string; value: string; onChange: (url: string) => void; folder: "blog" | "projects"; error?: string; hint?: string; aspect?: string };

/** Image : envoi vers Vercel Blob ou adresse collée, avec aperçu. */
export function ImageField({ label, value, onChange, folder, error, hint, aspect = "aspect-[1200/630]" }: Props) {
    const input = useRef<HTMLInputElement>(null);
    const [pending, startTransition] = useTransition();

    const upload = (file: File) =>
        startTransition(async () => {
            const form = new FormData();
            form.set("file", file);
            form.set("folder", folder);
            const res = await uploadImageAction(form);
            if (res.ok) {
                onChange(res.url);
                toast.success("Image envoyée");
            } else toast.error(res.error);
        });

    return (
        <div className="flex flex-col gap-3">
            <TextField label={label} value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… ou /projects/…" error={error} hint={hint} inputMode="url" />
            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => input.current?.click()}
                    className="inline-flex min-h-11 items-center gap-2 rounded-[14px] border-[3px] border-dark bg-white px-4 text-sm font-extrabold shadow-[3px_3px_0_#0d0d0d] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                    <IconPhotoUp size={18} stroke={2.25} aria-hidden="true" />
                    {pending ? "Envoi…" : "Envoyer une image"}
                </button>
                {value && (
                    <button type="button" onClick={() => onChange("")} className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-extrabold underline underline-offset-4">
                        <IconX size={16} stroke={2.5} aria-hidden="true" /> Retirer
                    </button>
                )}
                <input
                    ref={input}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                    className="hidden"
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) upload(f);
                        e.target.value = "";
                    }}
                />
            </div>
            {value && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="" className={`w-full max-w-md ${aspect} rounded-[16px] border-[3px] border-dark object-cover object-top bg-cream`} />
            )}
        </div>
    );
}
