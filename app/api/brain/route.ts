/**
 * POST /api/brain
 * OrthoBrain Engine™ — tri-model otimizado
 *
 * Body JSON:
 *   messages: Message[]
 *   images?:  ImageInput[]
 *   mode?:    BrainMode
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { callOrthoBrain, getModeLabel, isHighRiskMode } from "@/lib/ortho-brain";
import { checkAccess } from "@/lib/subscription";
import type { Message, ImageInput, BrainMode } from "@/lib/ortho-brain";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const access = await checkAccess(session.user.id);
    if (!access.hasAccess) {
      return NextResponse.json(
        { error: "Acesso expirado.", reason: access.reason, redirectTo: "/billing" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { messages, images, mode: forcedMode } = body as {
      messages: Message[];
      images?:  ImageInput[];
      mode?:    BrainMode;
    };

    if (!messages?.length) {
      return NextResponse.json({ error: "Campo 'messages' obrigatório." }, { status: 400 });
    }

    // Validar imagens
    if (images?.length) {
      for (const img of images) {
        if (!img.base64Data || !img.mimeType)
          return NextResponse.json({ error: "Imagem inválida: faltam base64Data ou mimeType." }, { status: 400 });
        if (img.base64Data.length > 13_500_000)
          return NextResponse.json({ error: "Imagem muito grande. Máximo 10MB." }, { status: 400 });
      }
    }

    const result = await callOrthoBrain(messages, { forcedMode, images });

    return NextResponse.json({
      content:       result.content,
      mode:          result.mode,
      modeLabel:     getModeLabel(result.mode),
      engine:        result.engine,         // sempre "OrthoBrain Engine™"
      latency:       result.latency,
      hasVision:     result.hasVision,
      cached:        result.cached,         // true = economizou 90% no input Claude
      isHighRisk:    isHighRiskMode(result.mode),
      usage: {
        inputTokens:  result.inputTokens,
        outputTokens: result.outputTokens,
      },
      trialDaysLeft: access.trialDaysLeft,
    }, { status: 200 });

  } catch (err) {
    console.error("[OrthoBrain API]", err);
    return NextResponse.json({ error: "Erro interno no OrthoBrain Engine." }, { status: 500 });
  }
}
