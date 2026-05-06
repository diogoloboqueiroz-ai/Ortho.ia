"use client";

import Link from "next/link";
import { OrthoLogo } from "@/components/ortho-logo";

const navigation = [
  { label: "Dashboard", active: true, short: "DB" },
  { label: "Ortho Console", active: false, short: "AI" },
  { label: "Estudo e Residência", active: false, short: "ER" },
  { label: "Novo Pedido (TUSS)", active: false, short: "NP" },
  { label: "Laudos e Pareceres", active: false, short: "LP" },
  { label: "Planejamento Cirúrgico", active: false, short: "PC" },
  { label: "Ângulos e Medidas", active: false, short: "AM" },
  { label: "Ortobiológicos", active: false, short: "OR" },
  { label: "Assinatura", active: false, short: "AS" },
  { label: "Perfil", active: false, short: "PF" },
] as const;

const stats = [
  { label: "Casos discutidos", value: "128", meta: "IA clínica, estudo e segunda opinião" },
  { label: "Documentos", value: "84", meta: "Laudos, pedidos e justificativas" },
  { label: "Planejamentos", value: "36", meta: "Cirurgias, ângulos, OPME e TUSS" },
  { label: "Trilhas de estudo", value: "12", meta: "Residência e revisão por subespecialidade" },
] as const;

const shortcuts = [
  {
    title: "Discutir Caso",
    description: "Abra o Ortho Console para hipótese, conduta, protocolo e próximos passos.",
    icon: "AI",
  },
  {
    title: "Planejar Cirurgia",
    description: "Organize técnica, materiais, OPME, riscos e estratégia do procedimento.",
    icon: "PC",
  },
  {
    title: "Corrigir Ângulos",
    description: "Estruture medidas, eixo mecânico, varo/valgo, osteotomia e deformidade.",
    icon: "AM",
  },
  {
    title: "Gerar Laudo",
    description: "Transforme achados e raciocínio em laudo ou parecer médico organizado.",
    icon: "LD",
  },
  {
    title: "Pedido TUSS",
    description: "Crie pedidos de exame ou cirurgia com justificativa e códigos relevantes.",
    icon: "TT",
  },
  {
    title: "Ortobiológicos",
    description: "Revise indicação, protocolo, elegibilidade e documentação regenerativa.",
    icon: "OB",
  },
] as const;

const activities = [
  { title: "Planejamento cirúrgico em revisão", detail: "Joelho varo: eixo mecânico, OPME e justificativa pré-operatória.", status: "Aberto" },
  { title: "Laudo estruturado gerado", detail: "RM de ombro com síntese, hipótese e recomendação clínica.", status: "Pronto" },
  { title: "Trilha de estudo atualizada", detail: "Trauma: fraturas do rádio distal, classificação e conduta.", status: "Estudo" },
  { title: "Protocolo regenerativo salvo", detail: "Checklist para infiltração ortobiológica e documentação LGPD.", status: "Ativo" },
] as const;

const stackItems = [
  { label: "Ortho Console", value: "IA clínica ativa" },
  { label: "Estudo e residência", value: "Biblioteca guiada" },
  { label: "Planejamento cirúrgico", value: "Ângulos + materiais" },
  { label: "Laudos e pedidos", value: "Documentos prontos" },
  { label: "Ortobiológicos", value: "Regenerativa" },
  { label: "Dados e LGPD", value: "Rastreável" },
] as const;

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar__meta">
            <OrthoLogo tone="light" />
            <span className="dashboard-chip">Cockpit de IA ortopédica</span>
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
            <strong>ORTHO.AI completa</strong>
            <p>
              Uma inteligência para estudar, decidir, planejar, documentar e operar a rotina
              ortopédica com evidência, precisão e rastreabilidade.
            </p>
          </div>
        </aside>

        <section className="dashboard-main">
          <header className="dashboard-topbar">
            <div>
              <p>Painel ORTHO.AI</p>
              <h1>Cockpit ortopédico inteligente</h1>
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
              <strong>Plataforma de IA ortopédica em modo desenvolvedor</strong>
              <span>
                Este painel representa o produto real: estudo, clínica, laudos, TUSS,
                cirurgia, ângulos, ortobiológicos e medicina regenerativa.
              </span>
            </div>
            <Link href="/" className="button button--primary">
              Ver visão geral
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
                <span className="section-kicker">Ações inteligentes</span>
                <h3>Atalhos para as necessidades centrais do ortopedista</h3>
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
                    <h3>Fluxos clínicos em andamento</h3>
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
                    <span className="section-kicker">Módulos habilitados</span>
                    <h3>Stack ORTHO.AI</h3>
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
