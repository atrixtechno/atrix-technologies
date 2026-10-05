"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { hasAnalyticsConsent } from "@/lib/cookie-consent";
import { currentVisit, newEventId } from "@/lib/marketing/visit-client";

// Pixel de Meta en el navegador (PageView + Lead). Solo se monta dentro de ConsentGatedAnalytics,
// es decir después de "Aceptar" en el aviso de cookies, y nunca en el panel admin. Los mismos
// eventos Lead se mandan desde el servidor (Conversions API) con el mismo id, sin contarse doble.

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? "";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };

function loadPixel(id: string) {
  const w = window as typeof window & { fbq?: Fbq; _fbq?: Fbq };
  if (w.fbq) return w.fbq;
  const fbq: Fbq = (...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue!.push(args);
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  w.fbq = fbq;
  w._fbq = fbq;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  fbq("init", id);
  return fbq;
}

/** Evento Lead en el navegador (si el Pixel está cargado); el servidor manda el suyo con el mismo id. */
export function trackLeadInBrowser(eventId: string, contentName: "contacto" | "whatsapp") {
  const w = window as typeof window & { fbq?: Fbq };
  if (!PIXEL_ID || !w.fbq || !hasAnalyticsConsent()) return;
  w.fbq("track", "Lead", { content_name: contentName }, { eventID: eventId });
}

function isWhatsAppLink(href: string) {
  return /^https:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(href);
}

export function MetaPixel() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (!PIXEL_ID || pathname.startsWith("/admin") || pathname === "/login" || !hasAnalyticsConsent()) return;
    loadPixel(PIXEL_ID)("track", "PageView");
  }, [pathname]);

  // Clic a cualquier enlace de WhatsApp: cuenta para el embudo y para el Pixel (evento Lead).
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || !isWhatsAppLink(link.href) || window.location.pathname.startsWith("/admin")) return;
      if (!hasAnalyticsConsent()) return;
      const eventId = newEventId();
      trackLeadInBrowser(eventId, "whatsapp");
      const visit = currentVisit();
      const body = JSON.stringify({ path: window.location.pathname, sessionId: visit.sessionId, campaign: visit.campaign, eventId });
      try {
        if (navigator.sendBeacon?.("/api/analytics/whatsapp", new Blob([body], { type: "application/json" }))) return;
      } catch {
        /* sigue con fetch */
      }
      void fetch("/api/analytics/whatsapp", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
