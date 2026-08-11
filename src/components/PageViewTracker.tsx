"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { normalizeHash, normalizePath, shouldTrackPath } from "@/lib/analytics";

/**
 * First-party pageview tracker. POSTs on pathname / hash changes.
 * Skips /admin, /login, /api.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const lastKey = useRef<string>("");

  useEffect(() => {
    function send(path: string, hash: string | null) {
      if (!shouldTrackPath(path)) return;
      const key = `${path}${hash ? `#${hash}` : ""}`;
      if (key === lastKey.current) return;
      lastKey.current = key;

      const payload = {
        path,
        hash,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent.slice(0, 200),
        timestamp: new Date().toISOString(),
      };

      const body = JSON.stringify(payload);
      try {
        if (typeof navigator.sendBeacon === "function") {
          const blob = new Blob([body], { type: "application/json" });
          const ok = navigator.sendBeacon("/api/analytics/pageview", blob);
          if (ok) return;
        }
      } catch {
        /* fall through */
      }

      void fetch("/api/analytics/pageview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }

    function track() {
      send(normalizePath(window.location.pathname), normalizeHash(window.location.hash));
    }

    track();

    function onHashChange() {
      track();
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  return null;
}
