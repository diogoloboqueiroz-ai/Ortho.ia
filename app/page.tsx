"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { OrthoLogo } from "@/components/ortho-logo";

const pillars = [
  { id: "study", label: "Estudo e residência", detail: "Casos, temas, provas, protocolos e revisão guiada." },
  { id: "clinical", label: "Decisão clínica", detail: "Raciocínio ortopédico com evidência e contexto." },
  { id: "surgery", label: "Planejamento cirúrgico", detail: "Ângulos, eixos, materiais, técnica e estratégia." },
  { id: "docs", label: "Documentação inteligente", detail: "Laudos, pedidos, TUSS, justificativas e prontuário." },
] as const;

const capabilities = [
  {
    title: "Ortho Console",
    description: "Um assistente clínico para discutir casos, hipóteses, condutas, protocolos e dúvidas de ortopedia em linguagem natural.",
    kind: "console",
  },
  {
    title: "Estudo para residentes",
    description: "Trilhas de aprendizado, revisão por subespecialidade, discussão de casos e sínteses para prova, ambulatório e centro cirúrgico.",
    kind: "education",
  },
  {
    title: "Laudos e pareceres",
    description: "Estrutura laudos, pareceres e evoluções com linguagem médica, achados relevantes, hipótese e conclusão organizada.",
    kind: "reports",
  },
  {
    title: "Pedidos cirúrgicos e TUSS",
    description: "Gera pedidos de cirurgia, materiais, OPME, justificativas e códigos TUSS com rastreabilidade operacional.",
    kind: "codes",
  },
  {
    title: "Planejamento com ângulos",
    description: "Apoio para correção de eixos, deformidades, varo/valgo, osteotomias, artroplastia e medidas radiográficas.",
    kind: "angles",
  },
  {
    title: "Imagens e exames",
    description: "Organiza RX, RM, TC e US em um raciocínio clínico integrado, conectando achados, diagnóstico e próximos passos.",
    kind: "images",
  },
  {
    title: "Ortobiológicos e regenerativa",
    description: "Protocolos, elegibilidade, materiais, indicação e documentação para terapias ortobiológicas e medicina regenerativa.",
    kind: "biologics",
  },
  {
    title: "Protocolos e evidência",
    description: "Consulta protocolos, literatura, checklists e condutas para tomada de decisão com base científica.",
    kind: "protocols",
  },
] as const;

const surgicalStack = [
  "Correção de ângulos e eixos mecânicos",
  "Planejamento de osteotomias e deformidades",
  "Artroplastia, artroscopia e materiais",
  "Checklist pré-operatório e justificativa",
  "Pedidos de OPME e compatibilidade TUSS",
  "Resumo cirúrgico para equipe e paciente",
] as const;

const residentStack = [
  "Banco de temas por subespecialidade",
  "Discussão de casos com perguntas orientadoras",
  "Resumo rápido para ambulatório e plantão",
  "Protocolos de trauma, joelho, ombro, quadril e coluna",
] as const;

const workflow = [
  { step: "01", title: "Estude o caso", detail: "Insira história, exame físico, hipótese, imagem ou dúvida." },
  { step: "02", title: "Raciocine com a IA", detail: "O OrthoBrain cruza evidência, protocolos, TUSS e contexto ortopédico." },
  { step: "03", title: "Planeje a conduta", detail: "Receba estratégia clínica, cirúrgica, regenerativa ou documental." },
  { step: "04", title: "Gere documentos", detail: "Produza laudo, pedido, justificativa, plano cirúrgico e resumo." },
] as const;

