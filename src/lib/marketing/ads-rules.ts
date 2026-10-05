import { AD_AUDIENCES, AD_LOCATIONS } from "./ad-locations";
import { AD_GOALS, isFollowerGoal, type AdGoal } from "./ad-goals";
import type { DesignStyle } from "./styles";
import type { AdAudience, AdCampaign, AdFund, AdLocation } from "./types";

// Reglas puras de Campañas pagadas (sin red ni base de datos): servidor, navegador y pruebas.

const DAY = 86_400_000;

/** Límites por campaña (MXN). El tope se puede subir con AD_MAX_BUDGET_MXN. */
export const AD_MIN_BUDGET_MXN = 100;
export const AD_MIN_DAILY_MXN = 20;

export function adMaxBudgetMxn() {
  const raw = Number(process.env.AD_MAX_BUDGET_MXN);
  return Number.isFinite(raw) && raw >= AD_MIN_BUDGET_MXN ? Math.floor(raw) : 5000;
}

/** Reglas de presupuesto y días; devuelve el error en español o null. */
export function budgetError(budgetMxn: number, days: number) {
  if (!Number.isInteger(days) || days < 1 || days > 30) return "Elige de 1 a 30 días.";
  if (!Number.isFinite(budgetMxn) || budgetMxn < AD_MIN_BUDGET_MXN) return `El presupuesto mínimo es de $${AD_MIN_BUDGET_MXN} MXN.`;
  if (budgetMxn > adMaxBudgetMxn()) return `El máximo por campaña es de $${adMaxBudgetMxn().toLocaleString("es-MX")} MXN.`;
  if (budgetMxn / days < AD_MIN_DAILY_MXN) return `Meta pide al menos $${AD_MIN_DAILY_MXN} MXN por día: con ${days} días, pon $${days * AD_MIN_DAILY_MXN} MXN o más.`;
  return null;
}

type Words = { headline: string; subline: string; message: string };

/** Textos base por servicio (salen de src/content/services.ts y la guía; nada inventado). */
const SERVICE_WORDS: Record<AdAudience, (place: string, local: boolean) => Words> = {
  cctv: (place, local) => ({
    headline: "Cámaras con vista en tu celular",
    subline: local ? `Instalación de CCTV en ${place} para hogares y negocios.` : "Instalación de CCTV para hogares y negocios.",
    message: `Protege tu casa o negocio${local ? ` en ${place}` : ""} con cámaras de seguridad bien instaladas: diseño, instalación y acceso remoto desde tu celular. Cotiza gratis con ATRIX Technologies.`,
  }),
  soporte: (place, local) => ({
    headline: "¿Tu equipo falla? Te ayudamos hoy",
    subline: "Soporte técnico rápido, en sitio o remoto, para PCs y laptops.",
    message: `Diagnóstico, reparación y mantenimiento de computadoras${local ? ` en ${place}` : ""}. Soporte a domicilio o remoto para que tu equipo vuelva a trabajar sin demoras.`,
  }),
  redes: (place, local) => ({
    headline: "Wi-Fi y red estables para tu negocio",
    subline: "Cableado estructurado, WiFi empresarial y equipos de red.",
    message: `Internet estable, cobertura real y una red ordenada${local ? ` en ${place}` : ""}: cableado estructurado, WiFi para empresa u hogar y configuración de routers y switches.`,
  }),
  software: (place, local) => ({
    headline: "Tu sistema, app o página a la medida",
    subline: "Sitios, paneles y sistemas que captan clientes y ordenan tu operación.",
    message: `Diseñamos y desarrollamos sitios web, apps y sistemas a la medida para negocios${local ? ` de ${place}` : ""}: presencia web con SEO local, paneles, portales e intranets en producción.`,
  }),
  empresas: (place, local) => ({
    headline: "Tu área de TI sin contratar un equipo",
    subline: "Soporte IT empresarial: mantenimiento, respaldos y seguridad.",
    message: `ATRIX como tu departamento de sistemas${local ? ` en ${place}` : ""}: mantenimiento preventivo, respaldos, seguridad básica y atención prioritaria, sin personal de planta.`,
  }),
};

