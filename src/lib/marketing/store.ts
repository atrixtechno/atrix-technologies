import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase";
import { adAudience, adLocation } from "./ad-locations";
import { adGoal } from "./ad-goals";
import { isDesignStyle } from "./styles";
import type { AdCampaign, AdFund, SocialDestination, SocialPost, SocialSettings } from "./types";

// Datos de Marketing y Campañas en Supabase (tablas social_posts, ad_campaigns, ad_funds y
// site_settings 'social' / 'ads'). Solo servidor, siempre con la service role: las tablas tienen
// RLS sin políticas públicas (migración 20261004_marketing.sql).

export const UPLOAD_BUCKET = "marketing-uploads";

export function marketingStoreReady() {
  return isSupabaseAdminConfigured();
}

export function db() {
  return getSupabaseAdmin();
}

/** Mensaje claro cuando falta la migración o las variables de Supabase. */
export function storeError(error: { message?: string } | null | undefined) {
  const message = error?.message ?? "";
  if (/relation .* does not exist|schema cache|Could not find the table/i.test(message)) {
    return "Falta correr la migración supabase/migrations/20261004_marketing.sql en Supabase.";
  }
  return message || "No se pudo leer la base de datos.";
}

// ---------------------------------------------------------------------------
// Ajustes (site_settings)
// ---------------------------------------------------------------------------

export const DEFAULT_SOCIAL: SocialSettings = {
  autoPlan: false,
  postsPerWeek: 5,
  hour: 19,
  autoApprove: false,
  destinations: ["ig_feed", "ig_story", "fb"],
  contactStrip: true,
  lastPlanWeek: null,
};

export type AdsSettings = { cityKeys: Record<string, string> };

export async function readSetting<T extends object>(key: string, fallback: T): Promise<T> {
  if (!marketingStoreReady()) return fallback;
  const { data } = await db().from("site_settings").select("value").eq("key", key).maybeSingle();
  return { ...fallback, ...((data?.value as Partial<T> | undefined) ?? {}) };
}

export async function writeSetting(key: string, value: object) {
  const { error } = await db().from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(storeError(error));
}

export function socialSettings() {
  return readSetting<SocialSettings>("social", DEFAULT_SOCIAL);
}

export function adsSettings() {
  return readSetting<AdsSettings>("ads", { cityKeys: {} });
}

// ---------------------------------------------------------------------------
// social_posts
// ---------------------------------------------------------------------------

const DESTS: SocialDestination[] = ["ig_feed", "ig_story", "fb"];

type Row = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" ? v : "");
const strOrNull = (v: unknown) => (typeof v === "string" && v ? v : null);
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export function postFromRow(row: Row): SocialPost {
  const theme = str(row.theme) as SocialPost["theme"];
  return {
    id: str(row.id),
    createdAt: str(row.created_at),
    createdBy: str(row.created_by),
    source: row.source === "plan" ? "plan" : "manual",
    theme,
    headline: str(row.headline),
    subline: str(row.subline),
    chips: arr<string>(row.chips).map(String),
    imageKey: strOrNull(row.image_key),
    style: isDesignStyle(row.style) ? row.style : "azul",
    frame: Boolean(row.frame),
    designVersion: Number(row.design_version ?? 0),
    caption: str(row.caption),
    destinations: arr<string>(row.destinations).filter((d): d is SocialDestination => (DESTS as string[]).includes(d)),
    scheduledAt: new Date(str(row.scheduled_at)).toISOString(),
    status: (str(row.status) || "borrador") as SocialPost["status"],
    approvedBy: strOrNull(row.approved_by),
    approvedAt: strOrNull(row.approved_at),
    publishedAt: strOrNull(row.published_at),
    results: arr<SocialPost["results"][number]>(row.results),
  };
}

export function postToRow(post: Partial<SocialPost>): Row {
  const map: Record<string, string> = {
    id: "id",
    createdBy: "created_by",
    source: "source",
    theme: "theme",
    headline: "headline",
    subline: "subline",
    chips: "chips",
    imageKey: "image_key",
    style: "style",
    frame: "frame",
    designVersion: "design_version",
    caption: "caption",
    destinations: "destinations",
    scheduledAt: "scheduled_at",
    status: "status",
    approvedBy: "approved_by",
    approvedAt: "approved_at",
    publishedAt: "published_at",
    results: "results",
  };
  const out: Row = {};
  for (const [key, value] of Object.entries(post)) if (map[key] && value !== undefined) out[map[key]] = value;
  return out;
}

export async function listPosts() {
  const { data, error } = await db().from("social_posts").select("*").order("scheduled_at", { ascending: true }).limit(400);
  if (error) throw new Error(storeError(error));
  return (data ?? []).map(postFromRow);
}

export async function getPost(id: string) {
  if (!isUuid(id)) return null;
  const { data } = await db().from("social_posts").select("*").eq("id", id).maybeSingle();
  return data ? postFromRow(data) : null;
}

export async function insertPosts(posts: SocialPost[]) {
  if (!posts.length) return;
  const { error } = await db().from("social_posts").insert(posts.map((post) => postToRow(post)));
  if (error) throw new Error(storeError(error));
}

export async function updatePost(id: string, change: Partial<SocialPost>) {
  const { error } = await db().from("social_posts").update(postToRow(change)).eq("id", id);
  if (error) throw new Error(storeError(error));
}

