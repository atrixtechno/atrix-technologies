"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { SectionLink } from "@/components/SectionLink";
import { ArrowIcon, WhatsAppIcon } from "@/components/ui";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { whatsappUrl } from "@/content/site";
import { getDailyTip } from "@/content/tips";

const systems = [
  { code: "CCTV", label: "Videovigilancia", status: "Activo", load: 92 },
  { code: "NET", label: "Redes e infraestructura", status: "Estable", load: 98 },
  { code: "APP", label: "Plataformas digitales", status: "En producción", load: 86 },
  { code: "IT", label: "Soporte empresarial", status: "Disponible", load: 100 },
] as const;

const stats = [
  { value: `${services.length}`, label: "Líneas de servicio" },
  { value: `${projects.length}+`, label: "Plataformas en producción" },
  { value: "MX · TX", label: "Cobertura fronteriza" },
] as const;

const noopSubscribe = () => () => {};

/** Índice del consejo del día calculado en el cliente (la página se pre-renderiza). */
function useDailyTip() {
  const index = useSyncExternalStore(
    noopSubscribe,
    () => getDailyTip().index,
    () => -1,
  );
  return index < 0 ? null : getDailyTip();
}

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const tip = useDailyTip();

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#05070d] text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30 [filter:grayscale(0.5)_contrast(1.15)_saturate(0.6)_hue-rotate(190deg)]"
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

      <div className="hero-overlay pointer-events-none absolute inset-0 -z-10" />
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="hero-beam pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[38rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,255,0.28),transparent)] blur-2xl" />
      <div className="pointer-events-none absolute right-[-10rem] bottom-[-12rem] -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.14),transparent)] blur-2xl" />

      <div className="relative mx-auto grid w-full max-w-[1240px] flex-1 items-center gap-12 px-5 pt-28 pb-16 sm:px-8 sm:pt-32 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-14 lg:pt-28 lg:pb-20">
        <div className="min-w-0">
          <p className="chip chip-dark animate-rise">
            <span className="live-dot" aria-hidden />
            Nuevo Laredo · Laredo, TX
          </p>

          <h1 className="hero-title animate-rise-delay mt-6">
            <span className="text-gradient-light">Tecnología que opera</span>{" "}
            <span className="bg-gradient-to-r from-[#5b9bff] to-[#22d3ee] bg-clip-text text-transparent">
              y vende
            </span>{" "}
            <span className="text-gradient-light">por tu negocio</span>
          </h1>

          <p className="animate-rise-delay-2 mt-6 max-w-[34rem] text-pretty text-base leading-relaxed text-[#aab6cf] sm:text-lg">
            Soporte IT, CCTV, redes y plataformas digitales para empresas y hogares
            de la frontera. Ingeniería real, instalada y con seguimiento.
          </p>

          <div className="animate-rise-delay-2 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={whatsappUrl("Hola ATRIX, quiero que me asesoren con mi tecnología.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary h-[3.25rem] px-6"
            >
              <WhatsAppIcon />
              Hablar con un ingeniero
            </a>
            <SectionLink hash="servicios" className="btn btn-ghost-light h-[3.25rem] px-6">
              Explorar soluciones
              <ArrowIcon />
            </SectionLink>
          </div>

          <dl className="animate-rise-delay-3 mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="stat-value text-2xl text-white sm:text-3xl">{stat.value}</dd>
                <dd className="mono mt-2 text-[10px] leading-snug tracking-[0.12em] text-[#7d8aa6] uppercase">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <aside
          className="console animate-rise-delay-2 relative mx-auto w-full max-w-[440px] lg:mx-0 lg:justify-self-end"
          aria-label="Estado de servicios ATRIX"
        >
          <div className="console-bar">
            <i />
            <i />
            <i />
            <span className="mono ml-2 truncate text-[11px] text-[#7d8aa6]">
              atrix://operaciones/estado
            </span>
            <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-emerald-300 uppercase">
              <span className="live-dot" aria-hidden />
              Online
            </span>
          </div>

          <div className="p-5 sm:p-6">
            <p className="mono text-[11px] text-[#7d8aa6]">
              <span className="text-[#22d3ee]">$</span> atrix status --all
            </p>

            <ul className="mt-4 space-y-3.5">
              {systems.map((system) => (
                <li key={system.code}>
                  <div className="flex items-center gap-3">
                    <span className="mono w-11 shrink-0 text-[11px] font-medium text-[#5b9bff]">
                      {system.code}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-[#dbe4f7]">
                      {system.label}
                    </span>
                    <span className="mono shrink-0 text-[10px] tracking-[0.08em] text-emerald-300 uppercase">
                      {system.status}
                    </span>
                  </div>
                  <div className="meter mt-2 ml-14">
                    <span style={{ width: `${system.load}%` }} />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <p className="mono flex items-center gap-2 text-[10px] tracking-[0.16em] text-[#22d3ee] uppercase">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <path
                    d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Consejo del día
              </p>
              <p className="mt-2.5 min-h-[1.4em] text-sm font-semibold text-white">
                {tip ? tip.title : <span className="typing-caret text-[#7d8aa6]">Cargando</span>}
              </p>
              <p className="mt-1.5 min-h-[2.8em] text-[13px] leading-relaxed text-[#93a0bb]">
                {tip?.copy}
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="glow-divider absolute inset-x-0 bottom-0" aria-hidden />
    </section>
  );
}
