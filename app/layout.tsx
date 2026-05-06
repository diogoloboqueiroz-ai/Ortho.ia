import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORTHO.AI - Inteligência Artificial para Ortopedia Completa",
  description:
    "IA ortopédica para estudo, laudos, pedidos TUSS, planejamento cirúrgico, correção de ângulos, ortobiológicos e medicina regenerativa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
