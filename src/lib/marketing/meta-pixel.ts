import { createHash, randomUUID } from "crypto";
import { site } from "@/content/site";
import { COOKIE_CONSENT_COOKIE } from "@/lib/cookie-consent";

// Pixel de Meta + Conversions API: le dice a Meta qué visitas de anuncios terminaron en una
// cotización (evento Lead: formulario de contacto o clic a WhatsApp), para que las campañas
// optimicen por clientes reales y no por clics.
// Solo para visitantes que aceptaron cookies ("Aceptar" → cookie atrix_cookie_consent=accepted);
// con "Solo necesarias" no se manda nada. Correo y teléfono van con hash SHA-256, como pide Meta.
//
//   META_PIXEL_ID / NEXT_PUBLIC_META_PIXEL_ID  id del conjunto de datos de ATRIX (no es secreto)
//   META_CAPI_TOKEN        opcional (Secret); por defecto usa META_ADS_TOKEN
//   META_TEST_EVENT_CODE   opcional; muestra los eventos en Administrador de eventos → Probar eventos

export function pixelConfig() {
  return {
    pixelId: process.env.META_PIXEL_ID?.trim() || process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || "",
    token: process.env.META_CAPI_TOKEN?.trim() || process.env.META_ADS_TOKEN?.trim() || "",
    testCode: process.env.META_TEST_EVENT_CODE?.trim() || "",
    version: process.env.META_GRAPH_VERSION?.trim() || "v23.0",
  };
}

export function pixelConfigured() {
  const c = pixelConfig();
  return Boolean(c.pixelId && c.token);
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

/** Normalización de Meta: correo en minúsculas; teléfono solo dígitos con lada de país (52 México). */
export function normalizedUserData(input: { email?: string | null; phone?: string | null; city?: string | null; externalId?: string | null }) {
  const out: Record<string, string[]> = {};
  const email = input.email?.trim().toLowerCase();
  if (email && email.includes("@")) out.em = [sha256(email)];
  let digits = (input.phone ?? "").replace(/\D/g, "");
  if (digits.length === 10) digits = `52${digits}`;
  if (digits.length >= 11) out.ph = [sha256(digits)];
  const city = input.city?.split(",")[0]?.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/gi, "").toLowerCase();
  if (city) out.ct = [sha256(city)];
  if (input.externalId) out.external_id = [sha256(input.externalId)];
  return out;
}

export type PixelContext = { consent: boolean; ip: string; userAgent: string; fbp: string; fbc: string; url: string };

function readCookie(header: string | null, name: string) {
  for (const part of (header ?? "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return "";
}

/** Lo que dice la petición: consentimiento, IP, navegador y las cookies de clic de Meta (_fbp / _fbc). */
export function pixelContext(request: Request, path = "/"): PixelContext {
  const cookie = request.headers.get("cookie");
  return {
    consent: readCookie(cookie, COOKIE_CONSENT_COOKIE) === "accepted",
    ip: (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || request.headers.get("x-real-ip") || "",
    userAgent: request.headers.get("user-agent") ?? "",
    fbp: readCookie(cookie, "_fbp"),
    fbc: readCookie(cookie, "_fbc"),
    url: `${site.url.replace(/\/$/, "")}${path.startsWith("/") ? path : "/"}`,
  };
}

/** Cuerpo de un evento de la Conversions API (puro, para pruebas). */
export function pixelEventBody(event: "Lead", user: Parameters<typeof normalizedUserData>[0], context: PixelContext, now = Date.now(), eventId: string = randomUUID()) {
  const userData: Record<string, unknown> = { ...normalizedUserData(user) };
  if (context.ip) userData.client_ip_address = context.ip;
  if (context.userAgent) userData.client_user_agent = context.userAgent;
  if (context.fbp) userData.fbp = context.fbp;
  if (context.fbc) userData.fbc = context.fbc;
  return {
    event_name: event,
    event_time: Math.floor(now / 1000),
    // El mismo id que manda el Pixel del navegador: Meta cuenta el evento una sola vez.
    event_id: eventId,
    action_source: "website",
    event_source_url: context.url,
    user_data: userData,
  };
}

/** Manda un evento. Nunca lanza ni tarda más de 4 s: medir anuncios es de mejor esfuerzo. */
export async function sendPixelEvent(event: "Lead", user: Parameters<typeof normalizedUserData>[0], context: PixelContext, eventId?: string, send: typeof fetch = fetch) {
  const c = pixelConfig();
  if (!c.pixelId || !c.token) return "off";
  if (!context.consent) return "no-consent";
  try {
    const body = new URLSearchParams({
      data: JSON.stringify([pixelEventBody(event, user, context, Date.now(), eventId)]),
      access_token: c.token,
      ...(c.testCode ? { test_event_code: c.testCode } : {}),
    });
    const res = await send(`https://graph.facebook.com/${c.version}/${c.pixelId}/events`, { method: "POST", body, signal: AbortSignal.timeout(4000) });
    return res.ok ? "sent" : "rejected";
  } catch {
    return "error";
  }
}

const EVENT_ID = /^[a-zA-Z0-9-]{8,64}$/;

/** Id de evento que manda el navegador (para no contar doble); si no es válido, uno nuevo. */
export function safeEventId(value: unknown) {
  return typeof value === "string" && EVENT_ID.test(value) ? value : randomUUID();
}
