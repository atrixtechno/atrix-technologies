"use client";

import { useState, useTransition } from "react";
import { buttonClass, dangerButtonClass, primaryButtonClass } from "@/components/marketing/ui";

type Outcome = void | null | { ok?: boolean | string; message?: string; error?: string };

/**
 * Botón que llama una acción del servidor y muestra lo que respondió (Meta, la base o la IA).
 * `confirm` pide confirmación antes de llamar (acciones que publican o borran).
 */
export function ActionButton({
  action,
  label,
  pendingLabel = "Un momento…",
  confirm,
  variant = "default",
}: {
  action: () => Promise<Outcome>;
  label: string;
  pendingLabel?: string;
  confirm?: string;
  variant?: "default" | "primary" | "danger";
}) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const className = variant === "primary" ? primaryButtonClass : variant === "danger" ? dangerButtonClass : buttonClass;

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={className}
        disabled={pending}
        onClick={() => {
          if (confirm && !window.confirm(confirm)) return;
          setMessage(null);
          start(async () => {
            try {
              const result = await action();
              if (!result) return;
              if (result.error) setMessage({ ok: false, text: result.error });
              else if (typeof result.ok === "string") setMessage({ ok: true, text: result.ok });
              else if (result.message) setMessage({ ok: result.ok !== false, text: result.message });
            } catch {
              setMessage({ ok: false, text: "No se pudo completar. Revisa tu sesión e intenta de nuevo." });
            }
          });
        }}
      >
        {pending ? pendingLabel : label}
      </button>
      {message ? (
        <span role="status" className={`text-xs ${message.ok ? "text-ok" : "text-alert"}`}>
          {message.text}
        </span>
      ) : null}
    </span>
  );
}
