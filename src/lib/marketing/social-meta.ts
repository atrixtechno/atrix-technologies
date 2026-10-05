import type { SocialDestination } from "./types";

// Publicar en Meta (Instagram profesional vinculado a la página de Facebook) con la Graph API
// oficial. Configuración en Vercel (la pone el dueño; nunca en el código):
//   META_PAGE_ID        id de la página de Facebook de ATRIX
//   META_IG_USER_ID     id de la cuenta profesional de Instagram vinculada a esa página
//   META_PAGE_TOKEN     token de página (no caduca), tipo Secret
//   META_GRAPH_VERSION  opcional, por defecto v23.0
// Sin ellas, las publicaciones se quedan como borrador y "Publicar" explica qué falta.

const DEST_LABEL: Record<SocialDestination, string> = { ig_feed: "Instagram", ig_story: "Historia de Instagram", fb: "Facebook" };

export function destinationLabel(destination: SocialDestination) {
  return DEST_LABEL[destination];
}

function config() {
  return {
    pageId: process.env.META_PAGE_ID?.trim() ?? "",
    igUserId: process.env.META_IG_USER_ID?.trim() ?? "",
    token: process.env.META_PAGE_TOKEN?.trim() ?? "",
    version: process.env.META_GRAPH_VERSION?.trim() || "v23.0",
  };
}

export function metaStatus() {
  const c = config();
  return {
    instagram: Boolean(c.igUserId && c.token),
    facebook: Boolean(c.pageId && c.token),
    configured: Boolean(c.token && (c.igUserId || c.pageId)),
  };
}

export function canPublishTo(destination: SocialDestination) {
  const status = metaStatus();
  return destination === "fb" ? status.facebook : status.instagram;
}

async function graph(path: string, params: Record<string, string>, method: "GET" | "POST" = "POST") {
  const c = config();
  const url = `https://graph.facebook.com/${c.version}/${path}`;
  const body = new URLSearchParams({ ...params, access_token: c.token });
  const res =
    method === "GET"
      ? await fetch(`${url}?${body.toString()}`, { signal: AbortSignal.timeout(20_000) })
      : await fetch(url, { method: "POST", body, signal: AbortSignal.timeout(30_000) });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown> & { error?: { message?: string } };
  if (!res.ok || json.error) throw new Error(json.error?.message?.slice(0, 300) || `Meta respondió ${res.status}`);
  return json;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Instagram crea primero un contenedor; tarda unos segundos antes de poder publicarse. */
async function waitForContainer(id: string) {
  for (let i = 0; i < 12; i += 1) {
    const status = await graph(id, { fields: "status_code" }, "GET");
    if (status.status_code === "FINISHED") return;
    if (status.status_code === "ERROR" || status.status_code === "EXPIRED") throw new Error(`Instagram no pudo procesar la imagen (${status.status_code}).`);
    await sleep(2500);
  }
  throw new Error("Instagram tardó demasiado en procesar la imagen. Vuelve a intentarlo.");
}

/** Publica en un destino; devuelve el id que asignó Meta. */
export async function publishToMeta(destination: SocialDestination, input: { feedImageUrl: string; storyImageUrl: string; caption: string }) {
  const c = config();
  if (!canPublishTo(destination)) throw new Error(`Falta conectar ${destinationLabel(destination)} (variables META_* en Vercel).`);
  if (destination === "fb") {
    const photo = await graph(`${c.pageId}/photos`, { url: input.feedImageUrl, caption: input.caption, published: "true" });
    return String(photo.post_id ?? photo.id ?? "");
  }
  const container = await graph(
    `${c.igUserId}/media`,
    destination === "ig_story" ? { image_url: input.storyImageUrl, media_type: "STORIES" } : { image_url: input.feedImageUrl, caption: input.caption },
  );
  const creationId = String(container.id ?? "");
  if (!creationId) throw new Error("Instagram no devolvió el contenedor de la publicación.");
  await waitForContainer(creationId);
  const published = await graph(`${c.igUserId}/media_publish`, { creation_id: creationId });
  return String(published.id ?? "");
}

/** "Probar conexión": nombres de las cuentas conectadas (sin secretos). */
export async function testMetaConnection() {
  const c = config();
  const out: { instagram?: string; facebook?: string; error?: string } = {};
  try {
    if (c.igUserId && c.token) {
      const ig = await graph(c.igUserId, { fields: "username" }, "GET");
      out.instagram = `@${String(ig.username ?? "")}`;
    }
    if (c.pageId && c.token) {
      const page = await graph(c.pageId, { fields: "name" }, "GET");
      out.facebook = String(page.name ?? "");
    }
    if (!out.instagram && !out.facebook) out.error = "Faltan las variables META_* en Vercel.";
  } catch (error) {
    out.error = error instanceof Error ? error.message : "No se pudo conectar con Meta.";
  }
  return out;
}

/** Usuario de Instagram conectado (sin @), para las campañas de "seguidores en Instagram". */
export async function instagramUsername() {
  const c = config();
  if (!c.igUserId || !c.token) return null;
  try {
    const ig = await graph(c.igUserId, { fields: "username" }, "GET");
    return typeof ig.username === "string" && ig.username ? ig.username : null;
  } catch {
    return null;
  }
}

/** Seguidores ahora mismo. null = sin conexión o sin respuesta. */
export async function profileFollowers(): Promise<{ fb: number | null; ig: number | null }> {
  const c = config();
  if (!c.token) return { fb: null, ig: null };
  const read = async (id: string, fields: string, pick: (row: Record<string, unknown>) => unknown) => {
    if (!id) return null;
    try {
      const value = Number(pick(await graph(id, { fields }, "GET")));
      return Number.isFinite(value) ? value : null;
    } catch {
      return null;
    }
  };
  const [fb, ig] = await Promise.all([
    read(c.pageId, "followers_count,fan_count", (row) => row.followers_count ?? row.fan_count),
    read(c.igUserId, "followers_count", (row) => row.followers_count),
  ]);
  return { fb, ig };
}
