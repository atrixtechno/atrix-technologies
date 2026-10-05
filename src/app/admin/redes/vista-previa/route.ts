import { currentAdmin } from "@/lib/admin-guard";
import { MARKETING_SIZES, marketingCard } from "@/lib/marketing/card";
import { cardInputFor } from "@/lib/marketing/social";
import { readImageUpload, socialSettings } from "@/lib/marketing/store";
import { isDesignStyle } from "@/lib/marketing/styles";
import { SOCIAL_THEMES, themeContent } from "@/lib/marketing/templates";
import type { SocialTheme } from "@/lib/marketing/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vista previa de una plantilla mientras se compone (Admin → Marketing en redes). Solo admin.
export async function GET(request: Request) {
  if (!(await currentAdmin())) return new Response("Solo administración.", { status: 403 });
  const params = new URL(request.url).searchParams;
  const raw = params.get("theme") ?? "servicio";
  const theme = (Object.hasOwn(SOCIAL_THEMES, raw) ? raw : "servicio") as SocialTheme;
  const defaults = themeContent(theme);
  const estilo = params.get("estilo");
  const chips = (params.get("chips") ?? "").split(",").map((chip) => chip.trim()).filter(Boolean);
  const settings = await socialSettings();
  const image = await marketingCard({
    ...cardInputFor(
      {
        theme,
        headline: (params.get("headline") ?? "").slice(0, 120) || defaults.headline,
        subline: (params.get("subline") ?? "").slice(0, 200) || defaults.subline,
        chips: chips.length ? chips.slice(0, 3) : defaults.chips,
        style: isDesignStyle(estilo) ? estilo : "azul",
      },
      settings,
    ),
    format: params.get("formato") === "historia" ? "historia" : "feed",
  });
  return new Response(image.body, { headers: { "Content-Type": image.headers.get("Content-Type") ?? "image/jpeg", "Cache-Control": "private, max-age=60" } });
}

// Foto propia con el marco de ATRIX, antes de guardar: el compositor manda aquí el archivo.
export async function POST(request: Request) {
  if (!(await currentAdmin())) return new Response("Solo administración.", { status: 403 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("image");
  if (!(file instanceof File)) return new Response("Falta la imagen.", { status: 400 });
  const read = await readImageUpload(file);
  if ("error" in read) return new Response(read.error, { status: 400 });
  const format = form?.get("formato") === "historia" ? "historia" : "feed";
  const size = MARKETING_SIZES[format];
  const sharp = (await import("sharp")).default;
  const background = await sharp(read.bytes).rotate().resize(size.width, size.height, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
  const settings = await socialSettings();
  const image = await marketingCard({
    ...cardInputFor(
      { theme: "propia", headline: String(form?.get("headline") ?? "").slice(0, 120), subline: String(form?.get("subline") ?? "").slice(0, 200), chips: [], style: "azul" },
      settings,
    ),
    format,
    photo: `data:image/jpeg;base64,${background.toString("base64")}`,
  });
  return new Response(image.body, { headers: { "Content-Type": image.headers.get("Content-Type") ?? "image/jpeg", "Cache-Control": "no-store" } });
}
