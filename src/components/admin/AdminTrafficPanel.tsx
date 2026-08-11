"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalyticsStats } from "@/lib/analytics";
import { AUTH_KEYS, ensureAdminSessionCookie } from "@/lib/admin-auth";

const POLL_MS = 8_000;

function formatRelative(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";
  const delta = Date.now() - t;
  if (delta < 60_000) return "hace unos segundos";
  if (delta < 3_600_000) return `hace ${Math.floor(delta / 60_000)} min`;
  if (delta < 86_400_000) return `hace ${Math.floor(delta / 3_600_000)} h`;
  return new Date(iso).toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function BarList({
  items,
  emptyLabel,
}: {
  items: { label: string; count: number }[];
  emptyLabel: string;
}) {
  const max = items[0]?.count ?? 0;
  if (!items.length) {
    return <p className="mt-4 text-sm text-muted">{emptyLabel}</p>;
  }
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => {
        const pct = max > 0 ? Math.max(4, Math.round((item.count / max) * 100)) : 0;
        return (
          <li key={item.label}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate font-medium text-fg" title={item.label}>
                {item.label}
              </span>
              <span className="shrink-0 tabular-nums text-muted">{item.count}</span>
            </div>
            <div className="h-1.5 overflow-hidden bg-line/80">
              <div
                className="h-full bg-accent transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function AdminTrafficPanel() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    ensureAdminSessionCookie();
    const session = window.localStorage.getItem(AUTH_KEYS.session) ?? "";
    try {
      const res = await fetch("/api/analytics/stats", {
        credentials: "same-origin",
        headers: session ? { "x-atrix-admin-session": session } : {},
        cache: "no-store",
      });
      if (res.status === 401) {
        setError("Sesión no válida para analítica.");
        setLoading(false);
        return;
      }
      const data = (await res.json()) as AnalyticsStats;
      setStats(data);
      setError(null);
    } catch {
      setError("No se pudo cargar el tráfico.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), POLL_MS);
    return () => window.clearInterval(id);
  }, [load]);

  const totals = stats?.totals ?? { today: 0, last7d: 0, all: 0, live5m: 0 };
  const live = totals.live5m;

  return (
    <section className="space-y-5 border border-line bg-bg-elevated/70 p-5 backdrop-blur md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-fg">
            Tráfico del sitio
          </h2>
          <p className="mt-1 text-sm text-muted">
            Vistas en tiempo casi real (actualiza cada {POLL_MS / 1000}s). Sin
            datos personales.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span
            className={`inline-block size-2 rounded-full ${
              live > 0 ? "bg-accent animate-pulse" : "bg-muted/50"
            }`}
            aria-hidden
          />
          {loading && !stats
            ? "Cargando…"
            : stats?.updatedAt
              ? `Act. ${formatRelative(stats.updatedAt)}`
              : "—"}
        </div>
      </div>

      {error ? (
        <p className="border border-line bg-bg/40 px-3 py-2 text-sm text-muted">
          {error}
        </p>
      ) : null}

      {stats?.setupNote ? (
        <p className="border border-accent/30 bg-accent/5 px-3 py-2 text-sm leading-relaxed text-fg">
          {stats.setupNote}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <TrafficStat
          label="Últimos 5 min"
          value={totals.live5m}
          hint="Actividad en vivo"
          emphasize
        />
        <TrafficStat label="Hoy" value={totals.today} hint="Zona México" />
        <TrafficStat label="7 días" value={totals.last7d} hint="Ventana reciente" />
        <TrafficStat label="Total" value={totals.all} hint="Histórico" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
            Páginas más visitadas
          </h3>
          <BarList
            items={(stats?.topPages ?? []).map((p) => ({
              label: p.path,
              count: p.count,
            }))}
            emptyLabel="Sin datos aún — navega el sitio público para generar eventos."
          />
        </div>
        <div>
          <h3 className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
            Secciones / hash
          </h3>
          <BarList
            items={(stats?.topSections ?? []).map((s) => ({
              label: s.label,
              count: s.count,
            }))}
            emptyLabel="Sin anclas (#sección) registradas en los últimos 7 días."
          />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
          Eventos recientes
        </h3>
        {(stats?.recent?.length ?? 0) === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Aún no hay visitas registradas.
          </p>
        ) : (
          <ul className="mt-3 max-h-64 divide-y divide-line overflow-y-auto border border-line">
            {(stats?.recent ?? []).map((ev, i) => (
              <li
                key={`${ev.created_at}-${ev.path}-${i}`}
                className="flex items-baseline justify-between gap-3 px-3 py-2 text-sm"
              >
                <span className="truncate font-medium text-fg">
                  {ev.path}
                  {ev.hash ? (
                    <span className="text-accent">#{ev.hash}</span>
                  ) : null}
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {formatRelative(ev.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function TrafficStat({
  label,
  value,
  hint,
  emphasize,
}: {
  label: string;
  value: number;
  hint: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={`border p-4 ${
        emphasize
          ? "border-accent/40 bg-accent/8"
          : "border-line bg-bg/30"
      }`}
    >
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
        {label}
      </p>
      <p
        className={`font-display mt-2 text-2xl font-semibold tabular-nums tracking-tight ${
          emphasize ? "text-accent" : "text-fg"
        }`}
      >
        {value.toLocaleString("es-MX")}
      </p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