/** Palabras del anuncio para un servicio, lugar y objetivo (el admin las puede editar). */
export function adDefaults(audience: AdAudience, location: AdLocation, goal: AdGoal = "clics"): Words {
  const place = AD_LOCATIONS[location].short;
  const local = location !== "mx";
  if (goal === "interaccion") return { headline: "", subline: "", message: "" };
  if (goal === "seguidores_fb" || goal === "perfil_ig") {
    const where = goal === "seguidores_fb" ? "Facebook" : "Instagram";
    return {
      headline: "Consejos de tecnología cada semana",
      subline: `Síguenos en ${where}: soporte, cámaras, redes y plataformas digitales.`,
      message: `Síguenos en ${where}. Compartimos consejos de tecnología para hogares y negocios${local ? ` de ${place}` : ""}, casos reales y novedades de ATRIX Technologies.`,
    };
  }
  if (goal === "alcance") {
    return {
      headline: local ? `Tecnología para ${place}` : "Conoce ATRIX Technologies",
      subline: "Soporte, CCTV, redes y plataformas digitales para hogares y empresas.",
      message: `ATRIX Technologies: soporte técnico, cámaras de seguridad, redes y plataformas digitales${local ? ` en ${place}` : ""}. Tecnología que opera y vende por tu negocio.`,
    };
  }
  const words = SERVICE_WORDS[audience](place, local);
  if (goal === "whatsapp") return { ...words, message: `${words.message} Escríbenos por WhatsApp y te respondemos.` };
  return words;
}

/** Otras palabras para el flyer cuando la IA está apagada ("Rediseñar flyer" toma el siguiente par). */
export function adAlternateWords(audience: AdAudience, location: AdLocation, currentHeadline: string, goal: AdGoal = "clics") {
  const place = AD_LOCATIONS[location].short;
  const local = location !== "mx";
  const base = adDefaults(audience, location, goal);
  const service = AD_AUDIENCES[audience].short;
  const options = [
    { headline: base.headline, subline: base.subline },
    { headline: local ? `${service} en ${place}` : `${service} profesional`, subline: "Diagnóstico claro, instalación profesional y seguimiento." },
    { headline: "Cotiza sin compromiso", subline: `${service} para hogares y negocios. Escríbenos por WhatsApp.` },
  ];
  const index = options.findIndex((row) => row.headline === currentHeadline);
  const next = options[(index + 1) % options.length];
  return { headline: next.headline, subline: next.subline };
}

/** Inicio en 10 minutos (Meta no acepta fechas pasadas) y fin a los días elegidos. */
export function datesFrom(now: Date, days: number) {
  const start = new Date(now.getTime() + 10 * 60_000);
  return { startAt: start.toISOString(), endAt: new Date(start.getTime() + days * DAY).toISOString() };
}

/** Segmentación de Meta: ciudad con radio (o país), edades de quien decide y solo feeds. */
export function targetingSpec(location: AdLocation, cityKey: string | null) {
  const info = AD_LOCATIONS[location];
  const geo = cityKey ? { cities: [{ key: cityKey, radius: info.radiusKm ?? 25, distance_unit: "kilometer" }] } : { countries: [info.country] };
  return {
    geo_locations: geo,
    age_min: 21,
    age_max: 65,
    publisher_platforms: ["facebook", "instagram"],
    facebook_positions: ["feed"],
    instagram_positions: ["stream"],
    // Respeta la ciudad y el radio elegidos (sin "Advantage+ audience").
    targeting_automation: { advantage_audience: 0 },
  };
}

