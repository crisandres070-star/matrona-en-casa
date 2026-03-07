// lib/resend.ts
import { Resend } from "resend";

<<<<<<< HEAD
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

// Backward-compatible export for code paths that still import `resend` directly.
export const resend = getResendClient();
=======
const key = process.env.RESEND_API_KEY;

// No lanzar error en build si falta la API key
if (!key) {
  console.warn(
    "[lib/resend] RESEND_API_KEY no está definida. El envío de correos está deshabilitado."
  );
}

// Puede ser `null` si no hay API key
export const resend = key ? new Resend(key) : null;

// Helper
export function isResendConfigured() {
  return Boolean(key);
}
>>>>>>> d82eb10ad38b5890b6ab90ddd4e4983062602863
