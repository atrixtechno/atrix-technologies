"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import {
  ADMIN_USERNAME,
  clearAdminUiSession,
  hasAdminUiSession,
  markAdminUiSession,
} from "@/lib/admin-auth";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/proyectos", label: "Proyecto", exact: false },
  { href: "/admin/facturas", label: "Factura", exact: false },
  { href: "/admin/tarjeta", label: "Tarjeta presentación", exact: false },
] as const;

function navActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      try {
        const res = await fetch("/api/admin/session", {
          credentials: "include",
          cache: "no-store",
        });
        if (cancelled) return;
        if (!res.ok) {
          clearAdminUiSession();
          router.replace("/login");
          return;
        }
        const data = (await res.json()) as {
          authenticated?: boolean;
          mustChangePassword?: boolean;
        };
        if (!data.authenticated) {
          clearAdminUiSession();
          router.replace("/login");
          return;
        }
        markAdminUiSession(true);
        setReady(true);
      } catch {
        if (!cancelled) {
          if (hasAdminUiSession()) {
            // Network blip — keep UI if flag present; APIs will 401.
            setReady(true);
          } else {
            router.replace("/login");
          }
        }
      }
    }
    void verify();
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function logout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* clear local anyway */
    }
    clearAdminUiSession();
    router.replace("/login");
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-muted">
        Cargando panel…
      </div>
    );
  }

  const isLight = theme === "light";

  const navList = (
    <nav className="flex flex-col gap-1" aria-label="Módulos del panel">
      {NAV.map((item) => {
        const active = navActive(pathname, item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-sm px-3 py-2.5 text-sm transition ${
              active
                ? "bg-accent/15 font-semibold text-accent"
                : "text-muted hover:bg-bg/60 hover:text-fg"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="atmosphere relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-tech opacity-30" />

      <div className="relative mx-auto flex min-h-dvh max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-bg-elevated/80 backdrop-blur md:flex">
          <div className="border-b border-line px-5 py-5">
            <Link href="/" className="inline-flex" aria-label="ATRIX Technologies">
              <Logo
                variant={isLight ? "lockup-light" : "lockup"}
                size={148}
                priority
                className="shrink-0"
              />
            </Link>
            <p className="mt-3 text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
              Panel admin
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">{navList}</div>

          <div className="space-y-3 border-t border-line px-4 py-4">
            <p className="truncate text-xs text-muted">
              Sesión:{" "}
              <span className="font-medium text-fg">{ADMIN_USERNAME}</span>
            </p>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={logout}
                className="flex-1 rounded-full border border-line px-3 py-2 text-xs font-semibold text-fg transition hover:border-accent/40 hover:text-accent"
              >
                Cerrar sesión
              </button>
            </div>
            <Link
              href="/"
              className="block text-center text-xs text-muted transition hover:text-accent"
            >
              Ver sitio público
            </Link>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar */}
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-bg-elevated/90 px-4 py-3 backdrop-blur md:hidden">
            <Link href="/" className="inline-flex" aria-label="ATRIX Technologies">
              <Logo
                variant={isLight ? "lockup-light" : "lockup"}
                size={120}
                className="shrink-0"
              />
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                className="rounded-sm border border-line px-3 py-2 text-xs font-semibold text-fg"
                aria-expanded={mobileOpen}
                aria-controls="admin-mobile-nav"
              >
                {mobileOpen ? "Cerrar" : "Menú"}
              </button>
            </div>
          </header>

          {mobileOpen && (
            <div
              id="admin-mobile-nav"
              className="border-b border-line bg-bg-elevated/95 px-3 py-3 md:hidden"
            >
              {navList}
              <div className="mt-3 flex gap-2 border-t border-line pt-3">
                <button
                  type="button"
                  onClick={logout}
                  className="flex-1 rounded-full bg-accent px-3 py-2 text-xs font-semibold text-accent-ink"
                >
                  Cerrar sesión
                </button>
                <Link
                  href="/"
                  className="flex-1 rounded-full border border-line px-3 py-2 text-center text-xs font-semibold text-fg"
                >
                  Sitio
                </Link>
              </div>
            </div>
          )}

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
