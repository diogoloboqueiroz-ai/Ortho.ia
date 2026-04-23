-- ── ORTHO.AI — Schema do Supabase ─────────────────────────────────────────
-- Execute no SQL Editor do Supabase: https://supabase.com/dashboard
-- Project → SQL Editor → New Query → cole e execute

-- ── EXTENSÕES ────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── TABELA: users (gerenciada pelo NextAuth/Supabase Adapter) ─────────────
-- O adapter cria automaticamente as tabelas: users, accounts, sessions, verification_tokens
-- Apenas adicionamos colunas extras via migration:

alter table users
  add column if not exists crm text,
  add column if not exists specialty text default 'Ortopedia e Traumatologia',
  add column if not exists state text,
  add column if not exists phone text;

-- ── TABELA: subscriptions ─────────────────────────────────────────────────
create table if not exists subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null references users(id) on delete cascade,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  plan                    text not null default 'profissional'
                            check (plan in ('basico','profissional','clinica','developer')),
  billing                 text not null default 'mensal'
                            check (billing in ('mensal','anual')),
  status                  text not null default 'trial'
                            check (status in ('trial','active','canceled','past_due')),
  is_developer            boolean not null default false,
  trial_start             timestamptz not null default now(),
  trial_end               timestamptz not null default (now() + interval '7 days'),
  current_period_end      timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  unique(user_id)
);

-- Index para lookup rápido
create index if not exists subscriptions_user_id_idx on subscriptions(user_id);
create index if not exists subscriptions_stripe_customer_idx on subscriptions(stripe_customer_id);

-- ── TABELA: documents ─────────────────────────────────────────────────────
create table if not exists documents (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references users(id) on delete cascade,
  type             text not null check (type in ('cirurgia','exame','laudo')),
  patient_name     text not null,
  patient_cpf      text,
  convenio         text,
  cid              text,
  tuss_codes       jsonb not null default '[]',
  clinical_summary text,
  specific_data    jsonb not null default '{}',
  doctor_name      text not null,
  doctor_crm       text not null,
  created_at       timestamptz not null default now()
);

create index if not exists documents_user_id_idx on documents(user_id);
create index if not exists documents_created_at_idx on documents(created_at desc);

-- ── TABELA: brain_sessions (histórico de conversas) ───────────────────────
create table if not exists brain_sessions (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references users(id) on delete cascade,
  messages   jsonb not null default '[]',
  mode       text not null default 'console',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists brain_sessions_user_id_idx on brain_sessions(user_id);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────
-- Cada usuário só vê seus próprios dados

alter table subscriptions enable row level security;
alter table documents enable row level security;
alter table brain_sessions enable row level security;

-- Policies: usuário lê/edita apenas seus dados
create policy "Users can view own subscription"
  on subscriptions for select using (auth.uid() = user_id);

create policy "Users can view own documents"
  on documents for select using (auth.uid() = user_id);

create policy "Users can insert own documents"
  on documents for insert with check (auth.uid() = user_id);

create policy "Users can view own brain sessions"
  on brain_sessions for select using (auth.uid() = user_id);

-- Service role bypassa RLS (para o backend/admin)
-- O SUPABASE_SERVICE_ROLE_KEY tem acesso total automaticamente

-- ── TRIGGER: atualizar updated_at automaticamente ─────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute procedure update_updated_at();

create trigger brain_sessions_updated_at
  before update on brain_sessions
  for each row execute procedure update_updated_at();

-- ── VERIFICAÇÃO ───────────────────────────────────────────────────────────
select 'Schema ORTHO.AI criado com sucesso! ✓' as status;
