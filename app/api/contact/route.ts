import { NextResponse } from "next/server";
import { resend, isResendConfigured } from "@/lib/resend";
import { ContactSchema } from "@/lib/validators";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = ContactSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Datos inválidos",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        // build and verify environment variables
        const hasKey = Boolean(process.env.RESEND_API_KEY);
        const to = process.env.CONTACT_TO_EMAIL;
        const from = process.env.CONTACT_FROM_EMAIL; // ej: "Matrona en Casa <onboarding@resend.dev>"
        // from must be a verified sender in Resend (or a domain you control).

        // log presence but never print the actual key
        console.log("[contact] env vars", {
            hasKey,
            to: !!to,
            from: !!from,
        });

        if (!hasKey) {
            console.error("[contact] falta RESEND_API_KEY");
            // ⚠️ No rompemos el servidor, solo lo registramos.
        }

        if (!to || !from) {
            console.error("[contact] missing to/from email", { to, from });
            return NextResponse.json(
                { ok: false, error: "Faltan variables de entorno (TO/FROM)." },
                { status: 500 }
            );
        }

        // ✅ Chequeo final antes de enviar correos
        if (!isResendConfigured() || !resend) {
            console.error(
                "[contact] Resend no está configurado correctamente (falta RESEND_API_KEY)"
            );
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "El servicio de correo no está disponible en este momento. Intenta nuevamente más tarde.",
                },
                { status: 500 }
            );
        }

        const d = parsed.data;

        // 1) Correo a Catalina (admin)
        const adminSubject = `Nueva solicitud - ${d.nombre} (${d.comuna})`;
        const adminHtml = `
      <h2>Nueva solicitud</h2>
      <p><b>Nombre:</b> ${escapeHtml(d.nombre)}</p>
      <p><b>Comuna:</b> ${escapeHtml(d.comuna)}</p>
      <p><b>Email:</b> ${escapeHtml(d.email)}</p>
      <p><b>Teléfono:</b> ${escapeHtml(d.telefono)}</p>
      <p><b>Fecha preferida:</b> ${escapeHtml(d.fechaPreferida || "—")
            }</p>
      <p><b>Motivo:</b><br/>${escapeHtml(d.motivo).replace(
                /\n/g,
                "<br/>"
            )}</p>
      <hr/>
      <small>Enviado desde el formulario web.</small>
    `;

        let adminResult: any;
        try {
            adminResult = await resend.emails.send({
                from,
                to,
                subject: adminSubject,
                replyTo: d.email, // para que Catalina responda directo al paciente
                html: adminHtml,
            });
            console.log("[contact] admin email sent", adminResult);
        } catch (e: any) {
            console.error("[contact] admin send error", e);
            return NextResponse.json(
                {
                    ok: false,
                    error: e?.message || "Error al enviar correo admin",
                },
                { status: 500 }
            );
        }

        // 2) Confirmación al paciente
        const clientSubject = `Recibimos tu solicitud ✅`;
        const clientHtml = `
      <p>Hola <b>${escapeHtml(d.nombre)}</b>,</p>
      <p>Gracias por contactarte. Recibimos tu solicitud y te contactaremos a la brevedad.</p>
      <p><b>Resumen:</b></p>
      <ul>
        <li><b>Comuna:</b> ${escapeHtml(d.comuna)}</li>
        <li><b>Fecha preferida:</b> ${escapeHtml(d.fechaPreferida || "—")
            }</li>
      </ul>
      <p><b>Tu mensaje:</b><br/>${escapeHtml(d.motivo).replace(
                /\n/g,
                "<br/>"
            )}</p>
      <br/>
      <p>Saludos,<br/>Catalina Farías</p>
    `;

        try {
            const clientResult = await resend.emails.send({
                from,
                to: d.email,
                subject: clientSubject,
                html: clientHtml,
            });
            console.log("[contact] client email sent", clientResult);
        } catch (e: any) {
            console.error("[contact] client send error", e);
            // no necesitamos abortar la petición, simplemente avisamos al frontend
            return NextResponse.json(
                {
                    ok: false,
                    error: e?.message || "Error al enviar correo al cliente",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err: any) {
        console.error("[contact] unexpected error", err);
        return NextResponse.json(
            {
                ok: false,
                error:
                    err?.message ||
                    "No se pudo enviar. Intenta nuevamente en unos minutos.",
            },
            { status: 500 }
        );
    }
}

function escapeHtml(input: string) {
    return input
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
