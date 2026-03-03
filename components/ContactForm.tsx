"use client";

import { useMemo, useRef, useState } from "react";

type FormState = {
    nombre: string;
    comuna: string;
    email: string;
    telefono: string;
    motivo: string;
    fechaPreferida: string;
    website: string; // honeypot (anti-spam)
};

const initial: FormState = {
    nombre: "",
    comuna: "",
    email: "",
    telefono: "",
    motivo: "",
    fechaPreferida: "",
    website: "",
};

function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function normalizePhoneCL(v: string) {
    // mantiene dígitos y +, elimina todo lo demás
    const cleaned = v.replace(/[^\d+]/g, "");

    // si viene con +56, lo dejamos +56 9XXXXXXXX
    if (cleaned.startsWith("+56")) {
        const rest = cleaned.replace("+56", "");
        // rest debería ser 9 + 8 dígitos (9XXXXXXXX)
        return "+56" + rest;
    }

    // si viene 9XXXXXXXX, lo dejamos así
    return cleaned;
}

function formatPhoneCL(v: string) {
    // Formato simple: +56 9 1234 5678
    const cleaned = normalizePhoneCL(v);

    // +56 9XXXXXXXX
    if (cleaned.startsWith("+56")) {
        const rest = cleaned.slice(3); // quita +56
        if (!rest) return "+56";
        const digits = rest.replace(/[^\d]/g, "");
        const d = digits.slice(0, 9); // 9 + 8

        const a = d.slice(0, 1); // 9
        const b = d.slice(1, 5); // 1234
        const c = d.slice(5, 9); // 5678

        let out = "+56";
        if (a) out += ` ${a}`;
        if (b) out += ` ${b}`;
        if (c) out += ` ${c}`;
        return out;
    }

    // 9XXXXXXXX
    const digits = cleaned.replace(/[^\d]/g, "").slice(0, 9);
    const a = digits.slice(0, 1);
    const b = digits.slice(1, 5);
    const c = digits.slice(5, 9);

    let out = "";
    if (a) out += a;
    if (b) out += ` ${b}`;
    if (c) out += ` ${c}`;
    return out.trim();
}

function isValidPhoneCL(v: string) {
    // acepta +56 9 XXXXXXXX / 9XXXXXXXX / con espacios/guiones
    const cleaned = normalizePhoneCL(v);

    if (cleaned.startsWith("+56")) {
        const rest = cleaned.replace("+56", "");
        return /^9\d{8}$/.test(rest);
    }

    return /^9\d{8}$/.test(cleaned);
}

