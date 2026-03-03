// lib/resend.ts
import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;

// ✅ No lanzamos error en tiempo de build.
// Solo avisamos por consola si falta la key.
if (!key) {
  console.warn(
    "[lib/resend] RESEND_API_KEY no está definida. El envío de correos está deshabilitado."
  );
}

// Puede ser `null` si no hay API key
export const resend = key ? new Resend(key) : null;

// Helper para que las rutas puedan chequear configuración
export function isResendConfigured() {
  return Boolean(key);
}
