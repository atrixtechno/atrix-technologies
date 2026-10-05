"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { socialWords } from "./ai";
import { ALL_DESTINATIONS, captionFor, generateWeekPlan, publishPost } from "./social";
import { canPublishTo, testMetaConnection } from "./social-meta";
import { db, getPost, insertPosts, readImageUpload, removeUpload, socialSettings, storeError, storeUpload, updatePost, writeSetting } from "./store";
import { SOCIAL_THEMES, alternateWords, fallbackCaption, themeContent } from "./templates";
import { isDesignStyle, nextStyle } from "./styles";
import { cdmxToIso } from "./time";
import type { SocialDestination, SocialPost, SocialTheme } from "./types";

// Admin → Marketing en redes (ver social.ts). Cada acción valida la sesión de admin primero: las
// acciones del servidor se pueden llamar con un POST directo.

const THEMES = Object.keys(SOCIAL_THEMES) as SocialTheme[];

type Result = { ok: string } | { error: string } | null;

function refresh() {
  revalidatePath("/admin/redes");
}

function themeFrom(value: unknown): SocialTheme | "propia" {
  const raw = String(value ?? "");
  return raw === "propia" ? "propia" : (THEMES as string[]).includes(raw) ? (raw as SocialTheme) : "servicio";
}

function destinationsFrom(formData: FormData): SocialDestination[] {
  return formData.getAll("destinations").map(String).filter((value): value is SocialDestination => (ALL_DESTINATIONS as string[]).includes(value));
}

function text(formData: FormData, name: string, max: number) {
  return String(formData.get(name) ?? "").replace(/\r\n/g, "\n").trim().slice(0, max);
}

/** Límite por instancia para los botones de IA (protege el saldo de la API). */
function aiAllowed() {
  const g = globalThis as typeof globalThis & { __atrixAiClicks?: number[] };
  const now = Date.now();
  const recent = (g.__atrixAiClicks ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  g.__atrixAiClicks = recent;
  return recent.length <= 30;
}

const fail = (error: unknown): { error: string } => ({ error: error instanceof Error ? error.message : "Algo salió mal." });

/** "Nueva publicación": plantilla o imagen propia, texto, fecha y destinos. */
export async function createSocialPostAction(_: Result, formData: FormData): Promise<Result> {
  const admin = await requireAdmin();
  try {
    const theme = themeFrom(formData.get("theme"));
    const scheduledAt = cdmxToIso(String(formData.get("when") ?? ""));
    if (!scheduledAt) return { error: "Elige el día y la hora de publicación." };
    const destinations = destinationsFrom(formData);
    if (!destinations.length) return { error: "Elige al menos un destino (Instagram o Facebook)." };
    const defaults = theme === "propia" ? { headline: "", subline: "", chips: [] as string[] } : themeContent(theme);
    const headline = text(formData, "headline", 120) || defaults.headline;
    const subline = text(formData, "subline", 200) || defaults.subline;
    const chipsText = text(formData, "chips", 120);
    const chips = theme === "propia" ? [] : chipsText ? chipsText.split(",").map((c) => c.trim()).filter(Boolean).slice(0, 3) : defaults.chips;

    let imageKey: string | null = null;
    if (theme === "propia") {
      const file = formData.get("image");
      if (!(file instanceof File) || file.size === 0) return { error: "Sube la imagen de la publicación (JPG, PNG o WebP)." };
      const read = await readImageUpload(file);
      if ("error" in read) return { error: read.error ?? "Imagen no válida." };
      imageKey = `${randomUUID()}.${read.kind}`;
      await storeUpload(imageKey, read.bytes, read.type);
    }
    const caption = text(formData, "caption", 2200) || (await captionFor(theme, headline, subline, chips, aiAllowed()));
    const approve = formData.get("approve") === "on";
    const styleRaw = formData.get("style");
    const post: SocialPost = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      createdBy: admin.username,
      source: "manual",
      theme,
      headline,
      subline,
      chips,
      imageKey,
      style: isDesignStyle(styleRaw) ? styleRaw : "azul",
      frame: theme === "propia" && formData.get("frame") === "on",
      designVersion: 0,
      caption,
      destinations,
      scheduledAt,
      status: approve ? "aprobada" : "borrador",
      approvedBy: approve ? admin.username : null,
      approvedAt: approve ? new Date().toISOString() : null,
      publishedAt: null,
      results: [],
    };
    await insertPosts([post]);
    refresh();
    return { ok: approve ? "Programada. Sale sola a su hora." : "Guardada como borrador. Apruébala para que salga." };
  } catch (error) {
    return fail(error);
  }
}

