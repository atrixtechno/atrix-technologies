import { NextResponse } from "next/server";
import {
  formatLeadWhatsAppMessage,
  isCallMeBotConfigured,
  sendCallMeBotWhatsApp,
} from "@/lib/callmebot";
import { services } from "@/content/services";
import { AD_COOKIE } from "@/lib/marketing/ads";
import { pixelContext, safeEventId, sendPixelEvent } from "@/lib/marketing/meta-pixel";
import { getCampaign } from "@/lib/marketing/store";
import { campaignFromUtm } from "@/lib/marketing/visit-source";
import { getSupabase } from "@/lib/supabase";

const LIMITS = { name: 120, phone: 30, business: 160, message: 2000 } as const;
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;

/** Límite best-effort por instancia: frena ráfagas de spam sin infraestructura extra. */
const recent = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) {
    for (const [key, times] of recent) {
      if (times.every((t) => now - t >= WINDOW_MS)) recent.delete(key);
    }
  }
  return hits.length > MAX_PER_WINDOW;
}

function field(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

function cookieValue(request: Request, name: string) {
  for (const part of (request.headers.get("cookie") ?? "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}

/** Campaña pagada que trajo esta cotización (cookie de /a/<id>), solo si existe. */
async function adCampaignFrom(request: Request) {
  const id = campaignFromUtm(cookieValue(request, AD_COOKIE));
  if (!id) return null;
  const campaign = await getCampaign(id).catch(() => null);
  return campaign ? { id: campaign.id, headline: campaign.headline } : null;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: "Demasiados envíos. Intenta en unos minutos o escríbenos por WhatsApp." },
        { status: 429 },
      );
    }

    const body = await request.json();

    // Honeypot: campo oculto que solo llenan los bots.
    if (field(body.website, 200)) {
      return NextResponse.json({ ok: true, whatsapp: "skipped" });
    }

    const name = field(body.name, LIMITS.name);
    const message = field(body.message, LIMITS.message);
    const phone = field(body.phone, LIMITS.phone).replace(/\s+/g, "") || null;
    const business = field(body.business, LIMITS.business) || null;

    if (!name || !message) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    if (phone && !/^\+?[\d()-]{7,20}$/.test(phone)) {
      return NextResponse.json({ error: "Teléfono no válido" }, { status: 400 });
    }

    const lead = { name, phone, business, message };
    const serviceSlug = field(body.service, 60);
    const service = services.some((s) => s.slug === serviceSlug) ? serviceSlug : null;
    const campaign = await adCampaignFrom(request);

    const supabase = getSupabase();
    let { error } = await supabase.from("leads").insert({ ...lead, service, ad_campaign_id: campaign?.id ?? null });
    // Si la migración de marketing todavía no se corrió, se guarda el lead sin atribución.
    if (error && /column .* (service|ad_campaign_id)|schema cache|Could not find the/i.test(error.message)) {
      ({ error } = await supabase.from("leads").insert(lead));
    }

    if (error) {
      console.error("lead insert", error);
      return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
    }

    // Pixel de Meta (Conversions API): solo con permiso de cookies; teléfono con hash SHA-256.
    await sendPixelEvent("Lead", { phone }, pixelContext(request, service ? `/servicios/${service}` : "/"), safeEventId(body.eventId));

    let whatsapp: "sent" | "failed" | "skipped" = "skipped";
    if (isCallMeBotConfigured()) {
      const origin = [service ? `Servicio: ${service}` : null, campaign ? `Anuncio: ${campaign.headline.slice(0, 60)}` : null].filter(Boolean).join(" · ");
      const result = await sendCallMeBotWhatsApp(
        formatLeadWhatsAppMessage({ ...lead, message: origin ? `${lead.message}\n\n${origin}` : lead.message }),
      );
      whatsapp = result.ok ? "sent" : "failed";
    } else {
      console.warn(
        "CallMeBot no configurado: define CALLMEBOT_APIKEY (y opcional CALLMEBOT_PHONE)",
      );
    }

    return NextResponse.json({ ok: true, whatsapp });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
