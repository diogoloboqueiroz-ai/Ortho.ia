"use client";

import Link from "next/link";
import { OrthoLogo } from "@/components/ortho-logo";

const navigation = [
  { label: "Dashboard", active: true, short: "DB" },
  { label: "Novo Pedido (TUSS)", active: false, short: "NP" },
  { label: "Meus Documentos", active: false, short: "MD" },
  { label: "Ortho Console", active: false, short: "OC" },
  { label: "Tabela TUSS", active: false, short: "TT" },
  { label: "Assinatura", active: false, short: "AS" },
  { label: "Perfil", active: false, short: "PF" },
] as const;

const stats = [
  { label: "Pedidos", value: "128", meta: "26 em processamento hoje" },
  { label: "Laudos", value: "84", meta: "Taxa de conclusão 98%" },
  { label: "Consultas IA", value: "312", meta: "Ortho Console nas últimas 2 semanas" },
  { label: "Plano", value: "PRO", meta: "Renovação anual ativa" },
] as const;

const shortcuts = [
  {
    title: "Pedido Cirúrgico",
    description: "Monte um pedido completo com base em contexto clínico e tabela TUSS.",
    icon: "SC",
  },
  {
    title: "Pedido de Exame",
    description: "Solicite RX, RM, TC ou US com estrutura e justificativa em segundos.",
    icon: "EX",
  },
  {
    title: "Laudo",
    description: "Consolide achados, hipótese e recomendação com apoio do motor cognitivo.",
    icon: "LD",
  },
  {
    title: "Ortho Console",
    description: "Abra o espaço de consulta clínica para raciocínio, revisão e tomada de decisão.",
    icon: "AI",
  },
] as const;

const activities = [
  { title: "Pedido TUSS atualizado", detail: "Artroscopia de ombro com materiais revisados.", status: "Pronto" },
  { title: "Novo laudo aguardando revisão", detail: "RM de joelho direito recebida no workspace.", status: "Fila" },
  { title: "Consulta IA finalizada", detail: "Síntese de protocolo para infiltração ortobiológica.", status: "Concluído" },
] as const;

const stackItems = [
  { label: "Análise de Imagens", value: "Ativa" },
  { label: "Planejamento Cirúrgico", value: "Ativo" },
  { label: "Documentos LGPD", value: "Sincronizado" },
  { label: "Assinatura Profissional", value: "Renova em 12 meses" },
] as const;

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar__meta">
            <OrthoLogo tone="light" />
            <span className="dashboard-chip">OrthoBrain Engine™</span>
          </div>

          <nav className="dashboard-nav" aria-label="Dashboard">
            {navigation.map((item) => (
              <a key={item.label} href="#" className={item.active ? "is-active" : undefined}>
                <span className="dashboard-nav__icon">{item.short}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="dashboard-sidebar__footer">
            <strong>Camada clínica ativa</strong>
            <p>
              Workspace configurado para pedidos, laudos, consulta cognitiva e documentos com
              rastreabilidade operacional.
            </p>
          </div>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-topbar">
            <div>
              <p>Painel ORTHO.AI</p>
              <h1>Dashboard operacional</h1>
            </div>

            <div className="dashboard-topbar__user">
              <div className="dashboard-topbar__avatar">DL</div>
              <div>
                <strong>Dr. Diogo Lobo Queiroz</strong>
                <div className="muted">Perfil desenvolvedor</div>
              </div>
            </div>
          </header>

          <div className="dashboard-banner">
            <div>
              <strong>Trial do desenvolvedor ativo</strong>
              <span>Experiência completa habilitada para validar landing, login e dashboard.</span>
            </div>
            <Link href="/" className="button button--primary">
              Voltar para a home
            </Link>
          </div>

          <div className="stats-grid">
            {stats.map((stat) => (
              <article key={stat.label} className="stat-card">
                <span className="stat-card__label">{stat.label}</span>
                <strong className="stat-card__value">{stat.value}</strong>
                <span className="stat-card__meta">{stat.meta}</span>
              </article>
            ))}
          </div>

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Ações rápidas</span>
                <h3>Atalhos para os fluxos mais usados</h3>
              </div>
            </div>

            <div className="shortcut-grid">
              {shortcuts.map((shortcut) => (
                <article key={shortcut.title} className="shortcut-card">
                  <div className="shortcut-card__icon">{shortcut.icon}</div>
                  <h3>{shortcut.title}</h3>
                  <p>{shortcut.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="insight-grid">
              <article className="dashboard-panel">
                <div className="section-heading">
                  <div>
                    <span className="section-kicker">Atividade recente</span>
                    <h3>Fluxos em andamento</h3>
                  </div>
                </div>

                <ul className="activity-list">
                  {activities.map((activity) => (
                    <li key={activity.title}>
                      <div>
                        <strong>{activity.title}</strong>
                        <span>{activity.detail}</span>
                      </div>
                      <span className="status-pill">{activity.status}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="dashboard-panel">
                <div className="section-heading">
                  <div>
                    <span className="section-kicker">Workspace</span>
                    <h3>Módulos habilitados</h3>
                  </div>
                </div>

                <ul className="stack-list">
                  {stackItems.map((item) => (
                    <li key={item.label}>
                      <span>{item.label}</span>
                      <span className="status-pill">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
