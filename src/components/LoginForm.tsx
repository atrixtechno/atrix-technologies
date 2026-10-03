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

    if (newPassword.length < 10) {
      setError("La nueva contraseña debe tener al menos 10 caracteres.");
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
        <div className="pointer-events-none absolute -inset-px rounded-[1.25rem] bg-gradient-to-br from-accent/40 via-transparent to-signal/30" />
        <div className="relative overflow-hidden rounded-[1.25rem] border border-line bg-bg-elevated shadow-[var(--shadow-soft)]">
          <div className="console-bar !border-line">
            <i />
            <i />
            <i />
            <span className="mono ml-2 text-[11px] text-muted">atrix://panel/acceso</span>
            <span className="mono ml-auto inline-flex items-center gap-1.5 text-[10px] tracking-[0.12em] text-success uppercase">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7" />
              </svg>
              Cifrado
            </span>
          </div>
          <div className="p-6 md:p-8">
          {step === "login" ? (
            <>
              <p className="eyebrow">Panel interno</p>
              <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg">
                Acceso
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Ingresa con tu cuenta ATRIX para continuar.
              </p>

              <form onSubmit={onLogin} className="mt-8 space-y-5">
                <label className="block">
                  <span className="field-label">
                    usuario
                  </span>
                  <div className="mt-2 flex rounded-xl border border-line-strong bg-bg/70 transition focus-within:border-accent focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_18%,transparent)]">
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
                  <span className="field-label">
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
                    className="field mt-2"
                  />
                </label>

                {error && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full disabled:opacity-60"
                >
                  {loading ? "Verificando…" : "Entrar"}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="eyebrow">Seguridad</p>
              <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg">
                Cambiar contraseña
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Por seguridad, debes definir una nueva contraseña antes de
                continuar. Mínimo 10 caracteres.
              </p>

              <form onSubmit={onChangePassword} className="mt-8 space-y-5">
                <label className="block">
                  <span className="field-label">
                    Nueva contraseña
                  </span>
                  <input
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={10}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="field mt-2"
                  />
                </label>

                <label className="block">
                  <span className="field-label">
                    Confirmar contraseña
                  </span>
                  <input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={10}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="field mt-2"
                  />
                </label>

                {error && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full disabled:opacity-60"
                >
                  {loading ? "Guardando…" : "Guardar y continuar"}
                </button>
              </form>
            </>
          )}
          </div>
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
