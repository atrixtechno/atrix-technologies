import { currentAdmin } from "@/lib/admin-guard";
import { adAudience, adLocation } from "@/lib/marketing/ad-locations";
import { adGoal } from "@/lib/marketing/ad-goals";
import { adImage } from "@/lib/marketing/ads";
import { adDefaults } from "@/lib/marketing/ads-rules";
import { isDesignStyle } from "@/lib/marketing/styles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vista previa del flyer de una campaña que todavía no se guarda (Admin → Campañas). Solo admin.
export async function GET(request: Request) {
  if (!(await currentAdmin())) return new Response("Solo administración.", { status: 403 });
  const params = new URL(request.url).searchParams;
  const audience = adAudience(params.get("audience"));
  const location = adLocation(params.get("location"));
  const goal = adGoal(params.get("goal"));
  const base = adDefaults(audience, location, goal);
  const estilo = params.get("estilo");
  const image = await adImage({
    audience,
    location,
    goal,
    headline: (params.get("headline") ?? "").slice(0, 90) || base.headline,
    subline: (params.get("subline") ?? "").slice(0, 140) || base.subline,
    style: isDesignStyle(estilo) ? estilo : "azul",
  });
  return new Response(image.body, { headers: { "Content-Type": image.headers.get("Content-Type") ?? "image/jpeg", "Cache-Control": "private, max-age=60" } });
}
