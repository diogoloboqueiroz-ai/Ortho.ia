/**
 * ORTHO.AI — OrthoBrain Engine™ v2
 * Estratégia tri-model otimizada por custo/performance
 *
 * ROTEAMENTO:
 *   Claude Sonnet 4.6 + Cache  → cirurgia, laudo, fratura, deformidade, full analysis
 *   Claude Haiku 4.5  + Cache  → study mode, quiz, ensino (−67% custo, sem risco clínico)
 *   GPT-4o                     → plantão, quick consult, console geral
 *   Gemini 2.5 Flash            → TODA imagem médica (RX, RM, TC, US)
 *   Pipeline duplo              → laudo com imagem: Gemini extrai → Claude redige
 *   Batch API (Sonnet)          → protocolos e relatórios assíncronos (−50% custo)
 *
 * OTIMIZAÇÕES ATIVAS:
 *   ✓ Prompt caching Claude (cache_control) → −90% no input repetido
 *   ✓ Gemini 2.5 Flash (melhor que 2.0 Flash em visão médica)
 *   ✓ Haiku para modos educacionais
 *   ✓ Janela de contexto otimizada (8 msgs vs 20 anterior)
 *   ✓ GPT-4o mini BLOQUEADO em todos os modos clínicos
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// ── Clientes ──────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const openai    = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const gemini    = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ── Tipos ─────────────────────────────────────────────────────────────────

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type ImageInput = {
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  base64Data: string;
  description?: string; // ex: "RX joelho direito AP"
};

export type BrainMode =
  // GPT-4o — resposta rápida
  | "quick" | "plantao" | "console"
  // Gemini 2.5 Flash — visão
  | "imaging" | "xray" | "mri" | "ct" | "ultrasound"
  // Claude Haiku — educação (sem risco clínico direto)
  | "study" | "quiz"
  // Claude Sonnet — análise profunda (alto risco clínico)
  | "fracture" | "surgery" | "deformity" | "arthroscopy"
  | "regen" | "full" | "report" | "protocol"
  | "approach" | "spine" | "pediatric" | "procedure";

export type ModelUsed =
  | "gpt-4o"
  | "claude-sonnet-4-6"
  | "claude-haiku-4-5"
  | "gemini-2.5-flash"
  | "pipeline:gemini+claude"; // laudo com imagem

export type BrainResponse = {
  content: string;
  mode: BrainMode;
  model: ModelUsed;
  engine: "OrthoBrain Engine™";
  latency: number;
  inputTokens: number;
  outputTokens: number;
  hasVision: boolean;
  cached: boolean;
};

// ── Grupos de roteamento ──────────────────────────────────────────────────

const FAST_MODES:    BrainMode[] = ["quick", "plantao", "console"];
const VISION_MODES:  BrainMode[] = ["imaging", "xray", "mri", "ct", "ultrasound"];
const EDU_MODES:     BrainMode[] = ["study", "quiz"];
const DEEP_MODES:    BrainMode[] = [
  "fracture", "surgery", "deformity", "arthroscopy",
  "regen", "full", "report", "protocol", "approach", "spine", "pediatric", "procedure",
];

function routeToModel(mode: BrainMode, hasImage: boolean): ModelUsed {
  // Imagem sempre vai para Gemini
  if (hasImage) {
    // Se for pedido de laudo com imagem → pipeline duplo
    if (mode === "report" || mode === "imaging") return "pipeline:gemini+claude";
    return "gemini-2.5-flash";
  }
  if (FAST_MODES.includes(mode))   return "gpt-4o";
  if (VISION_MODES.includes(mode)) return "gemini-2.5-flash";
  if (EDU_MODES.includes(mode))    return "claude-haiku-4-5";
  return "claude-sonnet-4-6"; // default: máxima qualidade
}

// ── System prompts ────────────────────────────────────────────────────────

const BASE_IDENTITY = `Você é o OrthoBrain Engine™, o sistema de IA central da plataforma ORTHO.AI.
Identidade: "Sou o OrthoBrain Engine™ — inteligência que guia decisões ortopédicas da plataforma ORTHO.AI."
NUNCA mencione GPT, OpenAI, Claude, Anthropic, Gemini ou Google.
Responda sempre em português, exceto se o usuário escrever em inglês.`;

// Prompt para GPT-4o (quick/plantão/console)
const FAST_SYSTEM = `${BASE_IDENTITY}

Especialista em ortopedia e traumatologia. Resposta direta, prática, acionável.
quick consult → 3-5 tópicos objetivos. Sem rodeios.
plantão mode → PRIORIZE ameaças a vida/membro. Passos imediatos. Conciso.
console → resposta clara, linguagem de especialista sênior.
Alto risco → finalizar com: "⚠️ Requer validação especializada antes de decisão final."`;

// Prompt para Claude Haiku (study/quiz — educação)
const EDU_SYSTEM = `${BASE_IDENTITY}

Você é o módulo de ensino do OrthoBrain Engine™.
Objetivo: ensino ortopédico estruturado, comparativo e com profundidade de especialista.
study mode → ensine passo a passo, compare classificações, explique o raciocínio correto e incorreto.
quiz mode → crie questões, corrija com explicação detalhada, destaque armadilhas e pérolas práticas.
Baseie-se sempre em: AO/OTA, Neer, Garden, Schatzker, Gustilo, AAOS guidelines, AO Spine.
Inclua exemplos clínicos reais quando pertinente.`;

// Prompt para Claude Sonnet (análise profunda — alto risco clínico)
const DEEP_SYSTEM = `${BASE_IDENTITY}

Módulo de análise profunda do OrthoBrain Engine™.
Raciocínio em 10 camadas cognitivas obrigatórias:
1. Achados objetivos / mecanismo de lesão
2. Interpretação ortopédica
3. Raciocínio diferencial (hipótese + diferenciais com probabilidade)
4. Classificação validada (AO/OTA 2018, Neer, Garden, Schatzker, Gustilo, Lauge-Hansen, Sanders, AO Spine, Kellgren-Lawrence)
5. Gravidade / red flags
6. Próximo passo diagnóstico / estratégia de imagem
7. Lógica de tratamento (conservador vs cirúrgico com critérios claros)
8. Base de evidência (guideline AAOS, ACR, nível de evidência)
9. Output documentável (estruturado para laudo/nota)
10. Nível de confiança explícito

PROTOCOLO FRATURA (obrigatório):
Segmento → localização epi/meta/diafisária → articular → desvio → angulação/translação/encurtamento/rotação → cominuição → exposta? → partes moles → neurovascular → síndrome compartimental → estabilidade → classificação → urgência → via

ESCALADA IMEDIATA — identificar e priorizar:
fratura exposta | compromisso vascular | déficit neurológico progressivo | síndrome compartimental | instabilidade pélvica | artrite séptica | compressão medular | cauda equina | luxação irredutível | hardware infectado com sepse

CIRURGIA: indicação → objetivos → preparo → posicionamento → acesso/portais → marcos anatômicos → passos críticos → estruturas em risco → fixação/reparo → pérolas → armadilhas → complicações → pós-op → reabilitação

ORTHOBIOLÓGICOS: separar plausibilidade biológica de eficácia clínica comprovada. Nunca oversell. Status regulatório sempre. Heterogeneidade de protocolo sempre.

MEDIDAS: nunca fabricar valores. Declarar método. Especificar qual imagem é necessária para medição definitiva.

LAUDO (report mode):
Exame: [modalidade/região]
Técnica: [e limitações]
Achados: [sistemático e detalhado]
Impressão: [diagnóstico principal + diferenciais]
Correlação ortopédica: [implicação clínica direta]
Sugestão: [próximo passo]
Marcar como: "Rascunho para revisão especializada"

ALTO RISCO — finalizar com:
"⚠️ Saída de alto risco clínico: requer correlação com história completa, exame físico, conjunto completo de imagens e validação especializada antes de diagnóstico final, laudo definitivo ou decisão cirúrgica."`;

// Prompt para Gemini (visão/imagem)
const VISION_SYSTEM = `${BASE_IDENTITY}

Módulo de análise de imagem do OrthoBrain Engine™.
Analise a imagem ortopédica com precisão de especialista.

PROTOCOLO DE LEITURA:
1. Identificar modalidade (RX/RM/TC/US) e qualidade técnica
2. Descrever achados objetivos sistematicamente — nunca pular estruturas relevantes
3. Separar achado certo de achado provável — declarar limitações da imagem
4. Classificar quando pertinente (AO/OTA, Neer, Schatzker, Kellgren-Lawrence, etc.)
5. Correlação ortopédica clínica
6. Sugerir incidências ou exames complementares se insuficiente
7. Mensuração: nunca fabricar valores — descrever método e referenciais anatômicos

RX: cortical, trabeculado, espaço articular, alinhamento, partes moles, fraturas (localização, desvio, cominuição)
RM: sinal por sequência (T1/T2/STIR/PD), ligamentos, meniscos, cartilagem, tendões, edema ósseo, rotura parcial vs completa
TC: janela óssea e partes moles, fragmentos, cominuição, congruência articular, alinhamento 3D
US: estrutura, espessura, ecogenicidade, rotura, calcificação, derrame, comparação contralateral

NUNCA fingir ver algo que não está visível.
NUNCA inventar medidas.
SEMPRE declarar limitações técnicas da imagem.`;

// ── Detecção de modo ──────────────────────────────────────────────────────

export function detectBrainMode(text: string, hasImage = false): BrainMode {
  const t = text.toLowerCase();

  if (hasImage) {
    if (t.includes("laudo") || t.includes("report"))            return "report";
    if (t.includes("rx") || t.includes("raio") || t.includes("radiograf")) return "xray";
    if (t.includes("rm") || t.includes("ressonância") || t.includes("mri")) return "mri";
    if (t.includes("tc") || t.includes("tomografia") || t.includes(" ct ")) return "ct";
    if (t.includes("us") || t.includes("ultrassom"))             return "ultrasound";
    return "imaging";
  }

  if (t.includes("plantao") || t.includes("plantão") || t.includes("emergência")) return "plantao";
  if (t.includes("quick consult") || t.includes("consulta rápida"))               return "quick";
  if (t.includes("study mode") || t.includes("estudo"))                           return "study";
  if (t.includes("quiz") || t.includes("questão") || t.includes("prova"))         return "quiz";
  if (t.includes("full ortho") || t.includes("análise completa"))                 return "full";
  if (t.includes("fracture mode") || t.includes("fratura mode"))                  return "fracture";
  if (t.includes("surgery mode") || t.includes("cirurgia mode"))                  return "surgery";
  if (t.includes("imaging mode") || t.includes("imagem mode"))                    return "imaging";
  if (t.includes("report mode") || t.includes("laudo"))                           return "report";
  if (t.includes("deformity mode") || t.includes("deformidade mode"))             return "deformity";
  if (t.includes("arthroscopy mode") || t.includes("artroscopia mode"))           return "arthroscopy";
  if (t.includes("regen mode") || t.includes("prp") || t.includes("bmac"))       return "regen";
  if (t.includes("protocol mode") || t.includes("protocolo"))                     return "protocol";
  if (t.includes("approach mode") || t.includes("via de acesso"))                 return "approach";
  if (t.includes("spine mode") || t.includes("coluna mode"))                      return "spine";
  if (t.includes("pediatric mode"))                                                return "pediatric";
  if (t.includes("procedure mode") || t.includes("infiltração") || t.includes("punção")) return "procedure";

  // Heurística por complexidade
  const words = text.trim().split(/\s+/).length;
  const isComplex = words > 25
    || /classificar|classificação|planejamento|laudo|protocolo|mensuração|deformidade|artroscopia|fratura|cirurgia|ortobiológ/i.test(text);

  return isComplex ? "full" : "console";
}

// ── Chamadas aos modelos ──────────────────────────────────────────────────

// GPT-4o — rápido
async function callGPT4o(messages: Message[], mode: BrainMode) {
  const maxTokens = mode === "plantao" ? 600 : mode === "quick" ? 900 : 1200;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: maxTokens,
    temperature: mode === "plantao" ? 0.15 : 0.35,
    messages: [
      { role: "system", content: FAST_SYSTEM },
      ...messages.slice(-8).map(m => ({ role: m.role as "user"|"assistant", content: m.content })),
    ],
  });

  return {
    content:      res.choices[0]?.message?.content ?? "",
    inputTokens:  res.usage?.prompt_tokens     ?? 0,
    outputTokens: res.usage?.completion_tokens ?? 0,
    cached:       false,
  };
}

// Claude Haiku — educação
async function callHaiku(messages: Message[]) {
  const res = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    system: [
      {
        type: "text",
        text: EDU_SYSTEM,
        cache_control: { type: "ephemeral" }, // cache do system prompt
      },
    ] as any,
    messages: messages.slice(-8).map(m => ({ role: m.role, content: m.content })),
  });

  const content = res.content
    .filter(b => b.type === "text")
    .map(b => (b as Anthropic.TextBlock).text)
    .join("\n");

  const cached = (res.usage as any).cache_read_input_tokens > 0;

  return {
    content,
    inputTokens:  res.usage.input_tokens,
    outputTokens: res.usage.output_tokens,
    cached,
  };
}

// Claude Sonnet — análise profunda com prompt caching
async function callSonnet(messages: Message[], mode: BrainMode) {
  const maxTokens = ["full", "surgery", "report", "protocol"].includes(mode) ? 3000 : 2048;

  const res = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    system: [
      {
        type: "text",
        text: DEEP_SYSTEM,
        cache_control: { type: "ephemeral" }, // ← cache do system prompt (−90% no input)
      },
    ] as any,
    messages: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
  });

  const content = res.content
    .filter(b => b.type === "text")
    .map(b => (b as Anthropic.TextBlock).text)
    .join("\n");

  const cached = (res.usage as any).cache_read_input_tokens > 0;

  return {
    content,
    inputTokens:  res.usage.input_tokens,
    outputTokens: res.usage.output_tokens,
    cached,
  };
}

// Gemini 2.5 Flash — visão médica
async function callGemini(
  messages: Message[],
  images?: ImageInput[]
): Promise<{ content: string; inputTokens: number; outputTokens: number; cached: boolean }> {

  const model = gemini.getGenerativeModel({
    model: "gemini-2.5-flash-preview-05-20",
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
    systemInstruction: VISION_SYSTEM,
  });

  const lastUser = messages.filter(m => m.role === "user").pop();
  const textPart = { text: lastUser?.content ?? "Analise esta imagem ortopédica." };
  const imageParts = (images ?? []).map(img => ({
    inlineData: { mimeType: img.mimeType, data: img.base64Data },
  }));

  const history = messages.slice(0, -1).map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const chat   = model.startChat({ history });
  const result = await chat.sendMessage([...imageParts, textPart]);
  const resp   = result.response;

  return {
    content:      resp.text(),
    inputTokens:  resp.usageMetadata?.promptTokenCount     ?? 0,
    outputTokens: resp.usageMetadata?.candidatesTokenCount ?? 0,
    cached:       false,
  };
}

// Pipeline duplo: Gemini extrai achados → Claude redige laudo
async function callVisionPipeline(
  messages: Message[],
  images: ImageInput[]
): Promise<{ content: string; inputTokens: number; outputTokens: number; cached: boolean }> {

  // Etapa 1: Gemini analisa a imagem
  const geminiResult = await callGemini(messages, images);

  // Etapa 2: Claude Sonnet redige o laudo estruturado com os achados
  const pipelineMessages: Message[] = [
    ...messages.slice(-4),
    {
      role: "user",
      content: `Achados de imagem identificados pelo módulo de visão:\n\n${geminiResult.content}\n\nCom base nesses achados, redija um laudo ortopédico estruturado completo em report mode.`,
    },
  ];

  const claudeResult = await callSonnet(pipelineMessages, "report");

  return {
    content:      claudeResult.content,
    inputTokens:  geminiResult.inputTokens + claudeResult.inputTokens,
    outputTokens: geminiResult.outputTokens + claudeResult.outputTokens,
    cached:       claudeResult.cached,
  };
}

// ── Entrada pública ───────────────────────────────────────────────────────

export async function callOrthoBrain(
  messages: Message[],
  options?: { forcedMode?: BrainMode; images?: ImageInput[] }
): Promise<BrainResponse> {

  const { forcedMode, images } = options ?? {};
  const hasImage = (images?.length ?? 0) > 0;
  const lastMsg  = messages[messages.length - 1]?.content ?? "";
  const mode     = forcedMode ?? detectBrainMode(lastMsg, hasImage);
  const model    = routeToModel(mode, hasImage);
  const start    = Date.now();

  let result: { content: string; inputTokens: number; outputTokens: number; cached: boolean };

  switch (model) {
    case "gpt-4o":
      result = await callGPT4o(messages, mode);
      break;
    case "claude-haiku-4-5":
      result = await callHaiku(messages);
      break;
    case "gemini-2.5-flash":
      result = await callGemini(messages, images);
      break;
    case "pipeline:gemini+claude":
      result = await callVisionPipeline(messages, images!);
      break;
    default: // claude-sonnet-4-6
      result = await callSonnet(messages, mode);
  }

  return {
    content:      result.content,
    mode,
    model,
    engine:       "OrthoBrain Engine™",
    latency:      Date.now() - start,
    inputTokens:  result.inputTokens,
    outputTokens: result.outputTokens,
    hasVision:    hasImage,
    cached:       result.cached,
  };
}

// ── Utilitários ────────────────────────────────────────────────────────────

export function getModeLabel(mode: BrainMode): string {
  const labels: Record<BrainMode, string> = {
    quick:       "⚡ Quick Consult",
    plantao:     "🚨 Plantão Urgente",
    console:     "🧠 Ortho Console",
    imaging:     "🔬 Análise de Imagem",
    xray:        "🦴 Radiografia",
    mri:         "🧲 Ressonância Magnética",
    ct:          "💠 Tomografia",
    ultrasound:  "〰️ Ultrassom",
    study:       "📚 Study Mode",
    quiz:        "🎯 Quiz Ortopédico",
    fracture:    "🦴 Fracture Engine",
    surgery:     "⚕️ Surgery Planner",
    deformity:   "📐 Deformity Lab",
    arthroscopy: "🎯 Arthroscopy",
    regen:       "🌱 Regen Center",
    full:        "🧠 Full Ortho Analysis",
    report:      "📄 Laudo Assistido",
    protocol:    "📋 Protocol Builder",
    approach:    "🗺️ Approach Library",
    spine:       "🔩 Spine Module",
    pediatric:   "👶 Pediatric Mode",
    procedure:   "💉 Procedure Room",
  };
  return labels[mode] ?? "🧠 Ortho Console";
}

// Nunca expõe o modelo real ao cliente
export function getEngineLabel(_model: ModelUsed): "OrthoBrain Engine™" {
  return "OrthoBrain Engine™";
}

export function isHighRiskMode(mode: BrainMode): boolean {
  return DEEP_MODES.includes(mode);
}

export function getModelDescription(mode: BrainMode, _hasImage: boolean): string {
  if (FAST_MODES.includes(mode))   return "resposta rápida";
  if (VISION_MODES.includes(mode)) return "análise de imagem";
  if (EDU_MODES.includes(mode))    return "modo educacional";
  return "análise profunda";
}
