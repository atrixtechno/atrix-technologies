"use client";

import { useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import { site, whatsappUrl } from "@/content/site";
import type { DailyTip } from "@/content/tips";

type HeroProps = {
  tip: DailyTip & { label: string };
};

export function Hero({ tip }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      /* autoplay puede bloquearse; el poster/overlay cubre */
    });
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
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

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,9,18,0.82)_0%,rgba(3,9,18,0.68)_42%,rgba(3,9,18,0.94)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_18%,rgba(43,107,255,0.18),transparent_60%)]" />
      <div className="grid-tech pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-5 pb-16 pt-28 text-center md:px-8 md:pb-20">
        <div className="animate-fade-scale relative">
          <div className="pointer-events-none absolute inset-0 -m-8 rounded-full bg-[radial-gradient(circle,rgba(43,107,255,0.2),transparent_70%)] blur-2xl" />
          <Logo
            variant="full"
            size={300}
            priority
            className="relative mx-auto max-w-[min(82vw,300px)]"
          />
        </div>

        <h1 className="sr-only">{site.legalName}</h1>

        <p className="animate-rise-delay mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
          {site.tagline}
        </p>

        <aside
          id="consejo"
          className="animate-rise-delay-2 mt-8 w-full max-w-xl scroll-mt-28 border-y border-white/15 bg-white/[0.04] px-5 py-5 backdrop-blur-sm md:px-7"
          aria-labelledby="daily-tip-title"
        >
          <p className="text-[10px] font-semibold tracking-[0.28em] text-accent uppercase">
            Consejo del día · Para tu negocio
          </p>
          <p className="mt-1.5 text-xs capitalize text-white/45">{tip.label}</p>
          <h2
            id="daily-tip-title"
            className="font-display mt-3 text-xl font-bold tracking-tight text-white md:text-2xl"
          >
            {tip.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70 md:text-[15px]">
            {tip.copy}
          </p>
        </aside>

        <div className="animate-rise-delay-2 mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappUrl(
              "Hola ATRIX, quiero un sitio web para mi negocio.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-accent-ink shadow-[0_0_40px_rgba(46,230,214,0.35)] transition hover:bg-white"
          >
            Quiero mi sitio web
          </a>
          <a
            href="/proyectos"
            className="rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-base text-fg backdrop-blur transition hover:border-accent/50 hover:text-accent"
          >
            Ver proyectos
          </a>
        </div>

        <p className="mt-7 text-[11px] font-semibold tracking-[0.28em] text-white/45 uppercase">
          {site.city}
        </p>
      </div>
    </section>
  );
}
