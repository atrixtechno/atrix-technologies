"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
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

      <div className="relative mx-auto grid min-h-[78svh] max-w-6xl items-center gap-6 px-5 pb-12 pt-28 md:grid-cols-[1.15fr_0.95fr] md:gap-8 md:px-8 md:pb-16 md:pt-28 lg:gap-10">
        {/* Logo izquierda — más grande */}
        <div className="animate-fade-scale relative mx-auto flex w-full max-w-[360px] items-center justify-center md:mx-0 md:max-w-none">
          <div className="pointer-events-none absolute inset-0 -m-10 rounded-full bg-[radial-gradient(circle,rgba(26,76,255,0.16),transparent_70%)] blur-2xl" />
          <Logo
            variant={isLight ? "full-light" : "full"}
            size={560}
            priority
            className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[540px]"
          />
        </div>

        {/* Contenido derecha — tipografía más clara */}
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
            <a
              href="#servicios"
              className="rounded-full border border-line bg-bg-elevated/70 px-6 py-3 text-[15px] font-medium text-fg backdrop-blur transition hover:border-accent/50 hover:text-accent"
            >
              Ver servicios
            </a>
          </div>

          <p className="mt-4 text-sm tracking-wide text-muted">
            {site.phoneDisplay}
            <span className="mx-2 text-line">·</span>
            <span className="tracking-[0.12em] uppercase">{site.motto}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
