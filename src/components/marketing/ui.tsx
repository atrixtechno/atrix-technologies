import type { ReactNode } from "react";

// Piezas visuales del panel de Marketing y Campañas, con el mismo lenguaje del resto del admin
// (bordes rectos, paneles elevados, etiquetas en mayúsculas pequeñas).

export const inputClass =
  "mt-1.5 w-full border border-line bg-bg px-3 py-2.5 text-sm text-fg outline-none transition placeholder:text-muted/60 focus:border-accent";

export const buttonClass =
  "inline-flex items-center justify-center gap-2 border border-line px-3.5 py-2 text-xs font-semibold text-fg transition hover:border-accent/50 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50";

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 border border-accent bg-accent px-3.5 py-2 text-xs font-semibold text-accent-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";

export const dangerButtonClass =
  "inline-flex items-center justify-center gap-2 border border-line px-3.5 py-2 text-xs font-semibold text-muted transition hover:border-alert/50 hover:text-alert disabled:cursor-not-allowed disabled:opacity-50";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`border border-line bg-bg-elevated/70 ${className}`}>{children}</section>;
}

export function PanelHead({ title, hint, children }: { title: string; hint?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-4 md:px-5">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight text-fg">{title}</h2>
        {hint ? <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted">{hint}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{children}</span>;
}

export function StatusRow({ ok, label, detail }: { ok: boolean; label: string; detail?: ReactNode }) {
  return (
    <li className="flex items-start gap-3 py-2.5">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${ok ? "bg-ok" : "bg-warn"}`} aria-hidden />
      <span className="min-w-0 text-sm">
        <span className="font-medium text-fg">{label}</span>
        {detail ? <span className="block text-xs leading-relaxed text-muted">{detail}</span> : null}
      </span>
    </li>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="border border-line bg-bg/60 px-4 py-3">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-fg tabular-nums">{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn"; children: ReactNode }) {
  return (
    <p
      className={`border px-3 py-2 text-xs leading-relaxed ${
        tone === "warn" ? "border-warn/40 bg-warn/10 text-fg" : "border-accent/25 bg-accent/10 text-fg"
      }`}
    >
      {children}
    </p>
  );
}
