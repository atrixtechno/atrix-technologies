import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api-auth";
import {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "project-assets";

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

    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "logos");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Solo se permiten imágenes" },
        { status: 400 },
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "La imagen no debe superar 4 MB" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const ext =
      file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
      "png";
    const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "") || "logos";
    const path = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Ensure bucket exists (idempotent best-effort)
    await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => null);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error(error);
      return NextResponse.json(
        {
          error:
            error.message ||
            `No se pudo subir. Crea el bucket público "${BUCKET}" en Supabase Storage.`,
        },
        { status: 400 },
      );
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al subir" }, { status: 500 });
  }
}
