"use client";

import { useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import { site, whatsappUrl } from "@/content/site";

export function Hero() {
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
        poster="/brand/atrix-logo-on-dark.png"
        aria-hidden
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,9,18,0.72)_0%,rgba(3,9,18,0.55)_40%,rgba(3,9,18,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(43,107,255,0.22),transparent_60%)]" />
      <div className="grid-tech pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-5 pb-20 pt-28 text-center md:px-8">
        <div className="animate-fade-scale">
          <Logo
            variant="full"
            size={300}
            priority
            className="mx-auto max-w-[min(78vw,300px)] drop-shadow-[0_20px_60px_rgba(43,107,255,0.35)]"
          />
        </div>

        <h1 className="animate-rise-delay sr-only">{site.legalName}</h1>

        <p className="animate-rise-delay mt-8 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
          {site.tagline}
        </p>

        <div className="animate-rise-delay-2 mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-accent-ink shadow-[0_0_40px_rgba(46,230,214,0.35)] transition hover:bg-white"
          >
            Hablemos por WhatsApp
          </a>
          <a
            href="/proyectos"
            className="rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-base text-fg backdrop-blur transition hover:border-accent/50 hover:text-accent"
          >
            Ver proyectos
          </a>
        </div>

        <p className="animate-rise-delay-2 mt-8 text-[11px] font-semibold tracking-[0.28em] text-white/55 uppercase">
          {site.city} · {site.motto}
        </p>
      </div>
    </section>
  );
}
