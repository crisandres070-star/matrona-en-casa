import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matrona en Casa | Atención profesional a domicilio",
  description:
    "Atención profesional de matrona a domicilio en Santiago y alrededores. Acompañamiento cercano, seguro y basado en evidencia.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}