/** Editar texto, palabras, estilo, fecha y destinos (no después de publicada). */
export async function updateSocialPostAction(id: string, formData: FormData) {
  await requireAdmin();
  const row = await getPost(id);
  if (!row || row.status === "publicada" || row.status === "publicando") return;
  const scheduledAt = cdmxToIso(String(formData.get("when") ?? ""));
  const destinations = destinationsFrom(formData);
  const change: Partial<SocialPost> = { caption: text(formData, "caption", 2200) || row.caption };
  if (row.theme !== "propia" || row.frame) {
    change.headline = text(formData, "headline", 120) || row.headline;
    change.subline = text(formData, "subline", 200) || row.subline;
    if (change.headline !== row.headline || change.subline !== row.subline) change.designVersion = row.designVersion + 1;
  }
  const style = formData.get("style");
  if (isDesignStyle(style) && style !== row.style) {
    change.style = style;
    change.designVersion = row.designVersion + 1;
  }
  if (scheduledAt) change.scheduledAt = scheduledAt;
  if (destinations.length) change.destinations = destinations;
  if (row.status === "error") change.status = row.approvedAt ? "aprobada" : "borrador";
  await updatePost(id, change);
  refresh();
}

export async function approveSocialPostAction(id: string) {
  const admin = await requireAdmin();
  await db()
    .from("social_posts")
    .update({ status: "aprobada", approved_by: admin.username, approved_at: new Date().toISOString() })
    .eq("id", id)
    .in("status", ["borrador", "error"]);
  refresh();
}

export async function approveAllSocialAction() {
  const admin = await requireAdmin();
  await db().from("social_posts").update({ status: "aprobada", approved_by: admin.username, approved_at: new Date().toISOString() }).eq("status", "borrador");
  refresh();
}

/** Regresa a borrador (detiene una publicación programada). */
export async function unscheduleSocialPostAction(id: string) {
  await requireAdmin();
  await db().from("social_posts").update({ status: "borrador" }).eq("id", id).eq("status", "aprobada");
  refresh();
}

export async function deleteSocialPostAction(id: string) {
  await requireAdmin();
  const row = await getPost(id);
  if (!row || row.status === "publicando") return;
  await db().from("social_posts").delete().eq("id", id).neq("status", "publicando");
  if (row.imageKey) await removeUpload(row.imageKey);
  refresh();
}

/** "Publicar ahora" (también reintenta los destinos que fallaron). */
export async function publishSocialNowAction(id: string) {
  const admin = await requireAdmin();
  const target = await getPost(id);
  if (!target) return { ok: false, message: "No encontramos la publicación." };
  if (!target.destinations.some((destination) => canPublishTo(destination))) {
    return { ok: false, message: "Primero conecta Instagram y la página de Facebook (variables META_* en Vercel). La publicación sigue guardada." };
  }
  if (target.status !== "publicada" && target.status !== "publicando") {
    await updatePost(id, { status: "aprobada", approvedBy: target.approvedBy ?? admin.username, approvedAt: target.approvedAt ?? new Date().toISOString() });
  }
  const result = await publishPost(id);
  refresh();
  return result;
}

