"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollFollowLogo } from "@/components/ScrollFollowLogo";
import { SectionLink } from "@/components/SectionLink";
import { useTheme } from "@/components/ThemeProvider";
import { site, whatsappUrl } from "@/content/site";
import { getDailyTip } from "@/content/tips";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { theme } = useTheme();
  const [tip, setTip] = useState<ReturnType<typeof getDailyTip> | null>(null);
  const isLight = theme === "light";

  useEffect(() => {
    setTip(getDailyTip());
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden bg-bg">
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition duration-300 ${
          isLight ? "opacity-28 saturate-75" : "opacity-100"
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/brand/hero-poster.jpg"
        aria-hidden
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      <div className="hero-overlay absolute inset-0" />
      <div className="hero-glow absolute inset-0" />
      <div className="grid-tech pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="animate-orb absolute left-[8%] top-[22%] h-40 w-40 rounded-full bg-accent/15 blur-3xl" />
        <div className="animate-orb-delayed absolute right-[12%] bottom-[18%] h-48 w-48 rounded-full bg-signal/15 blur-3xl" />
        <div className="absolute left-6 top-24 h-10 w-10 border-l-2 border-t-2 border-accent/35 md:left-10 md:top-28" />
        <div className="absolute right-6 bottom-10 h-10 w-10 border-r-2 border-b-2 border-signal/35 md:right-10 md:bottom-14" />
      </div>

      <div className="relative mx-auto grid min-h-[78svh] max-w-6xl items-center gap-6 px-5 pb-12 pt-28 md:grid-cols-[1.15fr_0.95fr] md:gap-6 md:px-8 md:pb-16 md:pt-28 lg:gap-8">
        <ScrollFollowLogo />

        <div className="animate-rise-delay text-center md:text-left">
          <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            {site.coverage}
          </p>

          <h1 className="font-display mt-3 max-w-xl text-[1.85rem] font-semibold tracking-[-0.02em] text-fg md:text-[2.35rem] md:leading-[1.15] lg:text-[2.65rem]">
            {site.tagline}
          </h1>

          <p className="mt-4 max-w-lg text-[15px] leading-[1.65] text-muted md:text-base md:leading-[1.7]">
            Impulsamos tu negocio — y tu hogar — con tecnología confiable: soporte,
            CCTV, redes, software y más.
          </p>

          <aside
            id="consejo"
            className="mt-5 scroll-mt-28 border-y px-4 py-4 backdrop-blur-sm md:px-5"
            style={{
              background: "var(--tip-bg)",
              borderColor: "var(--tip-border)",
            }}
            aria-labelledby="daily-tip-title"
          >
            <p className="text-[11px] font-semibold tracking-[0.14em] text-accent uppercase">
              Consejo del día
            </p>
            {tip ? (
              <>
                <p className="mt-1.5 text-xs capitalize text-muted">{tip.label}</p>
                <h2
                  id="daily-tip-title"
                  className="font-display mt-2 text-lg font-semibold tracking-[-0.01em] text-fg md:text-xl"
                >
                  {tip.title}
                </h2>
                <p className="mt-2 text-[15px] leading-[1.65] text-muted">
                  {tip.copy}
                </p>
              </>
            ) : (
              <div className="mt-2 space-y-2" aria-hidden>
                <div className="mx-auto h-3 w-36 rounded bg-line md:mx-0" />
                <div className="mx-auto h-4 w-full max-w-sm rounded bg-line md:mx-0" />
              </div>
            )}
          </aside>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <a
              href={whatsappUrl("Hola ATRIX, quiero cotizar un servicio.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110"
            >
              Cotizar por WhatsApp
            </a>
            <SectionLink
              hash="servicios"
              className="rounded-full border border-line bg-bg-elevated/70 px-6 py-3 text-[15px] font-medium text-fg backdrop-blur transition hover:border-accent/50 hover:text-accent"
            >
              Ver servicios
            </SectionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
