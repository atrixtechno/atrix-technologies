import { campaignFromUtm, visitSource, type VisitSource } from "./visit-source";

// Sesión de la visita en el navegador (solo con permiso de cookies): un id por pestaña y el origen
// de la primera página (utm_* / fbclid / referrer), para atribuir las visitas a una campaña.

const KEY = "atrix_visit_v1";

type Visit = { sessionId: string; source: VisitSource; campaign: string | null };

function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function currentVisit(): Visit {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(KEY) ?? "null") as Visit | null;
    if (saved?.sessionId) return saved;
  } catch {
    /* sin almacenamiento: se calcula cada vez */
  }
  const params = new URLSearchParams(window.location.search);
  const visit: Visit = {
    sessionId: newId(),
    source: visitSource({
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      fbclid: params.has("fbclid"),
      referrer: document.referrer || null,
      host: window.location.hostname,
    }),
    campaign: campaignFromUtm(params.get("utm_campaign")),
  };
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(visit));
  } catch {
    /* ignorar */
  }
  return visit;
}

export function newEventId() {
  return newId();
}
