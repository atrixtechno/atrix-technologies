import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api-auth";
import {
  inputToDbPatch,
  mergeDateFields,
  toPublicProject,
  type AdminProjectInput,
  type AdminProjectRow,
} from "@/lib/admin-projects";
import {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Ctx) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json(
        { error: "Supabase admin no configurado" },
        { status: 503 },
      );
    }

    const { id } = await context.params;
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("admin_projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (!data) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      project: toPublicProject(data as AdminProjectRow),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al leer" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: Ctx) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json(
        { error: "Supabase admin no configurado" },
        { status: 503 },
      );
    }

    const { id } = await context.params;
    const body = (await request.json()) as AdminProjectInput;
    const supabase = getSupabaseAdmin();

    const existingRes = await supabase
      .from("admin_projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (existingRes.error || !existingRes.data) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    const existing = existingRes.data as AdminProjectRow;
    const patch = inputToDbPatch(body);

    if (
      body.domainRegisteredAt !== undefined ||
      body.domainRenewsAt !== undefined
    ) {
      const dates = mergeDateFields(existing, body);
      patch.domain_registered_at = dates.domain_registered_at;
      patch.domain_renews_at = dates.domain_renews_at;
    }

    const { data, error } = await supabase
      .from("admin_projects")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      project: toPublicProject(data as AdminProjectRow),
    });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "Error al actualizar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: Ctx) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json(
        { error: "Supabase admin no configurado" },
        { status: 503 },
      );
    }

    const { id } = await context.params;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("admin_projects").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
