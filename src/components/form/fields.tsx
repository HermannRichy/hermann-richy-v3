"use client";

import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { forwardRef, useId, useRef, useState, type ClipboardEvent, type InputHTMLAttributes, type KeyboardEvent, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/** Champs du dashboard : même style que le formulaire de contact du portfolio. */
const CONTROL =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-5 text-[15px] font-medium text-white outline-none transition-colors placeholder:text-white/35 focus:border-lime disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[#ff6b6b] [color-scheme:dark]";

type FieldShellProps = {
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
  className?: string;
  status?: ReactNode;
};

/** Libellé, aide et message d'erreur reliés au champ (accessibilité). */
export function FieldShell({ label, hint, error, optional, children, className, status }: FieldShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 font-mono text-2xs tracking-widest text-white/50 uppercase">
        <span>
          {label}
          {optional && <span className="ml-1.5 tracking-normal normal-case text-white/30">(facultatif)</span>}
        </span>
        {status}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={hintId} className="text-[13px] leading-snug text-white/45">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-[13px] leading-snug font-semibold text-[#ff8a8a]">
          <span aria-hidden="true">✶</span>
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: ReactNode; error?: string; optional?: boolean; status?: ReactNode; addon?: ReactNode };

export const TextField = forwardRef<HTMLInputElement, InputProps>(function TextField(
  { label, hint, error, optional, status, className, addon, ...props },
  ref,
) {
  return (
    <FieldShell label={label} hint={hint} error={error} optional={optional} status={status} className={className}>
      {({ id, describedBy, invalid }) =>
        addon ? (
          <div className="flex gap-2">
            {addon}
            <input ref={ref} id={id} aria-describedby={describedBy} aria-invalid={invalid} className={cn(CONTROL, "min-h-[54px]")} {...props} />
          </div>
        ) : (
          <input ref={ref} id={id} aria-describedby={describedBy} aria-invalid={invalid} className={cn(CONTROL, "min-h-[54px]")} {...props} />
        )
      }
    </FieldShell>
  );
});

type PasswordProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string; hint?: ReactNode; error?: string; status?: ReactNode };

/** Mot de passe avec bouton afficher / masquer. */
export const PasswordField = forwardRef<HTMLInputElement, PasswordProps>(function PasswordField({ label, hint, error, status, className, ...props }, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <FieldShell label={label} hint={hint} error={error} status={status} className={className}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className={cn(CONTROL, "min-h-[54px] pr-14")}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            aria-pressed={visible}
            aria-controls={id}
            className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:text-lime focus-visible:outline-none"
          >
            {visible ? <IconEyeOff size={20} stroke={2.25} aria-hidden="true" /> : <IconEye size={20} stroke={2.25} aria-hidden="true" />}
          </button>
        </div>
      )}
    </FieldShell>
  );
});

type OtpProps = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  label?: string;
  hint?: ReactNode;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
};

