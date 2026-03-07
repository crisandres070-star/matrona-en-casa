import { Resend } from "resend";

let cachedResend: Resend | null | undefined;

export function getResendClient(): Resend | null {
    if (cachedResend !== undefined) {
        return cachedResend;
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();

    if (!apiKey) {
        console.warn(
            "[lib/resend] RESEND_API_KEY no esta definida. El envio de correos se habilita solo cuando exista la variable."
        );
        cachedResend = null;
        return cachedResend;
    }

    cachedResend = new Resend(apiKey);
    return cachedResend;
}

export function isResendConfigured() {
    return Boolean(process.env.RESEND_API_KEY?.trim());
}

// Export compatible with older imports.
export const resend = getResendClient();