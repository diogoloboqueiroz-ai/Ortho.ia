/**
 * POST /api/stripe/checkout
 * Cria sessão de checkout com trial de 7 dias
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCheckoutSession } from "@/lib/stripe";
import type { PlanKey, BillingCycle } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const body = await req.json();
    const { plan, billing } = body as { plan: PlanKey; billing: BillingCycle };

    if (!plan || !billing) {
      return NextResponse.json(
        { error: "Campos 'plan' e 'billing' obrigatórios." },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      email: session.user.email,
      plan,
      billing,
      successUrl: `${appUrl}/dashboard?success=1&plan=${plan}`,
      cancelUrl: `${appUrl}/billing?canceled=1`,
    });

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
  } catch (error) {
    console.error("[Stripe Checkout Error]", error);
    return NextResponse.json(
      { error: "Erro ao criar checkout." },
      { status: 500 }
    );
  }
}
