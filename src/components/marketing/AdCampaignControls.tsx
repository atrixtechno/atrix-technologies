"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { FieldLabel, inputClass, primaryButtonClass } from "@/components/marketing/ui";
import { activateAdCampaignAction, addAdFundsAction } from "@/lib/marketing/ads-actions";

/** "Activar": pide escribir el monto exacto antes de empezar a gastar. */
export function ActivateButton({ id, budgetMxn, days }: { id: string; budgetMxn: number; days: number }) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={primaryButtonClass}
        disabled={pending}
        onClick={() => {
          const typed = window.prompt(
            `Esta campaña gastará como máximo $${budgetMxn.toLocaleString("es-MX")} MXN en ${days} días.\n\nPara activarla, escribe el monto exacto (${budgetMxn}):`,
          );
          if (typed == null) return;
          const amount = Number(typed.replace(/[$,\s]/g, ""));
          if (amount !== budgetMxn) {
            setMessage({ ok: false, text: "El monto no coincide. No se activó." });
            return;
          }
          start(async () => {
            const result = await activateAdCampaignAction(id, amount);
            setMessage({ ok: result.ok, text: result.message });
          });
        }}
      >
        {pending ? "Activando…" : "Activar"}
      </button>
      {message ? <span className={`text-xs ${message.ok ? "text-ok" : "text-alert"}`}>{message.text}</span> : null}
    </span>
  );
}

function left(ms: number) {
  if (ms <= 0) return "Terminó";
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return d ? `Termina en ${d} d ${h} h` : h ? `Termina en ${h} h ${m} min` : `Termina en ${m} min`;
}

/** Tiempo que le queda a una campaña activa (se actualiza cada minuto). */
export function CampaignTimer({ endAt }: { endAt: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  if (now == null) return null;
  return <span className="text-xs font-medium text-accent tabular-nums">{left(new Date(endAt).getTime() - now)}</span>;
}

/** "Registrar recarga": anota lo que agregaste en Meta para estimar cuánto queda. */
export function FundsForm() {
  const [state, action, pending] = useActionState(addAdFundsAction, null);
  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <label className="block text-sm">
        <FieldLabel>Monto agregado en Meta (MXN)</FieldLabel>
        <input name="amount" inputMode="decimal" placeholder="300" className={`${inputClass} w-40`} required />
      </label>
      <button className={primaryButtonClass} disabled={pending}>
        {pending ? "Guardando…" : "Registrar recarga"}
      </button>
      {state && "ok" in state ? <span className="text-xs text-ok">{state.ok}</span> : null}
      {state && "error" in state ? <span className="text-xs text-alert">{state.error}</span> : null}
    </form>
  );
}