const plans = [
  {
    name: "Básico",
    monthly: "R$97",
    monthlyCycle: "/mês",
    annual: "R$1.047,60",
    annualCycle: "/ano",
    description: "Para residentes e ortopedistas que querem IA para estudo, documentos essenciais e consulta clínica.",
    bullets: ["Ortho Console essencial", "Estudo e protocolos", "Pedidos e laudos básicos"],
    featured: false,
  },
  {
    name: "Profissional",
    monthly: "R$197",
    monthlyCycle: "/mês",
    annual: "R$2.128,60",
    annualCycle: "/ano",
    description: "Para especialistas que precisam de IA clínica, planejamento, laudos, TUSS e rotina cirúrgica completa.",
    bullets: ["Planejamento cirúrgico", "Laudos e TUSS avançados", "Ortobiológicos e regenerativa"],
    featured: true,
  },
  {
    name: "Clínica",
    monthly: "R$497",
    monthlyCycle: "/mês",
    annual: "R$5.367,60",
    annualCycle: "/ano",
    description: "Para equipes, clínicas e serviços que precisam padronizar fluxos, documentos, assinatura e governança.",
    bullets: ["Múltiplos profissionais", "Workspace de documentos", "Gestão clínica e operacional"],
    featured: false,
  },
] as const;

const modules = [
  { title: "Ortho Console", subtitle: "IA clínica", kind: "console" },
  { title: "Estudo", subtitle: "Residência e prova", kind: "education" },
  { title: "Laudos", subtitle: "Documentos médicos", kind: "reports" },
  { title: "Pedidos TUSS", subtitle: "Cirurgia e exames", kind: "codes" },
  { title: "Ângulos", subtitle: "Eixos e medidas", kind: "angles" },
  { title: "Artroscopia", subtitle: "Técnicas e materiais", kind: "arthroscopy" },
  { title: "Ortobiológicos", subtitle: "Regenerativa", kind: "biologics" },
  { title: "Protocolos", subtitle: "Evidência científica", kind: "protocols" },
] as const;

