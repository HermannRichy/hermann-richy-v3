"use client";

import { cloudinarySignatureAction } from "@/app/admin/actions";

const MAX_SIZE = 10 * 1024 * 1024;
const TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"];

/** Optimisation à la diffusion : format et qualité automatiques, largeur maximale. */
export function optimized(url: string, width = 1600) {
    return url.includes("/image/upload/") ? url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`) : url;
}

/** Envoi direct vers Cloudinary avec une signature fournie par le serveur. Renvoie l'URL optimisée. */
export async function uploadImage(file: File, folder: "blog" | "projects"): Promise<string> {
    if (!TYPES.includes(file.type)) throw new Error("Format accepté : PNG, JPG, WebP, AVIF ou GIF.");
    if (file.size > MAX_SIZE) throw new Error("Image trop lourde (10 Mo maximum).");
    const sig = await cloudinarySignatureAction(folder);
    if (!sig.ok) throw new Error(sig.error);
    const form = new FormData();
    form.set("file", file);
    form.set("api_key", sig.apiKey);
    form.set("timestamp", String(sig.timestamp));
    form.set("signature", sig.signature);
    form.set("folder", sig.folder);
    form.set("allowed_formats", sig.allowedFormats);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: form });
    const data = (await res.json().catch(() => ({}))) as { secure_url?: string; error?: { message?: string } };
    if (!res.ok || !data.secure_url) throw new Error(data.error?.message ?? "Envoi impossible.");
    return optimized(data.secure_url);
}
