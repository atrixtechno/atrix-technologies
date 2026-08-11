"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminTrafficPanel } from "@/components/admin/AdminTrafficPanel";
import { ADMIN_USERNAME } from "@/lib/admin-auth";
import { projects } from "@/content/projects";

const SITE_SECTIONS = [
  { href: "/", label: "Inicio", copy: "Landing principal ATRIX" },
  { href: "/proyectos", label: "Proyectos", copy: "Casos y software público" },
  { href: "/conferencias", label: "Conferencias", copy: "Agenda y perfil" },
  { href: "/soporte-remoto", label: "Soporte remoto", copy: "Asistencia técnica" },
  { href: "/#contacto", label: "Contacto", copy: "WhatsApp y formulario" },
] as const;

const QUICK_LINKS = [
  { href: "/conferencias", label: "Conferencias" },
  { href: "/soporte-remoto", label: "Soporte remoto" },
  { href: "/#contacto", label: "Contacto" },
  { href: "/admin/proyectos", label: "Gestionar proyectos" },
  { href: "/admin/facturas", label: "Factura / comprobante" },
  { href: "/admin/tarjeta", label: "Tarjeta de presentación" },
] as const;

export function AdminDashboardHome() {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionSince, setSessionSince] = useState<string>("—");
  const [expiresLabel, setExpiresLabel] = useState<string>("8 horas");

  useEffect(() => {
    let cancelled = false;
    async function loadSession() {
      try {
        const res = await fetch("/api/admin/session", {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          authenticated?: boolean;
          iat?: number;
          exp?: number;
          expiresIn?: number;
        };
        if (!data.authenticated || !data.exp) return;
        setSessionActive(true);
        const startMs = (data.iat ?? data.exp - 8 * 60 * 60) * 1000;
        setSessionSince(
          new Date(startMs).toLocaleString("es-MX", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        );
        const hoursLeft = Math.max(
          0,
          Math.ceil((data.expiresIn ?? 0) / 3600),
        );
        setExpiresLabel(
          hoursLeft <= 1 ? "expira en ~1 h" : `expira en ~${hoursLeft} h`,
        );
      } catch {
        /* ignore */
      }
    }
    void loadSession();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
          Dashboard
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          Resumen del panel
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Panel de administración ATRIX. La sesión es una cookie httpOnly firmada
          que expira a las 8 horas.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Proyectos publicados"
          value={String(projects.length)}
          hint="Desde el catálogo del sitio"
        />
        <SummaryCard
          label="Módulos del panel"
          value="4"
          hint="Dashboard · Proyecto · Factura · Tarjeta"
        />
        <SummaryCard
          label="Usuario"
          value={ADMIN_USERNAME}
          hint="Cuenta interna ATRIX"
        />
        <SummaryCard
          label="Sesión desde"
          value={sessionSince}
          hint={sessionActive ? expiresLabel : "Sin sesión"}
        />
      </section>

      <AdminTrafficPanel />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-line bg-bg-elevated/70 p-5 backdrop-blur md:p-6">
          <h2 className="font-display text-lg font-semibold text-fg">
            Secciones del sitio
          </h2>
          <p className="mt-1 text-sm text-muted">
            Enlaces rápidos a la presencia pública.
          </p>
          <ul className="mt-5 divide-y divide-line">
            {SITE_SECTIONS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-baseline justify-between gap-3 py-3 text-sm transition hover:text-accent"
                >
                  <span className="font-medium text-fg">{item.label}</span>
                  <span className="truncate text-xs text-muted">{item.copy}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-line bg-bg-elevated/70 p-5 backdrop-blur md:p-6">
          <h2 className="font-display text-lg font-semibold text-fg">
            Accesos rápidos
          </h2>
          <p className="mt-1 text-sm text-muted">
            Conferencias, soporte, contacto y módulos internos.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-fg transition hover:border-accent/40 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 border-t border-line pt-5">
            <h3 className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">
              Nota
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Panel interno ATRIX: vault de proyectos (secretos cifrados),
              comprobantes PDF, editor de tarjeta y analítica. Requiere Supabase
              service role para persistencia.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="border border-line bg-bg-elevated/70 p-4 backdrop-blur md:p-5">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
        {label}
      </p>
      <p className="font-display mt-2 text-2xl font-semibold tracking-tight text-fg">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
