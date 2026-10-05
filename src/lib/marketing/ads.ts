import { AD_AUDIENCES, AD_LOCATIONS } from "./ad-locations";
import { AD_GOALS, isFollowerGoal, type AdGoal } from "./ad-goals";
import { socialWords } from "./ai";
import { adAlternateWords, campaignName, datesFrom, targetingSpec, type CampaignMeasure } from "./ads-rules";
import { marketingCard } from "./card";
import { activateAd, adAccountInfo, adsConfig, adsConfigured, adsGraph, campaignInsights, createPausedAd, findCityKey, pauseAd, uploadAdImage } from "./meta-ads";
import { pixelConfig } from "./meta-pixel";
import { instagramUsername, profileFollowers } from "./social-meta";
import { postImageUrl, siteUrl } from "./social";
import { CONTACT_PHONE } from "./templates";
import { adsSettings, db, getCampaign, listCampaigns, listPosts, updateCampaign, writeSetting } from "./store";
import { nextStyle } from "./styles";
import type { AdCampaign } from "./types";

// Admin → Campañas pagadas: anuncios de Meta (feeds de Facebook e Instagram) que traen
// cotizaciones. El dinero nunca pasa por ATRIX: Meta cobra a la cuenta publicitaria (tarjeta o
// saldo prepagado, que el dueño agrega en Meta). Aquí el admin elige servicio, lugar, presupuesto
// total y días; el sitio arma la imagen, el texto y el botón y lo crea TODO EN PAUSA. Solo gasta
// después de "Activar", y nunca más que el presupuesto total.
// El anuncio lleva a /a/<id>, que recuerda la campaña 30 días para contar visitas y cotizaciones.

export const AD_COOKIE = "atrix_ad";
export const AD_COOKIE_DAYS = 30;

export function adLink(campaign: Pick<AdCampaign, "id">) {
  return `${siteUrl()}/a/${campaign.id}`;
}

export function adImageUrl(campaign: Pick<AdCampaign, "id" | "designVersion">, absolute = true) {
  const path = `/marketing/anuncio/${campaign.id}${campaign.designVersion ? `?v=${campaign.designVersion}` : ""}`;
  return absolute ? `${siteUrl()}${path}` : path;
}

const SERVICE_VISUAL: Record<AdCampaign["audience"], string> = {
  cctv: "/images/renders/cctv.webp",
  soporte: "/images/renders/soporte.webp",
  redes: "/images/renders/redes.webp",
  software: "/images/renders/software.webp",
  empresas: "/images/services/it-empresarial.jpg",
};

/** La imagen 1080×1350 del anuncio. */
export function adImage(campaign: Pick<AdCampaign, "audience" | "location" | "headline" | "subline" | "style" | "goal">) {
  const service = AD_AUDIENCES[campaign.audience];
  return marketingCard({
    kicker: campaign.location === "mx" ? service.short : AD_LOCATIONS[campaign.location].short,
    headline: campaign.headline,
    subline: campaign.subline,
    chips: [],
    cta: AD_GOALS[campaign.goal].cta || "Cotiza gratis en atrixnld.com",
    format: "feed",
    style: campaign.style,
    visual: isFollowerGoal(campaign.goal) || campaign.goal === "alcance" ? "/images/renders/software.webp" : SERVICE_VISUAL[campaign.audience],
    contactPhone: campaign.goal === "whatsapp" ? null : CONTACT_PHONE,
  });
}

/** Palabras nuevas del flyer: de la IA si está activa, si no el siguiente par alterno. */
export async function freshAdWords(input: Pick<AdCampaign, "audience" | "location" | "headline" | "subline"> & { goal?: AdGoal | null }, useAi = true) {
  const goal = input.goal ?? "clics";
  if (useAi) {
    const aim = goal === "seguidores_fb" ? " (invítalos a seguir la página de Facebook)" : goal === "perfil_ig" ? " (invítalos a seguir el Instagram)" : goal === "alcance" ? " (date a conocer)" : "";
    const who = `personas y negocios en ${AD_LOCATIONS[input.location].short} que necesitan ${AD_AUDIENCES[input.audience].label.toLowerCase()}${aim}`;
    const ai = await socialWords({ audience: who, headline: input.headline, subline: input.subline });
    if (ai) return ai;
  }
  return adAlternateWords(input.audience, input.location, input.headline, goal);
}

/** Publicaciones de Facebook que ya salieron desde Marketing en redes ("Promocionar una publicación"). */
export async function boostablePosts() {
  const posts = await listPosts().catch(() => []);
  return posts
    .flatMap((post) => {
      const fb = [...post.results].reverse().find((row) => row.destination === "fb" && row.ok && row.id);
      if (!fb?.id) return [];
      const title = (post.headline || post.caption || "Publicación").replace(/\s+/g, " ").trim().slice(0, 90);
      return [{ id: fb.id, title, image: postImageUrl(post, "feed", false), at: fb.at }];
    })
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 30);
}

