import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api-auth";
import {
  toPublicProject,
  type AdminProjectRow,
} from "@/lib/admin-projects";
import {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "project-contracts";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const SIGNED_URL_SECONDS = 60 * 60; // 1 hour

type Ctx = { params: Promise<{ id: string }> };

function columnMissingMessage(errorMessage: string): string | null {
  if (
    /contract_url|contract_filename|contract_uploaded_at/i.test(errorMessage) &&
    /column|does not exist|schema cache/i.test(errorMessage)
  ) {
    return "Faltan columnas de contrato. Ejecuta supabase/migrations/20260812_admin_project_contract.sql en el SQL Editor de Supabase.";
  }
  return null;
}

function sanitizeFilename(name: string): string {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
  const withExt = base.toLowerCase().endsWith(".pdf") ? base : `${base || "contrato"}.pdf`;
  return withExt || "contrato.pdf";
}

async function ensurePrivateBucket(
  supabase: ReturnType<typeof getSupabaseAdmin>,
) {
  await supabase.storage
    .createBucket(BUCKET, {
      public: false,
      fileSizeLimit: MAX_BYTES,
      allowedMimeTypes: ["application/pdf"],
    })
    .catch(() => null);
}

async function signedDownloadUrl(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  path: string,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_SECONDS);
  if (error || !data?.signedUrl) {
    console.error(error);
    return null;
  }
  return data.signedUrl;
}

/** GET — signed download URL for the project's contract PDF. */
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
      const hint = columnMissingMessage(error.message);
      return NextResponse.json(
        { error: hint || error.message },
        { status: 400 },
      );
    }
    if (!data) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    const row = data as AdminProjectRow;
    if (!row.contract_url) {
      return NextResponse.json(
        { error: "Este proyecto no tiene contrato PDF" },
        { status: 404 },
      );
    }

    const downloadUrl = await signedDownloadUrl(supabase, row.contract_url);
    if (!downloadUrl) {
      return NextResponse.json(
        {
          error: `No se pudo generar el enlace. Verifica el bucket privado "${BUCKET}".`,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      downloadUrl,
      filename: row.contract_filename,
      uploadedAt: row.contract_uploaded_at,
      expiresIn: SIGNED_URL_SECONDS,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al obtener el contrato" }, { status: 500 });
  }
}

/** POST — multipart PDF upload (field: file). Replaces existing contract. */
export async function POST(request: Request, context: Ctx) {
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

    const existingRes = await supabase
      .from("admin_projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (existingRes.error) {
      const hint = columnMissingMessage(existingRes.error.message);
      return NextResponse.json(
        { error: hint || existingRes.error.message },
        { status: 400 },
      );
    }
    if (!existingRes.data) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    const existing = existingRes.data as AdminProjectRow;
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Falta el archivo PDF" }, { status: 400 });
    }

    const mime = (file.type || "").toLowerCase();
    const nameLooksPdf = file.name.toLowerCase().endsWith(".pdf");
    if (mime !== "application/pdf" && !(mime === "" && nameLooksPdf)) {
      return NextResponse.json(
        { error: "Solo se permiten archivos PDF (application/pdf)" },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "El PDF no debe superar 10 MB" },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "El archivo está vacío" }, { status: 400 });
    }

    const filename = sanitizeFilename(file.name);
    const path = `contracts/${id}/${Date.now()}-${filename}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await ensurePrivateBucket(supabase);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        {
          error:
            uploadError.message ||
            `No se pudo subir. Crea el bucket privado "${BUCKET}" en Supabase Storage (o ejecuta 20260812_admin_project_contract.sql).`,
        },
        { status: 400 },
      );
    }

    const uploadedAt = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from("admin_projects")
      .update({
        contract_url: path,
        contract_filename: filename,
        contract_uploaded_at: uploadedAt,
        updated_at: uploadedAt,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      // Roll back uploaded object if DB update fails
      await supabase.storage.from(BUCKET).remove([path]).catch(() => null);
      const hint = columnMissingMessage(updateError.message);
      return NextResponse.json(
        { error: hint || updateError.message },
        { status: 400 },
      );
    }

    // Best-effort: remove previous object after successful replace
    if (existing.contract_url && existing.contract_url !== path) {
      await supabase.storage
        .from(BUCKET)
        .remove([existing.contract_url])
        .catch(() => null);
    }

    const project = toPublicProject(updated as AdminProjectRow);
    const downloadUrl = await signedDownloadUrl(supabase, path);

    return NextResponse.json({
      project,
      downloadUrl,
      message: "Contrato PDF guardado.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al subir el contrato" }, { status: 500 });
  }
}

/** DELETE — remove contract from storage and clear DB fields. */
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

    const existingRes = await supabase
      .from("admin_projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (existingRes.error) {
      const hint = columnMissingMessage(existingRes.error.message);
      return NextResponse.json(
        { error: hint || existingRes.error.message },
        { status: 400 },
      );
    }
    if (!existingRes.data) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }

    const existing = existingRes.data as AdminProjectRow;
    if (existing.contract_url) {
      await supabase.storage
        .from(BUCKET)
        .remove([existing.contract_url])
        .catch(() => null);
    }

    const now = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from("admin_projects")
      .update({
        contract_url: null,
        contract_filename: null,
        contract_uploaded_at: null,
        updated_at: now,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      const hint = columnMissingMessage(updateError.message);
      return NextResponse.json(
        { error: hint || updateError.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      project: toPublicProject(updated as AdminProjectRow),
      message: "Contrato eliminado.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al eliminar el contrato" }, { status: 500 });
  }
}
