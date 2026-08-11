"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import { unetePage } from "@/content/unete";
import { site } from "@/content/site";

type Props = {
  whatsappHref: string;
};

export function QuieresSerParteHero({ whatsappHref }: Props) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className="relative overflow-hidden border-b border-line md:min-h-[min(88svh,52rem)]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg to-bg-elevated/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_85%_10%,rgba(26,107,255,0.2),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_5%_90%,rgba(77,143,255,0.12),transparent_50%)]" />
        <div className="grid-tech animate-grid-pulse absolute inset-0 opacity-40" />
        <div className="animate-orb absolute left-[8%] top-[20%] h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
        <div className="animate-orb-delayed absolute right-[10%] bottom-[8%] h-60 w-60 rounded-full bg-signal/14 blur-3xl" />
        <div className="scanline absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col justify-center px-4 pb-14 pt-28 sm:px-5 sm:pb-16 sm:pt-28 md:min-h-[min(88svh,52rem)] md:px-8 md:pb-20 md:pt-32">
        <div className="animate-rise mx-auto max-w-3xl text-center md:mx-0 md:max-w-2xl md:text-left">
          <div className="animate-fade-scale relative mx-auto mb-6 w-full max-w-[11rem] sm:mb-8 sm:max-w-[15rem] md:mx-0 md:mb-10 md:max-w-[20rem]">
            <div className="animate-glow pointer-events-none absolute inset-0 -m-5 rounded-full bg-[radial-gradient(circle,rgba(26,107,255,0.28),transparent_68%)] blur-2xl" />
            <Logo
              key={isLight ? "unete-hero-light" : "unete-hero-dark"}
              variant={isLight ? "full-light" : "full"}
              size={480}
              className="relative w-full"
              priority
            />
          </div>

          <p className="text-[10px] font-semibold tracking-[0.18em] text-accent uppercase sm:text-xs sm:tracking-[0.28em]">
            {unetePage.eyebrow}
          </p>
          <h1 className="font-display mt-3 text-balance text-[1.85rem] font-extrabold leading-[1.1] tracking-tight sm:mt-4 sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-[4.1rem] lg:leading-[0.95]">
            {unetePage.title}
          </h1>
          <div className="animate-line mx-auto mt-4 h-px w-24 bg-accent/60 sm:mt-5 sm:w-28 md:mx-0" />
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-muted sm:mt-5 sm:text-lg md:mx-0">
            {unetePage.lead}
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center md:justify-start">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold sm:w-auto"
            >
              Enviar CV por WhatsApp
            </a>
            <Link
              href="/#contacto"
              className="btn-ghost inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold sm:w-auto"
            >
              Completar formulario
            </Link>
          </div>
          <p className="mt-5 text-sm text-muted">
            {site.coverage} · Equipo tech en crecimiento
          </p>
        </div>
      </div>
    </section>
  );
}
