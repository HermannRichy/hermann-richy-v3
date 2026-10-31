import { twMerge } from "tailwind-merge";

/** Concatène des classes Tailwind en résolvant les conflits (la dernière l'emporte). */
export function cn(...inputs: (string | false | null | undefined)[]) {
    return twMerge(inputs.filter(Boolean).join(" "));
}
