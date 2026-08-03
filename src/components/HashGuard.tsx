"use client";

import { useEffect } from "react";

/** Corrige URLs con hashes acumulados (#a#b#c → #a). */
export function HashGuard() {
  useEffect(() => {
    function sanitize() {
      const href = window.location.href;
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const before = href.slice(0, hashIndex);
      const after = href.slice(hashIndex + 1);
      const first = after.split("#").find(Boolean);
      if (!first) {
        window.history.replaceState(null, "", before || "/");
        return;
      }

      const clean = `${before}#${first}`;
      if (clean !== href) {
        window.history.replaceState(null, "", clean);
      }
    }

    sanitize();
    window.addEventListener("hashchange", sanitize);
    return () => window.removeEventListener("hashchange", sanitize);
  }, []);

  return null;
}