function Glyph({ kind }: { kind: string }) {
  switch (kind) {
    case "console":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M5 6.5C5 5.1 6.1 4 7.5 4H16.5C17.9 4 19 5.1 19 6.5V13.5C19 14.9 17.9 16 16.5 16H10L6 20V16.2C5.4 15.8 5 15.1 5 14.3V6.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M8.5 8.5H15.5M8.5 11.5H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
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
    case "angles":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M5 19L19 5M5 19H17M5 19V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 18.5C9 16.2 8 14.1 6.4 12.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="17.5" cy="6.5" r="1.7" fill="currentColor" />
        </svg>
      );
    case "reports":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M7 4H14L18 8V20H7C5.9 20 5 19.1 5 18V6C5 4.9 5.9 4 7 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14 4V8H18M8.5 12H15.5M8.5 15H14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
    case "arthroscopy":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M13.5 13.5L18.5 18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M16 7H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
    <main className="landing-page platform-page">
      <header className="landing-header">
        <div className="container landing-header__inner">
          <Link href="/" aria-label="ORTHO.AI">
            <OrthoLogo tone="light" />
          </Link>
          <nav className="landing-nav" aria-label="Principal">
            <a href="#ia-clinica">IA clínica</a>
            <a href="#modulos">Módulos</a>
            <a href="#cirurgia">Cirurgia</a>
            <a href="#planos">Planos</a>
            <Link href="/login">Entrar</Link>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">OrthoBrain Engine™</span>
              <h1 className="hero-title">A IA ortopédica para estudar, decidir, documentar e planejar cirurgias.</h1>
              <p>
                ORTHO.AI é um cockpit cognitivo para ortopedistas, residentes e clínicas:
                estudo, laudos, pedidos TUSS, planejamento cirúrgico com correção de
                ângulos, ortobiológicos, medicina regenerativa e protocolos em uma única
                inteligência.
              </p>
              <div className="hero-actions">
                <Link href="/login" className="button button--primary">
                  Entrar no cockpit
                </Link>
                <a href="#ia-clinica" className="button button--ghost">
                  Ver capacidades
                </a>
              </div>
              <div className="hero-footnote">
                Do R1 ao especialista: IA aplicada a toda jornada ortopédica.
              </div>
            </div>

            <div className="hero-visual hero-visual--console" aria-hidden="true">
              <div className="product-console">
                <div className="product-console__header">
                  <span>ORTHO CONSOLE</span>
                  <strong>Caso ativo: Joelho varo + dor medial</strong>
                </div>
                <div className="product-console__tabs">
                  <span className="is-active">Raciocínio</span>
                  <span>Ângulos</span>
                  <span>TUSS</span>
                  <span>Laudo</span>
                </div>
                <div className="case-board">
                  <div className="case-board__main">
                    <span className="console-label">Síntese IA</span>
                    <p>
                      Avaliar eixo mecânico, compartimento medial, indicação de osteotomia
                      ou artroplastia parcial conforme idade, demanda e achados de imagem.
                    </p>
                    <div className="console-tags">
                      <span>HKA</span>
                      <span>Varo</span>
                      <span>RM</span>
                      <span>OPME</span>
                    </div>
                  </div>
                  <div className="measurement-map">
                    <div className="measurement-map__axis" />
                    <div className="measurement-map__angle">7.5°</div>
                    <div className="measurement-map__node measurement-map__node--a" />
                    <div className="measurement-map__node measurement-map__node--b" />
                  </div>
                </div>
                <div className="console-feed">
                  <div>
                    <strong>Pedido cirúrgico</strong>
                    <span>Materiais + justificativa + códigos TUSS</span>
                  </div>
                  <div>
                    <strong>Regenerativa</strong>
                    <span>Elegibilidade e protocolo ortobiológico</span>
                  </div>
                  <div>
                    <strong>Estudo</strong>
                    <span>Resumo para residente e perguntas-chave</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pillar-row" id="ia-clinica">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="pillar-row__item">
                <strong>{pillar.label}</strong>
                <span>{pillar.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--features" id="modulos">
        <div className="container">
          <span className="section-kicker">Plataforma de IA ortopédica</span>
          <div className="section-heading">
            <div>
              <h2>Uma inteligência para todas as necessidades reais da ortopedia.</h2>
              <p className="section-copy">
                A ORTHO.AI combina raciocínio clínico, documentação, estudo, planejamento
                cirúrgico, medicina regenerativa e operação de clínica em um ambiente único.
              </p>
            </div>
          </div>

          <div className="feature-grid feature-grid--suite">
            {capabilities.map((capability) => (
              <article key={capability.title} className="feature-card capability-card">
                <div className="feature-card__icon">
                  <Glyph kind={capability.kind} />
                </div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--deep" id="cirurgia">
        <div className="container">
          <div className="depth-grid">
            <article className="depth-panel depth-panel--dark">
              <span className="section-kicker">Planejamento cirúrgico</span>
              <h2>Deformidade, eixos, ângulos, materiais e estratégia em um único fluxo.</h2>
              <p>
                A IA organiza o caso, sugere medidas, estrutura a lógica cirúrgica,
                prepara justificativas e transforma o planejamento em documentos acionáveis.
              </p>
              <ul className="depth-list">
                {surgicalStack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="depth-panel">
              <span className="section-kicker">Formação contínua</span>
              <h2>Uma camada de estudo para residentes e especialistas.</h2>
              <p>
                O mesmo motor que apoia a prática clínica também ensina: explica raciocínio,
                cria revisões dirigidas, resume protocolos e simula discussão de casos.
              </p>
              <ul className="depth-list depth-list--light">
                {residentStack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          <div className="workflow-board">
            {workflow.map((item) => (
              <article key={item.step} className="workflow-card">
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>

          <div className="trial-banner">
            <div>
              <strong>7 dias grátis, sem cartão de crédito</strong>
              <span>Teste a plataforma como IA de trabalho, estudo, documentação e planejamento.</span>
            </div>
            <div className="trial-banner__badge">Cockpit completo</div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--pricing" id="planos">
        <div className="container">
          <span className="section-kicker">Planos</span>
          <div className="section-heading">
            <div>
              <h2>Escolha o nível de inteligência para sua rotina ortopédica.</h2>
              <p className="section-copy">
                Da residência à clínica, a ORTHO.AI foi desenhada para crescer junto com
                a complexidade do seu trabalho.
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
                    {plan.featured ? "Mais completo" : "ORTHO.AI"}
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
                      Começar agora
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Ecossistema ORTHO.AI</span>
              <h3>O objetivo é ser a inteligência ortopédica mais completa do mercado.</h3>
            </div>
            <Link href="/dashboard" className="button button--ghost">
              Abrir dashboard
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
