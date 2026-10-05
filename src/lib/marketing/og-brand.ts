import { readFile } from "node:fs/promises";
import path from "node:path";

// Piezas de marca para las imágenes de Marketing y Campañas: el logo de ATRIX (fondo oscuro y
// claro), los renders de servicios y la tipografía del sitio (Geist / Geist Mono). Se cargan una
// vez por servidor; lo que falle se omite, así siempre sale una imagen.

export type BrandFont = { name: string; data: ArrayBuffer; weight: 500 | 700; style: "normal" };

type Assets = { logoOnDark: string | null; logoOnLight: string | null; fonts: BrandFont[] };

let cached: Promise<Assets> | null = null;

/** Un archivo de /public como data URL PNG o JPEG (satori no lee WebP). */
export async function publicImage(file: string, width: number, format: "png" | "jpeg" = "png") {
  try {
    const clean = file.replace(/^\/+/, "");
    const full = path.join(process.cwd(), "public", clean);
    if (!full.startsWith(path.join(process.cwd(), "public"))) return null;
    const bytes = await readFile(full);
    const sharp = (await import("sharp")).default;
    const pipeline = sharp(bytes).resize({ width, withoutEnlargement: true });
    const out = format === "png" ? await pipeline.png().toBuffer() : await pipeline.jpeg({ quality: 86 }).toBuffer();
    return `data:image/${format};base64,${out.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Geist estática (public/fonts/og, licencia OFL). Las fuentes variables de Google se miden mal en
 * el renderizador y los textos se enciman. Si el archivo no está en el servidor, se pide al sitio.
 */
async function localFont(file: string, weight: 500 | 700, name: string): Promise<BrandFont | null> {
  try {
    const bytes = await readFile(path.join(process.cwd(), "public", "fonts", "og", file));
    return { name, data: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer, weight, style: "normal" };
  } catch {
    try {
      const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://atrixnld.com").replace(/\/$/, "");
      const res = await fetch(`${base}/fonts/og/${file}`, { signal: AbortSignal.timeout(6000) });
      return res.ok ? { name, data: await res.arrayBuffer(), weight, style: "normal" } : null;
    } catch {
      return null;
    }
  }
}

export function brandAssets() {
  cached ??= (async () => {
    const [logoOnDark, logoOnLight, bold, medium, mono] = await Promise.all([
      publicImage("brand/atrix-lockup-on-dark-v5.png", 600),
      publicImage("brand/atrix-lockup-v3.png", 600),
      localFont("Geist-Bold.ttf", 700, "Geist"),
      localFont("Geist-Medium.ttf", 500, "Geist"),
      localFont("GeistMono-Medium.ttf", 500, "Geist Mono"),
    ]);
    const fonts = [bold, medium, mono].filter((font): font is BrandFont => Boolean(font));
    // Si no se pudieron bajar las fuentes, se reintenta la próxima vez.
    if (!fonts.length) cached = null;
    return { logoOnDark, logoOnLight, fonts };
  })();
  return cached;
}
