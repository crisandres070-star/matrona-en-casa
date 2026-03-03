// lib/resend.ts
import { Resend } from "resend";

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
