import { NextResponse } from "next/server";
import {
  formatLeadWhatsAppMessage,
  isCallMeBotConfigured,
  sendCallMeBotWhatsApp,
} from "@/lib/callmebot";
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

    const supabase = getSupabase();
    const { error } = await supabase.from("leads").insert(lead);

    if (error) {
      console.error("lead insert", error);
      return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
    }

    let whatsapp: "sent" | "failed" | "skipped" = "skipped";
    if (isCallMeBotConfigured()) {
      const result = await sendCallMeBotWhatsApp(
        formatLeadWhatsAppMessage(lead),
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
