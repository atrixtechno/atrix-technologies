"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import { soporteRemotoPage } from "@/content/soporte-remoto";
import { site } from "@/content/site";

type Props = {
  whatsappHref: string;
};

const statusItems = [
  { label: "Canal", value: "Remoto prioritario" },
  { label: "Sistemas", value: "Windows · macOS" },
  { label: "Cobertura", value: site.coverage },
  { label: "Modelo", value: "Departamento de sistemas" },
] as const;

export function SoporteRemotoHero({ whatsappHref }: Props) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(26,76,255,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_0%_100%,rgba(13,159,150,0.12),transparent_50%)]" />
        <div className="grid-tech absolute inset-0 opacity-45" />
        <div className="animate-orb absolute right-[12%] top-[22%] h-44 w-44 rounded-full bg-signal/18 blur-3xl" />
        <div className="animate-orb-delayed absolute left-[8%] bottom-[10%] h-52 w-52 rounded-full bg-accent/14 blur-3xl" />
        <div className="scanline absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 pt-28 pb-12 sm:gap-10 sm:px-5 sm:pt-28 sm:pb-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pb-20 lg:pt-32">
        <div className="animate-rise min-w-0">
          <div className="animate-fade-scale mb-6 w-full max-w-[10rem] sm:mb-7 sm:max-w-[13rem]">
            <Logo
              key={isLight ? "soporte-hero-light" : "soporte-hero-dark"}
              variant={isLight ? "full-light" : "full"}
              size={360}
              className="w-full"
              priority
            />
          </div>

          <p className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase sm:tracking-[0.22em]">
            {soporteRemotoPage.title}
          </p>

          <h1 className="font-display mt-3 text-balance text-[2.35rem] font-extrabold leading-[1.05] tracking-tight sm:mt-4 sm:text-5xl sm:leading-[1.02] md:text-[3.75rem] md:leading-[0.98] lg:text-[4.15rem]">
            <span className="text-fg">Tu </span>
            <span className="relative inline-block text-signal">
              departamento
              <span
                className="absolute inset-x-0 -bottom-1 h-[3px] origin-left bg-signal/70 sm:-bottom-1.5 sm:h-1"
                aria-hidden
              />
            </span>
            <span className="text-fg"> de </span>
            <span className="relative inline-block text-accent">
              sistemas
              <span
                className="absolute inset-x-0 -bottom-1 h-[3px] origin-left bg-accent/65 sm:-bottom-1.5 sm:h-1"
                aria-hidden
              />
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-pretty text-[15px] leading-relaxed text-muted sm:mt-6 sm:text-base md:text-lg">
            {soporteRemotoPage.lead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110 sm:w-auto"
            >
              Solicitar por WhatsApp
            </a>
            <Link
              href="#servicios"
              className="inline-flex w-full items-center justify-center rounded-full border border-line bg-bg-elevated/70 px-6 py-3.5 text-sm font-semibold text-fg transition hover:border-signal/40 hover:bg-bg-elevated sm:w-auto"
            >
              Ver cobertura
            </Link>
          </div>
        </div>

        <aside className="animate-rise-delay relative min-w-0">
          <div className="tech-frame border border-line bg-bg-elevated/80 p-4 backdrop-blur-sm sm:p-6">
            <div className="flex items-start justify-between gap-3 border-b border-line pb-4 sm:items-center">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
                  Panel de servicio
                </p>
                <p className="font-display mt-1 text-base font-bold sm:text-lg">
                  Estado operativo
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 border border-accent/35 bg-accent/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-accent uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                Activo
              </span>
            </div>

            <ul className="mt-1 divide-y divide-line">
              {statusItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-baseline justify-between gap-3 py-3.5 sm:gap-4"
                >
                  <span className="shrink-0 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                    {item.label}
                  </span>
                  <span className="min-w-0 text-right text-sm font-semibold break-words text-fg">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
              <div className="border border-line bg-bg/60 px-2.5 py-3 text-center sm:px-3">
                <p className="font-display text-sm font-bold tracking-wide">
                  Windows
                </p>
                <p className="mt-1 text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
                  Compatible
                </p>
              </div>
              <div className="border border-line bg-bg/60 px-2.5 py-3 text-center sm:px-3">
                <p className="font-display text-sm font-bold tracking-wide">
                  macOS
                </p>
                <p className="mt-1 text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
                  Compatible
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
