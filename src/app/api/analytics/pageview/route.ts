import { NextResponse } from "next/server";
import {
  normalizeHash,
  normalizePath,
  rateLimitOk,
  shouldTrackPath,
  truncateUa,
} from "@/lib/analytics";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

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

    const supabase = getSupabase();
    const { error } = await supabase.from("page_views").insert({
      path,
      hash,
      referrer,
      user_agent: userAgent,
    });

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
