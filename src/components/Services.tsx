"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon, CheckIcon } from "@/components/ui";
import { useScrollProgress } from "@/components/useScrollProgress";
import { services } from "@/content/services";
import { whatsappUrl } from "@/content/site";

const scenes = services.filter((s) => !s.photo);
const remoteSupportSlugs = new Set(["soporte-tecnico", "soporte-it-empresarial"]);

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function SceneCopy({ service, compact = false }: { service: (typeof scenes)[number]; compact?: boolean }) {
  return (
    <>
      <h3 className={`display ${compact ? "text-3xl" : "text-[clamp(2.4rem,4.4vw,4.2rem)]"}`}>
        {service.title}
      </h3>
      <p className={`stage-muted mt-5 max-w-md leading-relaxed ${compact ? "" : "text-lg"}`}>
        {service.copy}
      </p>
      <ul className="mt-7 space-y-2.5">
        {service.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-[15px] text-white/90">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#7aa9ff]" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={whatsappUrl(`Hola ATRIX, me interesa el servicio de ${service.title}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Cotizar este servicio
          <ArrowIcon />
        </a>
        {remoteSupportSlugs.has(service.slug) && (
          <Link href="/soporte-remoto" className="btn btn-ghost-light">
            Soporte remoto
          </Link>
        )}
      </div>
    </>
  );
}

export function Services() {
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const renderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const n = scenes.length;

  // Cada escena ocupa 1/n del recorrido: entra, se sostiene y sale.
  const onProgress = useCallback(
    (p: number) => {
      const pos = p * n;
      for (let i = 0; i < n; i++) {
        const d = pos - (i + 0.5);
        let o = clamp(1 - (Math.abs(d) - 0.28) / 0.22);
        let s = clamp(d, -1, 1);
        if ((i === 0 && d < 0) || (i === n - 1 && d > 0)) {
          o = 1;
          s = 0;
        }
        for (const el of [copyRefs.current[i], renderRefs.current[i]]) {
          if (!el) continue;
          el.style.setProperty("--o", o.toFixed(3));
          el.style.setProperty("--s", s.toFixed(3));
          el.style.visibility = o < 0.01 ? "hidden" : "visible";
        }
      }
      const next = Math.min(n - 1, Math.floor(pos));
      setActive((prev) => (prev === next ? prev : next));
    },
    [n],
  );

  const filmRef = useScrollProgress<HTMLDivElement>("sticky", onProgress);

  function jumpTo(i: number) {
    const el = filmRef.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + travel * ((i + 0.5) / n);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <section id="servicios" className="relative scroll-mt-16 pt-24 md:pt-36">
      <Reveal className="mx-auto max-w-[1240px] px-5 text-center sm:px-8">
        <h2 className="section-title mx-auto max-w-3xl">Siete servicios. Un solo equipo responsable.</h2>
        <p className="section-lead mx-auto">
          Desde la PC que no enciende hasta la plataforma que vende por ti y el
          video que la presenta. Lo diseñamos, lo instalamos y lo mantenemos nosotros mismos.
        </p>
      </Reveal>

      {/* Escritorio: escena fijada */}
      <div ref={filmRef} className="relative mt-16 hidden lg:block" style={{ height: `${n * 95 + 20}vh` }}>
        <div className="sticky top-0 flex h-[100svh] items-center px-6 py-6">
          <div className="stage h-full w-full">
            <div className="stage-light" />
            <div className="mx-auto grid h-full max-w-[1320px] grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-10 px-12">
              <div className="relative h-[64%]">
                {scenes.map((s, i) => (
                  <div
                    key={s.slug}
                    ref={(el) => {
                      copyRefs.current[i] = el;
                    }}
                    className="film-layer absolute inset-0 flex flex-col justify-center"
                    style={{ ["--o" as string]: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
                    aria-hidden={i !== active}
                  >
                    <SceneCopy service={s} />
                  </div>
                ))}
              </div>
              <div className="relative h-[78%]">
                {scenes.map((s, i) => (
                  <div
                    key={s.slug}
                    ref={(el) => {
                      renderRefs.current[i] = el;
                    }}
                    className="film-render absolute inset-0"
                    style={{ ["--o" as string]: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
                  >
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      sizes="(max-width: 1600px) 60vw, 900px"
                      className="render-feather object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Índice de escenas */}
            <nav className="absolute right-0 bottom-8 left-0 flex justify-center" aria-label="Servicios">
              <ol className="flex gap-1.5 rounded-full border border-white/10 bg-white/[0.05] p-1.5 backdrop-blur">
                {scenes.map((s, i) => (
                  <li key={s.slug}>
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-current={i === active ? "step" : undefined}
                      className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                        i === active ? "bg-white text-[#0b0d12]" : "text-[#9aa6bd] hover:text-white"
                      }`}
                    >
                      {s.osd.charAt(0) + s.osd.slice(1).toLowerCase()}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Móvil y tablet: escenarios apilados */}
      <ul className="mx-auto mt-14 grid max-w-[1240px] gap-5 px-3 sm:px-6 lg:hidden">
        {scenes.map((s) => (
          <Reveal as="li" key={s.slug} className="stage px-6 pt-4 pb-8 sm:px-10">
            <div className="stage-light" />
            <div className="relative -mx-6 aspect-[4/3] sm:-mx-10">
              <Image src={s.image} alt={s.imageAlt} fill sizes="100vw" className="render-feather object-contain" />
            </div>
            <SceneCopy service={s} compact />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
