"use client";

import Image from "next/image";
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
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg to-bg-elevated" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(26,107,255,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_0%_100%,rgba(26,107,255,0.1),transparent_50%)]" />
        <div className="grid-tech absolute inset-0 opacity-30" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-28 sm:gap-12 sm:px-5 sm:pb-16 sm:pt-32 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:px-8 md:pb-20 md:pt-36 lg:gap-16">
        <div className="animate-rise order-2 min-w-0 md:order-1">
          <div className="animate-fade-scale relative mb-6 w-full max-w-[10.5rem] sm:mb-8 sm:max-w-[13rem] md:max-w-[16rem]">
            <div className="animate-glow pointer-events-none absolute inset-0 -m-4 rounded-full bg-[radial-gradient(circle,rgba(26,107,255,0.28),transparent_70%)] blur-2xl" />
            <Logo
              key={isLight ? "unete-hero-light" : "unete-hero-dark"}
              variant={isLight ? "full-light" : "full"}
              size={400}
              className="relative w-full"
              priority
            />
          </div>

          <p className="text-[10px] font-semibold tracking-[0.22em] text-accent uppercase sm:text-xs sm:tracking-[0.28em]">
            {unetePage.eyebrow}
          </p>
          <h1 className="font-display mt-3 text-balance text-[1.9rem] font-extrabold leading-[1.08] tracking-tight sm:mt-4 sm:text-5xl sm:leading-[1.02] md:text-[3.25rem] lg:text-[3.6rem]">
            {unetePage.title}
          </h1>
          <div className="animate-line mt-4 h-px w-20 bg-accent sm:mt-5 sm:w-28" />
          <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-muted sm:mt-5 sm:text-lg">
            {unetePage.lead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
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
            <a
              href="#uniforme"
              className="text-center text-sm font-medium text-muted underline-offset-4 transition hover:text-accent hover:underline sm:text-left"
            >
              Ver el uniforme →
            </a>
          </div>
          <p className="mt-5 text-sm text-muted">
            {site.coverage} · Equipo tech en crecimiento
          </p>
        </div>

        <div className="animate-fade-scale order-1 md:order-2">
          <div className="relative overflow-hidden border border-line bg-[#0a0c10] shadow-[0_24px_80px_-28px_rgba(26,107,255,0.45)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
            <div className="relative aspect-[3/2] w-full">
              <Image
                src="/brand/atrix-uniforme.png"
                alt="Uniforme ATRIX Technologies: polo, gorra y hoodie con marca"
                fill
                priority
                quality={95}
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 48vw"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-4 pb-4 pt-16 sm:px-5 sm:pb-5">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-accent uppercase">
                Identidad de equipo
              </p>
              <p className="mt-1 text-sm font-medium text-white/95">
                Polo · Gorra · Hoodie — marca ATRIX
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
