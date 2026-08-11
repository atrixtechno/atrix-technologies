import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api-auth";
import {
  inputToDbPatch,
  seedRowsFromSiteContent,
  toPublicProject,
  type AdminProjectInput,
  type AdminProjectRow,
  slugify,
  resolveRenewalDates,
} from "@/lib/admin-projects";
import { canEncryptProjectSecrets } from "@/lib/project-secrets";
import {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function setupPayload(note: string) {
  return {
    configured: false,
    setupNote: note,
    projects: [] as ReturnType<typeof toPublicProject>[],
  };
}

export async function GET(request: Request) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        setupPayload(
          "Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
        ),
      );
    }

    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json(
        setupPayload(
          "Añade SUPABASE_SERVICE_ROLE_KEY (solo servidor) para el vault de proyectos. Ejecuta también supabase/migrations/20260811_admin_modules.sql.",
        ),
      );
    }

    const supabase = getSupabaseAdmin();
    let { data, error } = await supabase
      .from("admin_projects")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      const tableMissing =
        /relation .* does not exist|Could not find the table/i.test(
          error.message,
        );
      return NextResponse.json(
        setupPayload(
          tableMissing
            ? "Falta la tabla admin_projects. Ejecuta supabase/migrations/20260811_admin_modules.sql en el SQL Editor de Supabase."
            : `No se pudieron leer los proyectos: ${error.message}`,
        ),
      );
    }

    if (!data?.length) {
      const seeds = seedRowsFromSiteContent();
      const { error: seedError } = await supabase
        .from("admin_projects")
        .insert(seeds);
      if (!seedError) {
        const again = await supabase
          .from("admin_projects")
          .select("*")
          .order("name", { ascending: true });
        data = again.data ?? [];
      }
    }

    const projects = (data as AdminProjectRow[]).map(toPublicProject);
    return NextResponse.json({
      configured: true,
      setupNote: canEncryptProjectSecrets()
        ? null
        : "Configura PROJECT_SECRETS_KEY (o SUPABASE_SERVICE_ROLE_KEY) para cifrar contraseñas al guardar.",
      projects,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      setupPayload("Error al cargar proyectos. Revisa la configuración de Supabase."),
    );
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

    const body = (await request.json()) as AdminProjectInput;
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 },
      );
    }

    const slug = slugify(body.slug || body.name);
    if (!slug) {
      return NextResponse.json({ error: "Slug inválido" }, { status: 400 });
    }

    const dates = resolveRenewalDates(
      body.domainRegisteredAt ?? null,
      body.domainRenewsAt ?? null,
    );

    const patch = inputToDbPatch({ ...body, slug });
    const row = {
      name: body.name.trim(),
      slug,
      short_description: (body.shortDescription ?? null)?.toString().trim() || null,
      public_url: (body.publicUrl ?? null)?.toString().trim() || null,
      logo_url: (body.logoUrl ?? null)?.toString().trim() || null,
      email_address: (body.emailAddress ?? null)?.toString().trim() || null,
      domain_platform: (body.domainPlatform ?? null)?.toString().trim() || null,
      domain_email: (body.domainEmail ?? null)?.toString().trim() || null,
      db_platform: (body.dbPlatform ?? null)?.toString().trim() || null,
      db_email: (body.dbEmail ?? null)?.toString().trim() || null,
      deploy_platform: (body.deployPlatform ?? null)?.toString().trim() || null,
      deploy_email: (body.deployEmail ?? null)?.toString().trim() || null,
      email_password_enc: patch.email_password_enc ?? null,
      domain_password_enc: patch.domain_password_enc ?? null,
      db_password_enc: patch.db_password_enc ?? null,
      deploy_password_enc: patch.deploy_password_enc ?? null,
      domain_registered_at: dates.domain_registered_at,
      domain_renews_at: dates.domain_renews_at,
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("admin_projects")
      .insert(row)
      .select("*")
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: error.message || "No se pudo crear el proyecto" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      project: toPublicProject(data as AdminProjectRow),
    });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "Error al crear el proyecto";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
