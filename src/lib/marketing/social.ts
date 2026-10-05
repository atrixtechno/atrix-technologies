import { randomUUID } from "crypto";
import { site } from "@/content/site";
import { isCallMeBotConfigured, sendCallMeBotWhatsApp } from "@/lib/callmebot";
import { socialCaption } from "./ai";
import { CONTACT_PHONE, HASHTAGS, SOCIAL_THEMES, THEME_ORDER, fallbackCaption, themeContent, themeVisual } from "./templates";
import { canPublishTo, destinationLabel, publishToMeta } from "./social-meta";
import { db, getPost, insertPosts, listPosts, postFromRow, socialSettings, storeError, updatePost, writeSetting } from "./store";
import { cdmxToIso, isoToCdmxInput, weekKey } from "./time";
import type { SocialDestination, SocialPost, SocialSettings, SocialTheme } from "./types";

// Admin → Marketing en redes: publicaciones propias de ATRIX en Instagram / Facebook. Cada lunes
// (si está activo) se crean como borrador las publicaciones de la semana desde las plantillas de
// marca con texto de IA; un admin las aprueba (o salen solas si "publicar sin aprobación" está
// activo) y se publican a su hora. Las corre el cron diario, un cron externo (/api/cron/social) y,
// como máximo cada 5 minutos, las visitas normales del sitio (maybeSocialTick).

export const ALL_DESTINATIONS: SocialDestination[] = ["ig_feed", "ig_story", "fb"];

export function siteUrl() {
  return site.url.replace(/\/$/, "");
}

export function postImageUrl(post: Pick<SocialPost, "id" | "designVersion">, format: "feed" | "historia" = "feed", absolute = true) {
  const query = new URLSearchParams();
  if (format === "historia") query.set("formato", "historia");
  if (post.designVersion) query.set("v", String(post.designVersion));
  const path = `/marketing/imagen/${post.id}${query.size ? `?${query.toString()}` : ""}`;
  return absolute ? `${siteUrl()}${path}` : path;
}

/** Datos para dibujar la imagen de una publicación (plantilla o foto propia con marco). */
export function cardInputFor(post: Pick<SocialPost, "theme" | "headline" | "subline" | "chips" | "style">, settings: Pick<SocialSettings, "contactStrip">) {
  const own = post.theme === "propia";
  const info = own ? null : SOCIAL_THEMES[post.theme as SocialTheme];
  return {
    kicker: info?.kicker ?? "ATRIX",
    headline: post.headline || info?.headline || "Tecnología que opera y vende por tu negocio",
    subline: post.subline || info?.subline || "",
    chips: own ? [] : post.chips,
    cta: info?.cta ?? "Cotiza gratis en atrixnld.com",
    style: post.style,
    visual: own ? null : themeVisual(post.theme, post.headline),
    contactPhone: settings.contactStrip && post.theme !== "cotiza" ? CONTACT_PHONE : null,
  };
}

export async function captionFor(theme: SocialTheme | "propia", headline: string, subline: string, chips: string[], useAi = true) {
  if (theme !== "propia" && useAi) {
    const info = SOCIAL_THEMES[theme];
    const ai = await socialCaption({
      audience: info.audience,
      headline,
      subline,
      facts: chips,
      cta: info.cta,
      hashtags: HASHTAGS[theme] ?? HASHTAGS.todos,
    });
    if (ai) return ai;
  }
  return fallbackCaption(theme, headline, subline);
}

/** Días del plan semanal según cuántas publicaciones por semana. */
export function planDays(postsPerWeek: number) {
  return postsPerWeek === 3 ? [0, 2, 4] : postsPerWeek === 7 ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4];
}

/**
 * Borradores para los próximos 7 días (puro, para pruebas): una publicación por día elegido a la
 * hora elegida, rotando temas; salta las horas que ya pasaron y las que ya tienen publicación.
 */
export function buildWeekPlan(settings: SocialSettings, createdBy: string, now: Date, taken: Set<string>, captions: (theme: SocialTheme, content: { headline: string; subline: string; chips: string[] }) => Promise<string>) {
  const todayLocal = isoToCdmxInput(now.toISOString()).slice(0, 10);
  const hour = String(settings.hour).padStart(2, "0");
  const first = new Date(`${todayLocal}T00:00:00Z`);
  if (new Date(cdmxToIso(`${todayLocal}T${hour}:00`)!).getTime() < now.getTime() + 15 * 60_000) first.setUTCDate(first.getUTCDate() + 1);
  return Promise.all(
    planDays(settings.postsPerWeek).flatMap((offset) => {
      const date = new Date(first);
      date.setUTCDate(first.getUTCDate() + offset);
      const scheduledAt = cdmxToIso(`${date.toISOString().slice(0, 10)}T${hour}:00`)!;
      if (new Date(scheduledAt).getTime() < now.getTime() + 15 * 60_000 || taken.has(scheduledAt)) return [];
      // Tema por día de calendario: días seguidos no se repiten y regenerar da el mismo.
      const dayIndex = Math.floor(date.getTime() / 86_400_000);
      const theme = THEME_ORDER[dayIndex % THEME_ORDER.length];
      const content = themeContent(theme, date);
      return [
        captions(theme, content).then(
          (caption): SocialPost => ({
            id: randomUUID(),
            createdAt: now.toISOString(),
            createdBy,
            source: "plan",
            theme,
            headline: content.headline,
            subline: content.subline,
            chips: content.chips,
            imageKey: null,
            style: "azul",
            frame: false,
            designVersion: 0,
            caption,
            destinations: settings.destinations,
            scheduledAt,
            status: settings.autoApprove ? "aprobada" : "borrador",
            approvedBy: settings.autoApprove ? "automático" : null,
            approvedAt: settings.autoApprove ? now.toISOString() : null,
            publishedAt: null,
            results: [],
          }),
        ),
      ];
    }),
  );
}

