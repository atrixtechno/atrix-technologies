import { NextResponse } from "next/server";
import { socialTick } from "@/lib/marketing/social";
import { marketingStoreReady } from "@/lib/marketing/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Marketing en redes: plan del lunes + publicaciones cuya hora llegó. Lo llama el cron diario de
// Vercel y, para horas exactas, cualquier cron externo (p. ej. cron-job.org cada 10 minutos) con el
// encabezado "Authorization: Bearer <CRON_SECRET>".
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return NextResponse.json({ error: "CRON_SECRET no está configurado" }, { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!marketingStoreReady()) return NextResponse.json({ skipped: "supabase_not_configured" });
  try {
    return NextResponse.json(await socialTick());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error" }, { status: 500 });
  }
}
