// De dónde llegó una visita (PageViewTracker → page_views.source). Puro, seguro para el navegador.

export type VisitSource = "anuncios" | "facebook" | "instagram" | "google" | "whatsapp" | "directo" | "otro";

export const SOURCE_LABEL: Record<VisitSource, string> = {
  anuncios: "Anuncios de Meta",
  facebook: "Facebook",
  instagram: "Instagram",
  google: "Google",
  whatsapp: "WhatsApp",
  directo: "Directo",
  otro: "Otros sitios",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** utm_campaign solo cuenta si es el id (UUID) de una campaña del panel. */
export function campaignFromUtm(value: string | null | undefined) {
  const v = (value ?? "").trim();
  return UUID.test(v) ? v.toLowerCase() : null;
}

/** El enlace del anuncio, una etiqueta UTM, el fbclid de Facebook o el sitio que refirió. */
export function visitSource(input: { utmSource?: string | null; utmMedium?: string | null; fbclid?: boolean; referrer?: string | null; host?: string | null }): VisitSource {
  const utm = (input.utmSource ?? "").toLowerCase();
  const medium = (input.utmMedium ?? "").toLowerCase();
  if ((utm === "meta" || utm === "facebook" || utm === "instagram") && /paid|cpc|ads?/.test(medium)) return "anuncios";
  if (utm.includes("instagram")) return "instagram";
  if (utm.includes("facebook") || utm === "meta") return "facebook";
  if (utm.includes("google")) return "google";
  if (utm.includes("whatsapp")) return "whatsapp";
  let ref = "";
  try {
    ref = input.referrer ? new URL(input.referrer).hostname.toLowerCase() : "";
  } catch {
    ref = "";
  }
  if (ref && input.host && (ref === input.host || ref.endsWith(`.${input.host}`) || input.host.endsWith(`.${ref}`))) ref = "";
  if (/(^|\.)instagram\.com$/.test(ref)) return "instagram";
  if (/(^|\.)(facebook\.com|fb\.com|fb\.me|messenger\.com)$/.test(ref) || input.fbclid) return "facebook";
  if (/(^|\.)google\./.test(ref)) return "google";
  if (/(^|\.)(whatsapp\.com|wa\.me)$/.test(ref)) return "whatsapp";
  if (!ref) return "directo";
  return "otro";
}

export function isVisitSource(value: unknown): value is VisitSource {
  return typeof value === "string" && Object.hasOwn(SOURCE_LABEL, value);
}
