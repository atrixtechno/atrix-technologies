"use client";

import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import { conferenciasPage } from "@/content/conferencias";
import { site } from "@/content/site";

type Props = {
  whatsappHref: string;
};

export function ConferenciasHero({ whatsappHref }: Props) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className="relative min-h-[min(100svh,52rem)] overflow-hidden border-b border-line md:min-h-[min(92svh,56rem)]">
      {/* Full-bleed visual plane */}
      <Image
        src="/brand/hero-poster.jpg"
        alt=""
        fill
        priority
        className={`object-cover transition duration-300 ${
          isLight ? "opacity-35 saturate-75" : "opacity-55 saturate-90"
        }`}
        sizes="100vw"
        aria-hidden
      />
      <div className="hero-overlay absolute inset-0" />
      <div className="hero-glow absolute inset-0" />
      <div className="grid-tech pointer-events-none absolute inset-0 opacity-35" />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="animate-orb absolute left-[8%] top-[20%] h-48 w-48 rounded-full bg-accent/18 blur-3xl" />
        <div className="animate-orb-delayed absolute right-[10%] bottom-[16%] h-56 w-56 rounded-full bg-signal/14 blur-3xl" />
        <div className="absolute left-5 top-20 h-10 w-10 border-l-2 border-t-2 border-accent/40 md:left-10 md:top-28" />
        <div className="absolute right-5 bottom-10 h-10 w-10 border-r-2 border-b-2 border-signal/35 md:right-10 md:bottom-14" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-5 pb-14 pt-16 sm:pb-16 sm:pt-20 md:min-h-[min(92svh,56rem)] md:justify-center md:px-8 md:pb-20 md:pt-24">
        <div className="grid items-end gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12 lg:gap-16">
          {/* Brand — hero-level signal */}
          <div className="animate-fade-scale relative mx-auto w-full max-w-[16rem] sm:max-w-[20rem] md:mx-0 md:max-w-none">
            <div className="animate-glow pointer-events-none absolute inset-0 -m-6 rounded-full bg-[radial-gradient(circle,rgba(13,159,150,0.2),transparent_68%)] blur-2xl" />
            <Logo
              key={isLight ? "conf-hero-light" : "conf-hero-dark"}
              variant={isLight ? "full-light" : "full"}
              size={560}
              className="relative w-full origin-center scale-[0.92] sm:scale-100 md:max-w-[420px] lg:max-w-[480px]"
              priority
            />
            <p className="relative mt-4 text-center text-[11px] font-semibold tracking-[0.22em] text-muted uppercase md:text-left">
              {site.motto}
            </p>
          </div>

          {/* Copy — one H1, one support, one CTA group */}
          <div className="animate-rise min-w-0 text-center md:text-left">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase sm:text-xs sm:tracking-[0.24em]">
              {conferenciasPage.eyebrow}
            </p>
            <h1 className="font-display mt-3 text-balance text-4xl font-extrabold tracking-tight sm:mt-4 sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[0.95]">
              {conferenciasPage.title}
            </h1>
            <div className="animate-line mx-auto mt-5 h-px w-24 bg-accent/55 md:mx-0" />
            <p className="mx-auto mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted sm:text-lg md:mx-0">
              {conferenciasPage.lead}
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center md:justify-start">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110"
              >
                Solicitar por WhatsApp
              </a>
              <Link
                href="#temas"
                className="inline-flex items-center justify-center rounded-full border border-line bg-bg-elevated/55 px-6 py-3.5 text-sm font-semibold text-fg backdrop-blur transition hover:border-accent/40 hover:bg-bg-elevated"
              >
                Ver temario
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted">
              {site.coverage} · Presencial o virtual
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
