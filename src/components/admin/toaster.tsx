"use client";

import { Toaster } from "sonner";

/** Notifications à l'écran (sonner), au style néo-brutaliste. */
export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      closeButton
      richColors={false}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-[min(92vw,380px)] items-start gap-3 rounded-[18px] border-[3px] border-dark bg-white p-4 font-sans text-dark shadow-[6px_6px_0_#000]",
          title: "text-[15px] font-extrabold",
          description: "text-[13px] font-semibold text-muted",
          success: "shadow-[6px_6px_0_#1E45FB]",
          error: "border-[#C62828] shadow-[6px_6px_0_#C62828]",
          closeButton: "!border-2 !border-dark !bg-white",
          icon: "mt-0.5",
        },
      }}
    />
  );
}
