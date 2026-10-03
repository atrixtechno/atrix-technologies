import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon, CheckIcon, SectionHeading } from "@/components/ui";
import { services } from "@/content/services";
import { whatsappUrl } from "@/content/site";

const remoteSupportSlugs = new Set([
  "soporte-tecnico",
  "soporte-it-empresarial",
]);

function Icon({ name }: { name: string }) {
  const common = "h-5 w-5";
  switch (name) {
    case "pc":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "printer":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M7 8V4h10v4" stroke="currentColor" strokeWidth="1.6" />
          <rect x="4" y="8" width="16" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M7 16h10v4H7v-4Z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "cctv":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 11.5 14 7l4 2.2-10 4.5L4 11.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M8 16.5v2.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="17.5" cy="9.5" r="1.2" fill="currentColor" />
        </svg>
      );
    case "network":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "code":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8 7 3 12l5 5M16 7l5 5-5 5M13 5l-2 14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 8.2V4M12 20v-4.2M8.2 12H4M20 12h-4.2M7 7l-2.5-2.5M19.5 19.5 17 17M17 7l2.5-2.5M4.5 19.5 7 17"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
}

export function Services() {
  return (
    <section id="servicios" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="grid-tech pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              index="01"
              eyebrow="Servicios"
              title={
                <>
                  Un solo equipo para toda tu{" "}
                  <span className="text-gradient">operación tecnológica</span>
                </>
              }
              lead="Soporte técnico, seguridad, redes, infraestructura y plataformas digitales — diseñados, instalados y mantenidos por ingenieros en la frontera."
            />
            <a
              href={whatsappUrl("Hola ATRIX, quiero una evaluación de mi tecnología.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline shrink-0 self-start lg:self-end"
            >
              Solicitar evaluación
              <ArrowIcon />
            </a>
          </div>
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal
              as="li"
              key={service.slug}
              delay={(index % 3) * 80}
              className="card-glow group flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  className="object-cover opacity-90 transition duration-700 group-hover:scale-[1.05] group-hover:opacity-100"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated via-bg-elevated/30 to-transparent" />
                <span className="mono absolute top-4 right-4 rounded-md border border-white/15 bg-black/40 px-2 py-1 text-[10px] tracking-[0.12em] text-white/80 backdrop-blur">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="relative -mt-8 flex flex-1 flex-col px-6 pb-6">
                <span className="icon-tile">
                  <Icon name={service.icon} />
                </span>
                <h3 className="font-display mt-4 text-xl font-semibold">{service.title}</h3>
                <p className="mono mt-1.5 text-[11px] tracking-[0.06em] text-signal">
                  {service.short}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{service.copy}</p>
                <ul className="mt-5 space-y-2 border-t border-line pt-5">
                  {service.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-fg/85">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
                  <a
                    href={whatsappUrl(
                      `Hola ATRIX, me interesa el servicio de ${service.title}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-arrow"
                  >
                    Cotizar
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </a>
                  {remoteSupportSlugs.has(service.slug) && (
                    <Link
                      href="/soporte-remoto"
                      className="text-sm font-medium text-muted transition hover:text-fg"
                    >
                      Departamento de sistemas
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
