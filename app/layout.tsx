import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORTHO.AI — Inteligência que Guia Decisões Ortopédicas",
  description: "Plataforma cognitiva ortopédica powered by OrthoBrain Engine™",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
