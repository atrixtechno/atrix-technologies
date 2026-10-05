"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { FieldLabel, buttonClass, inputClass, primaryButtonClass } from "@/components/marketing/ui";
import { AD_AUDIENCES, AD_AUDIENCE_ORDER, AD_LOCATIONS } from "@/lib/marketing/ad-locations";
import { AD_GOALS, AD_GOAL_ORDER, type AdGoal } from "@/lib/marketing/ad-goals";
import { createAdCampaignAction, suggestAdWordsAction } from "@/lib/marketing/ads-actions";
import { AD_MIN_BUDGET_MXN, AD_MIN_DAILY_MXN, adDefaults } from "@/lib/marketing/ads-rules";
import { MARKETING_STYLES, nextStyle, type DesignStyle } from "@/lib/marketing/styles";
import type { AdAudience, AdLocation } from "@/lib/marketing/types";

// "Nueva campaña" (Admin → Campañas pagadas): ¿qué quieres lograr?, servicio, lugar, presupuesto
// total y días. Se guarda y se crea en Meta EN PAUSA; nada gasta hasta "Activar".

export type GoalAvailability = { pixel: boolean; whatsapp: boolean; instagram: boolean; posts: { id: string; title: string }[] };

function budgetProblem(budget: number, days: number, max: number) {
  if (!Number.isInteger(days) || days < 1 || days > 30) return "Elige de 1 a 30 días.";
  if (!Number.isFinite(budget) || budget < AD_MIN_BUDGET_MXN) return `Mínimo $${AD_MIN_BUDGET_MXN} MXN.`;
  if (budget > max) return `Máximo $${max.toLocaleString("es-MX")} MXN por campaña.`;
  if (budget / days < AD_MIN_DAILY_MXN) return `Meta pide al menos $${AD_MIN_DAILY_MXN} MXN por día (pon $${days * AD_MIN_DAILY_MXN} o más).`;
  return null;
}

