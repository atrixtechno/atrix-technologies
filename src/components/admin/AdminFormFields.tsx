"use client";

import { useState } from "react";

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
      <span className="text-xs tracking-[0.12em] text-muted uppercase">
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
          className="min-w-0 flex-1 border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="shrink-0 border border-line px-3 py-2 text-xs font-semibold text-muted transition hover:text-accent"
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
      <span className="text-xs tracking-[0.12em] text-muted uppercase">
        {label}
      </span>
      {as === "textarea" ? (
        <textarea
          id={id}
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1.5 w-full border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1.5 w-full border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
        />
      )}
    </label>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-line bg-bg/40 p-4 md:p-5">
      <h3 className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
        {title}
      </h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
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
    <span className={`inline-flex border px-2 py-0.5 text-[11px] font-medium ${colors}`}>
      {label}
    </span>
  );
}
