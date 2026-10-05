import { after, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  geoFromRequest,
  normalizeHash,
  normalizePath,
  rateLimitOk,
  shouldTrackPath,
  truncateUa,
} from "@/lib/analytics";
import { maybeSocialTick } from "@/lib/marketing/social";
import { marketingStoreReady } from "@/lib/marketing/store";
import { campaignFromUtm, isVisitSource } from "@/lib/marketing/visit-source";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

const SESSION_ID = /^[a-zA-Z0-9-]{8,64}$/;

/** Columnas que agrega una migración que quizá todavía no se corrió. */
function missingColumn(message: string, columns: string[]) {
  return new RegExp(`column .* (${columns.join("|")})|schema cache|Could not find the ['"]?(${columns.join("|")})`, "i").test(message);
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimitOk(`pv:${ip}`, 90, 60_000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { ok: false, skipped: true, reason: "supabase_not_configured" },
        { status: 200 },
      );
    }

    // Marketing en redes: publica lo pendiente con las visitas (máximo cada 5 minutos).
    if (marketingStoreReady()) after(() => maybeSocialTick());

    // No contar al administrador (navegador con sesión del panel).
    if (request.headers.get("cookie")?.includes(`${ADMIN_SESSION_COOKIE}=`)) {
      return NextResponse.json({ ok: true, skipped: true, reason: "admin" });
    }

    const body = await request.json().catch(() => ({}));
    const path = normalizePath(String(body.path ?? ""));
    if (!shouldTrackPath(path)) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const hash = normalizeHash(
      body.hash != null ? String(body.hash) : null,
    );
    const referrerRaw =
      body.referrer != null ? String(body.referrer).trim().slice(0, 500) : "";
    const referrer = referrerRaw || null;
    const userAgent = truncateUa(
      body.userAgent != null
        ? String(body.userAgent)
        : request.headers.get("user-agent"),
    );
    const geo = geoFromRequest(request);
    const attribution = {
      session_id: typeof body.sessionId === "string" && SESSION_ID.test(body.sessionId) ? body.sessionId : null,
      source: isVisitSource(body.source) ? body.source : null,
      campaign: campaignFromUtm(typeof body.campaign === "string" ? body.campaign : null),
    };

    const supabase = getSupabase();
    const base = { path, hash, referrer, user_agent: userAgent };
    const withGeo = { ...base, country: geo.country, region: geo.region, city: geo.city };
    let { error } = await supabase.from("page_views").insert({ ...withGeo, ...attribution });

    // Si falta alguna migración, se guarda lo que se pueda.
    if (error && missingColumn(error.message, ["session_id", "source", "campaign"])) {
      ({ error } = await supabase.from("page_views").insert(withGeo));
    }
    if (error && missingColumn(error.message, ["country", "region", "city"])) {
      ({ error } = await supabase.from("page_views").insert(base));
    }
    if (error) {
      console.error("pageview insert", error);
      // Table missing or RLS — don't break the public site
      return NextResponse.json(
        { ok: false, error: "No se pudo guardar" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
