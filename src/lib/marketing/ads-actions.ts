"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { adAudience, adLocation } from "./ad-locations";
import { AD_GOALS, adGoal } from "./ad-goals";
import { activateCampaign, boostablePosts, freshAdWords, pauseCampaign, redesignCampaign, refreshCampaignStats, sendToMeta } from "./ads";
import { adDefaults, budgetError, newCampaign } from "./ads-rules";
import { adAccountInfo, adsConfig, adsConfigured, adsGraph } from "./meta-ads";
import { pixelConfigured } from "./meta-pixel";
import { metaStatus } from "./social-meta";
import { db, getCampaign, insertCampaign, storeError } from "./store";
import { isDesignStyle } from "./styles";

// Admin → Campañas pagadas (ver ads.ts). Cada acción valida la sesión de admin primero.

type Result = { ok: string } | { error: string } | null;

function refresh() {
  revalidatePath("/admin/campanas");
}

function text(formData: FormData, name: string, max: number) {
  return String(formData.get(name) ?? "").replace(/\r\n/g, "\n").trim().slice(0, max);
}

function aiAllowed() {
  const g = globalThis as typeof globalThis & { __atrixAdAi?: number[] };
  const now = Date.now();
  const recent = (g.__atrixAdAi ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  g.__atrixAdAi = recent;
  return recent.length <= 30;
}

/** "Nueva campaña": la guarda y, si la cuenta publicitaria está conectada, la crea en Meta EN PAUSA. */
export async function createAdCampaignAction(_: Result, formData: FormData): Promise<Result> {
  const admin = await requireAdmin();
  try {
    const audience = adAudience(formData.get("audience"));
    const location = adLocation(formData.get("location"));
    const budgetMxn = Math.floor(Number(formData.get("budget")));
    const days = Math.floor(Number(formData.get("days")));
    const invalid = budgetError(budgetMxn, days);
    if (invalid) return { error: invalid };
    const goal = adGoal(formData.get("goal"));
    if (goal === "cotizaciones" && !pixelConfigured()) return { error: "Para «Más cotizaciones» falta conectar el Pixel de Meta (META_PIXEL_ID)." };
    if (goal === "whatsapp" && !adsConfig().whatsappLinked) return { error: "Para «Mensajes por WhatsApp» vincula el WhatsApp Business a la página y pon META_WHATSAPP_LINKED=true en Vercel." };
    if (goal === "perfil_ig" && !metaStatus().instagram) return { error: "Para «Más seguidores en Instagram» falta conectar Instagram en Marketing en redes." };
    const post = goal === "interaccion" ? (await boostablePosts()).find((row) => row.id === String(formData.get("postId") ?? "")) : null;
    if (goal === "interaccion" && !post) return { error: "Elige una publicación de Facebook ya publicada para promocionarla." };
    const defaults = adDefaults(audience, location, goal);
    const styleRaw = formData.get("style");
    const campaign = newCampaign({
      createdBy: admin.username,
      audience,
      location,
      headline: post ? post.title : text(formData, "headline", 90) || defaults.headline,
      subline: post ? "" : text(formData, "subline", 140) || defaults.subline,
      message: post ? "" : text(formData, "message", 600) || defaults.message,
      budgetMxn,
      days,
      style: isDesignStyle(styleRaw) ? styleRaw : "azul",
      goal,
      post,
    });
    const saved = await insertCampaign(campaign);
    const sent = adsConfigured() ? await sendToMeta(saved.id) : { ok: true, message: `Guardada (${AD_GOALS[goal].label}). Conecta la cuenta publicitaria para crearla en Meta.` };
    refresh();
    return sent.ok ? { ok: sent.message } : { error: sent.message };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo guardar la campaña." };
  }
}

/** Reintentar crearla en Meta (después de conectar la cuenta o corregir un error). */
export async function sendAdToMetaAction(id: string) {
  await requireAdmin();
  const result = await sendToMeta(id);
  refresh();
  return result;
}

/** "Activar": empieza a gastar, como máximo el presupuesto total. Pide el monto para confirmar. */
export async function activateAdCampaignAction(id: string, confirmedBudgetMxn: number) {
  const admin = await requireAdmin();
  const campaign = await getCampaign(id);
  if (!campaign) return { ok: false, message: "No encontramos la campaña." };
  if (Math.floor(Number(confirmedBudgetMxn)) !== campaign.budgetMxn) {
    return { ok: false, message: `Para activar, confirma el monto exacto: $${campaign.budgetMxn.toLocaleString("es-MX")} MXN.` };
  }
  const result = await activateCampaign(id, admin.username);
  refresh();
  return result;
}

export async function pauseAdCampaignAction(id: string) {
  await requireAdmin();
  const result = await pauseCampaign(id);
  refresh();
  return result;
}

/** Quita una campaña que nunca corrió (borrador, en pausa o con error); también su copia en Meta. */
export async function deleteAdCampaignAction(id: string) {
  await requireAdmin();
  const row = await getCampaign(id);
  if (!row || row.activatedAt) return;
  if (row.meta?.campaignId) await adsGraph(row.meta.campaignId, {}, "DELETE").catch(() => null);
  await db().from("ad_campaigns").delete().eq("id", id).is("activated_at", null);
  refresh();
}

/** "Rediseñar flyer" de una campaña guardada (siguiente estilo + palabras nuevas). */
export async function redesignAdCampaignAction(id: string) {
  await requireAdmin();
  const result = await redesignCampaign(id, aiAllowed());
  refresh();
  return result;
}

/** "Rediseñar flyer" del formulario: palabras nuevas para la vista previa (no guarda nada). */
export async function suggestAdWordsAction(audience: string, location: string, headline: string, subline: string, goal = "clics") {
  await requireAdmin();
  const a = adAudience(audience);
  const l = adLocation(location);
  const g = adGoal(goal);
  const base = adDefaults(a, l, g);
  return freshAdWords({ audience: a, location: l, headline: headline || base.headline, subline: subline || base.subline, goal: g }, aiAllowed());
}

export async function refreshAdStatsAction() {
  await requireAdmin();
  await refreshCampaignStats();
  refresh();
}

/** "Registrar recarga": anota fondos agregados en Meta (la API de Meta no los informa). */
export async function addAdFundsAction(_: Result, formData: FormData): Promise<Result> {
  const admin = await requireAdmin();
  const amount = Math.round(Number(String(formData.get("amount") ?? "").replace(/[$,\s]/g, "")) * 100) / 100;
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) return { error: "Escribe el monto que agregaste en Meta (por ejemplo 300)." };
  const { error } = await db().from("ad_funds").insert({ id: randomUUID(), amount_mxn: amount, by: admin.username });
  if (error) return { error: storeError(error) };
  refresh();
  return { ok: `Recarga de $${amount.toLocaleString("es-MX")} MXN registrada.` };
}

export async function deleteAdFundsAction(id: string) {
  await requireAdmin();
  await db().from("ad_funds").delete().eq("id", id);
  refresh();
}

/** "Probar cuenta publicitaria": nombre, moneda, estado y si tiene método de pago. */
export async function testAdAccountAction() {
  await requireAdmin();
  if (!adsConfigured()) return { error: "Faltan META_AD_ACCOUNT_ID, META_ADS_TOKEN y META_PAGE_ID en Vercel." };
  try {
    const a = await adAccountInfo();
    const payment = a.paymentLabel ?? (a.hasPayment ? "con método de pago" : "sin método de pago");
    return { ok: `${a.name} · ${a.currency} · ${a.status} · ${payment}` };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo leer la cuenta publicitaria." };
  }
}