export default function ContactForm() {
    const [data, setData] = useState<FormState>(initial);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
        "idle"
    );
    const [errorMsg, setErrorMsg] = useState<string>("");

    const abortRef = useRef<AbortController | null>(null);

    const disabled = useMemo(() => {
        const ok =
            data.nombre.trim().length >= 3 &&
            data.comuna.trim().length >= 2 &&
            isValidEmail(data.email) &&
            isValidPhoneCL(data.telefono) &&
            data.motivo.trim().length >= 10;

        return !ok || status === "loading";
    }, [data, status]);

    const helper = useMemo(() => {
        const hints: string[] = [];
        if (data.email && !isValidEmail(data.email)) hints.push("Email inválido.");
        if (data.telefono && !isValidPhoneCL(data.telefono))
            hints.push("Teléfono inválido (ej: +56 9 1234 5678).");
        if (data.motivo && data.motivo.trim().length < 10)
            hints.push("Describe el motivo (mínimo 10 caracteres).");
        return hints.join(" ");
    }, [data.email, data.telefono, data.motivo]);

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        // si el usuario cambia algo, vuelve a estado idle (para no dejar el success pegado)
        setStatus("idle");
        setErrorMsg("");
        setData((prev) => ({ ...prev, [key]: value }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        // anti-spam: si el honeypot viene lleno => fingimos éxito y no enviamos nada
        if (data.website.trim().length > 0) {
            setStatus("success");
            setData(initial);
            return;
        }

        setStatus("loading");
        setErrorMsg("");

        // abort anterior si existiera
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        // timeout 12s
        const timeoutId = window.setTimeout(() => controller.abort(), 12000);

        try {
            const payload = {
                nombre: data.nombre.trim(),
                comuna: data.comuna.trim(),
                email: data.email.trim(),
                telefono: normalizePhoneCL(data.telefono),
                motivo: data.motivo.trim(),
                fechaPreferida: data.fechaPreferida.trim(),
            };

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });

            // intenta JSON, si falla lo dejamos vacío
            let json: any = {};
            try {
                json = await res.json();
            } catch {
                json = {};
            }

            if (!res.ok || json?.ok === false) {
                const msg =
                    json?.error ||
                    `No se pudo enviar (HTTP ${res.status}). Intenta nuevamente en unos minutos.`;
                setStatus("error");
                setErrorMsg(msg);
                return;
            }

            setStatus("success");
            setData(initial);
        } catch (err: any) {
            if (err?.name === "AbortError") {
                setStatus("error");
                setErrorMsg("La solicitud tardó demasiado. Intenta nuevamente.");
                return;
            }
            setStatus("error");
            setErrorMsg("Error de conexión. Revisa tu internet e intenta otra vez.");
        } finally {
            window.clearTimeout(timeoutId);
            abortRef.current = null;
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* honeypot anti-spam (no eliminar) */}
            <input
                type="text"
                name="website"
                value={data.website}
                onChange={(e) => update("website", e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
            />

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-800">
                    Nombre
                </label>
                <input
                    type="text"
                    required
                    maxLength={80}
                    className="w-full rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm outline-none ring-emerald-200 focus:ring-4 focus:border-emerald-300 transition-shadow duration-200"
                    placeholder="Tu nombre"
                    value={data.nombre}
                    onChange={(e) => update("nombre", e.target.value)}
                    autoComplete="name"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-800">
                        Comuna
                    </label>
                    <input
                        type="text"
                        required
                        maxLength={60}
                        className="w-full rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm outline-none ring-emerald-200 focus:ring-4 focus:border-emerald-300 transition-shadow duration-200"
                        placeholder="Ej: Ñuñoa"
                        value={data.comuna}
                        onChange={(e) => update("comuna", e.target.value)}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-800">
                        Fecha preferida (opcional)
                    </label>
                    <input
                        type="text"
                        maxLength={80}
                        className="w-full rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm outline-none ring-emerald-200 focus:ring-4 focus:border-emerald-300 transition-shadow duration-200"
                        placeholder="Ej: sábado en la tarde"
                        value={data.fechaPreferida}
                        onChange={(e) => update("fechaPreferida", e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-800">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        maxLength={120}
                        className="w-full rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm outline-none ring-emerald-200 focus:ring-4 focus:border-emerald-300 transition-shadow duration-200"
                        placeholder="tucorreo@gmail.com"
                        value={data.email}
                        onChange={(e) => update("email", e.target.value)}
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-800">
                        Teléfono (Chile)
                    </label>
                    <input
                        type="tel"
                        required
                        inputMode="tel"
                        maxLength={20}
                        className="w-full rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm outline-none ring-emerald-200 focus:ring-4 focus:border-emerald-300 transition-shadow duration-200"
                        placeholder="+56 9 1234 5678"
                        value={data.telefono}
                        onChange={(e) => update("telefono", formatPhoneCL(e.target.value))}
                        autoComplete="tel"
                        aria-invalid={Boolean(data.telefono && !isValidPhoneCL(data.telefono))}
                    />
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-800">
                    Motivo / solicitud
                </label>
                <textarea
                    required
                    maxLength={1000}
                    className="min-h-[120px] w-full resize-none rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm outline-none ring-emerald-200 focus:ring-4 focus:border-emerald-300 transition-shadow duration-200"
                    placeholder="Cuéntame brevemente tu solicitud (mín. 10 caracteres)."
                    value={data.motivo}
                    onChange={(e) => update("motivo", e.target.value)}
                />
                {helper && <p className="mt-2 text-xs text-slate-400">{helper}</p>}
            </div>

            {/* estados */}
            {status === "success" && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    ✅ Solicitud enviada. Te contactaremos a la brevedad.
                </div>
            )}

            {status === "error" && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
                    ❌ {errorMsg}
                </div>
            )}

            <button
                type="submit"
                disabled={disabled}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                aria-busy={status === "loading"}
            >
                {status === "loading" ? (
                    <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                        Enviando…
                    </>
                ) : (
                    "Enviar solicitud"
                )}
            </button>

            <p className="text-xs text-slate-400">
                Al enviar, aceptas que tus datos se usen solo para coordinar la atención.
            </p>
        </form>
    );
}