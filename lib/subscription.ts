/**
 * ORTHO.AI — Gestão de Assinatura
 * Trial 7 dias + verificação de acesso
 */

import { supabaseAdmin } from "./supabase";
import type { Subscription } from "./supabase";

const DEVELOPER_EMAIL = process.env.DEVELOPER_EMAIL || "diogo.lobo.queiroz@gmail.com";
const TRIAL_DAYS = 7;

// ── Criar assinatura trial ao registrar ───────────────────────────────────

export async function createTrialSubscription(userId: string, email: string) {
  // Desenvolvedor — acesso permanente gratuito
  if (email.toLowerCase() === DEVELOPER_EMAIL.toLowerCase()) {
    const { error } = await supabaseAdmin.from("subscriptions").upsert({
      user_id: userId,
      plan: "developer",
      billing: "mensal",
      status: "active",
      trial_start: new Date().toISOString(),
      trial_end: new Date("2099-12-31").toISOString(),
      is_developer: true,
    });
    if (error) console.error("Error creating dev subscription:", error);
    return;
  }

  // Usuário normal — trial de 7 dias
  const trialStart = new Date();
  const trialEnd = new Date(trialStart.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  const { error } = await supabaseAdmin.from("subscriptions").upsert({
    user_id: userId,
    plan: "profissional", // Plano padrão do trial
    billing: "mensal",
    status: "trial",
    trial_start: trialStart.toISOString(),
    trial_end: trialEnd.toISOString(),
    is_developer: false,
  });

  if (error) console.error("Error creating trial subscription:", error);
}

// ── Verificar se usuário tem acesso ───────────────────────────────────────

export async function checkAccess(userId: string): Promise<{
  hasAccess: boolean;
  reason: "developer" | "active" | "trial" | "expired" | "canceled";
  subscription: Subscription | null;
  trialDaysLeft: number | null;
}> {
  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!sub) {
    return { hasAccess: false, reason: "expired", subscription: null, trialDaysLeft: null };
  }

  // Desenvolvedor
  if (sub.is_developer || sub.plan === "developer") {
    return { hasAccess: true, reason: "developer", subscription: sub, trialDaysLeft: null };
  }

  // Assinatura ativa
  if (sub.status === "active") {
    return { hasAccess: true, reason: "active", subscription: sub, trialDaysLeft: null };
  }

  // Trial
  if (sub.status === "trial") {
    const now = new Date();
    const trialEnd = new Date(sub.trial_end);
    const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft > 0) {
      return { hasAccess: true, reason: "trial", subscription: sub, trialDaysLeft: daysLeft };
    } else {
      // Trial expirado — atualizar status
      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("user_id", userId);
      return { hasAccess: false, reason: "expired", subscription: sub, trialDaysLeft: 0 };
    }
  }

  return { hasAccess: false, reason: "canceled", subscription: sub, trialDaysLeft: null };
}

// ── Atualizar assinatura após pagamento (Stripe webhook) ──────────────────

export async function activateSubscription({
  userId,
  stripeCustomerId,
  stripeSubscriptionId,
  plan,
  billing,
  currentPeriodEnd,
}: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: string;
  billing: string;
  currentPeriodEnd: number;
}) {
  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      plan,
      billing,
      status: "active",
      current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
    })
    .eq("user_id", userId);

  if (error) console.error("Error activating subscription:", error);
}

// ── Cancelar assinatura ───────────────────────────────────────────────────

export async function cancelSubscription(userId: string) {
  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", userId)
    .single();

  if (sub?.stripe_subscription_id) {
    const { stripe } = await import("./stripe");
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });
  }

  await supabaseAdmin
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("user_id", userId);
}
