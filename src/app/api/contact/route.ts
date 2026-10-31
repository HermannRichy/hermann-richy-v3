import { NextResponse } from "next/server";
import { z } from "zod";

import { SITE_URL } from "@/config/site";
import { db, hasDatabase } from "@/lib/server/db";
import { sendEmail, templates } from "@/lib/server/email";
import { rateLimitAll, retryMessage } from "@/lib/server/rate-limit";
import { getClientIp, hashIp, isSameOrigin } from "@/lib/server/request";

const schema = z.object({
    name: z.string().trim().min(2, "Nom trop court.").max(80, "Nom trop long."),
    email: z.string().trim().toLowerCase().max(254).pipe(z.email("Adresse e-mail invalide.")),
    title: z.string().trim().min(2, "Titre du projet trop court.").max(140, "Titre trop long."),
    types: z.array(z.string().trim().max(40)).max(10).default([]),
    message: z.string().trim().min(10, "Message trop court.").max(5000, "Message trop long (5 000 caractères maximum)."),
    website: z.string().max(200).optional(),
    startedAt: z.number().int().nonnegative().optional(),
});

const MIN_FILL_MS = 3000;

/** Formulaire de contact : validation, anti-robot, limitation de débit, enregistrement puis e-mail. */
export async function POST(request: Request) {
    if (!isSameOrigin(request)) return NextResponse.json({ error: "Origine non autorisée." }, { status: 403 });

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Champs invalides." }, { status: 400 });
    const d = parsed.data;

    // Robot : champ piège rempli ou envoi trop rapide → réponse « succès » sans rien faire.
    if (d.website || (d.startedAt && Date.now() - d.startedAt < MIN_FILL_MS)) return NextResponse.json({ success: true });

    const ipHash = hashIp(await getClientIp()) ?? "unknown";
    let id: string | null = null;
    if (hasDatabase()) {
        const limit = await rateLimitAll([
            [`contact:ip:${ipHash}`, 5, 60 * 60],
            [`contact:burst:${ipHash}`, 1, 30],
        ]);
        if (!limit.ok) return NextResponse.json({ error: retryMessage(limit.retryAfter) }, { status: 429 });
        const saved = await db.contactMessage.create({ data: { name: d.name, email: d.email, title: d.title, types: d.types, message: d.message, ipHash } });
        id = saved.id;
    }

    const sent = await sendEmail({
        to: process.env.CONTACT_TO || process.env.ADMIN_EMAIL || "hermannrichy15@gmail.com",
        replyTo: d.email,
        ...templates.contactNotify({ ...d, adminUrl: `${SITE_URL}/admin/messages${id ? `#${id}` : ""}` }),
    });
    if (id) await db.contactMessage.update({ where: { id }, data: { emailSent: sent } });

    // Message enregistré : succès même si l'e-mail a échoué (il reste visible dans le dashboard).
    if (!sent && !id) return NextResponse.json({ error: "Erreur lors de l'envoi. Réessayez." }, { status: 502 });
    return NextResponse.json({ success: true });
}
