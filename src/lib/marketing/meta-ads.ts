// Campañas pagadas con la API de marketing de Meta (Admin → Campañas, ver ads.ts).
// Configuración en Vercel (la pone el dueño; nunca en el código):
//   META_AD_ACCOUNT_ID   cuenta publicitaria de ATRIX ("act_123…" o solo el número), en MXN
//   META_ADS_TOKEN       token del usuario del sistema con ads_management (Secret)
//   META_WHATSAPP_LINKED "true" cuando el WhatsApp Business está vinculado a la página (objetivo WhatsApp)
//   META_PAGE_ID / META_IG_USER_ID / META_GRAPH_VERSION se comparten con social-meta.ts.
// Todo se crea EN PAUSA; solo gasta después de que un admin presiona "Activar".

import type { AdGoal } from "./ad-goals";

export function adsConfig() {
  const account = process.env.META_AD_ACCOUNT_ID?.trim().replace(/^act_/, "") ?? "";
  return {
    account,
    token: process.env.META_ADS_TOKEN?.trim() ?? "",
    pageId: process.env.META_PAGE_ID?.trim() ?? "",
    igUserId: process.env.META_IG_USER_ID?.trim() ?? "",
    version: process.env.META_GRAPH_VERSION?.trim() || "v23.0",
    whatsappLinked: process.env.META_WHATSAPP_LINKED?.trim() === "true",
  };
}

export function adsConfigured() {
  const c = adsConfig();
  return Boolean(c.account && c.token && c.pageId);
}

/** Facturación de la cuenta en Meta: pagar saldo o agregar fondos prepagados. */
export function billingUrl() {
  const c = adsConfig();
  return c.account
    ? `https://business.facebook.com/billing_hub/accounts/details/?asset_id=${c.account}&payment_account_id=${c.account}`
    : "https://business.facebook.com/billing_hub";
}

/** Página de Meta para agregar o cambiar la tarjeta de la cuenta. */
export function paymentMethodsUrl() {
  const c = adsConfig();
  return c.account ? `https://business.facebook.com/billing_hub/payment_methods?asset_id=${c.account}` : "https://business.facebook.com/billing_hub/payment_methods";
}

type Json = Record<string, unknown> & { error?: { message?: string; error_user_msg?: string } };

export async function adsGraph(path: string, params: Record<string, string> = {}, method: "GET" | "POST" | "DELETE" = "POST"): Promise<Json> {
  const c = adsConfig();
  const url = `https://graph.facebook.com/${c.version}/${path}`;
  const body = new URLSearchParams({ ...params, access_token: c.token });
  const res =
    method === "POST"
      ? await fetch(url, { method: "POST", body, signal: AbortSignal.timeout(30_000) })
      : await fetch(`${url}?${body.toString()}`, { method, signal: AbortSignal.timeout(20_000) });
  const json = (await res.json().catch(() => ({}))) as Json;
  if (!res.ok || json.error) {
    const message = json.error?.error_user_msg || json.error?.message || `Meta respondió ${res.status}`;
    throw new Error(message.slice(0, 300));
  }
  return json;
}

export type AdAccountInfo = {
  name: string;
  currency: string;
  active: boolean;
  status: string;
  spentMxn: number;
  dueMxn: number;
  spendCapMxn: number | null;
  /** Tarjeta o fondos como Meta los describe (p. ej. "Mastercard *5823"); nunca números completos. */
  paymentLabel: string | null;
  storedBalanceMxn: number | null;
  prepaid: boolean;
  hasPayment: boolean;
};

const ACCOUNT_STATUS: Record<number, string> = {
  1: "Activa",
  2: "Deshabilitada",
  3: "Con pago pendiente",
  7: "En revisión de riesgo",
  8: "Pendiente de liquidación",
  9: "En periodo de gracia",
  100: "Pendiente de cierre",
  101: "Cerrada",
};

const BASE_FIELDS = "name,currency,account_status,amount_spent,balance,spend_cap,is_prepay_account";

