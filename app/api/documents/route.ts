/**
 * GET  /api/documents — Listar documentos do usuário
 * POST /api/documents — Salvar novo documento
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { checkAccess } from "@/lib/subscription";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("documents")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ documents: data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  // Verificar acesso
  const access = await checkAccess(session.user.id);
  if (!access.hasAccess) {
    return NextResponse.json(
      { error: "Acesso expirado. Assine um plano para continuar.", redirectTo: "/billing" },
      { status: 403 }
    );
  }

  const body = await req.json();

  const { error } = await supabaseAdmin.from("documents").insert({
    user_id: session.user.id,
    type: body.type,
    patient_name: body.patientName,
    patient_cpf: body.patientCpf,
    convenio: body.convenio,
    cid: body.cid,
    tuss_codes: body.tussCodes || [],
    clinical_summary: body.clinicalSummary,
    specific_data: body.specificData || {},
    doctor_name: body.doctorName,
    doctor_crm: body.doctorCrm,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
