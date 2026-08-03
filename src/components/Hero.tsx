"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { site, whatsappUrl } from "@/content/site";
import { getDailyTip } from "@/content/tips";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tip, setTip] = useState<ReturnType<typeof getDailyTip> | null>(null);

  useEffect(() => {
    setTip(getDailyTip());
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
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

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,9,18,0.84)_0%,rgba(3,9,18,0.7)_45%,rgba(3,9,18,0.95)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_15%,rgba(43,107,255,0.2),transparent_60%)]" />
      <div className="grid-tech pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-5 pb-14 pt-28 text-center md:px-8 md:pb-16">
        <div className="animate-fade-scale relative">
          <div className="pointer-events-none absolute inset-0 -m-8 rounded-full bg-[radial-gradient(circle,rgba(43,107,255,0.22),transparent_70%)] blur-2xl" />
          <Logo
            variant="full"
            size={280}
            priority
            className="relative mx-auto max-w-[min(80vw,280px)]"
          />
        </div>

        <p className="animate-rise-delay mt-5 text-[11px] font-semibold tracking-[0.28em] text-accent uppercase">
          {site.coverage}
        </p>

        <h1 className="animate-rise-delay font-display mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          {site.tagline}
        </h1>

        <p className="animate-rise-delay mt-4 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
          Impulsamos tu negocio — y tu hogar — con tecnología confiable: soporte,
          CCTV, redes, software y más.
        </p>

        <aside
          id="consejo"
          className="animate-rise-delay-2 mt-7 w-full max-w-xl scroll-mt-28 border-y border-white/15 bg-white/[0.04] px-5 py-4 backdrop-blur-sm md:px-6"
          aria-labelledby="daily-tip-title"
        >
          <p className="text-[10px] font-semibold tracking-[0.28em] text-accent uppercase">
            Consejo del día
          </p>
          {tip ? (
            <>
              <p className="mt-1 text-xs capitalize text-white/40">{tip.label}</p>
              <h2
                id="daily-tip-title"
                className="font-display mt-2 text-lg font-bold tracking-tight text-white md:text-xl"
              >
                {tip.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{tip.copy}</p>
            </>
          ) : (
            <div className="mt-3 space-y-2" aria-hidden>
              <div className="mx-auto h-3 w-36 rounded bg-white/10" />
              <div className="mx-auto h-5 w-4/5 max-w-sm rounded bg-white/10" />
            </div>
          )}
        </aside>

        <div className="animate-rise-delay-2 mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappUrl("Hola ATRIX, quiero cotizar un servicio.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-accent-ink shadow-[0_0_40px_rgba(46,230,214,0.35)] transition hover:bg-white"
          >
            Cotizar por WhatsApp
          </a>
          <a
            href="#servicios"
            className="rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-base text-fg backdrop-blur transition hover:border-accent/50 hover:text-accent"
          >
            Ver servicios
          </a>
        </div>

        <p className="mt-6 text-sm text-white/55">
          {site.phoneDisplay} · {site.motto}
        </p>
      </div>
    </section>
  );
}
