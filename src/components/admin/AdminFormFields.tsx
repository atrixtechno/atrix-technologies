"use client";

import { useState, type ReactNode } from "react";

const inputClass =
  "mt-1.5 w-full border border-line bg-bg px-3 py-2.5 text-sm text-fg outline-none transition placeholder:text-muted/60 focus:border-accent";

export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="block text-sm" htmlFor={id}>
      <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
        {label}
      </span>
      <span className="mt-1.5 flex gap-2">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 border border-line bg-bg px-3 py-2.5 text-sm text-fg outline-none transition focus:border-accent"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="shrink-0 border border-line px-3 py-2 text-xs font-semibold text-muted transition hover:border-accent/40 hover:text-accent"
        >
          {show ? "Ocultar" : "Ver"}
        </button>
      </span>
    </label>
  );
}

export function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  as = "input",
  rows = 3,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  as?: "input" | "textarea";
  rows?: number;
}) {
  return (
    <label className="block text-sm" htmlFor={id}>
      <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
        {label}
      </span>
      {as === "textarea" ? (
        <textarea
          id={id}
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </label>
  );
}

export function Section({
  title,
  description,
  children,
  cols = 2,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  cols?: 1 | 2;
}) {
  return (
    <section className="border border-line bg-bg/50">
      <div className="border-b border-line px-4 py-3 md:px-5">
        <h3 className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
        )}
      </div>
      <div
        className={`grid gap-4 p-4 md:p-5 ${
          cols === 2 ? "sm:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

export function RenewalBadge({
  days,
  status,
}: {
  days: number | null;
  status: "ok" | "warn" | "danger" | "none";
}) {
  if (status === "none" || days == null) {
    return (
      <span className="inline-flex border border-line px-2 py-0.5 text-[11px] text-muted">
        Sin fecha
      </span>
    );
  }
  const colors =
    status === "ok"
      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
      : status === "warn"
        ? "border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-200"
        : "border-red-500/40 bg-red-500/15 text-red-700 dark:text-red-300";
  const label =
    days < 0
      ? `Vencido hace ${Math.abs(days)} d`
      : days === 0
        ? "Vence hoy"
        : `${days} d para renovar`;
  return (
    <span
      className={`inline-flex border px-2 py-0.5 text-[11px] font-medium ${colors}`}
    >
      {label}
    </span>
  );
}

export function AdminAlert({
  tone,
  children,
}: {
  tone: "info" | "error" | "success" | "soft";
  children: ReactNode;
}) {
  const styles =
    tone === "info"
      ? "border-accent/30 bg-accent/10 text-fg"
      : tone === "error"
        ? "border-red-500/40 bg-red-500/10 text-fg"
        : tone === "success"
          ? "border-emerald-500/30 bg-emerald-500/10 text-fg"
          : "border-line bg-bg-elevated/60 text-muted";
  return (
    <div className={`border px-4 py-3 text-sm leading-relaxed ${styles}`}>
      {children}
    </div>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div className="min-w-0 max-w-2xl">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function AdminToolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border border-line bg-bg-elevated/70 px-3 py-3 backdrop-blur md:px-4">
      {children}
    </div>
  );
}

export function AdminPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-line bg-bg-elevated/70 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  disabled,
  type = "button",
  onClick,
  className = "",
}: {
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  disabled,
  type = "button",
  onClick,
  danger,
  className = "",
}: {
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  danger?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? "border-red-500/40 text-red-600 hover:bg-red-500/10 dark:text-red-300"
          : "border-line text-fg hover:border-accent/40 hover:text-accent"
      } ${className}`}
    >
      {children}
    </button>
  );
}
