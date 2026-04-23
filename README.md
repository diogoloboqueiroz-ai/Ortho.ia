# ORTHO.AI — Guia de Deploy Completo

## Stack
- **Frontend/Backend:** Next.js 15 (Vercel)
- **Banco de dados + Auth:** Supabase
- **Pagamento:** Stripe (trial 7 dias)
- **OrthoBrain Engine™ — Tri-Model IA:**

| Motor | Modelo | Quando usa |
|---|---|---|
| ⚡ Rápido | GPT-4o | quick consult, plantão, perguntas curtas |
| 🧠 Profundo | Claude Sonnet | cirurgia, laudos, deformidades, protocolos, análise completa |
| 👁️ Visão | Gemini 2.0 Flash | RX, RM, TC, US — análise de imagens médicas |

O médico nunca vê qual modelo respondeu — é sempre **OrthoBrain Engine™**.

---

## PASSO 1 — Supabase (banco de dados e autenticação)

1. Acesse https://supabase.com e crie uma conta
2. Clique em **New Project**
   - Nome: `ortho-ai`
   - Região: `South America (São Paulo)`
3. Vá em **SQL Editor** → **New Query**
4. Cole o conteúdo de `supabase-schema.sql` e clique em **Run**
5. Vá em **Settings → API** e copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

---

## PASSO 2 — Google OAuth

1. Acesse https://console.cloud.google.com
2. **APIs & Services → Credentials → OAuth 2.0 Client ID**
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://seudominio.vercel.app/api/auth/callback/google`
3. Copie `Client ID` → `AUTH_GOOGLE_ID` e `Client Secret` → `AUTH_GOOGLE_SECRET`

---

## PASSO 3 — Stripe

1. https://dashboard.stripe.com → **Developers → API Keys**
2. Crie 6 produtos (Básico/Profissional/Clínica × Mensal/Anual em BRL)
3. Para webhook local: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

---

## PASSO 4 — Chaves de IA (3 APIs)

### Anthropic (Claude — análise profunda)
https://console.anthropic.com → API Keys → `ANTHROPIC_API_KEY`

### OpenAI (GPT-4o — respostas rápidas)
https://platform.openai.com → API Keys → `OPENAI_API_KEY`

### Google Gemini (visão — imagens médicas)
https://aistudio.google.com → Get API Key → `GEMINI_API_KEY`
> Gratuito para começar (Google AI Studio free tier)

---

## PASSO 5 — .env.local

```bash
cp .env.example .env.local
# Preencha todas as variáveis
openssl rand -base64 32  # gera AUTH_SECRET
```

---

## PASSO 6 — Rodar localmente

```bash
npm install
npm run dev
```

---

## PASSO 7 — Deploy na Vercel

```bash
git init && git add . && git commit -m "ORTHO.AI v1"
git remote add origin https://github.com/SEU_USER/ortho-ai.git
git push -u origin main
```

Vercel → Import Project → adicionar todas as env vars → Deploy.

---

## Arquitetura OrthoBrain Engine™

```
Mensagem do médico
        │
        ▼
┌─────────────────────────────────────┐
│         OrthoBrain Router           │
│                                     │
│  hasImage? ──────────────► Gemini   │  RX, RM, TC, US
│  plantão/quick? ─────────► GPT-4o  │  Resposta rápida
│  análise/cirurgia? ──────► Claude  │  Raciocínio profundo
└─────────────────────────────────────┘
        │
        ▼
  "OrthoBrain Engine™"  ← sempre esta marca
```

## Arquitetura de marca

- **ORTHO.AI** = produto/plataforma
- **OrthoBrain Engine™** = sistema de IA (tri-model interno)

## Dev

Email desenvolvedor: diogo.lobo.queiroz@gmail.com (acesso gratuito permanente)


## Stack
- **Frontend/Backend:** Next.js 15 (Vercel)
- **Banco de dados + Auth:** Supabase
- **Pagamento:** Stripe (trial 7 dias)
- **IA:** Anthropic Claude (OrthoBrain Engine™)

---

## PASSO 1 — Supabase (banco de dados e autenticação)

1. Acesse https://supabase.com e crie uma conta
2. Clique em **New Project**
   - Nome: `ortho-ai`
   - Senha do banco: anote em lugar seguro
   - Região: `South America (São Paulo)`