// ---------------------------------------------------------------------------
// ad_campaigns / ad_funds
// ---------------------------------------------------------------------------

export function campaignFromRow(row: Row): AdCampaign {
  return {
    id: str(row.id),
    createdAt: str(row.created_at),
    createdBy: str(row.created_by),
    goal: adGoal(row.goal),
    audience: adAudience(row.audience),
    location: adLocation(row.location),
    headline: str(row.headline),
    subline: str(row.subline),
    message: str(row.message),
    style: isDesignStyle(row.style) ? row.style : "azul",
    designVersion: Number(row.design_version ?? 0),
    postId: strOrNull(row.post_id),
    postTitle: strOrNull(row.post_title),
    postImage: strOrNull(row.post_image),
    budgetMxn: Number(row.budget_mxn ?? 0),
    days: Number(row.days ?? 0),
    status: (str(row.status) || "borrador") as AdCampaign["status"],
    meta: (row.meta as AdCampaign["meta"]) ?? null,
    error: strOrNull(row.error),
    activatedAt: strOrNull(row.activated_at),
    activatedBy: strOrNull(row.activated_by),
    startAt: strOrNull(row.start_at),
    endAt: strOrNull(row.end_at),
    stats: (row.stats as AdCampaign["stats"]) ?? null,
    followers: (row.followers as AdCampaign["followers"]) ?? null,
  };
}

export function campaignToRow(c: Partial<AdCampaign>): Row {
  const map: Record<string, string> = {
    id: "id",
    createdBy: "created_by",
    goal: "goal",
    audience: "audience",
    location: "location",
    headline: "headline",
    subline: "subline",
    message: "message",
    style: "style",
    designVersion: "design_version",
    postId: "post_id",
    postTitle: "post_title",
    postImage: "post_image",
    budgetMxn: "budget_mxn",
    days: "days",
    status: "status",
    meta: "meta",
    error: "error",
    activatedAt: "activated_at",
    activatedBy: "activated_by",
    startAt: "start_at",
    endAt: "end_at",
    stats: "stats",
    followers: "followers",
  };
  const out: Row = {};
  for (const [key, value] of Object.entries(c)) if (map[key] && value !== undefined) out[map[key]] = value;
  return out;
}

export async function listCampaigns() {
  const { data, error } = await db().from("ad_campaigns").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) throw new Error(storeError(error));
  return (data ?? []).map(campaignFromRow);
}

export async function getCampaign(id: string) {
  if (!isUuid(id) || !marketingStoreReady()) return null;
  const { data } = await db().from("ad_campaigns").select("*").eq("id", id).maybeSingle();
  return data ? campaignFromRow(data) : null;
}

export async function insertCampaign(campaign: AdCampaign) {
  const { data, error } = await db().from("ad_campaigns").insert(campaignToRow(campaign)).select("*").single();
  if (error) throw new Error(storeError(error));
  return campaignFromRow(data);
}

export async function updateCampaign(id: string, change: Partial<AdCampaign>) {
  const { error } = await db().from("ad_campaigns").update(campaignToRow(change)).eq("id", id);
  if (error) throw new Error(storeError(error));
}

export async function listFunds(): Promise<AdFund[]> {
  const { data, error } = await db().from("ad_funds").select("*").order("at", { ascending: false }).limit(200);
  if (error) throw new Error(storeError(error));
  return (data ?? []).map((row) => ({ id: str(row.id), at: str(row.at), amountMxn: Number(row.amount_mxn ?? 0), by: str(row.by) }));
}

// ---------------------------------------------------------------------------
// Fotos propias (Storage privado)
// ---------------------------------------------------------------------------

async function ensureBucket() {
  const storage = db().storage;
  const { data } = await storage.getBucket(UPLOAD_BUCKET);
  if (!data) await storage.createBucket(UPLOAD_BUCKET, { public: false, fileSizeLimit: 8_000_000 });
}

export async function storeUpload(key: string, bytes: Buffer, contentType: string) {
  await ensureBucket();
  const { error } = await db().storage.from(UPLOAD_BUCKET).upload(key, bytes, { contentType, upsert: false });
  if (error) throw new Error(`No se pudo guardar la imagen: ${error.message}`);
}

export async function loadUpload(key: string) {
  const { data, error } = await db().storage.from(UPLOAD_BUCKET).download(key);
  if (error || !data) return null;
  return Buffer.from(await data.arrayBuffer());
}

export async function removeUpload(key: string) {
  await db().storage.from(UPLOAD_BUCKET).remove([key]).catch(() => null);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

/** Lee una imagen subida y valida que de verdad sea JPG, PNG o WebP (por sus bytes). */
export async function readImageUpload(file: File, maxBytes = 8_000_000) {
  if (file.size > maxBytes) return { error: "La imagen debe pesar menos de 8 MB." } as const;
  const bytes = Buffer.from(await file.arrayBuffer());
  const kind =
    bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
      ? "jpg"
      : bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
        ? "png"
        : bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP"
          ? "webp"
          : null;
  if (!kind) return { error: "Usa una imagen JPG, PNG o WebP." } as const;
  const type = kind === "jpg" ? "image/jpeg" : `image/${kind}`;
  return { bytes, kind, type } as const;
}
