"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { HeroVideo } from "@/components/HeroVideo";
import { Logo } from "@/components/Logo";
import { SectionLink } from "@/components/SectionLink";
import { useTheme } from "@/components/ThemeProvider";
import { ArrowIcon, WhatsAppIcon } from "@/components/ui";
import { useScrollProgress } from "@/components/useScrollProgress";
import { site, whatsappUrl } from "@/content/site";
import { getDailyTip } from "@/content/tips";

const noopSubscribe = () => () => {};

function useDailyTip() {
  const index = useSyncExternalStore(noopSubscribe, () => getDailyTip().index, () => -1);
  return index < 0 ? null : getDailyTip();
}

export function Hero() {
  const stageRef = useScrollProgress<HTMLDivElement>("enter");
  const tip = useDailyTip();
  const { theme } = useTheme();

  return (
    <section className="relative isolate overflow-hidden pt-28 pb-10 sm:pt-32">
      <div className="absolute inset-x-0 top-0 -z-10 h-[min(100svh,960px)]">
        <HeroVideo />
      </div>

      <div className="mx-auto max-w-[1240px] px-5 text-center sm:px-8">
        <Logo
          variant={theme === "dark" ? "full" : "full-light"}
          size={220}
          priority
          className="animate-rise mx-auto !w-[150px] sm:!w-[190px]"
        />

        <h1 className="hero-title animate-rise-delay mx-auto mt-8 max-w-5xl">
          Tecnología que opera y vende por tu negocio.
        </h1>

        <p className="animate-rise-delay-2 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          Instalamos, conectamos y programamos la tecnología de empresas y hogares
          de la frontera, y le damos seguimiento para que nunca se detenga.
        </p>

        <div className="animate-rise-delay-3 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl("Hola ATRIX, quiero que me asesoren con mi tecnología.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary h-[3.25rem] px-7"
          >
            <WhatsAppIcon />
            Hablar con un ingeniero
          </a>
          <SectionLink hash="servicios" className="btn btn-outline h-[3.25rem] px-7">
            Conocer los servicios
            <ArrowIcon />
          </SectionLink>
        </div>
        <p className="animate-rise-delay-3 mt-6 inline-flex items-center gap-2 text-sm text-subtle">
          <span className="led" />
          Atendiendo en {site.coverage}
        </p>
      </div>

      {/* Escenario: el producto se acerca con el scroll */}
      <div ref={stageRef} className="mx-auto mt-16 max-w-[1400px] px-3 sm:mt-20 sm:px-6">
        <div className="stage zoom-stage aspect-[4/5] sm:aspect-[16/9]">
          <div className="stage-light" />
          <div className="zoom-product absolute inset-0">
            <Image
              src="/images/renders/software.webp"
              alt="Laptop y celular con un panel de control: plataformas digitales de ATRIX"
              fill
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="render-feather object-contain object-center"
            />
          </div>

          {tip && (
            <div className="absolute right-4 bottom-4 left-4 max-w-sm rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left backdrop-blur-md sm:right-auto sm:bottom-6 sm:left-6">
              <p className="text-xs font-medium text-[#9aa6bd]">Consejo del día</p>
              <p className="mt-1.5 text-sm font-semibold text-white">{tip.title}</p>
              <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#9aa6bd]">{tip.copy}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