export async function generateWeekPlan(createdBy: string, now = new Date()) {
  const settings = await socialSettings();
  const existing = await listPosts();
  const taken = new Set(existing.filter((row) => row.source === "plan").map((row) => row.scheduledAt));
  const posts = await buildWeekPlan(settings, createdBy, now, taken, (theme, content) => captionFor(theme, content.headline, content.subline, content.chips));
  await insertPosts(posts);
  await writeSetting("social", { ...settings, lastPlanWeek: weekKey(now) });
  return posts.length;
}

/** Aparta la publicación (estado "publicando") para que dos procesos no la publiquen dos veces. */
async function claimPost(id: string) {
  const { data, error } = await db()
    .from("social_posts")
    .update({ status: "publicando" })
    .eq("id", id)
    .not("status", "in", '("publicando","publicada")')
    .select("id");
  if (error) throw new Error(storeError(error));
  return Boolean(data?.length);
}

/** Publica una publicación en sus destinos y guarda cada resultado. */
export async function publishPost(id: string) {
  const before = await getPost(id);
  if (!before) return { ok: false, message: "No encontramos la publicación." };
  if (!(await claimPost(id))) return { ok: false, message: "Ya se está publicando o ya salió." };
  const results: SocialPost["results"] = [];
  const pending = before.destinations.filter((destination) => !before.results.some((r) => r.destination === destination && r.ok));
  for (const destination of pending) {
    const at = new Date().toISOString();
    try {
      const metaId = await publishToMeta(destination, {
        feedImageUrl: postImageUrl(before, "feed"),
        storyImageUrl: postImageUrl(before, "historia"),
        caption: before.caption,
      });
      results.push({ destination, at, ok: true, id: metaId });
    } catch (error) {
      results.push({ destination, at, ok: false, error: error instanceof Error ? error.message : "Error al publicar" });
    }
  }
  const allOk = before.destinations.every((d) => results.some((r) => r.destination === d && r.ok) || before.results.some((r) => r.destination === d && r.ok));
  await updatePost(id, {
    results: [...before.results.filter((r) => r.ok), ...results],
    status: allOk ? "publicada" : "error",
    ...(allOk ? { publishedAt: new Date().toISOString() } : {}),
  });
  const failed = results.filter((r) => !r.ok);
  const message = allOk ? "Publicada." : failed.map((r) => `${destinationLabel(r.destination)}: ${r.error}`).join(" · ");
  if (!allOk && isCallMeBotConfigured()) {
    // Aviso al dueño por WhatsApp cuando una publicación programada falla.
    const alert = `*ATRIX · Marketing en redes*\n\nFalló la publicación "${before.headline.slice(0, 80)}":\n${message.slice(0, 300)}`;
    void sendCallMeBotWhatsApp(alert).catch(() => null);
  }
  return { ok: allOk, message };
}

/** Publicaciones aprobadas cuya hora llegó (máximo 3 por vuelta: límites de Meta y del tiempo). */
export async function runDuePosts(now = new Date()) {
  const { data, error } = await db()
    .from("social_posts")
    .select("*")
    .eq("status", "aprobada")
    .lte("scheduled_at", now.toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(10);
  if (error) throw new Error(storeError(error));
  const due = (data ?? [])
    .map(postFromRow)
    .filter((row) => row.destinations.some((destination) => canPublishTo(destination)))
    .slice(0, 3);
  const out: string[] = [];
  for (const post of due) out.push(`${post.id}: ${(await publishPost(post.id)).message}`);
  return out;
}

/** Plan del lunes (si está activo) + lo que toca publicar. Barato cuando no hay nada. */
export async function socialTick(now = new Date()) {
  const settings = await socialSettings();
  let planned = 0;
  if (settings.autoPlan && settings.lastPlanWeek !== weekKey(now)) planned = await generateWeekPlan("automático", now);
  const published = await runDuePosts(now);
  return { planned, published };
}

/** Desde las visitas: como máximo una vez cada 5 minutos por instancia. Nunca lanza. */
export async function maybeSocialTick() {
  const g = globalThis as typeof globalThis & { __atrixSocialTick?: number };
  const now = Date.now();
  if (g.__atrixSocialTick && now - g.__atrixSocialTick < 5 * 60_000) return null;
  g.__atrixSocialTick = now;
  try {
    const settings = await socialSettings();
    const { count } = await db()
      .from("social_posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "aprobada")
      .lte("scheduled_at", new Date(now).toISOString());
    const needsPlan = settings.autoPlan && settings.lastPlanWeek !== weekKey();
    if (!count && !needsPlan) return null;
    return await socialTick();
  } catch (error) {
    console.error("[social] tick", error instanceof Error ? error.message : error);
    return null;
  }
}

export function groupPosts(posts: SocialPost[]) {
  const by = (status: SocialPost["status"]) => posts.filter((row) => row.status === status);
  const asc = (a: SocialPost, b: SocialPost) => (a.scheduledAt < b.scheduledAt ? -1 : 1);
  return {
    drafts: by("borrador").sort(asc),
    scheduled: [...by("aprobada"), ...by("publicando")].sort(asc),
    published: by("publicada")
      .sort((a, b) => ((a.publishedAt ?? "") < (b.publishedAt ?? "") ? 1 : -1))
      .slice(0, 30),
    failed: by("error").sort((a, b) => (a.scheduledAt < b.scheduledAt ? 1 : -1)),
  };
}
