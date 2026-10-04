"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  type CookieConsentValue,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookie-consent";

const CONSENT_EVENT = "atrix-cookie-consent";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

type CookieConsentBannerProps = {
  onDecision?: (value: CookieConsentValue) => void;
};

export function CookieConsentBanner({ onDecision }: CookieConsentBannerProps) {
  const pathname = usePathname();
  // En el servidor se asume "ya decidido" para no pintar el banner antes de leer el consentimiento.
  const consent = useSyncExternalStore(subscribe, readCookieConsent, () => "rejected" as const);
  const hiddenRoute = pathname?.startsWith("/admin") || pathname === "/login";

  function decide(value: CookieConsentValue) {
    writeCookieConsent(value);
    onDecision?.(value);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  }

  if (consent || hiddenRoute) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="enter-sheet fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5"
    >
      <div className="glass relative mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl p-5 shadow-[var(--shadow-soft)] md:flex-row md:items-center md:gap-8 md:p-6">
        <div className="min-w-0 flex-1">
          <h2
            id="cookie-consent-title"
            className="font-display text-lg font-semibold tracking-tight text-fg"
          >
            Uso de cookies
          </h2>
          <p id="cookie-consent-desc" className="mt-1.5 text-sm leading-relaxed text-muted">
            Usamos cookies necesarias para el tema y la sesión del panel. Con tu
            aceptación también medimos visitas anónimas para mejorar el sitio.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="btn btn-outline !min-h-11"
          >
            Solo necesarias
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="btn btn-primary !min-h-11"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
