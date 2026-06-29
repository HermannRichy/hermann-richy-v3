import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, title, types, message } = await request.json();

        if (!name?.trim() || !email?.trim() || !title?.trim() || !message?.trim()) {
            return NextResponse.json(
                { error: "Tous les champs sont requis." },
                { status: 400 },
            );
        }

        const typesList = Array.isArray(types) && types.length > 0
            ? types.join(", ")
            : "Non précisé";

        await resend.emails.send({
            from: "Portfolio <onboarding@resend.dev>",
            to: "hermannrichy15@gmail.com",
            replyTo: email,
            subject: `[Portfolio] ${title} — ${name}`,
            html: `
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                    <h2 style="color:#1E45FB;margin-bottom:24px">
                        Nouveau message — Portfolio
                    </h2>
                    <p style="margin:0 0 8px"><strong>Nom :</strong> ${name}</p>
                    <p style="margin:0 0 8px"><strong>Email :</strong>
                        <a href="mailto:${email}" style="color:#1E45FB">${email}</a>
                    </p>
                    <p style="margin:0 0 8px"><strong>Projet :</strong> ${title}</p>
                    <p style="margin:0 0 20px"><strong>Type :</strong>
                        <span style="color:#1E45FB">${typesList}</span>
                    </p>
                    <hr style="border:none;border-top:1px solid #eee;margin:0 0 20px"/>
                    <p style="white-space:pre-line;line-height:1.6">${message}</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Erreur lors de l'envoi. Réessayez." },
            { status: 500 },
        );
    }
}
