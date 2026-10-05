import { MARKETING_SIZES, marketingCard } from "@/lib/marketing/card";
import { cardInputFor } from "@/lib/marketing/social";
import { getPost, loadUpload, socialSettings } from "@/lib/marketing/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Imagen de una publicación (Admin → Marketing en redes) en JPEG, la que descarga Meta al publicar:
// ?formato=feed (1080×1350, por defecto) o ?formato=historia (1080×1920). Pública a propósito (Meta
// debe alcanzarla); el id es un UUID aleatorio y el contenido es publicidad de ATRIX.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id).catch(() => null);
  if (!post) return new Response("No encontrada.", { status: 404 });
  const format = new URL(request.url).searchParams.get("formato") === "historia" ? "historia" : "feed";
  const headers = { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=300" };
  const settings = await socialSettings();

  if (post.theme === "propia") {
    const file = post.imageKey ? await loadUpload(post.imageKey) : null;
    if (!file) return new Response("Sin imagen.", { status: 404 });
    const sharp = (await import("sharp")).default;
    const size = MARKETING_SIZES[format];
    if (post.frame) {
      const background = await sharp(file).rotate().resize(size.width, size.height, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
      const image = await marketingCard({
        ...cardInputFor(post, settings),
        format,
        photo: `data:image/jpeg;base64,${background.toString("base64")}`,
      });
      return new Response(image.body, { headers: { ...headers, "Content-Type": image.headers.get("Content-Type") ?? "image/jpeg" } });
    }
    const jpeg = await sharp(file)
      .rotate()
      .resize(size.width, size.height, { fit: "contain", background: "#070a10" })
      .flatten({ background: "#070a10" })
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer();
    return new Response(new Uint8Array(jpeg), { headers });
  }

  const image = await marketingCard({ ...cardInputFor(post, settings), format });
  return new Response(image.body, { headers: { ...headers, "Content-Type": image.headers.get("Content-Type") ?? "image/jpeg" } });
}
