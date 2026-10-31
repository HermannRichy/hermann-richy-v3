"use client";

import { Toaster } from "sonner";

/** Notifications du dashboard (sonner), aux couleurs du portfolio. */
export function AppToaster() {
    return (
        <Toaster
            position="bottom-right"
            richColors={false}
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: "flex w-[min(92vw,380px)] items-start gap-3 rounded-2xl border border-white/15 bg-[#161616] p-4 font-sans text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
                    title: "text-[15px] font-bold",
                    description: "text-[13px] text-white/55",
                    success: "border-lime/50 [&_[data-icon]]:text-lime",
                    error: "border-[#ff6b6b]/60 [&_[data-icon]]:text-[#ff8a8a]",
                    icon: "mt-0.5",
                },
            }}
        />
    );
}
