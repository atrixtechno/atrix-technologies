import { services } from "@/content/services";
import { whatsappUrl } from "@/content/site";

function Icon({ name }: { name: string }) {
  const common = "h-6 w-6";
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
    <section id="servicios" className="scroll-mt-10 border-t border-line py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
          Servicios
        </p>
        <h2 className="font-display mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
          Todo lo que ATRIX hace por ti
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          No solo páginas web. Soporte técnico, seguridad, redes, infraestructura y
          software — para hogares y empresas en la frontera.
        </p>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <li
              key={service.slug}
              className="group border border-line bg-bg-elevated/40 p-6 transition hover:border-accent/40 hover:bg-bg-elevated"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line text-accent transition group-hover:border-accent/50 group-hover:text-signal">
                  <Icon name={service.icon} />
                </span>
                <span className="text-[11px] font-semibold tracking-[0.18em] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display mt-5 text-xl font-semibold">{service.title}</h3>
              <p className="mt-1 text-sm font-medium text-signal">{service.short}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{service.copy}</p>
              <ul className="mt-4 space-y-1.5">
                {service.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-fg/80">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappUrl(
                  `Hola ATRIX, me interesa el servicio de ${service.title}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex text-sm font-semibold text-accent transition hover:text-white"
              >
                Cotizar →
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
