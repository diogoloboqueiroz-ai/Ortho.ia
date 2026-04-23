/**
 * ORTHO.AI — Cliente Supabase
 */

import { createClient } from "@supabase/supabase-js";

// Cliente público (browser)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cliente admin (server-side apenas)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ── Tipos das tabelas ──────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  crm?: string;
  specialty?: string;
  state?: string;
  is_developer: boolean;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan: "basico" | "profissional" | "clinica" | "developer";
  billing: "mensal" | "anual";
  status: "trial" | "active" | "canceled" | "past_due";
  trial_start: string;
  trial_end: string;
  current_period_end?: string;
  created_at: string;
};

export type Document = {
  id: string;
  user_id: string;
  type: "cirurgia" | "exame" | "laudo";
  patient_name: string;
  patient_cpf?: string;
  convenio?: string;
  cid?: string;
  tuss_codes: TussCode[];
  clinical_summary?: string;
  specific_data: Record<string, string>;
  doctor_name: string;
  doctor_crm: string;
  created_at: string;
};

export type TussCode = {
  code: string;
  name: string;
  group: string;
};

export type BrainSession = {
  id: string;
  user_id: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  mode: string;
  created_at: string;
  updated_at: string;
};