/** Palabras nuevas para la imagen: de la IA si está activa, si no el siguiente par de la plantilla. */
async function freshWords(theme: SocialTheme | "propia", headline: string, subline: string, useAi: boolean) {
  if (useAi) {
    const audience = theme === "propia" ? "hogares y negocios de Nuevo Laredo y Laredo, TX" : SOCIAL_THEMES[theme].audience;
    const ai = await socialWords({ audience, headline, subline });
    if (ai) return ai;
  }
  return theme === "propia" ? { headline, subline } : alternateWords(theme, headline);
}

/** "Rediseñar imagen": el siguiente estilo y palabras nuevas (la foto propia recibe el marco). */
export async function redesignSocialPostAction(id: string) {
  await requireAdmin();
  const post = await getPost(id);
  if (!post || post.status === "publicada" || post.status === "publicando") return;
  const words =
    post.theme === "propia" && !post.headline
      ? { headline: "Tecnología que opera y vende por tu negocio", subline: "Soporte, CCTV, redes y plataformas digitales en Nuevo Laredo." }
      : await freshWords(post.theme, post.headline, post.subline, aiAllowed());
  await updatePost(id, {
    ...(post.theme === "propia" ? { frame: true } : { style: nextStyle(post.style) }),
    headline: words.headline,
    subline: words.subline,
    designVersion: post.designVersion + 1,
  });
  refresh();
}

/** "Rediseñar" del compositor: palabras nuevas para la vista previa (no guarda nada). */
export async function suggestWordsAction(theme: string, headline: string, subline: string) {
  await requireAdmin();
  const t = themeFrom(theme);
  const base = t === "propia" ? { headline, subline } : { headline: headline || themeContent(t).headline, subline: subline || themeContent(t).subline };
  return freshWords(t, base.headline, base.subline, aiAllowed());
}

/** Texto sugerido para el compositor (IA si está disponible, si no el de la plantilla). */
export async function suggestCaptionAction(theme: string, headline: string, subline: string) {
  await requireAdmin();
  const t = themeFrom(theme);
  const defaults = t === "propia" ? { headline, subline, chips: [] as string[] } : themeContent(t);
  const h = headline.trim() || defaults.headline;
  const s = subline.trim() || defaults.subline;
  if (!aiAllowed()) return { caption: fallbackCaption(t, h, s) };
  return { caption: await captionFor(t, h, s, defaults.chips) };
}

export async function generateWeekPlanAction() {
  const admin = await requireAdmin();
  try {
    const count = await generateWeekPlan(admin.username);
    refresh();
    return { ok: count ? `Listas ${count} publicaciones como borrador.` : "La semana ya tenía sus publicaciones." };
  } catch (error) {
    return fail(error);
  }
}

export async function saveSocialSettingsAction(formData: FormData) {
  await requireAdmin();
  const perWeek = Number(formData.get("postsPerWeek"));
  const hour = Number(formData.get("hour"));
  const destinations = destinationsFrom(formData);
  const current = await socialSettings();
  await writeSetting("social", {
    ...current,
    autoPlan: formData.get("autoPlan") === "on",
    autoApprove: formData.get("autoApprove") === "on",
    postsPerWeek: perWeek === 3 || perWeek === 7 ? perWeek : 5,
    hour: Number.isInteger(hour) && hour >= 6 && hour <= 22 ? hour : 19,
    destinations: destinations.length ? destinations : ["ig_feed", "fb"],
    contactStrip: formData.get("contactStrip") === "on",
  });
  refresh();
}

/** "Probar conexión": qué cuenta de Instagram y qué página alcanza el token. */
export async function testMetaConnectionAction(): Promise<Result> {
  await requireAdmin();
  const result = await testMetaConnection();
  if (result.error) return { error: result.error };
  return { ok: [result.instagram ? `Instagram ${result.instagram}` : "", result.facebook ? `Facebook: ${result.facebook}` : ""].filter(Boolean).join(" · ") };
}

/** Para que el panel diga claramente si falta la migración. */
export async function socialStoreCheck() {
  await requireAdmin();
  const { error } = await db().from("social_posts").select("id", { head: true, count: "exact" });
  return error ? storeError(error) : null;
}
