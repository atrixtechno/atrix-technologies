import { NextResponse } from "next/server";
import { AD_AUDIENCES } from "@/lib/marketing/ad-locations";
import { AD_COOKIE, AD_COOKIE_DAYS } from "@/lib/marketing/ads";
import { getCampaign } from "@/lib/marketing/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Enlace de un anuncio pagado de Meta (Admin → Campañas): recuerda la campaña 30 días (cookie
// httpOnly) y abre la página del servicio con utm_source=meta&utm_medium=paid&utm_campaign=<id>,
// así la visita y la cotización que traiga se cuentan para esa campaña.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaign(id).catch(() => null);
  const target = new URL(campaign ? AD_AUDIENCES[campaign.audience].landing : "/", request.url);
  target.searchParams.set("utm_source", "meta");
  target.searchParams.set("utm_medium", "paid");
  if (campaign) target.searchParams.set("utm_campaign", campaign.id);
  if (!campaign) target.hash = "contacto";
  const response = NextResponse.redirect(target);
  if (campaign) {
    response.cookies.set(AD_COOKIE, campaign.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: AD_COOKIE_DAYS * 86_400,
      path: "/",
    });
  }
  return response;
}