export function AdCampaignForm({ availability, maxBudget, connected }: { availability: GoalAvailability; maxBudget: number; connected: boolean }) {
  const [state, action, saving] = useActionState(createAdCampaignAction, null);
  const [goal, setGoal] = useState<AdGoal>("clics");
  const [audience, setAudience] = useState<AdAudience>("cctv");
  const [location, setLocation] = useState<AdLocation>("nuevo_laredo");
  const [style, setStyle] = useState<DesignStyle>("azul");
  const [headline, setHeadline] = useState("");
  const [subline, setSubline] = useState("");
  const [budget, setBudget] = useState(300);
  const [days, setDays] = useState(7);
  const [busy, startBusy] = useTransition();
  const base = adDefaults(audience, location, goal);
  const info = AD_GOALS[goal];
  const problem = budgetProblem(budget, days, maxBudget);

  const blocked = (g: AdGoal) => {
    const needs = AD_GOALS[g].needs;
    if (needs === "pixel" && !availability.pixel) return "Conecta el Pixel de Meta.";
    if (needs === "whatsapp" && !availability.whatsapp) return "Vincula WhatsApp Business a la página.";
    if (needs === "instagram" && !availability.instagram) return "Conecta Instagram.";
    if (needs === "post" && !availability.posts.length) return "Publica primero algo en Facebook desde Marketing en redes.";
    return null;
  };

  const query = useMemo(() => new URLSearchParams({ audience, location, goal, headline, subline, estilo: style }).toString(), [audience, location, goal, headline, subline, style]);
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 600);
    return () => window.clearTimeout(timer);
  }, [query]);

  function redesign() {
    startBusy(async () => {
      const words = await suggestAdWordsAction(audience, location, headline || base.headline, subline || base.subline, goal);
      setHeadline(words.headline);
      setSubline(words.subline);
      setStyle((s) => nextStyle(s));
    });
  }

  return (
    <form action={action} className="grid gap-6 p-4 md:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)]">
      <div className="space-y-5">
        <fieldset>
          <FieldLabel>¿Qué quieres lograr?</FieldLabel>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {AD_GOAL_ORDER.map((g) => {
              const reason = blocked(g);
              return (
                <label
                  key={g}
                  className={`block border p-3 text-sm transition ${goal === g ? "border-accent bg-accent/10" : "border-line hover:border-accent/40"} ${reason ? "opacity-60" : "cursor-pointer"}`}
                >
                  <span className="flex items-start gap-2">
                    <input type="radio" name="goal" value={g} checked={goal === g} disabled={Boolean(reason)} onChange={() => setGoal(g)} className="mt-1" />
                    <span>
                      <span className="block font-semibold text-fg">{AD_GOALS[g].label}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted">{reason ?? AD_GOALS[g].hint}</span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {goal === "interaccion" ? (
          <label className="block text-sm">
            <FieldLabel>Publicación de Facebook a promocionar</FieldLabel>
            <select name="postId" className={inputClass} required>
              {availability.posts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <FieldLabel>Servicio</FieldLabel>
            <select name="audience" className={inputClass} value={audience} onChange={(event) => setAudience(event.target.value as AdAudience)}>
              {AD_AUDIENCE_ORDER.map((a) => (
                <option key={a} value={a}>
                  {AD_AUDIENCES[a].label}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-muted">El anuncio lleva a {AD_AUDIENCES[audience].landing}</span>
          </label>
          <label className="block text-sm">
            <FieldLabel>Dónde se muestra</FieldLabel>
            <select name="location" className={inputClass} value={location} onChange={(event) => setLocation(event.target.value as AdLocation)}>
              {(Object.keys(AD_LOCATIONS) as AdLocation[]).map((l) => (
                <option key={l} value={l}>
                  {AD_LOCATIONS[l].label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <FieldLabel>Presupuesto total (MXN)</FieldLabel>
            <input name="budget" type="number" min={AD_MIN_BUDGET_MXN} max={maxBudget} step={10} className={inputClass} value={budget} onChange={(event) => setBudget(Number(event.target.value))} required />
          </label>
          <label className="block text-sm">
            <FieldLabel>Días</FieldLabel>
            <input name="days" type="number" min={1} max={30} className={inputClass} value={days} onChange={(event) => setDays(Number(event.target.value))} required />
          </label>
        </div>
        <p className={`text-xs ${problem ? "text-alert" : "text-muted"}`}>
          {problem ?? `Como máximo $${budget.toLocaleString("es-MX")} MXN en ${days} días (unos $${Math.floor(budget / Math.max(days, 1)).toLocaleString("es-MX")} por día). Meta nunca gasta más del total.`}
        </p>

        {goal !== "interaccion" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <FieldLabel>Título del flyer</FieldLabel>
                <input name="headline" maxLength={90} className={inputClass} placeholder={base.headline} value={headline} onChange={(event) => setHeadline(event.target.value)} />
              </label>
              <label className="block text-sm">
                <FieldLabel>Texto corto</FieldLabel>
                <input name="subline" maxLength={140} className={inputClass} placeholder={base.subline} value={subline} onChange={(event) => setSubline(event.target.value)} />
              </label>
            </div>
            <label className="block text-sm">
              <FieldLabel>Texto del anuncio</FieldLabel>
              <textarea name="message" rows={4} maxLength={600} className={inputClass} placeholder={base.message} />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="block text-sm">
                <FieldLabel>Estilo</FieldLabel>
                <select className={inputClass} value={style} onChange={(event) => setStyle(event.target.value as DesignStyle)}>
                  {MARKETING_STYLES.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.label}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className={`${buttonClass} self-end`} onClick={redesign} disabled={busy}>
                {busy ? "Pensando…" : "Rediseñar flyer"}
              </button>
            </div>
          </>
        ) : null}
        <input type="hidden" name="style" value={style} />

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <button type="submit" className={primaryButtonClass} disabled={saving || Boolean(problem) || Boolean(blocked(goal))}>
            {saving ? "Guardando…" : connected ? "Guardar y crear en Meta (en pausa)" : "Guardar campaña"}
          </button>
          {state && "ok" in state ? <span className="text-xs text-ok">{state.ok}</span> : null}
          {state && "error" in state ? <span className="text-xs text-alert">{state.error}</span> : null}
        </div>
        <p className="text-xs text-muted">Se crea en pausa: no gasta nada hasta que presiones «Activar» y confirmes el monto.</p>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{info.flyer ? "Flyer del anuncio" : "Usa la imagen de la publicación"}</p>
        <div className="relative aspect-[4/5] overflow-hidden border border-line bg-stage">
          {info.flyer ? (
            // eslint-disable-next-line @next/next/no-img-element -- vista previa generada por el servidor
            <img key={debounced} src={`/admin/campanas/vista-previa?${debounced}`} alt="Vista previa del anuncio" className="h-full w-full object-cover" />
          ) : (
            <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-stage-muted">Meta muestra la publicación tal como salió en tu página.</p>
          )}
        </div>
      </div>
    </form>
  );
}
