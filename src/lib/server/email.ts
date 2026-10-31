import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM || "Portfolio <onboarding@resend.dev>";

/** Échappe le HTML (aucune donnée saisie par un visiteur n'est injectée telle quelle). */
export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string };

/** Envoi via Resend. Sans RESEND_API_KEY : affiché dans la console (développement). */
export async function sendEmail(mail: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || process.env.EMAIL_LOG_TO_CONSOLE === "true") {
    console.info(`[email] → ${mail.to} · ${mail.subject}\n${mail.text}`);
    return Boolean(!key || process.env.EMAIL_LOG_TO_CONSOLE === "true");
  }
  try {
    const { error } = await new Resend(key).emails.send({ from: FROM, to: mail.to, subject: mail.subject, html: mail.html, text: mail.text, replyTo: mail.replyTo });
    if (error) console.error("[email] Resend", error.message);
    return !error;
  } catch (e) {
    console.error("[email] Resend", (e as Error).message);
    return false;
  }
}

const shell = (title: string, body: string) => `<!doctype html><html lang="fr"><body style="margin:0;background:#f5f4ef;font-family:Helvetica,Arial,sans-serif;color:#0d0d0d">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
<div style="background:#fff;border:2.5px solid #0d0d0d;border-radius:22px;padding:28px;box-shadow:7px 7px 0 #1e45fb">
<h1 style="margin:0 0 20px;font-size:22px;color:#1e45fb">${title}</h1>${body}</div>
<p style="margin:18px 0 0;font-size:12px;color:#46463f;text-align:center">hermannrichy.dev</p></div></body></html>`;

export const templates = {
  contactNotify: (m: { name: string; email: string; title: string; types: string[]; message: string; adminUrl: string }) => ({
    subject: `[Portfolio] ${m.title} - ${m.name}`,
    text: `Nouveau message\n\nNom : ${m.name}\nE-mail : ${m.email}\nProjet : ${m.title}\nType : ${m.types.join(", ") || "Non précisé"}\n\n${m.message}\n\nDashboard : ${m.adminUrl}`,
    html: shell(
      "Nouveau message - Portfolio",
      `<p style="margin:0 0 8px"><strong>Nom :</strong> ${esc(m.name)}</p>
<p style="margin:0 0 8px"><strong>E-mail :</strong> <a href="mailto:${esc(m.email)}" style="color:#1e45fb">${esc(m.email)}</a></p>
<p style="margin:0 0 8px"><strong>Projet :</strong> ${esc(m.title)}</p>
<p style="margin:0 0 20px"><strong>Type :</strong> ${esc(m.types.join(", ") || "Non précisé")}</p>
<hr style="border:none;border-top:1px solid #d8d6ce;margin:0 0 20px"/>
<p style="white-space:pre-line;line-height:1.6;margin:0 0 24px">${esc(m.message)}</p>
<a href="${esc(m.adminUrl)}" style="display:inline-block;background:#0d0d0d;color:#cdf22b;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:12px">Ouvrir dans le dashboard</a>`,
    ),
  }),
  passwordReset: (url: string, first: boolean) => ({
    subject: first ? "Activez votre accès au dashboard" : "Réinitialisation du mot de passe",
    text: `${first ? "Choisissez votre mot de passe pour activer l'accès au dashboard." : "Une réinitialisation du mot de passe a été demandée."}\n\nLien valable 1 heure : ${url}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.`,
    html: shell(
      first ? "Activez votre accès" : "Nouveau mot de passe",
      `<p style="line-height:1.6;margin:0 0 20px">${first ? "Choisissez votre mot de passe pour activer l'accès au dashboard, puis la double authentification." : "Une réinitialisation du mot de passe a été demandée."}</p>
<a href="${esc(url)}" style="display:inline-block;background:#1e45fb;color:#fff;text-decoration:none;font-weight:700;padding:14px 20px;border-radius:12px">Choisir mon mot de passe</a>
<p style="font-size:13px;color:#46463f;margin:20px 0 0">Lien valable 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>`,
    ),
  }),
};
