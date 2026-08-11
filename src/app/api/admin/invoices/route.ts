import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api-auth";
import {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InvoiceBody = {
  clientName?: string;
  projectName?: string;
  startDate?: string | null;
  endDate?: string | null;
  engineers?: string[];
  paymentMethod?: string | null;
  terms?: string | null;
  notes?: string | null;
};

function mapInvoice(row: Record<string, unknown>) {
  return {
    id: row.id,
    clientName: row.client_name,
    projectName: row.project_name,
    startDate: row.start_date,
    endDate: row.end_date,
    engineers: Array.isArray(row.engineers) ? row.engineers : [],
    paymentMethod: row.payment_method,
    terms: row.terms,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: Request) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
      return NextResponse.json({
        configured: false,
        setupNote:
          "Configura Supabase + SUPABASE_SERVICE_ROLE_KEY y ejecuta 20260811_admin_modules.sql para guardar borradores. Puedes generar PDF sin guardar.",
        invoices: [],
      });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("admin_invoices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      const tableMissing =
        /relation .* does not exist|Could not find the table/i.test(
          error.message,
        );
      return NextResponse.json({
        configured: false,
        setupNote: tableMissing
          ? "Falta admin_invoices. Ejecuta supabase/migrations/20260811_admin_modules.sql."
          : error.message,
        invoices: [],
      });
    }

    return NextResponse.json({
      configured: true,
      setupNote: null,
      invoices: (data ?? []).map((r) => mapInvoice(r as Record<string, unknown>)),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      configured: false,
      setupNote: "Error al cargar facturas.",
      invoices: [],
    });
  }
}

export async function POST(request: Request) {
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

    const body = (await request.json()) as InvoiceBody;
    if (!body.clientName?.trim() || !body.projectName?.trim()) {
      return NextResponse.json(
        { error: "Cliente y proyecto son obligatorios" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("admin_invoices")
      .insert({
        client_name: body.clientName.trim(),
        project_name: body.projectName.trim(),
        start_date: body.startDate || null,
        end_date: body.endDate || null,
        engineers: (body.engineers ?? []).filter((e) => e.trim()),
        payment_method: body.paymentMethod?.trim() || null,
        terms: body.terms?.trim() || null,
        notes: body.notes?.trim() || null,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      invoice: mapInvoice(data as Record<string, unknown>),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
