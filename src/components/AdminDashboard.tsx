"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import {
  ADMIN_EMAIL,
  clearAdminSession,
  hasAdminSession,
  isPasswordChanged,
} from "@/lib/admin-auth";

export function AdminDashboard() {
  const router = useRouter();
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasAdminSession() || !isPasswordChanged()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  function logout() {
    clearAdminSession();
    router.replace("/login");
  }

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted">
        Cargando…
      </div>
    );
  }

  const isLight = theme === "light";

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center" aria-label="ATRIX Technologies">
          <Logo
            variant={isLight ? "lockup-light" : "lockup"}
            size={168}
            priority
            className="shrink-0"
          />
        </Link>
        <ThemeToggle />
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -inset-px rounded-sm bg-gradient-to-br from-accent/25 via-transparent to-signal/20 opacity-70" />
        <div className="relative border border-line bg-bg-elevated/85 p-6 backdrop-blur md:p-8">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
            Panel
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg">
            Bienvenido
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Sesión iniciada como{" "}
            <span className="font-medium text-fg">{ADMIN_EMAIL}</span>. Este es
            un acceso interno mínimo; el panel completo se construirá más
            adelante.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110"
            >
              Cerrar sesión
            </button>
            <Link
              href="/"
              className="inline-flex rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-fg transition hover:border-accent/40 hover:text-accent"
            >
              Ir al sitio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
