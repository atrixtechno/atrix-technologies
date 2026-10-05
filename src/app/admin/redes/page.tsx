import type { Metadata } from "next";
import Link from "next/link";
import { ActionButton } from "@/components/marketing/ActionButton";
import { SocialComposer } from "@/components/marketing/SocialComposer";
import { FieldLabel, Notice, Panel, PanelHead, Stat, StatusRow, buttonClass, dangerButtonClass, inputClass, primaryButtonClass } from "@/components/marketing/ui";
import { requireAdmin } from "@/lib/admin-guard";
import { aiEnabled } from "@/lib/marketing/ai";
import { groupPosts, postImageUrl } from "@/lib/marketing/social";
import {
  approveAllSocialAction,
  approveSocialPostAction,
  deleteSocialPostAction,
  generateWeekPlanAction,
  publishSocialNowAction,
  redesignSocialPostAction,
  saveSocialSettingsAction,
  testMetaConnectionAction,
  unscheduleSocialPostAction,
  updateSocialPostAction,
} from "@/lib/marketing/social-actions";
import { destinationLabel, metaStatus } from "@/lib/marketing/social-meta";
import { listPosts, marketingStoreReady, socialSettings } from "@/lib/marketing/store";
import { MARKETING_STYLES } from "@/lib/marketing/styles";
import { SOCIAL_THEMES } from "@/lib/marketing/templates";
import { formatCdmx, isoToCdmxInput } from "@/lib/marketing/time";
import type { SocialPost, SocialTheme } from "@/lib/marketing/types";

export const metadata: Metadata = {
  title: "Marketing en redes",
  alternates: { canonical: "/admin/redes" },
};

export const dynamic = "force-dynamic";

const TABS = [
  { id: "borradores", label: "Borradores" },
  { id: "programadas", label: "Programadas" },
  { id: "publicadas", label: "Publicadas" },
  { id: "errores", label: "Con error" },
] as const;

type Tab = (typeof TABS)[number]["id"];

const STATUS_LABEL: Record<SocialPost["status"], string> = {
  borrador: "Borrador",
  aprobada: "Programada",
  publicando: "Publicando…",
  publicada: "Publicada",
  error: "Con error",
};

/** Sugerencia del compositor: dentro de dos horas, en punto (hora CDMX). */
function defaultWhen() {
  const next = new Date(Date.now() + 2 * 3_600_000);
  next.setUTCMinutes(0, 0, 0);
  return isoToCdmxInput(next.toISOString());
}

function themeLabel(theme: SocialPost["theme"]) {
  return theme === "propia" ? "Imagen propia" : SOCIAL_THEMES[theme as SocialTheme]?.label ?? theme;
}

