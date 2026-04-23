import Stripe from "stripe";

// Inicialização lazy — só cria quando chamado, não no build
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY não configurada.");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});

export const PLANS = {
  basico: {
    name: "Básico",
    mensal: { priceId: process.env.STRIPE_PRICE_BASICO_MENSAL ?? "", amount: 9700 },
    anual:  { priceId: process.env.STRIPE_PRICE_BASICO_ANUAL  ?? "", amount: 104760 },
    features: ["50 pedidos/laudos por mês", "Tabela TUSS completa", "OrthoBrain Engine™", "Suporte por email"],
  },
  profissional: {
    name: "Profissional",
    mensal: { priceId: process.env.STRIPE_PRICE_PRO_MENSAL ?? "", amount: 19700 },
    anual:  { priceId: process.env.STRIPE_PRICE_PRO_ANUAL  ?? "", amount: 212760 },
    features: ["Pedidos ilimitados", "Laudos com IA avançada", "Templates personalizados", "Assinatura digital", "Suporte prioritário"],
  },
  clinica: {
    name: "Clínica",
    mensal: { priceId: process.env.STRIPE_PRICE_CLINICA_MENSAL ?? "", amount: 49700 },
    anual:  { priceId: process.env.STRIPE_PRICE_CLINICA_ANUAL  ?? "", amount: 536760 },
    features: ["Até 10 médicos", "Dashboard da clínica", "Gestão de equipe", "SLA dedicado"],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
export type BillingCycle = "mensal" | "anual";

export async function createCheckoutSession({
  userId, email, plan, billing, successUrl, cancelUrl,
}: {
  userId: string; email: string; plan: PlanKey;
  billing: BillingCycle; successUrl: string; cancelUrl: string;
}) {
  const s = getStripe();
  const priceId = PLANS[plan][billing].priceId;
  const customers = await s.customers.list({ email, limit: 1 });
  let customer = customers.data[0];
  if (!customer) {
    customer = await s.customers.create({ email, metadata: { userId } });
  }
  return s.checkout.sessions.create({
    customer: customer.id,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 7,
      trial_settings: { end_behavior: { missing_payment_method: "cancel" } },
      metadata: { userId, plan, billing },
    },
    payment_method_collection: "if_required",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId, plan, billing },
    locale: "pt-BR",
    currency: "brl",
  });
}

export async function createCustomerPortal({
  stripeCustomerId, returnUrl,
}: { stripeCustomerId: string; returnUrl: string }) {
  return getStripe().billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
}

export function formatPrice(amountInCents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amountInCents / 100);
}

export function getAnnualSavings(plan: PlanKey): number {
  return (PLANS[plan].mensal.amount * 12 - PLANS[plan].anual.amount) / 100;
}
