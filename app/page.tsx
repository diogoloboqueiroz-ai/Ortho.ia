"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { OrthoLogo } from "@/components/ortho-logo";

const pillars = [
  { id: "ia", label: "Inteligência Artificial", detail: "Triagem cognitiva para acelerar decisões." },
  { id: "precisao", label: "Precisão Clínica", detail: "Camadas operacionais orientadas por contexto." },
  { id: "evidencia", label: "Evidência Científica", detail: "Síntese contínua de protocolos e literatura." },
  { id: "evolucao", label: "Evolução Contínua", detail: "Motor que aprende com fluxos e feedbacks." },
] as const;

const solutions = [
  {
    title: "Análise de Imagens",
    description: "Interpretação assistida para RX, RM, TC e ultrassom com contexto ortopédico imediato.",
    kind: "images",
  },
  {
    title: "Códigos TUSS",
    description: "Sugestão estruturada de pedidos e compatibilidade de procedimentos para convênios.",
    kind: "codes",
  },
  {
    title: "Planejamento Cirúrgico",
    description: "Organize hipóteses, materiais e condutas a partir de um único cockpit assistido.",
    kind: "planning",
  },
  {
    title: "Dados Seguros LGPD",
    description: "Arquitetura preparada para governança, consentimento e rastreabilidade clínica.",
    kind: "security",
  },
] as const;

const plans = [
  {
    name: "Básico",
    monthly: "R$97",
    monthlyCycle: "/mês",
    annual: "R$1.047,60",
    annualCycle: "/ano",
    description: "Entrada enxuta para consultórios que precisam padronizar pedidos e laudos.",
    bullets: ["Pedidos TUSS essenciais", "1 usuário principal", "Suporte por e-mail"],
    featured: false,
  },
  {
    name: "Profissional",
    monthly: "R$197",
    monthlyCycle: "/mês",
    annual: "R$2.128,60",
    annualCycle: "/ano",
    description: "Fluxo completo para especialistas com rotina de análise, prescrição e revisão.",
    bullets: ["Ortho Console completo", "Imagens + Planejamento", "Mais popular entre especialistas"],
    featured: true,
  },
  {
    name: "Clínica",
    monthly: "R$497",
    monthlyCycle: "/mês",
    annual: "R$5.367,60",
    annualCycle: "/ano",
    description: "Camada operacional para equipes, múltiplos médicos e governança centralizada.",
    bullets: ["Múltiplos assentos", "Gestão de documentos", "Visão administrativa da operação"],
    featured: false,
  },
] as const;

const modules = [
  { title: "Análise de Imagens", subtitle: "Vision AI", kind: "images" },
  { title: "Planejamento Cirúrgico", subtitle: "Surgical Flow", kind: "planning" },
  { title: "Medidas", subtitle: "Metrics", kind: "measurements" },
  { title: "Artroscopia", subtitle: "Scope Assist", kind: "arthroscopy" },
  { title: "Ortobiológicos", subtitle: "Bio Modules", kind: "biologics" },
  { title: "Protocolos", subtitle: "Clinical Playbooks", kind: "protocols" },
  { title: "Educação", subtitle: "Learning Hub", kind: "education" },
  { title: "Plataforma Global", subtitle: "Unified Workspace", kind: "global" },
] as const;

