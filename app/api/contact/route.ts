import { NextResponse } from "next/server";
import { getResendClient, isResendConfigured } from "@/lib/resend";
import { ContactSchema } from "@/lib/validators";

const ADMIN_EMAIL = "c.farias1005@gmail.com";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = ContactSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { ok: false, error: "Datos inválidos", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        // Presence logs only: never print API keys.
        const hasKey = Boolean(process.env.RESEND_API_KEY?.trim());
        const configuredTo = process.env.CONTACT_TO_EMAIL?.trim();
        const from = process.env.CONTACT_FROM_EMAIL?.trim();
        // Recomendado para pruebas: "Matrona en Casa <onboarding@resend.dev>"

        console.log("[contact] env vars", {
            hasKey,
            hasContactToEmail: !!configuredTo,
            hasContactFromEmail: !!from,
        });

        const missingEnv: string[] = [];
        if (!hasKey) missingEnv.push("RESEND_API_KEY");
        if (!configuredTo) missingEnv.push("CONTACT_TO_EMAIL");
        if (!from) missingEnv.push("CONTACT_FROM_EMAIL");

        if (missingEnv.length > 0) {
            const message = `Faltan variables de entorno requeridas: ${missingEnv.join(", ")}`;
            console.error("[contact] " + message);
            return NextResponse.json(
                { ok: false, error: message },
                { status: 500 }
            );
        }

        // This endpoint is configured to always notify the personal inbox.
        if (configuredTo !== ADMIN_EMAIL) {
            console.warn(
                "[contact] CONTACT_TO_EMAIL no coincide con el correo admin esperado",
                {
                    configuredTo,
                    expected: ADMIN_EMAIL,
                }
            );
        }

        if (!isResendConfigured()) {
            const message = "RESEND_API_KEY no esta configurada para el envio de correos.";
            console.error("[contact] " + message);
            return NextResponse.json({ ok: false, error: message }, { status: 500 });
        }

        const resend = getResendClient();

        if (!resend) {
            const message = "No se pudo inicializar el cliente de correo.";
            console.error("[contact] " + message);
            return NextResponse.json({ ok: false, error: message }, { status: 500 });
        }

        const fromEmail = from as string;

        const d = parsed.data;

        // 1) Correo a Catalina (admin)
        const adminSubject = `Nueva solicitud - ${d.nombre} (${d.comuna})`;
        const adminHtml = `
      <h2>Nueva solicitud</h2>
      <p><b>Nombre:</b> ${escapeHtml(d.nombre)}</p>
      <p><b>Comuna:</b> ${escapeHtml(d.comuna)}</p>
      <p><b>Email:</b> ${escapeHtml(d.email)}</p>
      <p><b>Teléfono:</b> ${escapeHtml(d.telefono)}</p>
      <p><b>Fecha preferida:</b> ${escapeHtml(d.fechaPreferida || "—")}</p>
      <p><b>Motivo:</b><br/>${escapeHtml(d.motivo).replace(/\n/g, "<br/>")}</p>
      <hr/>
      <small>Enviado desde el formulario web.</small>
    `;

        let adminResult: Awaited<ReturnType<typeof resend.emails.send>>;
        try {
            adminResult = await resend.emails.send({
                from: fromEmail,
                to: ADMIN_EMAIL,
                subject: adminSubject,
                replyTo: d.email, // para que Catalina responda directo al paciente
                html: adminHtml,
            });
            console.log("[contact] admin send result", adminResult);
        } catch (error: unknown) {
            console.error("[contact] admin send exception", error);
            return NextResponse.json(
                {
                    ok: false,
                    error: `Error al enviar correo admin: ${extractErrorMessage(error)}`,
                },
                { status: 500 }
            );
        }

        if (adminResult.error) {
            console.error("[contact] admin send error", adminResult.error);
            return NextResponse.json(
                {
                    ok: false,
                    error: `Resend rechazo el correo admin: ${extractErrorMessage(adminResult.error)}`,
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
        <li><b>Fecha preferida:</b> ${escapeHtml(d.fechaPreferida || "—")}</li>
      </ul>
      <p><b>Tu mensaje:</b><br/>${escapeHtml(d.motivo).replace(/\n/g, "<br/>")}</p>
      <br/>
      <p>Saludos,<br/>Catalina Farías</p>
    `;

        let clientResult: Awaited<ReturnType<typeof resend.emails.send>>;
        try {
            clientResult = await resend.emails.send({
                from: fromEmail,
                to: d.email,
                subject: clientSubject,
                html: clientHtml,
            });
            console.log("[contact] client send result", clientResult);
        } catch (error: unknown) {
            console.error("[contact] client send exception", error);
            return NextResponse.json(
                {
                    ok: false,
                    error: `Error al enviar confirmacion al paciente: ${extractErrorMessage(error)}`,
                },
                { status: 500 }
            );
        }

        if (clientResult.error) {
            console.error("[contact] client send error", clientResult.error);
            return NextResponse.json(
                {
                    ok: false,
                    error: `Resend rechazo el correo al paciente: ${extractErrorMessage(clientResult.error)}`,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err: unknown) {
        console.error("[contact] unexpected error", err);
        return NextResponse.json(
            {
                ok: false,
                error: extractErrorMessage(err),
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

function extractErrorMessage(input: unknown) {
    if (input instanceof Error) {
        return input.message;
    }

    if (typeof input === "string") {
        return input;
    }

    if (
        input &&
        typeof input === "object" &&
        "message" in input &&
        typeof (input as { message?: unknown }).message === "string"
    ) {
        return (input as { message: string }).message;
    }

    return "No se pudo enviar. Intenta nuevamente en unos minutos.";
}