export function newCampaign(input: {
  createdBy: string;
  audience: AdAudience;
  location: AdLocation;
  headline: string;
  subline: string;
  message: string;
  budgetMxn: number;
  days: number;
  style?: DesignStyle;
  goal?: AdGoal;
  post?: { id: string; title: string; image: string } | null;
}): AdCampaign {
  return {
    id: globalThis.crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy,
    goal: input.goal ?? "clics",
    audience: input.audience,
    location: input.location,
    headline: input.headline,
    subline: input.subline,
    message: input.message,
    style: input.style ?? "azul",
    designVersion: 0,
    postId: input.post?.id ?? null,
    postTitle: input.post?.title ?? null,
    postImage: input.post?.image ?? null,
    budgetMxn: Math.floor(input.budgetMxn),
    days: input.days,
    status: "borrador",
    meta: null,
    error: null,
    activatedAt: null,
    activatedBy: null,
    startAt: null,
    endAt: null,
    stats: null,
    followers: null,
  };
}

export function campaignName(campaign: Pick<AdCampaign, "goal" | "audience" | "location" | "createdAt">) {
  return `ATRIX · ${AD_GOALS[campaign.goal].label} · ${AD_AUDIENCES[campaign.audience].short} · ${AD_LOCATIONS[campaign.location].short} · ${campaign.createdAt.slice(0, 10)}`;
}

/** Seguidores que sumó la campaña en su red (lectura al activar contra la última). */
export function followersGained(campaign: Pick<AdCampaign, "goal" | "followers">) {
  const f = campaign.followers;
  if (!f || !isFollowerGoal(campaign.goal)) return null;
  const [start, now] = campaign.goal === "seguidores_fb" ? [f.fbStart, f.fb] : [f.igStart, f.ig];
  return start == null || now == null ? null : { start, now, gained: now - start };
}

export type CampaignMeasure = { visits: number; leads: number; whatsapp: number };

/**
 * Embudo de una campaña: vistas → clics → visitas → cotizaciones → clics a WhatsApp, cada paso con
 * su tasa contra el anterior (null cuando el anterior es 0). WhatsApp se compara con las visitas.
 */
export function campaignFunnel(campaign: Pick<AdCampaign, "stats">, measure: CampaignMeasure | undefined) {
  const steps = [
    { key: "vistas", label: "Vistas", value: campaign.stats?.impressions ?? 0 },
    { key: "clics", label: "Clics", value: campaign.stats?.clicks ?? 0 },
    { key: "visitas", label: "Visitas", value: measure?.visits ?? 0 },
    { key: "cotizaciones", label: "Cotizaciones", value: measure?.leads ?? 0 },
    { key: "whatsapp", label: "Clics a WhatsApp", value: measure?.whatsapp ?? 0 },
  ];
  return steps.map((step, i) => {
    const before = step.key === "whatsapp" ? steps[2].value : i ? steps[i - 1].value : 0;
    const rate = before ? Math.round((step.value / before) * 1000) / 10 : null;
    return { ...step, rate };
  });
}

/** Recargas anotadas y lo que queda estimado después del gasto de Meta. */
export function adFundsSummary(spentMxn: number, entries: AdFund[]) {
  const addedMxn = Math.round(entries.reduce((sum, row) => sum + row.amountMxn, 0) * 100) / 100;
  const leftMxn = Math.round((addedMxn - spentMxn) * 100) / 100;
  return { addedMxn, leftMxn: entries.length ? leftMxn : null, entries: [...entries].sort((a, b) => (a.at < b.at ? 1 : -1)) };
}

/** Presupuesto apartado por campañas creadas en Meta que no han terminado (MXN). */
export function reservedBudgetMxn(campaigns: Pick<AdCampaign, "status" | "budgetMxn" | "stats">[]) {
  return campaigns.filter((row) => row.status === "activa" || row.status === "pausada").reduce((sum, row) => sum + Math.max(0, row.budgetMxn - (row.stats?.spend ?? 0)), 0);
}
