import { createHash } from "node:crypto";

export const ALLOWED_FORMATS = "jpg,jpeg,png,webp,avif,gif";

export const cloudinaryEnabled = () => Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

/**
 * Signature d'un envoi direct navigateur → Cloudinary (le secret ne quitte jamais le serveur).
 * https://cloudinary.com/documentation/authentication_signatures
 */
export function signUpload(folder: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const params: Record<string, string | number> = { allowed_formats: ALLOWED_FORMATS, folder, timestamp };
    const toSign = Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join("&");
    const signature = createHash("sha1").update(toSign + process.env.CLOUDINARY_API_SECRET).digest("hex");
    return { cloudName: process.env.CLOUDINARY_CLOUD_NAME!, apiKey: process.env.CLOUDINARY_API_KEY!, timestamp, signature, folder, allowedFormats: ALLOWED_FORMATS };
}
