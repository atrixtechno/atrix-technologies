"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function isReload() {
  const nav = performance.getEntriesByType(
    "navigation",
  )[0] as PerformanceNavigationTiming | undefined;
  return nav?.type === "reload";
}

function goToPageTop() {
  if (window.location.pathname === "/" && window.location.hash) {
    window.history.replaceState(null, "", "/");
  }
  window.scrollTo(0, 0);
}

/** Al refrescar: inicio de la página actual. Al cambiar de ruta: también al inicio. */
export function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    if (isReload()) {
      goToPageTop();
    }

    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted || isReload()) goToPageTop();
    }

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
