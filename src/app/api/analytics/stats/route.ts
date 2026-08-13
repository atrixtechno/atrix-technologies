import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api-auth";
import {
  aggregatePageViews,
  emptyStats,
  type PageViewRow,
} from "@/lib/analytics";
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

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        emptyStats(
          "Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY, luego ejecuta el SQL de page_views.",
        ),
      );
    }

    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json(
        emptyStats(
          "Añade SUPABASE_SERVICE_ROLE_KEY (solo servidor) para leer estadísticas. El tracker ya puede insertar con la anon key.",
        ),
      );
    }

    const supabase = getSupabaseAdmin();
    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const [allCountRes, recentRes] = await Promise.all([
      supabase
        .from("page_views")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("page_views")
        .select("path, hash, created_at, country, region, city, referrer")
        .gte("created_at", sevenDaysAgo)
        .order("created_at", { ascending: false })
        .limit(5000),
    ]);

    if (allCountRes.error || recentRes.error) {
      const msg = allCountRes.error?.message || recentRes.error?.message || "";
      const tableMissing =
        /relation .* does not exist|Could not find the table/i.test(msg);
      const geoMissing =
        /column .* (country|region|city)|Could not find the ['\"]?(country|region|city)/i.test(
          msg,
        );

      if (geoMissing && !tableMissing) {
        const fallback = await supabase
          .from("page_views")
          .select("path, hash, created_at, referrer")
          .gte("created_at", sevenDaysAgo)
          .order("created_at", { ascending: false })
          .limit(5000);
        if (!fallback.error) {
          const rows = (fallback.data ?? []).map((row) => ({
            ...row,
            country: null,
            region: null,
            city: null,
          })) as Pick<
            PageViewRow,
            | "path"
            | "hash"
            | "created_at"
            | "country"
            | "region"
            | "city"
            | "referrer"
          >[];
          const aggregated = aggregatePageViews(rows, allCountRes.count ?? 0);
          return NextResponse.json({
            configured: true,
            setupNote:
              "Faltan columnas de ubicación. Ejecuta supabase/migrations/20260813_page_views_geo.sql en el SQL Editor de Supabase.",
            ...aggregated,
            updatedAt: new Date().toISOString(),
          });
        }
      }

      console.error("analytics stats", allCountRes.error || recentRes.error);
      return NextResponse.json(
        emptyStats(
          tableMissing
            ? "Falta la tabla page_views. Ejecuta supabase/migrations/20260810_page_views.sql en el SQL Editor de Supabase."
            : "No se pudieron leer las estadísticas. Revisa la clave de servicio y la tabla page_views.",
        ),
      );
    }

    const rows = (recentRes.data ?? []) as Pick<
      PageViewRow,
      "path" | "hash" | "created_at" | "country" | "region" | "city" | "referrer"
    >[];
    const aggregated = aggregatePageViews(rows, allCountRes.count ?? 0);

    return NextResponse.json({
      configured: true,
      setupNote: null,
      ...aggregated,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      emptyStats("Error al cargar analítica. Revisa la configuración de Supabase."),
    );
  }
}