3. Aguarde o projeto iniciar (~2 min)
4. Vá em **SQL Editor** → **New Query**
5. Cole o conteúdo de `supabase-schema.sql` e clique em **Run**
6. Vá em **Settings → API** e copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`
7. Vá em **Authentication → Providers → Google**
   - Ative o Google provider
   - Você preencherá o Client ID e Secret no Passo 3

---

## PASSO 2 — Google OAuth

1. Acesse https://console.cloud.google.com
2. Crie um projeto ou selecione um existente
3. Vá em **APIs & Services → Credentials**
4. Clique em **Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Nome: `ortho-ai`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
     - `https://seudominio.vercel.app/api/auth/callback/google` (produção)
5. Copie:
   - `Client ID` → `AUTH_GOOGLE_ID`
   - `Client Secret` → `AUTH_GOOGLE_SECRET`
6. Cole esses valores também no Supabase (Authentication → Providers → Google)

---

## PASSO 3 — Stripe (pagamentos)

1. Acesse https://dashboard.stripe.com e crie uma conta
2. Vá em **Developers → API Keys** e copie:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`
3. Vá em **Products → Add Product** e crie os 6 preços:

   | Produto       | Preço   | Recorrência | Moeda | Price ID para .env          |
   |---------------|---------|-------------|-------|-----------------------------|
   | Básico        | R$97    | Mensal      | BRL   | STRIPE_PRICE_BASICO_MENSAL  |
   | Básico        | R$1.047 | Anual       | BRL   | STRIPE_PRICE_BASICO_ANUAL   |
   | Profissional  | R$197   | Mensal      | BRL   | STRIPE_PRICE_PRO_MENSAL     |
   | Profissional  | R$2.128 | Anual       | BRL   | STRIPE_PRICE_PRO_ANUAL      |
   | Clínica       | R$497   | Mensal      | BRL   | STRIPE_PRICE_CLINICA_MENSAL |
   | Clínica       | R$5.367 | Anual       | BRL   | STRIPE_PRICE_CLINICA_ANUAL  |

4. Para webhook local (desenvolvimento):
   ```bash
   npm install -g stripe
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copie o `whsec_...` que aparecer → `STRIPE_WEBHOOK_SECRET`

5. Para produção: Stripe Dashboard → Webhooks → Add endpoint
   - URL: `https://seudominio.vercel.app/api/stripe/webhook`
   - Events: `customer.subscription.*` e `invoice.payment_failed`

---

## PASSO 4 — Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha todos os valores:

```bash
cp .env.example .env.local
```

Gere o AUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## PASSO 5 — Rodar localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3000

---

## PASSO 6 — Deploy na Vercel

### Opção A — Via GitHub (recomendado)
1. Crie um repositório no GitHub e suba o código:
   ```bash
   git init
   git add .
   git commit -m "feat: ORTHO.AI initial deploy"
   git remote add origin https://github.com/SEU_USER/ortho-ai.git
   git push -u origin main
   ```
2. Acesse https://vercel.com → **Add New Project**
3. Importe o repositório `ortho-ai`
4. Em **Environment Variables**, adicione todas as variáveis do `.env.local`
5. Clique em **Deploy**

### Opção B — Via CLI
```bash
npm install -g vercel
vercel --prod
```

---

## PASSO 7 — Domínio personalizado (opcional)

Na Vercel: **Project Settings → Domains → Add Domain**

Exemplos: `ortho.ai`, `app.ortho-ai.com.br`

---

## Estrutura de arquivos

```
ortho-ai/
├── app/
│   ├── page.tsx                          ← Landing page ORTHO.AI
│   ├── login/page.tsx                    ← Tela de login
│   ├── dashboard/page.tsx                ← App principal
│   └── api/
│       ├── auth/[...nextauth]/route.ts   ← Google OAuth
│       ├── brain/route.ts                ← OrthoBrain Engine™
│       ├── stripe/
│       │   ├── checkout/route.ts         ← Criar checkout
│       │   └── webhook/route.ts          ← Eventos Stripe
│       └── documents/route.ts            ← Salvar pedidos TUSS
├── lib/
│   ├── supabase.ts                       ← Cliente DB
│   ├── stripe.ts                         ← Planos e checkout
│   ├── ortho-brain.ts                    ← Engine IA
│   └── subscription.ts                   ← Trial e acesso
├── auth.ts                               ← NextAuth config
├── supabase-schema.sql                   ← Schema do banco
├── .env.example                          ← Template de variáveis
└── vercel.json                           ← Config deploy
```

---

## Arquitetura de marca

- **ORTHO.AI** = produto/plataforma
- **OrthoBrain Engine™** = cérebro de IA (Anthropic Claude)

## Suporte

Desenvolvedor: diogo.lobo.queiroz@gmail.com
