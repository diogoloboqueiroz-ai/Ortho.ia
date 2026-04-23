/**
 * POST /api/stripe/webhook
 * Processa eventos do Stripe — ativa/cancela assinaturas
 */

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { activateSubscription, cancelSubscription } from "@/lib/subscription";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[Stripe Webhook] Assinatura inválida:", err);
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Trial convertido em assinatura paga
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        const plan   = sub.metadata?.plan || "profissional";
        const billing= sub.metadata?.billing || "mensal";

        if (userId && sub.status === "active") {
          await activateSubscription({
            userId,
            stripeCustomerId: sub.customer as string,
            stripeSubscriptionId: sub.id,
            plan,
            billing,
            currentPeriodEnd: sub.current_period_end,
          });
        }
        break;
      }

      // Assinatura cancelada ou pagamento falhou
      case "customer.subscription.deleted":
      case "invoice.payment_failed": {
        const obj = event.data.object as Stripe.Subscription | Stripe.Invoice;
        const userId =
          "metadata" in obj ? obj.metadata?.userId : undefined;

        if (userId) {
          await cancelSubscription(userId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[Stripe Webhook] Erro:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

// Necessário para o Stripe enviar o body cru
export const config = { api: { bodyParser: false } };
