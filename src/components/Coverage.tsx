import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionLink } from "@/components/SectionLink";
import { ArrowIcon, SectionHeading, WhatsAppIcon } from "@/components/ui";
import { pillars, promises, values } from "@/content/services";
import { site, whatsappUrl } from "@/content/site";

const cities = [
  {
    name: "Nuevo Laredo",
    region: "Tamaulipas, MX",
    coords: "27.47°N · 99.51°W",
    note: "Visitas a domicilio y negocio",
  },
  {
    name: "Laredo",
    region: "Texas, US",
    coords: "27.53°N · 99.48°W",
    note: "Soporte y proyectos en la frontera",
  },
] as const;

export function Coverage() {
  return (
    <section id="cobertura" className="relative scroll-mt-24 border-t border-line">
      {/* Banda de respuesta rápida */}
      <div className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8 md:pt-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-[#060a16] p-8 text-white sm:p-10 md:p-14">
            <div className="hero-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
            <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,255,0.4),transparent)] blur-xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.18),transparent)] blur-xl" aria-hidden />

            <div className="relative grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <p className="chip chip-dark">
                  <span className="live-dot" aria-hidden />
                  Respuesta rápida
                </p>
                <h2 className="section-title mt-6 max-w-xl">
                  ¿Equipo caído, red inestable o{" "}
                  <span className="bg-gradient-to-r from-[#5b9bff] to-[#22d3ee] bg-clip-text text-transparent">
                    cámaras sin grabar?
                  </span>
                </h2>
                <p className="mt-5 max-w-lg text-[#aab6cf]">
                  Escríbenos por WhatsApp y un ingeniero te orienta al momento.
                  Atendemos hogares y empresas en ambos lados de la frontera.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={whatsappUrl("Hola ATRIX, necesito soporte técnico cuanto antes.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                  >
                    <WhatsAppIcon />
                    WhatsApp · {site.phoneDisplay}
                  </a>
                  <SectionLink hash="contacto" className="btn btn-ghost-light">
                    Enviar mensaje
                    <ArrowIcon />
                  </SectionLink>
                </div>
              </div>

              <ul className="grid gap-3">
                {cities.map((city) => (
                  <li
                    key={city.name}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-lg font-semibold">{city.name}</p>
                        <p className="mt-0.5 text-sm text-[#93a0bb]">{city.region}</p>
                      </div>
                      <span className="live-dot mt-2" aria-hidden />
                    </div>
                    <p className="mono mt-4 text-[11px] tracking-[0.08em] text-[#5b9bff]">
                      {city.coords}
                    </p>
                    <p className="mt-1 text-sm text-[#aab6cf]">{city.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Cobertura */}
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              index="02"
              eyebrow="Cobertura"
              title={
                <>
                  Presencia local en <span className="text-gradient">{site.coverage}</span>
                </>
              }
              lead="Operamos en la frontera con tiempos de respuesta claros y seguimiento hasta dejar tu operación estable."
            />
            <ul className="mt-10 space-y-6">
              {promises.map((item, index) => (
                <li key={item.title} className="flex gap-4">
                  <span className="mono mt-0.5 shrink-0 text-[11px] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="border-l border-line pl-4">
                    <h3 className="font-display text-base font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{item.copy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100}>
            <div className="media-frame tech-frame aspect-[4/3]">
              <Image
                src="/images/home/cobertura-frontera.jpg"
                alt="Atardecer en la frontera Nuevo Laredo–Laredo"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-lg border border-white/15 bg-black/50 px-3 py-2 backdrop-blur">
                <span className="live-dot" aria-hidden />
                <span className="mono text-[10px] tracking-[0.14em] text-white/85 uppercase">
                  Zona de servicio activa
                </span>
              </div>
              <div className="absolute right-4 bottom-4 left-4 z-10 grid grid-cols-2 gap-3">
                {["MX", "US"].map((code, i) => (
                  <div
                    key={code}
                    className="rounded-xl border border-white/12 bg-black/45 px-4 py-3 text-white backdrop-blur"
                  >
                    <p className="mono text-[10px] tracking-[0.14em] text-white/60 uppercase">
                      Región {code}
                    </p>
                    <p className="font-display mt-1 text-sm font-semibold">
                      {cities[i].name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-5 sm:grid-cols-3">
          {pillars.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 90} className="card-glow p-6">
              <p className="mono text-[11px] tracking-[0.14em] text-subtle uppercase">
                Pilar {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display mt-3 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.copy}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-wrap gap-2">
            {values.map((value) => (
              <span key={value} className="chip">
                {value}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
