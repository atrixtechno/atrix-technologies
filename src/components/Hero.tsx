"use client";

import { useEffect, useRef } from "react";
import { SectionLink } from "@/components/SectionLink";
import { site, whatsappUrl } from "@/content/site";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#050a16] text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover opacity-55"
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_80%,rgba(26,107,255,0.22),transparent_60%)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-14 pt-28 sm:px-8 sm:pb-16 md:justify-center md:pb-24 md:pt-32">
        <div className="animate-rise max-w-3xl">
          <p className="font-display text-[clamp(2.8rem,10vw,5.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-white">
            {site.name}
          </p>
          <p className="mt-2 text-sm font-semibold tracking-[0.22em] text-white/70 uppercase sm:text-base">
            Technologies
          </p>

          <h1 className="font-display mt-8 max-w-2xl text-balance text-[1.65rem] font-bold leading-[1.15] tracking-[-0.03em] text-white sm:text-3xl md:text-5xl md:leading-[1.08]">
            Tecnología que opera y vende por tu negocio
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-white/75 sm:text-base md:text-lg">
            Soporte, CCTV, redes y plataformas digitales para hogares y empresas en
            Nuevo Laredo y Laredo, TX.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={whatsappUrl("Hola ATRIX, quiero cotizar un servicio.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold"
            >
              Cotizar por WhatsApp
            </a>
            <SectionLink
              hash="servicios"
              className="btn-ghost-light inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold"
            >
              Descubrir soluciones
            </SectionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
