import { NextResponse } from "next/server";
import {
  formatLeadWhatsAppMessage,
  isCallMeBotConfigured,
  sendCallMeBotWhatsApp,
} from "@/lib/callmebot";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const message = String(body.message ?? "").trim();
    const phoneRaw = String(body.phone ?? "").replace(/\s+/g, "").trim();
    const phone = phoneRaw || null;
    const business = String(body.business ?? "").trim() || null;

    if (!name || !message) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
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