/**
 * "Rediseñar flyer": siguiente estilo y palabras nuevas. Solo antes de activarse; si ya estaba
 * creada en Meta (en pausa) se borra esa copia y vuelve a "borrador" para subir el flyer nuevo.
 */
export async function redesignCampaign(id: string, useAi = true) {
  const campaign = await getCampaign(id);
  if (!campaign) return { ok: false, message: "No encontramos la campaña." };
  if (campaign.activatedAt) return { ok: false, message: "Ya estuvo activa: crea una campaña nueva con el flyer nuevo." };
  const words = await freshAdWords(campaign, useAi);
  const metaCampaignId = campaign.meta?.campaignId ?? null;
  if (metaCampaignId) await adsGraph(metaCampaignId, {}, "DELETE").catch(() => null);
  await updateCampaign(id, {
    headline: words.headline,
    subline: words.subline,
    style: nextStyle(campaign.style),
    designVersion: campaign.designVersion + 1,
    error: null,
    ...(metaCampaignId ? { meta: null, status: "borrador" } : {}),
  });
  return { ok: true, message: metaCampaignId ? "Flyer nuevo listo. Presiona «Crear en Meta» para subirlo." : "Flyer nuevo listo." };
}

async function cityKey(campaign: AdCampaign) {
  const info = AD_LOCATIONS[campaign.location];
  if (!info.city) return null;
  const settings = await adsSettings();
  const cached = settings.cityKeys[campaign.location];
  if (cached) return cached;
  const key = await findCityKey(info.city, info.region ?? "", info.country);
  await writeSetting("ads", { ...settings, cityKeys: { ...settings.cityKeys, [campaign.location]: key } });
  return key;
}

async function renderAdJpeg(campaign: AdCampaign) {
  const image = await adImage(campaign);
  return Buffer.from(await image.arrayBuffer());
}

