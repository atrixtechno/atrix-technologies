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
  { label: "Modelo", value: "Plan a medida" },
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

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pt-24 pb-14 sm:pt-28 sm:pb-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pb-20 lg:pt-32">
        <div className="animate-rise min-w-0">
          <div className="animate-fade-scale mb-7 w-full max-w-[11rem] sm:max-w-[13rem]">
            <Logo
              key={isLight ? "soporte-hero-light" : "soporte-hero-dark"}
              variant={isLight ? "full-light" : "full"}
              size={360}
              className="w-full"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 border border-signal/30 bg-signal/8 px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-signal uppercase">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal"
              aria-hidden
            />
            TI remoto · Operación continua
          </div>

          <h1 className="font-display mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-[3.35rem] md:leading-[1.02]">
            {soporteRemotoPage.title}
          </h1>
          <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted sm:text-lg">
            {soporteRemotoPage.lead}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110"
            >
              Solicitar por WhatsApp
            </a>
            <Link
              href="#servicios"
              className="inline-flex items-center justify-center rounded-full border border-line bg-bg-elevated/70 px-6 py-3.5 text-sm font-semibold text-fg transition hover:border-signal/40 hover:bg-bg-elevated"
            >
              Ver cobertura
            </Link>
          </div>
        </div>

        <aside className="animate-rise-delay relative">
          <div className="tech-frame border border-line bg-bg-elevated/80 p-5 backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
                  Panel de servicio
                </p>
                <p className="font-display mt-1 text-lg font-bold">
                  Estado operativo
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 border border-accent/35 bg-accent/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-accent uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                Activo
              </span>
            </div>

            <ul className="mt-1 divide-y divide-line">
              {statusItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-baseline justify-between gap-4 py-3.5"
                >
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                    {item.label}
                  </span>
                  <span className="text-right text-sm font-semibold text-fg">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="border border-line bg-bg/60 px-3 py-3 text-center">
                <p className="font-display text-sm font-bold tracking-wide">
                  Windows
                </p>
                <p className="mt-1 text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
                  Compatible
                </p>
              </div>
              <div className="border border-line bg-bg/60 px-3 py-3 text-center">
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
