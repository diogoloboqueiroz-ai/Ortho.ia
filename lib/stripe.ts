/**
 * ORTHO.AI — Stripe Integration
 * Trial 7 dias + Planos mensais e anuais
 */

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

// ── Planos e preços ────────────────────────────────────────────────────────

export const PLANS = {
  basico: {
    name: "Básico",
    mensal: { priceId: process.env.STRIPE_PRICE_BASICO_MENSAL!, amount: 9700 },
    anual:  { priceId: process.env.STRIPE_PRICE_BASICO_ANUAL!,  amount: 104760 },
    features: ["50 pedidos/laudos por mês", "Tabela TUSS completa", "OrthoBrain Engine™", "Suporte por email"],
  },
  profissional: {
    name: "Profissional",
    mensal: { priceId: process.env.STRIPE_PRICE_PRO_MENSAL!, amount: 19700 },
    anual:  { priceId: process.env.STRIPE_PRICE_PRO_ANUAL!,  amount: 212760 },
    features: ["Pedidos ilimitados", "Laudos com IA avançada", "Templates personalizados", "Assinatura digital", "Suporte prioritário"],
  },
  clinica: {
    name: "Clínica",
    mensal: { priceId: process.env.STRIPE_PRICE_CLINICA_MENSAL!, amount: 49700 },
    anual:  { priceId: process.env.STRIPE_PRICE_CLINICA_ANUAL!,  amount: 536760 },
    features: ["Até 10 médicos", "Dashboard da clínica", "Gestão de equipe", "SLA dedicado"],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
export type BillingCycle = "mensal" | "anual";

// ── Criar checkout com trial de 7 dias ────────────────────────────────────

export async function createCheckoutSession({
  userId,
  email,
  plan,
  billing,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  email: string;
  plan: PlanKey;
  billing: BillingCycle;
  successUrl: string;
  cancelUrl: string;
}) {
  const priceId = PLANS[plan][billing].priceId;

  // Criar ou recuperar customer no Stripe
  const customers = await stripe.customers.list({ email, limit: 1 });
  let customer = customers.data[0];

  if (!customer) {
    customer = await stripe.customers.create({
      email,
      metadata: { userId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],

    // Trial de 7 dias
    subscription_data: {
      trial_period_days: 7,
      trial_settings: {
        end_behavior: { missing_payment_method: "cancel" },
      },
      metadata: { userId, plan, billing },
    },

    // Coleta método de pagamento mas não cobra até o trial terminar
    payment_method_collection: "if_required",

    success_url: successUrl,
    cancel_url: cancelUrl,

    metadata: { userId, plan, billing },

    locale: "pt-BR",
    currency: "brl",
  });

  return session;
}

// ── Criar portal do cliente (gerenciar assinatura) ────────────────────────

export async function createCustomerPortal({
  stripeCustomerId,
  returnUrl,
}: {
  stripeCustomerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
  return session;
}

// ── Formatar preço em BRL ─────────────────────────────────────────────────

export function formatPrice(amountInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountInCents / 100);
}

export function getAnnualSavings(plan: PlanKey): number {
  const monthly = PLANS[plan].mensal.amount * 12;
  const annual  = PLANS[plan].anual.amount;
  return (monthly - annual) / 100;
}