/** Code à usage unique en cases séparées : saisie, collage, remplissage automatique (SMS / gestionnaire), flèches et retour arrière. */
export function OtpInput({ value, onChange, onComplete, length = 6, label = "Code à 6 chiffres", hint, error, disabled, autoFocus }: OtpProps) {
  const id = useId();
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focus = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    el?.focus();
    el?.select();
  };
  const commit = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
    return clean;
  };
  const write = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;
    const start = Math.min(index, value.length);
    const next = commit(value.slice(0, start) + digits);
    focus(next.length);
  };
  const onKey = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[i]) commit(value.slice(0, i));
      else if (i > 0) {
        commit(value.slice(0, i - 1));
        focus(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focus(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focus(Math.min(i + 1, value.length));
    }
  };
  const onPaste = (i: number) => (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    write(i, e.clipboardData.getData("text"));
  };
  return (
    <fieldset className="flex min-w-0 flex-col gap-2" aria-describedby={error ? `${id}-e` : hint ? `${id}-h` : undefined}>
      <legend className="mb-2 font-mono text-2xs tracking-widest text-white/50 uppercase">{label}</legend>
      <div className="grid max-w-[420px] grid-cols-6 gap-1.5 sm:gap-2.5">
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            autoFocus={autoFocus && i === 0}
            maxLength={i === 0 ? length : 1}
            disabled={disabled}
            value={value[i] ?? ""}
            aria-label={`Chiffre ${i + 1} sur ${length}`}
            aria-invalid={Boolean(error)}
            onChange={(e) => write(i, e.target.value)}
            onKeyDown={onKey(i)}
            onPaste={onPaste(i)}
            onFocus={(e) => e.target.select()}
            className={cn(CONTROL, "h-14 px-0 text-center font-mono text-2xl font-bold sm:h-16 sm:text-[28px]", value[i] && "border-white/40 bg-white/10")}
          />
        ))}
      </div>
      {hint && !error && (
        <p id={`${id}-h`} className="text-[13px] leading-snug text-white/45">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-e`} role="alert" className="text-[13px] leading-snug font-semibold text-[#ff8a8a]">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** Champ piège invisible : un humain ne le voit pas, un robot le remplit. */
export function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
      <label>
        Site web (ne pas remplir)
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string; hint?: ReactNode; error?: string; optional?: boolean; children: ReactNode };

export function SelectField({ label, hint, error, optional, className, children, ...props }: SelectProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} optional={optional} className={className}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <select id={id} aria-describedby={describedBy} aria-invalid={invalid} className={cn(CONTROL, "min-h-[54px] appearance-none pr-11 [&>option]:bg-dark [&>optgroup]:bg-dark")} {...props}>
            {children}
          </select>
          <svg className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      )}
    </FieldShell>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: ReactNode; error?: string };

export function TextareaField({ label, hint, error, className, ...props }: TextareaProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={className}>
      {({ id, describedBy, invalid }) => (
        <textarea id={id} aria-describedby={describedBy} aria-invalid={invalid} className={cn(CONTROL, "min-h-36 resize-y py-4 leading-relaxed")} {...props} />
      )}
    </FieldShell>
  );
}

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: ReactNode; error?: string };

/** Case à cocher néo-brutaliste (jamais précochée pour les consentements). */
export function Checkbox({ label, error, className, ...props }: CheckboxProps) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="group flex cursor-pointer items-start gap-3 text-[15px] leading-snug text-white/85">
        <input id={id} type="checkbox" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-e` : undefined} className="peer sr-only" {...props} />
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-[22px] flex-none items-center justify-center rounded-md border border-white/25 bg-white/5 text-dark transition-colors peer-checked:border-lime peer-checked:bg-lime peer-focus-visible:border-lime peer-aria-[invalid=true]:border-[#ff6b6b] [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-e`} role="alert" className="ml-9 text-[13px] font-semibold text-[#ff8a8a]">
          {error}
        </p>
      )}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3.5" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

type SubmitProps = { pending: boolean; children: ReactNode; pendingLabel?: string; className?: string; tone?: "blue" | "black" | "white"; type?: "submit" | "button"; onClick?: () => void; disabled?: boolean };

/** Bouton d'envoi : état de chargement, protégé contre le double clic. */
export function SubmitButton({ pending, children, pendingLabel = "Envoi…", className, tone = "blue", type = "submit", onClick, disabled }: SubmitProps) {
  // Boutons « pilule » du portfolio : citron (principal), blanc, contour.
  const tones = {
    blue: "border-lime bg-lime text-dark",
    black: "border-lime bg-lime text-dark",
    white: "border-white/30 bg-transparent text-white hover:border-lime hover:text-lime",
  } as const;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={pending || disabled}
      aria-busy={pending}
      className={cn(
        "inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full border-[2.5px] px-6 font-sans text-[15px] font-bold transition-[transform,color,border-color] duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
        tones[tone],
        className,
      )}
    >
      {pending && <Spinner />}
      <span>{pending ? pendingLabel : children}</span>
    </button>
  );
}
