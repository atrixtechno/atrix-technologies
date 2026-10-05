import type { Metadata } from "next";
import Link from "next/link";
import { ActionButton } from "@/components/marketing/ActionButton";
import { ActivateButton, CampaignTimer, FundsForm } from "@/components/marketing/AdCampaignControls";
import { AdCampaignForm } from "@/components/marketing/AdCampaignForm";
import { Notice, Panel, PanelHead, Stat, StatusRow, buttonClass, dangerButtonClass } from "@/components/marketing/ui";
import { requireAdmin } from "@/lib/admin-guard";
import { AD_AUDIENCES, AD_LOCATIONS } from "@/lib/marketing/ad-locations";
import { AD_GOALS, AD_GOAL_GROUPS, goalUsesSite, type AdGoalGroup } from "@/lib/marketing/ad-goals";
import { adImageUrl, boostablePosts, measuresByCampaign, refreshCampaignStats } from "@/lib/marketing/ads";
import {
  deleteAdCampaignAction,
  deleteAdFundsAction,
  pauseAdCampaignAction,
  redesignAdCampaignAction,
  refreshAdStatsAction,
  sendAdToMetaAction,
  testAdAccountAction,
} from "@/lib/marketing/ads-actions";
import { adFundsSummary, adMaxBudgetMxn, campaignFunnel, followersGained, reservedBudgetMxn, type CampaignMeasure } from "@/lib/marketing/ads-rules";
import { adAccountInfo, adsConfig, adsConfigured, billingUrl, goalResult, paymentMethodsUrl, type AdAccountInfo } from "@/lib/marketing/meta-ads";
import { pixelConfigured } from "@/lib/marketing/meta-pixel";
import { metaStatus } from "@/lib/marketing/social-meta";
import { listCampaigns, listFunds, marketingStoreReady } from "@/lib/marketing/store";
import { formatCdmx } from "@/lib/marketing/time";
import type { AdCampaign, AdFund } from "@/lib/marketing/types";

export const metadata: Metadata = {
  title: "Campañas pagadas",
  alternates: { canonical: "/admin/campanas" },
};

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const STATUS: Record<AdCampaign["status"], { label: string; tone: string }> = {
  borrador: { label: "Guardada", tone: "text-muted" },
  pausada: { label: "En pausa (no gasta)", tone: "text-warn" },
  activa: { label: "Activa", tone: "text-ok" },
  terminada: { label: "Terminada", tone: "text-muted" },
  error: { label: "Error", tone: "text-alert" },
};

const mxn = (value: number) => `$${value.toLocaleString("es-MX", { maximumFractionDigits: 2 })}`;
const num = (value: number) => value.toLocaleString("es-MX");