/** Nombre, estado y dinero de la cuenta publicitaria. Meta puede ocultar el método de pago. */
export async function adAccountInfo(): Promise<AdAccountInfo> {
  const c = adsConfig();
  let row: Json = {};
  let paymentKnown = true;
  for (const fields of [`${BASE_FIELDS},funding_source_details{id,type,display_string,amount,display_amount}`, `${BASE_FIELDS},funding_source_details`]) {
    try {
      row = await adsGraph(`act_${c.account}`, { fields }, "GET");
      break;
    } catch {
      row = {};
    }
  }
  if (!Object.keys(row).length) {
    row = await adsGraph(`act_${c.account}`, { fields: BASE_FIELDS }, "GET");
    paymentKnown = false;
  }
  const status = Number(row.account_status ?? 0);
  const cents = (value: unknown) => Number(value ?? 0) / 100;
  const funding = (row.funding_source_details ?? null) as { display_string?: string; type?: number | string; amount?: string | number } | null;
  // Tipo 20 = STORED_BALANCE (fondos prepagados); el monto viene en centavos.
  const stored = funding && Number(funding.type) === 20 && funding.amount != null ? cents(funding.amount) : null;
  const cap = cents(row.spend_cap);
  return {
    name: String(row.name ?? ""),
    currency: String(row.currency ?? ""),
    active: status === 1,
    status: ACCOUNT_STATUS[status] ?? `Estado ${status}`,
    spentMxn: cents(row.amount_spent),
    dueMxn: cents(row.balance),
    spendCapMxn: cap > 0 ? cap : null,
    paymentLabel: funding?.display_string ? String(funding.display_string).slice(0, 80) : null,
    storedBalanceMxn: stored,
    prepaid: Boolean(row.is_prepay_account),
    hasPayment: paymentKnown ? Boolean(funding) : status === 1,
  };
}

/** Clave de ciudad de Meta (México o Estados Unidos). */
export async function findCityKey(city: string, region: string, country: "MX" | "US" = "MX") {
  const found = await adsGraph("search", { type: "adgeolocation", location_types: JSON.stringify(["city"]), q: city, country_code: country, limit: "10" }, "GET");
  const rows = (Array.isArray(found.data) ? found.data : []) as { key?: string; name?: string; region?: string }[];
  const match =
    rows.find((row) => row.name?.toLowerCase() === city.toLowerCase() && row.region?.toLowerCase().includes(region.toLowerCase())) ??
    rows.find((row) => row.name?.toLowerCase() === city.toLowerCase());
  if (!match?.key) throw new Error(`Meta no encontró la ciudad ${city}.`);
  return String(match.key);
}

/** Sube la imagen del anuncio; devuelve su hash. */
export async function uploadAdImage(jpeg: Buffer) {
  const c = adsConfig();
  const out = await adsGraph(`act_${c.account}/adimages`, { bytes: jpeg.toString("base64") });
  const images = (out.images ?? {}) as Record<string, { hash?: string }>;
  const hash = Object.values(images)[0]?.hash;
  if (!hash) throw new Error("Meta no devolvió la imagen del anuncio.");
  return hash;
}

export type AdBuild = {
  name: string;
  lifetimeBudgetCents: number;
  startAt: string;
  endAt: string;
  targeting: Record<string, unknown>;
  imageHash: string;
  link: string;
  message: string;
  headline: string;
  description: string;
  goal?: AdGoal;
  /** "cotizaciones": Pixel de ATRIX que cuenta el evento Lead. */
  conversionPixelId?: string;
  /** "interaccion": la publicación de Facebook a promocionar ("<page>_<post>"). */
  postId?: string;
  /** "perfil_ig": usuario de Instagram que abre el anuncio. */
  igUsername?: string;
  /** "whatsapp": el WhatsApp Business está vinculado a la página. */
  whatsappLinked?: boolean;
};

type Ids = { pageId: string; igUserId: string };

/**
 * Cómo se arma cada objetivo en Meta (puro, para pruebas): objetivo de campaña, optimización y
 * destino del conjunto, dónde se muestra y el creativo.
 *  clics          Tráfico → clics al enlace (botón "Cotizar")
 *  cotizaciones   Clientes potenciales → conversiones del Pixel (LEAD)
 *  whatsapp       Interacción → conversaciones en WhatsApp
 *  seguidores_fb  Interacción → "Me gusta" de la página (solo Facebook)
 *  perfil_ig      Tráfico → visitas al perfil de Instagram (solo Instagram)
 *  interaccion    Interacción → interacción con una publicación existente
 *  alcance        Reconocimiento → alcance (botón "Más información")
 */
