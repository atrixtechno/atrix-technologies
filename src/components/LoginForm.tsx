"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import {
  clearAdminUiSession,
  isValidAdminUser,
  markAdminUiSession,
  normalizeUsername,
} from "@/lib/admin-auth";

type Step = "login" | "change-password";

export function LoginForm() {
  const router = useRouter();
  const { theme } = useTheme();
  const [step, setStep] = useState<Step>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch("/api/admin/session", {
          credentials: "include",
          cache: "no-store",
        });
        const data = (await res.json()) as {
          authenticated?: boolean;
          mustChangePassword?: boolean;
        };
        if (cancelled) return;
        if (data.authenticated) {
          markAdminUiSession(true);
          router.replace("/admin");
          return;
        }
        if (data.mustChangePassword) {
          setStep("change-password");
        }
      } catch {
        /* stay on login */
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    void check();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const localUser = normalizeUsername(username);
      if (!isValidAdminUser(localUser)) {
        setError("Usuario o contraseña incorrectos.");
        return;
      }

      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: localUser, password }),
      });
      const data = (await res.json()) as {
        error?: string;
        mustChangePassword?: boolean;
        ok?: boolean;
      };

      if (!res.ok) {
        setError(data.error || "Usuario o contraseña incorrectos.");
        return;
      }

      if (data.mustChangePassword) {
        clearAdminUiSession();
        setStep("change-password");
        setPassword("");
        return;
      }

      markAdminUiSession(true);
      router.replace("/admin");
    } catch {
      setError("No se pudo conectar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword === "12345678") {
      setError("Elige una contraseña distinta a la inicial.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });
      const data = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setError(data.error || "No se pudo cambiar la contraseña.");
        return;
      }
      markAdminUiSession(true);
      router.replace("/admin");
    } catch {
      setError("No se pudo conectar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
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
    <div className="relative mx-auto w-full max-w-md">
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
          {step === "login" ? (
            <>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
                Panel interno
              </p>
              <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg">
                Acceso
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Ingresa con tu cuenta ATRIX para continuar.
              </p>

              <form onSubmit={onLogin} className="mt-8 space-y-5">
                <label className="block">
                  <span className="text-xs tracking-[0.16em] text-muted uppercase">
                    usuario
                  </span>
                  <div className="mt-2 flex border border-line bg-bg transition focus-within:border-accent">
                    <input
                      name="username"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value.replace(/@.*$/, ""))
                      }
                      placeholder="usuario"
                      className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-fg outline-none"
                    />
                    <span
                      className="shrink-0 border-l border-line px-3 py-3.5 text-sm text-muted select-none"
                      aria-hidden
                    >
                      @atrix.com
                    </span>
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs tracking-[0.16em] text-muted uppercase">
                    contraseña
                  </span>
                  <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="contraseña"
                    className="mt-2 w-full border border-line bg-bg px-4 py-3.5 text-fg outline-none transition focus:border-accent"
                  />
                </label>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
                >
                  {loading ? "Verificando…" : "Entrar"}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
                Seguridad
              </p>
              <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg">
                Cambiar contraseña
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Por seguridad, debes definir una nueva contraseña antes de
                continuar. Mínimo 8 caracteres.
              </p>

              <form onSubmit={onChangePassword} className="mt-8 space-y-5">
                <label className="block">
                  <span className="text-xs tracking-[0.16em] text-muted uppercase">
                    Nueva contraseña
                  </span>
                  <input
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-2 w-full border border-line bg-bg px-4 py-3.5 text-fg outline-none transition focus:border-accent"
                  />
                </label>

                <label className="block">
                  <span className="text-xs tracking-[0.16em] text-muted uppercase">
                    Confirmar contraseña
                  </span>
                  <input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2 w-full border border-line bg-bg px-4 py-3.5 text-fg outline-none transition focus:border-accent"
                  />
                </label>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
                >
                  {loading ? "Guardando…" : "Guardar y continuar"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        <Link href="/" className="transition hover:text-accent">
          Volver al sitio
        </Link>
      </p>
    </div>
  );
}
