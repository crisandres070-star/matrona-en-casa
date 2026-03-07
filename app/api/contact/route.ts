import { NextResponse } from "next/server";
import { getResendClient, isResendConfigured } from "@/lib/resend";
import { ContactSchema } from "@/lib/validators";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = ContactSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Datos invalidos",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        // Presence logs only: never print API keys.
        const hasApiKey = Boolean(process.env.RESEND_API_KEY?.trim());
        const to = "c.farias1005@gmail.com";
        const from = "Matrona en Casa <onboarding@resend.dev>";

        console.log("[contact] env vars", {
            hasApiKey,
            fixedAdminTo: to,
            fixedFrom: from,
        });

        if (!hasApiKey) {
            const message = "Falta RESEND_API_KEY en variables de entorno.";
            console.error("[contact] " + message);

            return NextResponse.json(
                { ok: false, error: message },
                { status: 500 }
            );
        }

        if (!isResendConfigured()) {
            const message = "RESEND_API_KEY no esta configurada para el envio de correos.";
            console.error("[contact] " + message);

            return NextResponse.json(
                { ok: false, error: message },
                { status: 500 }
            );
        }

        const resend = getResendClient();

        if (!resend) {
            const message = "No se pudo inicializar el cliente de correo.";
            console.error("[contact] " + message);

            return NextResponse.json(
                { ok: false, error: message },
                { status: 500 }
            );
        }

        const d = parsed.data;

        console.log("[contact] email routing", {
            from,
            to,
            replyTo: d.email,
        });

        // 1) Correo admin
        const adminSubject = `Nueva solicitud - ${d.nombre} (${d.comuna})`;
        const adminHtml = `
      <h2>Nueva solicitud</h2>
      <p><b>Nombre:</b> ${escapeHtml(d.nombre)}</p>
      <p><b>Comuna:</b> ${escapeHtml(d.comuna)}</p>
      <p><b>Email:</b> ${escapeHtml(d.email)}</p>
      <p><b>Telefono:</b> ${escapeHtml(d.telefono)}</p>
      <p><b>Fecha preferida:</b> ${escapeHtml(d.fechaPreferida || "-")}</p>
      <p><b>Motivo:</b><br/>${escapeHtml(d.motivo).replace(/\n/g, "<br/>")}</p>
      <hr/>
      <small>Enviado desde el formulario web.</small>
    `;

        let adminResult: Awaited<ReturnType<typeof resend.emails.send>>;
        try {
            adminResult = await resend.emails.send({
                from,
                to,
                subject: adminSubject,
                replyTo: d.email,
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

        // 2) Confirmacion al paciente desactivada temporalmente para modo testing de Resend.
        console.log("[contact] client confirmation email skipped in testing mode", {
            clientEmail: d.email,
        });

        return NextResponse.json(
            {
                ok: true,
                message:
                    "Solicitud enviada al correo admin. Confirmacion al cliente desactivada temporalmente.",
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("[contact] unexpected error", error);

        return NextResponse.json(
            {
                ok: false,
                error: extractErrorMessage(error),
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