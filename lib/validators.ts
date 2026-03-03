import { z } from "zod";

function normalizePhoneCL(v: string) {
    return v.replace(/[^\d+]/g, "");
}

export const ContactSchema = z.object({
    nombre: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(80),

    comuna: z
        .string()
        .min(2, "La comuna es obligatoria.")
        .max(60),

    email: z
        .string()
        .email("Email inválido.")
        .max(120),

    telefono: z
        .string()
        .transform((v) => normalizePhoneCL(v))
        .refine((v) => {
            if (v.startsWith("+56")) {
                const rest = v.replace("+56", "");
                return /^9\d{8}$/.test(rest);
            }
            return /^9\d{8}$/.test(v);
        }, "Teléfono chileno inválido (ej: +56 9 1234 5678)."),

    motivo: z
        .string()
        .min(10, "El motivo debe tener mínimo 10 caracteres.")
        .max(1000),

    fechaPreferida: z
        .string()
        .max(80)
        .optional()
        .or(z.literal("")),
});

export type ContactInput = z.infer<typeof ContactSchema>;