function CampaignCard({ campaign, measure, connected }: { campaign: AdCampaign; measure: CampaignMeasure | undefined; connected: boolean }) {
  const goal = AD_GOALS[campaign.goal];
  const stats = campaign.stats;
  const followers = followersGained(campaign);
  const funnel = goalUsesSite(campaign.goal) ? campaignFunnel(campaign, measure) : null;
  const image = goal.flyer ? adImageUrl(campaign, false) : campaign.postImage;
  return (
    <article className="grid gap-4 border border-line bg-bg/50 p-4 md:grid-cols-[150px_minmax(0,1fr)]">
      <div className="aspect-[4/5] overflow-hidden border border-line bg-stage">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- imagen generada por el servidor
          <img src={image} alt={campaign.headline} loading="lazy" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className={`border border-line px-2 py-0.5 font-semibold ${STATUS[campaign.status].tone}`}>{STATUS[campaign.status].label}</span>
          <span>{goal.label}</span>
          <span>{AD_AUDIENCES[campaign.audience].short}</span>
          <span>{AD_LOCATIONS[campaign.location].short}</span>
          <span>
            {mxn(campaign.budgetMxn)} MXN · {campaign.days} días
          </span>
          {campaign.status === "activa" && campaign.endAt ? <CampaignTimer endAt={campaign.endAt} /> : null}
        </div>
        <h3 className="text-base font-semibold tracking-tight text-fg">{campaign.headline || "Publicación promocionada"}</h3>
        {campaign.activatedAt ? (
          <p className="text-xs text-muted">
            Activada {formatCdmx(campaign.activatedAt)} · del {formatCdmx(campaign.startAt)} al {formatCdmx(campaign.endAt)}
          </p>
        ) : null}
        {campaign.error ? <p className="text-xs text-alert">Meta respondió: {campaign.error}</p> : null}

        {stats ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Gastado" value={mxn(stats.spend)} hint={`de ${mxn(campaign.budgetMxn)}`} />
            <Stat label="Vistas" value={num(stats.impressions)} hint={`${num(stats.reach)} personas`} />
            <Stat label="Clics" value={num(stats.clicks)} />
            <Stat label={goal.result} value={num(goalResult(campaign.goal, stats))} hint={followers ? `+${num(followers.gained)} desde que se activó` : undefined} />
          </div>
        ) : null}

        {funnel && campaign.activatedAt ? (
          <ol className="flex flex-wrap gap-1 text-xs">
            {funnel.map((step) => (
              <li key={step.key} className="border border-line px-2.5 py-1.5">
                <span className="text-muted">{step.label}</span> <span className="font-semibold text-fg tabular-nums">{num(step.value)}</span>
                {step.rate != null ? <span className="text-muted"> · {step.rate}%</span> : null}
              </li>
            ))}
          </ol>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {(campaign.status === "borrador" || campaign.status === "error") && connected ? (
            <ActionButton action={sendAdToMetaAction.bind(null, campaign.id)} label="Crear en Meta (en pausa)" pendingLabel="Creando…" variant="primary" />
          ) : null}
          {campaign.status === "pausada" ? <ActivateButton id={campaign.id} budgetMxn={campaign.budgetMxn} days={campaign.days} /> : null}
          {campaign.status === "activa" ? <ActionButton action={pauseAdCampaignAction.bind(null, campaign.id)} label="Pausar" pendingLabel="Pausando…" /> : null}
          {!campaign.activatedAt && goal.flyer ? <ActionButton action={redesignAdCampaignAction.bind(null, campaign.id)} label="Rediseñar flyer" pendingLabel="Rediseñando…" /> : null}
          {!campaign.activatedAt ? (
            <form action={deleteAdCampaignAction.bind(null, campaign.id)}>
              <button className={dangerButtonClass}>Eliminar</button>
            </form>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function FundsPanel({ funds, spent, account }: { funds: AdFund[]; spent: number; account: AdAccountInfo | null }) {
  const summary = adFundsSummary(account?.spentMxn ?? spent, funds);
  return (
    <Panel>
      <PanelHead title="Fondos" hint="El dinero nunca pasa por ATRIX: Meta cobra a la cuenta publicitaria (tarjeta o saldo prepagado). Anota aquí tus recargas para ver cuánto queda.">
        <a href={billingUrl()} target="_blank" rel="noreferrer" className={buttonClass}>
          Ver mis fondos en Meta
        </a>
        <a href={paymentMethodsUrl()} target="_blank" rel="noreferrer" className={buttonClass}>
          Método de pago
        </a>
      </PanelHead>
      <div className="space-y-4 p-4 md:p-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Recargas anotadas" value={mxn(summary.addedMxn)} />
          <Stat label="Gastado (Meta)" value={mxn(account?.spentMxn ?? spent)} />
          <Stat label="Queda (estimado)" value={summary.leftMxn == null ? "—" : mxn(summary.leftMxn)} />
          <Stat label="Saldo prepagado" value={account?.storedBalanceMxn == null ? "—" : mxn(account.storedBalanceMxn)} hint={account?.paymentLabel ?? undefined} />
        </div>
        <FundsForm />
        {summary.entries.length ? (
          <ul className="divide-y divide-line border-y border-line text-sm">
            {summary.entries.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-2">
                <span className="text-fg">
                  {mxn(row.amountMxn)} MXN <span className="text-xs text-muted">· {formatCdmx(row.at)}</span>
                </span>
                <form action={deleteAdFundsAction.bind(null, row.id)}>
                  <button className="text-xs text-muted transition hover:text-alert">Quitar</button>
                </form>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Panel>
  );
}

export default async function AdminCampanasPage({ searchParams }: { searchParams: Promise<{ grupo?: string }> }) {
  await requireAdmin();
  const { grupo } = await searchParams;
  const connected = adsConfigured();
  const storeReady = marketingStoreReady();
  const config = adsConfig();
  const social = metaStatus();

  let loadError: string | null = null;
  let campaigns: AdCampaign[] = [];
  let funds: AdFund[] = [];
  let account: AdAccountInfo | null = null;
  let accountError: string | null = null;
  if (storeReady) {
    try {
      // Números de Meta como máximo cada 15 minutos al abrir el panel.
      if (connected) await refreshCampaignStats(new Date(), 15 * 60_000).catch(() => 0);
      [campaigns, funds] = await Promise.all([listCampaigns(), listFunds()]);
    } catch (error) {
      loadError = error instanceof Error ? error.message : "No se pudo leer la base.";
    }
  }
  if (connected) {
    try {
      account = await adAccountInfo();
    } catch (error) {
      accountError = error instanceof Error ? error.message : "No se pudo leer la cuenta.";
    }
  }
  const measures = storeReady && !loadError ? await measuresByCampaign(campaigns.filter((c) => c.activatedAt).map((c) => c.id)).catch(() => ({})) : {};
  const posts = storeReady ? (await boostablePosts()).map((p) => ({ id: p.id, title: p.title })) : [];
  const group: AdGoalGroup | "todas" = grupo && Object.hasOwn(AD_GOAL_GROUPS, grupo) ? (grupo as AdGoalGroup) : "todas";
  const shown = group === "todas" ? campaigns : campaigns.filter((c) => AD_GOALS[c.goal].group === group);
  const spent = campaigns.reduce((sum, row) => sum + (row.stats?.spend ?? 0), 0);
  const leads = Object.values(measures as Record<string, CampaignMeasure>).reduce((sum, row) => sum + row.leads, 0);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-fg md:text-3xl">Campañas pagadas</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          Anuncios de Meta en Facebook e Instagram. Todo se crea en pausa y solo gasta cuando presionas «Activar» y confirmas el monto. Nunca
          gasta más del presupuesto total de la campaña.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel>
          <PanelHead title="Conexión" hint="Cuenta publicitaria, página y Pixel propios de ATRIX. Nunca uses los de otro negocio.">
            <ActionButton action={testAdAccountAction} label="Probar cuenta publicitaria" pendingLabel="Probando…" />
          </PanelHead>
          <ul className="divide-y divide-line px-4 md:px-5">
            <StatusRow ok={storeReady && !loadError} label="Base de datos" detail={loadError ?? (storeReady ? "Tablas listas." : "Falta SUPABASE_SERVICE_ROLE_KEY.")} />
            <StatusRow
              ok={connected && !accountError}
              label="Cuenta publicitaria"
              detail={
                !connected
                  ? "Faltan META_AD_ACCOUNT_ID, META_ADS_TOKEN y META_PAGE_ID. Mientras tanto las campañas se guardan sin crearse en Meta."
                  : accountError
                    ? accountError
                    : account
                      ? `${account.name} · ${account.currency} · ${account.status}${account.currency && account.currency !== "MXN" ? " (debe estar en MXN)" : ""}`
                      : "Conectada."
              }
            />
            <StatusRow ok={social.instagram} label="Instagram" detail={social.instagram ? "Conectado (seguidores en Instagram)." : "Opcional: para «Más seguidores en Instagram»."} />
            <StatusRow ok={pixelConfigured()} label="Pixel de Meta" detail={pixelConfigured() ? "Conectado: mide cotizaciones (solo con permiso de cookies)." : "Opcional: META_PIXEL_ID y NEXT_PUBLIC_META_PIXEL_ID para «Más cotizaciones»."} />
            <StatusRow ok={config.whatsappLinked} label="WhatsApp en anuncios" detail={config.whatsappLinked ? "Activo." : "Opcional: vincula WhatsApp Business a la página y pon META_WHATSAPP_LINKED=true."} />
          </ul>
        </Panel>
        <div className="grid grid-cols-2 gap-3 self-start">
          <Stat label="Activas" value={campaigns.filter((c) => c.status === "activa").length} />
          <Stat label="Gastado" value={mxn(spent)} hint="todas las campañas" />
          <Stat label="Apartado" value={mxn(reservedBudgetMxn(campaigns))} hint="en pausa o activas" />
          <Stat label="Cotizaciones" value={num(leads)} hint="desde anuncios" />
        </div>
      </div>

      {storeReady && !loadError ? (
        <>
          <Panel>
            <PanelHead title="Nueva campaña" hint="Recomendado al empezar: «Más visitas», CCTV, Nuevo Laredo, $100–300 por 3–7 días. Revisa los números a las 24 horas." />
            <AdCampaignForm availability={{ pixel: pixelConfigured(), whatsapp: config.whatsappLinked, instagram: social.instagram, posts }} maxBudget={adMaxBudgetMxn()} connected={connected} />
          </Panel>

          <Panel>
            <PanelHead title="Campañas" hint="Los números de Meta se actualizan cada 15 minutos al abrir el panel.">
              {connected ? (
                <form action={refreshAdStatsAction}>
                  <button className={buttonClass}>Actualizar resultados</button>
                </form>
              ) : null}
            </PanelHead>
            <nav className="flex gap-1 overflow-x-auto border-b border-line px-4 py-2 md:px-5" aria-label="Objetivo">
              {(["todas", ...(Object.keys(AD_GOAL_GROUPS) as AdGoalGroup[])] as const).map((g) => (
                <Link
                  key={g}
                  href={g === "todas" ? "/admin/campanas" : `/admin/campanas?grupo=${g}`}
                  className={`shrink-0 px-3 py-1.5 text-xs font-semibold transition ${group === g ? "bg-accent/15 text-accent" : "text-muted hover:text-fg"}`}
                >
                  {g === "todas" ? "Todas" : AD_GOAL_GROUPS[g]} ({g === "todas" ? campaigns.length : campaigns.filter((c) => AD_GOALS[c.goal].group === g).length})
                </Link>
              ))}
            </nav>
            <div className="space-y-3 p-4 md:p-5">
              {shown.length ? (
                shown.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} measure={(measures as Record<string, CampaignMeasure>)[campaign.id]} connected={connected} />)
              ) : (
                <p className="text-sm text-muted">Todavía no hay campañas aquí.</p>
              )}
            </div>
          </Panel>

          <FundsPanel funds={funds} spent={spent} account={account} />
        </>
      ) : (
        <Notice tone="warn">
          Para usar este módulo corre la migración <code>supabase/migrations/20261004_marketing.sql</code> en el SQL Editor de Supabase y confirma que
          SUPABASE_SERVICE_ROLE_KEY está en Vercel.
        </Notice>
      )}
    </div>
  );
}