function Glyph({ kind }: { kind: string }) {
  switch (kind) {
    case "images":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M7 15.5L10.3 12.5L13 14.7L16.8 10.8L20 13.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="9" r="1.5" fill="currentColor" />
        </svg>
      );
    case "codes":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 9H16M8 12H16M8 15H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "planning":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M7 18L17 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="8" cy="16" r="3" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "security":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 4L18 7V11.5C18 15.5 15.6 18.9 12 20C8.4 18.9 6 15.5 6 11.5V7L12 4Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9.5 12.2L11.2 13.9L14.8 10.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "measurements":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M5 16L16 5L19 8L8 19H5V16Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M11 10L14 13M9 12L12 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "arthroscopy":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M13.5 13.5L18.5 18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M16 7H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "biologics":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="7" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 11L14.8 8M9 13L14.8 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "protocols":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="6" y="5" width="12" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 10H15M9 13H15M9 16H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "education":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 6L20 10L12 14L4 10L12 6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M7 12.8V15.5C7 16.4 9.2 18 12 18C14.8 18 17 16.4 17 15.5V12.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 12H19M12 5C13.8 6.9 14.8 9.4 14.8 12C14.8 14.6 13.8 17.1 12 19M12 5C10.2 6.9 9.2 9.4 9.2 12C9.2 14.6 10.2 17.1 12 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function Home() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [, startTransition] = useTransition();

  return (
    <main className="landing-page">
      <header className="landing-header">
        <div className="container landing-header__inner">
          <Link href="/" aria-label="ORTHO.AI">
            <OrthoLogo tone="light" />
          </Link>
          <nav className="landing-nav" aria-label="Principal">
            <a href="#plataforma">Plataforma</a>
            <a href="#planos">Planos</a>
            <a href="#modulos">Módulos</a>
            <Link href="/login">Entrar</Link>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Powered by OrthoBrain Engine™</span>
              <h1 className="hero-title">A nova era da ortopedia inteligente</h1>
              <p>
                Uma plataforma cognitiva desenhada para transformar imagem, evidência,
                solicitação TUSS e planejamento cirúrgico em decisões mais rápidas,
                seguras e consistentes para a prática ortopédica.
              </p>
              <div className="hero-actions">
                <Link href="/login" className="button button--primary">
                  Conhecer a plataforma
                </Link>
                <a href="#planos" className="button button--ghost">
                  Ver planos
                </a>
              </div>
              <div className="hero-footnote">
                Orquestra clínica para consultórios, especialistas e clínicas em expansão.
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-axis" />
              <div className="hero-ring hero-ring--outer" />
              <div className="hero-ring hero-ring--mid" />
              <div className="hero-ring hero-ring--inner" />
              <div className="hero-arc hero-arc--navy" />
              <div className="hero-arc hero-arc--gold" />
              <div className="hero-node" />
              <div className="hero-dot hero-dot--a" />
              <div className="hero-dot hero-dot--b" />
              <div className="hero-dot hero-dot--c" />
              <div className="hero-visual__panel">
                <div className="hero-signal">
                  <strong>Imaging Layer</strong>
                  <span>Análise de Imagens</span>
                  <em>Interpretação assistida por contexto clínico.</em>
                </div>
                <div className="hero-signal">
                  <strong>TUSS Matrix</strong>
                  <span>Códigos Estruturados</span>
                  <em>Pedidos consistentes com fluxo operacional.</em>
                </div>
                <div className="hero-signal">
                  <strong>Precision Axis</strong>
                  <span>Planejamento Cirúrgico</span>
                  <em>Protocolos, materiais e racional em um só eixo.</em>
                </div>
              </div>
            </div>
          </div>

          <div className="pillar-row" id="plataforma">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="pillar-row__item">
                <strong>{pillar.label}</strong>
                <span>{pillar.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--features">
        <div className="container">
          <span className="section-kicker">Arquitetura clínica</span>
          <div className="section-heading">
            <div>
              <h2>Uma superfície única para operação, decisão e rastreabilidade.</h2>
              <p className="section-copy">
                Cada módulo foi desenhado para apoiar o raciocínio ortopédico com menos fricção
                visual e mais clareza operacional, do pedido ao plano terapêutico.
              </p>
            </div>
          </div>

          <div className="feature-grid">
            {solutions.map((solution) => (
              <article key={solution.title} className="feature-card">
                <div className="feature-card__icon">
                  <Glyph kind={solution.kind} />
                </div>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
              </article>
            ))}
          </div>

          <div className="trial-banner">
            <div>
              <strong>7 dias grátis — sem cartão de crédito</strong>
              <span>Ative a experiência completa da ORTHO.AI e valide o fluxo clínico no seu ritmo.</span>
            </div>
            <div className="trial-banner__badge">Trial liberado</div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--pricing" id="planos">
        <div className="container">
          <span className="section-kicker">Planos</span>
          <div className="section-heading">
            <div>
              <h2>Escolha a cadência ideal para sua operação.</h2>
              <p className="section-copy">
                Mensal para começar rápido. Anual para consolidar uma rotina clínica com previsibilidade.
              </p>
            </div>
            <div className="billing-toggle" role="tablist" aria-label="Cobrança">
              <button
                type="button"
                aria-pressed={billing === "monthly"}
                onClick={() => startTransition(() => setBilling("monthly"))}
              >
                Mensal
              </button>
              <button
                type="button"
                aria-pressed={billing === "annual"}
                onClick={() => startTransition(() => setBilling("annual"))}
              >
                Anual
              </button>
            </div>
          </div>

          <div className="plan-grid">
            {plans.map((plan) => {
              const price = billing === "monthly" ? plan.monthly : plan.annual;
              const cycle = billing === "monthly" ? plan.monthlyCycle : plan.annualCycle;

              return (
                <article
                  key={plan.name}
                  className={`plan-card${plan.featured ? " plan-card--featured" : ""}`}
                >
                  <span className="plan-card__badge">
                    {plan.featured ? "Mais popular" : "ORTHO.AI"}
                  </span>
                  <h3>{plan.name}</h3>
                  <p className="plan-card__description">{plan.description}</p>
                  <div className="plan-card__price">
                    <strong>{price}</strong>
                    <span className="plan-card__cycle">{cycle}</span>
                  </div>
                  <ul>
                    {plan.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <div className="plan-card__footer">
                    <Link href="/login" className={`button ${plan.featured ? "button--primary" : "button--ghost"}`}>
                      Iniciar agora
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="landing-footer" id="modulos">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Ecossistema</span>
              <h3>Módulos que expandem a prática ortopédica em uma plataforma global.</h3>
            </div>
            <Link href="/dashboard" className="button button--ghost">
              Ver dashboard
            </Link>
          </div>

          <div className="module-grid">
            {modules.map((module) => (
              <div key={module.title} className="module-item">
                <div className="module-item__icon">
                  <Glyph kind={module.kind} />
                </div>
                <div>
                  <strong>{module.title}</strong>
                  <span>{module.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
