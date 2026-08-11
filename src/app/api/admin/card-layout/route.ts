import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api-auth";
import {
  CARD_LAYOUT_KEY,
  DEFAULT_CARD_LAYOUT,
  type BusinessCardLayout,
} from "@/lib/card-layout";
import {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
      return NextResponse.json({
        configured: false,
        setupNote:
          "Sin Supabase admin: el layout se puede guardar en este navegador (localStorage).",
        layout: DEFAULT_CARD_LAYOUT,
      });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", CARD_LAYOUT_KEY)
      .maybeSingle();

    if (error) {
      const tableMissing =
        /relation .* does not exist|Could not find the table/i.test(
          error.message,
        );
      return NextResponse.json({
        configured: false,
        setupNote: tableMissing
          ? "Falta site_settings. Ejecuta 20260811_admin_modules.sql. Mientras, usa localStorage."
          : error.message,
        layout: DEFAULT_CARD_LAYOUT,
      });
    }

    const layout =
      (data?.value as BusinessCardLayout | undefined) ?? DEFAULT_CARD_LAYOUT;

    return NextResponse.json({
      configured: true,
      setupNote: null,
      layout,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      configured: false,
      setupNote: "Error al cargar layout.",
      layout: DEFAULT_CARD_LAYOUT,
    });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = (await request.json()) as { layout?: BusinessCardLayout };
    if (!body.layout?.front || !body.layout?.back) {
      return NextResponse.json({ error: "Layout inválido" }, { status: 400 });
    }

    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json({
        saved: false,
        localOnly: true,
        message:
          "Supabase no configurado — guarda también en localStorage desde el cliente.",
        layout: body.layout,
      });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("site_settings").upsert({
      key: CARD_LAYOUT_KEY,
      value: body.layout,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ saved: true, layout: body.layout });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
