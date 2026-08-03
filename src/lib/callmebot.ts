/**
 * CallMeBot — envía un WhatsApp a tu número vía API HTTP.
 * Docs: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 *
 * Activación (una sola vez):
 * 1. Agrega el bot +34 684 783 347 a contactos
 * 2. Envíale: I allow callmebot to send me messages
 * 3. El bot responde con tu APIKEY
 * 4. Pon CALLMEBOT_PHONE y CALLMEBOT_APIKEY en .env.local / Vercel
 */

const ENDPOINT = "https://api.callmebot.com/whatsapp.php";

export function isCallMeBotConfigured() {
  return Boolean(
    process.env.CALLMEBOT_APIKEY?.trim() &&
      (process.env.CALLMEBOT_PHONE?.trim() ||
        process.env.NEXT_PUBLIC_WHATSAPP?.trim()),
  );
}

export async function sendCallMeBotWhatsApp(text: string): Promise<{
  ok: boolean;
  status?: number;
  body?: string;
  skipped?: boolean;
}> {
  const apikey = process.env.CALLMEBOT_APIKEY?.trim();
  const phoneRaw =
    process.env.CALLMEBOT_PHONE?.trim() ||
    process.env.NEXT_PUBLIC_WHATSAPP?.trim();

  if (!apikey || !phoneRaw) {
    return { ok: false, skipped: true };
  }

  // CallMeBot: usar el número como en la activación (ej. 5218671793155)
  const phone = phoneRaw.replace(/^\+/, "").replace(/\s+/g, "");

  const url = new URL(ENDPOINT);
  url.searchParams.set("source", "atrix");
  url.searchParams.set("phone", phone);
  url.searchParams.set("apikey", apikey);
  url.searchParams.set("text", text);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    const body = (await res.text()).slice(0, 500);
    const ok = res.ok;
    if (!ok) {
      console.error("callmebot error", res.status, body);
    }
    return { ok, status: res.status, body };
  } catch (err) {
    console.error("callmebot fetch", err);
    return { ok: false };
  }
}

export function formatLeadWhatsAppMessage(lead: {
  name: string;
  phone: string | null;
  business: string | null;
  message: string;
}) {
  const lines = [
    "*Nuevo contacto — ATRIX*",
    "",
    `*Nombre:* ${lead.name}`,
    lead.phone ? `*Teléfono:* ${lead.phone}` : null,
    lead.business ? `*Negocio:* ${lead.business}` : null,
    "",
    "*Mensaje:*",
    lead.message,
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}
