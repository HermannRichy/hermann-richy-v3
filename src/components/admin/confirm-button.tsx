"use client";

import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

type Props = {
    action: () => Promise<{ ok: boolean; error?: string; message?: string }>;
    confirm?: string;
    children: ReactNode;
    className?: string;
    redirectTo?: string;
    label?: string;
};

/** Bouton d'action serveur, avec confirmation facultative et retour visuel. */
export function ActionButton({ action, confirm, children, className, redirectTo, label }: Props) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            disabled={pending}
            onClick={() => {
                if (confirm && !window.confirm(confirm)) return;
                startTransition(async () => {
                    const res = await action();
                    if (!res.ok) return void toast.error(res.error ?? "Action impossible.");
                    if (res.message) toast.success(res.message);
                    if (redirectTo) router.push(redirectTo);
                    router.refresh();
                });
            }}
            className={cn("inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[12px] border-[2.5px] border-dark bg-white px-3 text-sm font-extrabold transition-transform hover:-translate-y-0.5 disabled:opacity-50", className)}
        >
            {children}
        </button>
    );
}
