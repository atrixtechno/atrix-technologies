"use client";

import { useEffect, useState } from "react";
import { hasAnalyticsConsent } from "@/lib/cookie-consent";
import { PageViewTracker } from "@/components/PageViewTracker";
import { Analytics } from "@/components/Analytics";
import { MetaPixel } from "@/components/MetaPixel";

/**
 * Loads first-party pageviews, optional GA and the Meta Pixel only after cookie consent = accepted.
 */
export function ConsentGatedAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    function sync() {
      setAllowed(hasAnalyticsConsent());
    }
    sync();
    function onConsent(e: Event) {
      const detail = (e as CustomEvent).detail;
      setAllowed(detail === "accepted");
    }
    window.addEventListener("atrix-cookie-consent", onConsent);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("atrix-cookie-consent", onConsent);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!allowed) return null;

  return (
    <>
      <PageViewTracker />
      <Analytics />
      <MetaPixel />
    </>
  );
}
