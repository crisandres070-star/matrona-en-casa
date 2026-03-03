import { Resend } from "resend";

// ensure environment variables are loaded (Next.js should handle this automatically)
if (!process.env.RESEND_API_KEY) {
    try {
        // fallback for local development when Next might not auto-load
        require("dotenv").config();
    } catch (e) {
        // ignore if dotenv isn't installed or fails
    }
}

console.log("[lib/resend] RESEND_API_KEY=", process.env.RESEND_API_KEY);

const key = process.env.RESEND_API_KEY;

if (!key) {
    throw new Error("RESEND_API_KEY no está definida.");
}

export const resend = new Resend(key);