import { Reveal } from "@/components/Reveal";
import { SectionLink } from "@/components/SectionLink";
import { pillars, promises, values } from "@/content/services";
import { site, whatsappUrl } from "@/content/site";

const cities = [
  {
    name: "Nuevo Laredo",
    region: "Tamaulipas, MX",
    note: "Visitas a domicilio y negocio",
  },
  {
    name: "Laredo",
    region: "Texas, US",
    note: "Soporte y proyectos en la frontera",
  },
] as const;

export function Coverage() {
  return (
    <section id="cobertura" className="scroll-mt-10 border-t border-line">
      <div className="relative overflow-hidden border-b border-line bg-bg-elevated/40">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="animate-orb absolute -left-16 top-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
          <div className="animate-orb-delayed absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-signal/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-14 md:px-8 md:py-16">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
              Respuesta rápida
            </p>
            <h2 className="font-display mt-4 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
              ¿Equipo caído, red inestable o cámaras sin grabar?
            </h2>
            <div className="animate-line mt-4 h-px w-24 bg-accent/50" />
            <p className="mt-4 max-w-lg text-muted">
              Escríbenos por WhatsApp y te orientamos al momento. Atendemos hogares
              y empresas en ambos lados de la frontera.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl(
                  "Hola ATRIX, necesito soporte técnico cuanto antes.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.25)] transition hover:brightness-110"
              >
                WhatsApp ahora · {site.phoneDisplay}
              </a>
              <SectionLink
                hash="contacto"
                className="rounded-full border border-line bg-bg/70 px-6 py-3.5 text-sm font-medium text-fg backdrop-blur transition hover:border-accent/50 hover:text-accent"
              >
                Enviar mensaje
              </SectionLink>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
              {cities.map((city) => (
                <li
                  key={city.name}
                  className="tech-frame border border-line bg-bg/80 p-5 backdrop-blur transition hover:border-accent/35"
                >
                  <p className="font-display text-xl font-semibold">{city.name}</p>
                  <p className="mt-1 text-xs font-semibold tracking-[0.16em] text-signal uppercase">
                    {city.region}
                  </p>
                  <p className="mt-2 text-sm text-muted">{city.note}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
            Cobertura
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            Servicio en {site.coverage}
          </h2>
          <div className="animate-line mt-4 h-px w-24 bg-accent/50" />
        </Reveal>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {promises.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <li className="border-t border-line pt-5">
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.copy}</p>
              </li>
            </Reveal>
          ))}
        </ul>

        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {pillars.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <li className="tech-frame border border-line bg-bg-elevated/50 px-5 py-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/35">
                <h3 className="font-display text-base font-semibold text-signal">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{item.copy}</p>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap gap-2">
            {values.map((value) => (
              <span
                key={value}
                className="rounded-full border border-line px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-muted uppercase transition hover:border-accent/40 hover:text-accent"
              >
                {value}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
