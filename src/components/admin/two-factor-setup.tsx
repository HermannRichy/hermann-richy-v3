"use client";

import QRCode from "qrcode";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { OtpInput, PasswordField, SubmitButton } from "@/components/form/fields";
import { authClient } from "@/lib/auth-client";
import { SITE_HOST } from "@/config/site";

/** Activation de la double authentification (TOTP) avec QR code et codes de secours. */
export function TwoFactorSetup({ enabled }: { enabled: boolean }) {
  const [password, setPassword] = useState("");
  const [uri, setUri] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [backup, setBackup] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [pending, startTransition] = useTransition();

  const confirm = (value: string) => {
    if (!/^\d{6}$/.test(value) || pending) return;
    startTransition(async () => {
      const { error } = await authClient.twoFactor.verifyTotp({ code: value });
      if (error) {
        setCode("");
        toast.error("Code incorrect.");
        return;
      }
      toast.success("Double authentification activée");
      // Rechargement complet : la session porte désormais la 2FA.
      window.setTimeout(() => window.location.assign("/admin"), 600);
    });
  };

  useEffect(() => {
    if (!uri) return;
    QRCode.toDataURL(uri, { margin: 1, width: 220, color: { dark: "#000000", light: "#ffffff" } }).then(setQr).catch(() => setQr(null));
  }, [uri]);

  if (enabled)
    return (
      <div className="flex flex-col gap-3">
        <p className="font-bold text-lime">✓ La double authentification est active sur votre compte.</p>
        <p className="text-sm text-white/50">En cas de perte de votre téléphone, utilisez un code de secours, ou lancez <code>pnpm admin:reset</code> pour repartir de zéro.</p>
      </div>
    );

  if (!uri)
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            const { data, error } = await authClient.twoFactor.enable({ password });
            if (error || !data?.totpURI) {
              toast.error("Mot de passe incorrect.");
              return;
            }
            setUri(data.totpURI);
            setBackup(data.backupCodes);
          });
        }}
        className="flex flex-col gap-4"
      >
        <p className="font-semibold">Obligatoire pour accéder à l&apos;administration. Confirmez votre mot de passe pour commencer.</p>
        <PasswordField label="Mot de passe" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="max-w-[420px]" />
        <SubmitButton pending={pending} className="w-full sm:w-auto sm:self-start">
          Activer la double authentification
        </SubmitButton>
      </form>
    );

  return (
    <div className="flex flex-col gap-5">
      <ol className="flex list-inside list-decimal flex-col gap-2 font-semibold">
        <li>Scannez ce QR code avec Google Authenticator, 1Password, Authy…</li>
        <li>Notez les codes de secours dans un endroit sûr.</li>
        <li>Saisissez le code à 6 chiffres affiché pour valider.</li>
      </ol>
      <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {qr && <img src={qr} alt="QR code de double authentification" width={220} height={220} className="size-[220px] self-center rounded-2xl bg-white p-2 sm:self-start" />}
        <div className="grid grid-cols-2 gap-2 self-stretch font-mono text-sm sm:self-start">
          {backup.map((c) => (
            <code key={c} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-center">
              {c}
            </code>
          ))}
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          confirm(code);
        }}
        className="flex flex-col gap-4"
      >
        <OtpInput value={code} onChange={setCode} onComplete={confirm} disabled={pending} hint={`Le code affiché par l'application pour « ${SITE_HOST} ».`} />
        <SubmitButton pending={pending} tone="black" className="w-full sm:w-auto sm:self-start">
          Valider
        </SubmitButton>
      </form>
    </div>
  );
}
