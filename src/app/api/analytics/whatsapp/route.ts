import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, normalizePath, rateLimitOk } from "@/lib/analytics";
import { AD_COOKIE } from "@/lib/marketing/ads";
import { pixelContext, safeEventId, sendPixelEvent } from "@/lib/marketing/meta-pixel";
import { db, marketingStoreReady } from "@/lib/marketing/store";
import { campaignFromUtm } from "@/lib/marketing/visit-source";

export const runtime = "nodejs";

const SESSION_ID = /^[a-zA-Z0-9-]{8,64}$/;

function cookieValue(request: Request, name: string) {
  for (const part of (request.headers.get("cookie") ?? "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}

// Clic a WhatsApp desde el sitio (solo con permiso de cookies): cuenta para el embudo de la campaña
// y manda el evento Lead del Pixel por la Conversions API (con el mismo id que el navegador).
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimitOk(`wa:${ip}`, 20, 60_000)) return NextResponse.json({ ok: false }, { status: 429 });
  const pixel = pixelContext(request);
  if (!pixel.consent) return NextResponse.json({ ok: true, skipped: "no-consent" });
  if (cookieValue(request, ADMIN_SESSION_COOKIE)) return NextResponse.json({ ok: true, skipped: "admin" });

  const body = await request.json().catch(() => ({}));
  const path = normalizePath(String(body.path ?? "/")).slice(0, 200);
  const campaign = campaignFromUtm(typeof body.campaign === "string" ? body.campaign : null) ?? campaignFromUtm(cookieValue(request, AD_COOKIE));

  if (marketingStoreReady()) {
    const sessionId = typeof body.sessionId === "string" && SESSION_ID.test(body.sessionId) ? body.sessionId : null;
    const { error } = await db().from("whatsapp_clicks").insert({ path, session_id: sessionId, campaign });
    if (error) console.error("whatsapp click", error.message);
  }
  const sent = await sendPixelEvent("Lead", {}, { ...pixel, url: pixel.url.replace(/\/$/, "") + path }, safeEventId(body.eventId));
  return NextResponse.json({ ok: true, pixel: sent });
}