function PostCard({ post }: { post: SocialPost }) {
  const editable = post.status !== "publicada" && post.status !== "publicando";
  return (
    <article className="grid gap-4 border border-line bg-bg/50 p-4 sm:grid-cols-[160px_minmax(0,1fr)]">
      <a href={postImageUrl(post, "feed", false)} target="_blank" rel="noreferrer" className="block aspect-[4/5] overflow-hidden border border-line bg-stage">
        {/* eslint-disable-next-line @next/next/no-img-element -- imagen generada por el servidor */}
        <img src={postImageUrl(post, "feed", false)} alt={post.headline || "Publicación"} loading="lazy" className="h-full w-full object-cover" />
      </a>
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="border border-line px-2 py-0.5 font-semibold text-fg">{STATUS_LABEL[post.status]}</span>
          <span>{themeLabel(post.theme)}</span>
          <span>{formatCdmx(post.status === "publicada" ? post.publishedAt : post.scheduledAt)}</span>
          <span>{post.destinations.map(destinationLabel).join(" · ")}</span>
          {post.source === "plan" ? <span>Plan semanal</span> : null}
        </div>
        {post.headline ? <h3 className="text-base font-semibold tracking-tight text-fg">{post.headline}</h3> : null}
        <p className="line-clamp-4 text-sm whitespace-pre-line text-muted">{post.caption}</p>
        {post.results.length ? (
          <ul className="space-y-1 text-xs">
            {post.results.map((row) => (
              <li key={`${row.destination}-${row.at}`} className={row.ok ? "text-ok" : "text-alert"}>
                {destinationLabel(row.destination)}: {row.ok ? "publicada" : row.error}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {post.status === "borrador" || post.status === "error" ? (
            <form action={approveSocialPostAction.bind(null, post.id)}>
              <button className={primaryButtonClass}>Aprobar</button>
            </form>
          ) : null}
          {post.status === "aprobada" ? (
            <form action={unscheduleSocialPostAction.bind(null, post.id)}>
              <button className={buttonClass}>Regresar a borrador</button>
            </form>
          ) : null}
          {editable ? (
            <>
              <ActionButton
                action={publishSocialNowAction.bind(null, post.id)}
                label={post.status === "error" ? "Reintentar" : "Publicar ahora"}
                pendingLabel="Publicando…"
                confirm="Se publica ahora en las redes elegidas. ¿Continuar?"
              />
              <form action={redesignSocialPostAction.bind(null, post.id)}>
                <button className={buttonClass}>Rediseñar imagen</button>
              </form>
              <form action={deleteSocialPostAction.bind(null, post.id)}>
                <button className={dangerButtonClass}>Eliminar</button>
              </form>
            </>
          ) : null}
        </div>
        {editable ? (
          <details className="border-t border-line pt-3">
            <summary className="cursor-pointer text-xs font-semibold text-accent">Editar</summary>
            <form action={updateSocialPostAction.bind(null, post.id)} className="mt-3 space-y-3">
              {post.theme !== "propia" || post.frame ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <FieldLabel>Título</FieldLabel>
                    <input name="headline" defaultValue={post.headline} maxLength={120} className={inputClass} />
                  </label>
                  <label className="block text-sm">
                    <FieldLabel>Texto corto</FieldLabel>
                    <input name="subline" defaultValue={post.subline} maxLength={200} className={inputClass} />
                  </label>
                </div>
              ) : null}
              <label className="block text-sm">
                <FieldLabel>Texto de la publicación</FieldLabel>
                <textarea name="caption" defaultValue={post.caption} rows={6} maxLength={2200} className={inputClass} />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <FieldLabel>Día y hora (CDMX)</FieldLabel>
                  <input name="when" type="datetime-local" defaultValue={isoToCdmxInput(post.scheduledAt)} className={inputClass} />
                </label>
                {post.theme !== "propia" ? (
                  <label className="block text-sm">
                    <FieldLabel>Estilo</FieldLabel>
                    <select name="style" defaultValue={post.style} className={inputClass}>
                      {MARKETING_STYLES.map((row) => (
                        <option key={row.id} value={row.id}>
                          {row.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
              </div>
              <fieldset className="flex flex-wrap gap-4 text-sm text-fg">
                {(["ig_feed", "ig_story", "fb"] as const).map((d) => (
                  <label key={d} className="flex items-center gap-2">
                    <input type="checkbox" name="destinations" value={d} defaultChecked={post.destinations.includes(d)} /> {destinationLabel(d)}
                  </label>
                ))}
              </fieldset>
              <button className={primaryButtonClass}>Guardar cambios</button>
            </form>
          </details>
        ) : null}
      </div>
    </article>
  );
}

export default async function AdminRedesPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  await requireAdmin();
  const { tab: rawTab } = await searchParams;
  const tab: Tab = TABS.some((row) => row.id === rawTab) ? (rawTab as Tab) : "borradores";
  const meta = metaStatus();
  const storeReady = marketingStoreReady();
  let loadError: string | null = null;
  let posts: SocialPost[] = [];
  if (storeReady) {
    try {
      posts = await listPosts();
    } catch (error) {
      loadError = error instanceof Error ? error.message : "No se pudo leer la base.";
    }
  }
  const settings = await socialSettings().catch(() => null);
  const groups = groupPosts(posts);
  const list = tab === "programadas" ? groups.scheduled : tab === "publicadas" ? groups.published : tab === "errores" ? groups.failed : groups.drafts;
  const counts: Record<Tab, number> = { borradores: groups.drafts.length, programadas: groups.scheduled.length, publicadas: groups.published.length, errores: groups.failed.length };

  const themes = (Object.keys(SOCIAL_THEMES) as SocialTheme[]).map((id) => ({ id, ...SOCIAL_THEMES[id] }));

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-fg md:text-3xl">Marketing en redes</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          Publicaciones propias de ATRIX en Instagram y Facebook con imágenes de marca. Nada se publica sin tu aprobación, salvo que actives
          «publicar sin aprobación» en los ajustes.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel>
          <PanelHead title="Conexión" hint="Las variables se ponen en Vercel (nunca en el código). Los tokens van como tipo Secret.">
            <ActionButton action={testMetaConnectionAction} label="Probar conexión" pendingLabel="Probando…" />
          </PanelHead>
          <ul className="divide-y divide-line px-4 md:px-5">
            <StatusRow ok={storeReady && !loadError} label="Base de datos" detail={loadError ?? (storeReady ? "Tablas de marketing listas." : "Falta SUPABASE_SERVICE_ROLE_KEY.")} />
            <StatusRow ok={meta.instagram} label="Instagram" detail={meta.instagram ? "Conectado." : "Faltan META_IG_USER_ID y META_PAGE_TOKEN."} />
            <StatusRow ok={meta.facebook} label="Página de Facebook" detail={meta.facebook ? "Conectada." : "Faltan META_PAGE_ID y META_PAGE_TOKEN."} />
            <StatusRow ok={aiEnabled()} label="Textos con IA" detail={aiEnabled() ? "Activos." : "Opcional: ANTHROPIC_API_KEY. Sin ella se usan los textos de las plantillas."} />
            <StatusRow ok={Boolean(process.env.CRON_SECRET?.trim())} label="Publicación automática" detail={process.env.CRON_SECRET?.trim() ? "Cron listo (diario + cada visita, máximo cada 5 min)." : "Falta CRON_SECRET para el cron."} />
          </ul>
        </Panel>
        <div className="grid grid-cols-2 gap-3 self-start">
          <Stat label="Borradores" value={counts.borradores} />
          <Stat label="Programadas" value={counts.programadas} />
          <Stat label="Publicadas" value={counts.publicadas} hint="últimas 30" />
          <Stat label="Con error" value={counts.errores} />
        </div>
      </div>

      {storeReady && !loadError ? (
        <>
          <Panel>
            <PanelHead title="Nueva publicación" hint="Elige un tema: los textos salen del contenido real del sitio (servicios, consejos, proyectos, soporte remoto, conferencias). Sin datos inventados." />
            <SocialComposer themes={themes} defaultWhen={defaultWhen()} defaultDestinations={settings?.destinations ?? ["ig_feed", "fb"]} />
          </Panel>

          <Panel>
            <PanelHead title="Publicaciones" hint="Las publicaciones aprobadas salen solas a su hora.">
              <ActionButton action={generateWeekPlanAction} label="Generar plan semanal" pendingLabel="Generando…" />
              {counts.borradores ? (
                <form action={approveAllSocialAction}>
                  <button className={buttonClass}>Aprobar todos los borradores</button>
                </form>
              ) : null}
            </PanelHead>
            <nav className="flex gap-1 overflow-x-auto border-b border-line px-4 py-2 md:px-5" aria-label="Estado">
              {TABS.map((row) => (
                <Link
                  key={row.id}
                  href={`/admin/redes?tab=${row.id}`}
                  className={`shrink-0 px-3 py-1.5 text-xs font-semibold transition ${tab === row.id ? "bg-accent/15 text-accent" : "text-muted hover:text-fg"}`}
                >
                  {row.label} ({counts[row.id]})
                </Link>
              ))}
            </nav>
            <div className="space-y-3 p-4 md:p-5">
              {list.length ? list.map((post) => <PostCard key={post.id} post={post} />) : <p className="text-sm text-muted">No hay publicaciones aquí.</p>}
            </div>
          </Panel>

          {settings ? (
            <Panel>
              <PanelHead title="Ajustes" hint="El plan semanal crea borradores cada lunes para los siguientes 7 días, rotando temas." />
              <form action={saveSocialSettingsAction} className="grid gap-4 p-4 md:grid-cols-2 md:p-5">
                <label className="flex items-center gap-2 text-sm text-fg">
                  <input type="checkbox" name="autoPlan" defaultChecked={settings.autoPlan} /> Crear el plan cada lunes automáticamente
                </label>
                <label className="flex items-center gap-2 text-sm text-fg">
                  <input type="checkbox" name="autoApprove" defaultChecked={settings.autoApprove} /> Publicar sin aprobación (no recomendado)
                </label>
                <label className="block text-sm">
                  <FieldLabel>Publicaciones por semana</FieldLabel>
                  <select name="postsPerWeek" defaultValue={String(settings.postsPerWeek)} className={inputClass}>
                    <option value="3">3 (lun, mié, vie)</option>
                    <option value="5">5 (lunes a viernes)</option>
                    <option value="7">7 (diario)</option>
                  </select>
                </label>
                <label className="block text-sm">
                  <FieldLabel>Hora (Ciudad de México)</FieldLabel>
                  <select name="hour" defaultValue={String(settings.hour)} className={inputClass}>
                    {Array.from({ length: 17 }, (_, i) => i + 6).map((h) => (
                      <option key={h} value={h}>
                        {String(h).padStart(2, "0")}:00
                      </option>
                    ))}
                  </select>
                </label>
                <fieldset className="text-sm">
                  <FieldLabel>Destinos del plan</FieldLabel>
                  <div className="mt-2 flex flex-wrap gap-4 text-fg">
                    {(["ig_feed", "ig_story", "fb"] as const).map((d) => (
                      <label key={d} className="flex items-center gap-2">
                        <input type="checkbox" name="destinations" value={d} defaultChecked={settings.destinations.includes(d)} /> {destinationLabel(d)}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="flex items-center gap-2 self-end text-sm text-fg">
                  <input type="checkbox" name="contactStrip" defaultChecked={settings.contactStrip} /> Franja «Cotiza por WhatsApp» en las imágenes
                </label>
                <div className="md:col-span-2">
                  <button className={primaryButtonClass}>Guardar ajustes</button>
                </div>
              </form>
            </Panel>
          ) : null}
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
