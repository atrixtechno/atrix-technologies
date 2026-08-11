"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  type CookieConsentValue,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookie-consent";

type CookieConsentBannerProps = {
  onDecision?: (value: CookieConsentValue) => void;
};

export function CookieConsentBanner({ onDecision }: CookieConsentBannerProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin") || pathname === "/login") {
      setVisible(false);
      return;
    }
    if (!readCookieConsent()) setVisible(true);
  }, [pathname]);

  function decide(value: CookieConsentValue) {
    writeCookieConsent(value);
    setVisible(false);
    onDecision?.(value);
    window.dispatchEvent(
      new CustomEvent("atrix-cookie-consent", { detail: value }),
    );
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed inset-x-0 bottom-0 z-[60] p-4 md:p-6"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg via-bg/90 to-transparent" />
      <div className="relative mx-auto max-w-3xl border border-line bg-bg-elevated/95 p-5 shadow-[0_-8px_40px_rgba(3,9,18,0.18)] backdrop-blur-md md:p-6">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
          Privacidad
        </p>
        <h2
          id="cookie-consent-title"
          className="font-display mt-2 text-xl font-semibold tracking-tight text-fg md:text-2xl"
        >
          Uso de cookies
        </h2>
        <p
          id="cookie-consent-desc"
          className="mt-2 text-sm leading-relaxed text-muted"
        >
          Usamos cookies necesarias para preferencias de tema y, si inicias
          sesión en el panel, para la sesión de administración. Con tu
          aceptación también medimos visitas anónimas (analítica de páginas)
          para mejorar el sitio. Puedes rechazar las no esenciales.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-fg transition hover:border-accent/40 hover:text-accent"
          >
            Solo necesarias
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
