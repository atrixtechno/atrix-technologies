import { adImage } from "@/lib/marketing/ads";
import { getCampaign } from "@/lib/marketing/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Imagen de una campaña pagada (Admin → Campañas), JPEG 1080×1350: la vista previa de lo que muestra
// Meta. Pública como /marketing/imagen (UUID aleatorio, solo contenido publicitario).
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaign(id).catch(() => null);
  if (!campaign) return new Response("No encontrada.", { status: 404 });
  const image = await adImage(campaign);
  return new Response(image.body, { headers: { "Content-Type": image.headers.get("Content-Type") ?? "image/jpeg", "Cache-Control": "public, max-age=300" } });
}
