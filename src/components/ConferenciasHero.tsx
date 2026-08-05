"use client";

import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import { conferenceSpeaker, conferenciasPage } from "@/content/conferencias";
import { site } from "@/content/site";

type Props = {
  whatsappHref: string;
};

export function ConferenciasHero({ whatsappHref }: Props) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className="relative min-h-[min(100svh,54rem)] overflow-hidden border-b border-line md:min-h-[min(94svh,58rem)]">
      <Image
        src="/brand/hero-poster.jpg"
        alt=""
        fill
        priority
        className={`object-cover object-[center_30%] transition duration-300 ${
          isLight ? "opacity-40 saturate-70" : "opacity-60 saturate-95"
        }`}
        sizes="100vw"
        aria-hidden
      />
      <div className="hero-overlay absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/75 to-transparent md:via-bg/55" />
      <div className="hero-glow absolute inset-0" />
      <div className="grid-tech pointer-events-none absolute inset-0 opacity-40" />

      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="animate-orb absolute left-[6%] top-[18%] h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="animate-orb-delayed absolute right-[8%] bottom-[12%] h-64 w-64 rounded-full bg-signal/16 blur-3xl" />
        <p className="font-display absolute top-1/2 -left-2 hidden -translate-y-1/2 rotate-180 text-[11px] font-bold tracking-[0.55em] text-accent/35 uppercase [writing-mode:vertical-rl] md:block lg:left-3 lg:text-xs">
          Keynote · Programa
        </p>
        <div className="absolute right-6 top-28 hidden h-16 w-px bg-gradient-to-b from-accent/50 to-transparent lg:block" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-5 pb-12 pt-20 sm:pb-14 sm:pt-24 md:min-h-[min(94svh,58rem)] md:justify-center md:px-8 md:pb-16 md:pt-28">
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
          <div className="animate-rise min-w-0 text-center md:text-left">
            <div className="animate-fade-scale relative mx-auto mb-8 w-full max-w-[14rem] sm:max-w-[17rem] md:mx-0 md:mb-10 md:max-w-[22rem]">
              <div className="animate-glow pointer-events-none absolute inset-0 -m-5 rounded-full bg-[radial-gradient(circle,rgba(13,159,150,0.22),transparent_68%)] blur-2xl" />
              <Logo
                key={isLight ? "conf-hero-light" : "conf-hero-dark"}
                variant={isLight ? "full-light" : "full"}
                size={520}
                className="relative w-full"
                priority
              />
            </div>

            <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase sm:text-xs sm:tracking-[0.28em]">
              {conferenciasPage.eyebrow}
            </p>
            <h1 className="font-display mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[4.4rem] lg:leading-[0.92]">
              {conferenciasPage.title}
            </h1>
            <div className="animate-line mx-auto mt-5 h-px w-28 bg-accent/60 md:mx-0" />
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg md:mx-0">
              {conferenciasPage.lead}
            </p>
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center md:justify-start">
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
                className="inline-flex items-center justify-center rounded-full border border-line bg-bg-elevated/60 px-6 py-3.5 text-sm font-semibold text-fg backdrop-blur transition hover:border-accent/40 hover:bg-bg-elevated"
              >
                Ver temario
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted">
              {site.coverage} · Presencial o virtual
            </p>
          </div>

          <aside className="animate-rise-delay relative mx-auto w-full max-w-md md:mx-0 md:max-w-none">
            <div className="tech-frame border border-line/80 bg-bg-elevated/55 p-6 backdrop-blur-md sm:p-7">
              <p className="text-[10px] font-semibold tracking-[0.22em] text-signal uppercase">
                Programa listo
              </p>
              <p className="font-display mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                Sesiones con criterio técnico
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-6">
                {conferenceSpeaker.stats.map((stat) => (
                  <li key={stat.label}>
                    <p className="font-display text-2xl font-extrabold text-accent tabular-nums md:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] font-medium tracking-wide text-muted uppercase">
                      {stat.label}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-muted">
                Impartidas por {conferenceSpeaker.name}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