export function goalSettings(input: AdBuild, ids: Ids) {
  const goal: AdGoal = input.goal ?? "clics";
  const linkCreative = (link: string, cta: Record<string, unknown>) => ({
    object_story_spec: {
      page_id: ids.pageId,
      ...(ids.igUserId ? { instagram_user_id: ids.igUserId } : {}),
      link_data: { link, message: input.message, name: input.headline, description: input.description, image_hash: input.imageHash, call_to_action: cta },
    },
  });
  const quote = { type: "GET_QUOTE", value: { link: input.link } };
  switch (goal) {
    case "cotizaciones":
      if (!input.conversionPixelId) throw new Error("Falta conectar el Pixel de Meta para optimizar por cotizaciones.");
      return {
        objective: "OUTCOME_LEADS",
        adSet: {
          optimization_goal: "OFFSITE_CONVERSIONS",
          destination_type: "WEBSITE",
          promoted_object: JSON.stringify({ pixel_id: input.conversionPixelId, custom_event_type: "LEAD" }),
        },
        placements: null,
        creative: linkCreative(input.link, quote),
      };
    case "whatsapp":
      if (!input.whatsappLinked) throw new Error("Vincula el WhatsApp Business a la página de Facebook (y META_WHATSAPP_LINKED=true en Vercel).");
      return {
        objective: "OUTCOME_ENGAGEMENT",
        adSet: { optimization_goal: "CONVERSATIONS", destination_type: "WHATSAPP", promoted_object: JSON.stringify({ page_id: ids.pageId }) },
        placements: null,
        creative: linkCreative("https://api.whatsapp.com/send", { type: "WHATSAPP_MESSAGE", value: { app_destination: "WHATSAPP" } }),
      };
    case "seguidores_fb":
      return {
        objective: "OUTCOME_ENGAGEMENT",
        adSet: { optimization_goal: "PAGE_LIKES", destination_type: "ON_PAGE", promoted_object: JSON.stringify({ page_id: ids.pageId }) },
        placements: { publisher_platforms: ["facebook"], facebook_positions: ["feed"] },
        creative: {
          object_story_spec: {
            page_id: ids.pageId,
            link_data: {
              link: `https://www.facebook.com/${ids.pageId}`,
              message: input.message,
              name: input.headline,
              description: input.description,
              image_hash: input.imageHash,
              call_to_action: { type: "LIKE_PAGE", value: { page: ids.pageId } },
            },
          },
        },
      };
    case "perfil_ig": {
      if (!ids.igUserId) throw new Error("Falta conectar Instagram (META_IG_USER_ID) para esta campaña.");
      if (!input.igUsername) throw new Error("Falta el usuario de Instagram (prueba la conexión en Marketing en redes).");
      const profile = `https://www.instagram.com/${input.igUsername}`;
      return {
        objective: "OUTCOME_TRAFFIC",
        adSet: { optimization_goal: "VISIT_INSTAGRAM_PROFILE", destination_type: "INSTAGRAM_PROFILE" },
        placements: { publisher_platforms: ["instagram"], instagram_positions: ["stream", "story", "explore"] },
        creative: linkCreative(profile, { type: "VIEW_INSTAGRAM_PROFILE", value: { link: profile } }),
      };
    }
    case "interaccion":
      if (!input.postId) throw new Error("Elige la publicación de Facebook que quieres promocionar.");
      return {
        objective: "OUTCOME_ENGAGEMENT",
        adSet: { optimization_goal: "POST_ENGAGEMENT", destination_type: "ON_POST" },
        placements: null,
        creative: { object_story_id: input.postId, ...(ids.igUserId ? { instagram_user_id: ids.igUserId } : {}) },
      };
    case "alcance":
      return {
        objective: "OUTCOME_AWARENESS",
        adSet: { optimization_goal: "REACH" },
        placements: null,
        creative: linkCreative(input.link, { type: "LEARN_MORE", value: { link: input.link } }),
      };
    default:
      return {
        objective: "OUTCOME_TRAFFIC",
        adSet: { optimization_goal: "LINK_CLICKS", destination_type: "WEBSITE" },
        placements: null,
        creative: linkCreative(input.link, quote),
      };
  }
}