/** Crea la campaña en Meta, EN PAUSA (todavía no gasta nada). */
export async function sendToMeta(id: string, now = new Date(), render: (campaign: AdCampaign) => Promise<Buffer> = renderAdJpeg) {
  const campaign = await getCampaign(id);
  if (!campaign) return { ok: false, message: "No encontramos la campaña." };
  if (!adsConfigured()) return { ok: false, message: "Falta conectar la cuenta publicitaria (META_AD_ACCOUNT_ID y META_ADS_TOKEN en Vercel). La campaña sigue guardada." };
  if (campaign.meta?.adId) return { ok: true, message: "Ya está creada en Meta." };
  try {
    // Los presupuestos se mandan en centavos de MXN: una cuenta en otra moneda gastaría otra cantidad.
    const account = await adAccountInfo();
    if (account.currency && account.currency !== "MXN") throw new Error(`La cuenta publicitaria está en ${account.currency}; para ATRIX debe estar en MXN.`);
    const goal = campaign.goal;
    const imageHash = AD_GOALS[goal].flyer ? await uploadAdImage(await render(campaign)) : "";
    const ids = await createPausedAd({
      name: campaignName(campaign),
      lifetimeBudgetCents: campaign.budgetMxn * 100,
      ...datesFrom(now, campaign.days),
      targeting: targetingSpec(campaign.location, await cityKey(campaign)),
      imageHash,
      link: adLink(campaign),
      message: campaign.message,
      headline: campaign.headline,
      description: campaign.subline,
      goal,
      ...(goal === "cotizaciones" && pixelConfig().pixelId ? { conversionPixelId: pixelConfig().pixelId } : {}),
      ...(campaign.postId ? { postId: campaign.postId } : {}),
      ...(goal === "perfil_ig" ? { igUsername: (await instagramUsername()) ?? undefined } : {}),
      whatsappLinked: adsConfig().whatsappLinked,
    });
    await updateCampaign(id, { meta: { ...ids, imageHash }, status: "pausada", error: null });
    return { ok: true, message: "Lista en Meta, en pausa. Presiona «Activar» para empezar." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Meta no aceptó la campaña.";
    await updateCampaign(id, { status: "error", error: message });
    return { ok: false, message };
  }
}

/** Empieza a gastar (las fechas cuentan desde ahora). */
export async function activateCampaign(id: string, by: string, now = new Date()) {
  const campaign = await getCampaign(id);
  const ids = campaign?.meta;
  if (!campaign || !ids?.campaignId || !ids.adSetId || !ids.adId) return { ok: false, message: "Primero crea la campaña en Meta." };
  if (campaign.status === "activa") return { ok: true, message: "Ya está activa." };
  if (campaign.status === "terminada") return { ok: false, message: "Esta campaña ya terminó. Crea una nueva." };
  const dates =
    campaign.activatedAt && campaign.endAt && new Date(campaign.endAt) > now ? { startAt: campaign.startAt ?? now.toISOString(), endAt: campaign.endAt } : datesFrom(now, campaign.days);
  try {
    const kept = await activateAd({ campaignId: ids.campaignId, adSetId: ids.adSetId, adId: ids.adId }, dates.endAt);
    // Campañas de seguidores: guarda cuántos había, para mostrar cuántos sumó.
    const counts = isFollowerGoal(campaign.goal) && !campaign.followers ? await profileFollowers().catch(() => null) : null;
    await updateCampaign(id, {
      ...(counts ? { followers: { fbStart: counts.fb, igStart: counts.ig, fb: counts.fb, ig: counts.ig, at: now.toISOString() } } : {}),
      status: "activa",
      activatedAt: campaign.activatedAt ?? now.toISOString(),
      activatedBy: by,
      startAt: kept.startAt ?? dates.startAt,
      endAt: kept.endAt ?? dates.endAt,
      error: null,
    });
    return { ok: true, message: `Activa: gastará como máximo $${campaign.budgetMxn.toLocaleString("es-MX")} MXN en ${campaign.days} días.` };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Meta no pudo activarla." };
  }
}

export async function pauseCampaign(id: string) {
  const campaign = await getCampaign(id);
  if (!campaign?.meta?.campaignId || campaign.status !== "activa") return { ok: false, message: "No está activa." };
  try {
    await pauseAd(campaign.meta.campaignId);
    await updateCampaign(id, { status: "pausada" });
    return { ok: true, message: "En pausa: ya no gasta." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Meta no pudo pausarla." };
  }
}

/** Actualiza gasto / alcance / clics de las campañas que corrieron (y marca las terminadas). */
export async function refreshCampaignStats(now = new Date(), onlyOlderThanMs = 0) {
  if (!adsConfigured()) return 0;
  const rows = (await listCampaigns()).filter(
    (row) => row.meta?.campaignId && row.activatedAt && (!row.stats || now.getTime() - new Date(row.stats.updatedAt).getTime() >= onlyOlderThanMs),
  );
  const followers = rows.some((row) => isFollowerGoal(row.goal) && row.status === "activa") ? await profileFollowers().catch(() => null) : null;
  for (const row of rows.slice(0, 10)) {
    try {
      const stats = await campaignInsights(row.meta!.campaignId!);
      await updateCampaign(row.id, {
        stats: { ...stats, updatedAt: now.toISOString() },
        ...(followers && row.followers && row.status === "activa"
          ? { followers: { ...row.followers, fb: followers.fb ?? row.followers.fb, ig: followers.ig ?? row.followers.ig, at: now.toISOString() } }
          : {}),
        ...(row.status === "activa" && row.endAt && new Date(row.endAt) <= now ? { status: "terminada" as const } : {}),
      });
    } catch {
      // Se quedan los últimos números; la siguiente actualización vuelve a intentar.
    }
  }
  return rows.length;
}

/** Visitas, cotizaciones y clics a WhatsApp de cada campaña (cookie de /a/<id> y utm_campaign). */
export async function measuresByCampaign(ids: string[]): Promise<Record<string, CampaignMeasure>> {
  const out: Record<string, CampaignMeasure> = {};
  if (!ids.length) return out;
  for (const id of ids) out[id] = { visits: 0, leads: 0, whatsapp: 0 };
  const [views, leads, clicks] = await Promise.all([
    db().from("page_views").select("campaign, session_id").in("campaign", ids).limit(20000),
    db().from("leads").select("ad_campaign_id").in("ad_campaign_id", ids).limit(5000),
    db().from("whatsapp_clicks").select("campaign").in("campaign", ids).limit(5000),
  ]);
  // Visitas = sesiones distintas (una persona que recorre 5 páginas cuenta una vez).
  const sessions = new Map<string, Set<string>>();
  let anonymous = 0;
  for (const row of (views.data ?? []) as { campaign: string | null; session_id: string | null }[]) {
    if (!row.campaign || !out[row.campaign]) continue;
    const set = sessions.get(row.campaign) ?? new Set<string>();
    set.add(row.session_id ?? `sin-sesion-${(anonymous += 1)}`);
    sessions.set(row.campaign, set);
  }
  for (const [id, set] of sessions) out[id].visits = set.size;
  for (const row of (leads.data ?? []) as { ad_campaign_id: string | null }[]) {
    if (row.ad_campaign_id && out[row.ad_campaign_id]) out[row.ad_campaign_id].leads += 1;
  }
  for (const row of (clicks.data ?? []) as { campaign: string | null }[]) {
    if (row.campaign && out[row.campaign]) out[row.campaign].whatsapp += 1;
  }
  return out;
}
