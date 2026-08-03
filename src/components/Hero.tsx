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
          isLight ? "opacity-30 saturate-75" : "opacity-100"
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
      <div className="grid-tech pointer-events-none absolute inset-0 opacity-35" />

      <div className="relative mx-auto grid min-h-[78svh] max-w-6xl items-center gap-8 px-5 pb-12 pt-28 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:px-8 md:pb-16 md:pt-28 lg:gap-16">
        {/* Logo izquierda */}
        <div className="animate-fade-scale relative mx-auto flex w-full max-w-[240px] items-center justify-center md:mx-0 md:max-w-none">
          <div className="pointer-events-none absolute inset-0 -m-6 rounded-full bg-[radial-gradient(circle,rgba(26,76,255,0.14),transparent_70%)] blur-2xl" />
          <Logo
            variant={isLight ? "full-light" : "full"}
            size={320}
            priority
            className="relative w-full max-w-[220px] md:max-w-[280px] lg:max-w-[300px]"
          />
        </div>

        {/* Contenido derecha */}
        <div className="animate-rise-delay text-center md:text-left">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-accent uppercase">
            {site.coverage}
          </p>

          <h1 className="font-display mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-fg md:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {site.tagline}
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted md:text-base">
            Impulsamos tu negocio — y tu hogar — con tecnología confiable: soporte,
            CCTV, redes, software y más.
          </p>

          <aside
            id="consejo"
            className="mt-5 scroll-mt-28 border-y px-4 py-3.5 backdrop-blur-sm md:px-5"
            style={{
              background: "var(--tip-bg)",
              borderColor: "var(--tip-border)",
            }}
            aria-labelledby="daily-tip-title"
          >
            <p className="text-[10px] font-semibold tracking-[0.28em] text-accent uppercase">
              Consejo del día
            </p>
            {tip ? (
              <>
                <p className="mt-1 text-[11px] capitalize text-muted">{tip.label}</p>
                <h2
                  id="daily-tip-title"
                  className="font-display mt-1.5 text-base font-bold tracking-tight text-fg md:text-lg"
                >
                  {tip.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{tip.copy}</p>
              </>
            ) : (
              <div className="mt-2 space-y-2" aria-hidden>
                <div className="h-3 w-36 rounded bg-line md:mx-0 mx-auto" />
                <div className="h-4 w-full max-w-sm rounded bg-line md:mx-0 mx-auto" />
              </div>
            )}
          </aside>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <a
              href={whatsappUrl("Hola ATRIX, quiero cotizar un servicio.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110"
            >
              Cotizar por WhatsApp
            </a>
            <a
              href="#servicios"
              className="rounded-full border border-line bg-bg-elevated/70 px-6 py-3 text-sm text-fg backdrop-blur transition hover:border-accent/50 hover:text-accent"
            >
              Ver servicios
            </a>
          </div>

          <p className="mt-4 text-xs text-muted md:text-sm">
            {site.phoneDisplay} · {site.motto}
          </p>
        </div>
      </div>
    </section>
  );
}