/** Campaña → conjunto → creativo → anuncio, todo EN PAUSA. Si algo falla, se borra lo creado. */
export async function createPausedAd(input: AdBuild) {
  const c = adsConfig();
  const act = `act_${c.account}`;
  const settings = goalSettings(input, { pageId: c.pageId, igUserId: c.igUserId });
  const ids: { campaignId?: string; adSetId?: string; creativeId?: string; adId?: string } = {};
  try {
    const campaign = await adsGraph(`${act}/campaigns`, {
      name: input.name,
      objective: settings.objective,
      buying_type: "AUCTION",
      status: "PAUSED",
      // ATRIX no anuncia empleo, vivienda ni crédito: sin categoría especial.
      special_ad_categories: JSON.stringify([]),
      is_adset_budget_sharing_enabled: "false",
    });
    ids.campaignId = String(campaign.id ?? "");
    const adSet = await adsGraph(`${act}/adsets`, {
      name: input.name,
      campaign_id: ids.campaignId,
      lifetime_budget: String(input.lifetimeBudgetCents),
      start_time: input.startAt,
      end_time: input.endAt,
      billing_event: "IMPRESSIONS",
      bid_strategy: "LOWEST_COST_WITHOUT_CAP",
      ...(settings.adSet as Record<string, string>),
      targeting: JSON.stringify({ ...input.targeting, ...(settings.placements ?? {}) }),
      status: "PAUSED",
    });
    ids.adSetId = String(adSet.id ?? "");
    const creativeSpec = settings.creative as Record<string, unknown>;
    const creative = await adsGraph(`${act}/adcreatives`, {
      name: input.name,
      ...Object.fromEntries(Object.entries(creativeSpec).map(([key, value]) => [key, typeof value === "string" ? value : JSON.stringify(value)])),
    });
    ids.creativeId = String(creative.id ?? "");
    const ad = await adsGraph(`${act}/ads`, {
      name: input.name,
      adset_id: ids.adSetId,
      creative: JSON.stringify({ creative_id: ids.creativeId }),
      status: "PAUSED",
    });
    ids.adId = String(ad.id ?? "");
    return ids;
  } catch (error) {
    if (ids.campaignId) await adsGraph(ids.campaignId, {}, "DELETE").catch(() => null);
    throw error;
  }
}

/**
 * Empieza a gastar: la fecha de fin pasa a "ahora + días" y luego anuncio → conjunto → campaña
 * ACTIVE. La fecha de inicio no se toca: Meta no deja cambiarla a menos de 15 minutos.
 */
export async function activateAd(ids: { campaignId: string; adSetId: string; adId: string }, endAt: string) {
  try {
    await adsGraph(ids.adSetId, { end_time: endAt, status: "ACTIVE" });
  } catch {
    // Recién creada, Meta bloquea las fechas: se enciende con las fechas con que se creó.
    await adsGraph(ids.adSetId, { status: "ACTIVE" });
  }
  await adsGraph(ids.adId, { status: "ACTIVE" });
  await adsGraph(ids.campaignId, { status: "ACTIVE" });
  const set = await adsGraph(ids.adSetId, { fields: "start_time,end_time" }, "GET").catch(() => ({}) as Record<string, unknown>);
  const iso = (value: unknown) => (typeof value === "string" && !Number.isNaN(Date.parse(value)) ? new Date(value).toISOString() : null);
  return { startAt: iso(set.start_time), endAt: iso(set.end_time) };
}

export async function pauseAd(campaignId: string) {
  await adsGraph(campaignId, { status: "PAUSED" });
}

/** Gasto (MXN), alcance, impresiones, clics al enlace y acciones desde el inicio. */
export async function campaignInsights(campaignId: string) {
  const out = await adsGraph(`${campaignId}/insights`, { fields: "spend,reach,impressions,inline_link_clicks,actions", date_preset: "maximum" }, "GET");
  const row = ((Array.isArray(out.data) ? out.data[0] : null) ?? {}) as Record<string, unknown>;
  const actions: Record<string, number> = {};
  for (const item of Array.isArray(row.actions) ? (row.actions as { action_type?: string; value?: string }[]) : []) {
    if (item.action_type) actions[item.action_type] = Number(item.value ?? 0);
  }
  return {
    spend: Number(row.spend ?? 0),
    reach: Number(row.reach ?? 0),
    impressions: Number(row.impressions ?? 0),
    clicks: Number(row.inline_link_clicks ?? 0),
    actions,
  };
}

/** El número principal de una campaña según su objetivo. */
export function goalResult(goal: AdGoal, stats: { reach: number; clicks: number; actions?: Record<string, number> }) {
  const a = stats.actions ?? {};
  switch (goal) {
    case "seguidores_fb":
      return a.like ?? 0;
    case "perfil_ig":
      return a.ig_profile_visit ?? a.instagram_profile_visit ?? stats.clicks;
    case "interaccion":
      return a.post_engagement ?? 0;
    case "alcance":
      return stats.reach;
    case "cotizaciones":
      return a["offsite_conversion.fb_pixel_lead"] ?? a.lead ?? 0;
    case "whatsapp":
      return a["onsite_conversion.messaging_conversation_started_7d"] ?? 0;
    default:
      return stats.clicks;
  }
}
