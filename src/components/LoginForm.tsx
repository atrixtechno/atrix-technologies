"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import {
  changeAdminPassword,
  clearAdminSession,
  hasAdminSession,
  isPasswordChanged,
  isValidAdminUser,
  mustChangePassword,
  setAdminSession,
  verifyPassword,
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
    if (hasAdminSession() && isPasswordChanged()) {
      router.replace("/admin");
      return;
    }
    setReady(true);
  }, [router]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isValidAdminUser(username)) {
        setError("Usuario o contraseña incorrectos.");
        return;
      }

      const ok = await verifyPassword(password);
      if (!ok) {
        setError("Usuario o contraseña incorrectos.");
        return;
      }

      if (mustChangePassword()) {
        clearAdminSession();
        setStep("change-password");
        setPassword("");
        return;
      }

      setAdminSession();
      router.replace("/admin");
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
      await changeAdminPassword(newPassword);
      router.replace("/admin");
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
                  <input
                    name="username"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="usuario"
                    className="mt-2 w-full border border-line bg-bg px-4 py-3.5 text-fg outline-none transition focus:border-accent"
                  />
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
                  className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:brightness-110 disabled:opacity-60"
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
                  className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:brightness-110 disabled:opacity-60"
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
