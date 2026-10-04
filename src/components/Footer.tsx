import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SectionLink } from "@/components/SectionLink";
import { LiveClock } from "@/components/LiveClock";
import { ArrowIcon, WhatsAppIcon } from "@/components/ui";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { site, whatsappUrl } from "@/content/site";

const explore = [
  { hash: "servicios", label: "Servicios" },
  { hash: "cobertura", label: "Cobertura" },
  { hash: "hogares", label: "Hogares" },
  { hash: "empresas", label: "Empresas" },
  { hash: "contacto", label: "Contacto" },
] as const;

const pages = [
  { href: "/proyectos", label: "Portafolio" },
  { href: "/soporte-remoto", label: "Soporte remoto" },
  { href: "/conferencias", label: "Conferencias" },
  { href: "/quieres-ser-parte", label: "Sé parte de ATRIX" },
] as const;

const linkClass = "text-sm text-[#8a97b2] transition hover:text-white";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#05070c] text-white">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8">
        {/* CTA final */}
        <div className="flex flex-col items-start gap-8 border-b border-white/8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-2xl">
            <p className="display text-3xl text-balance sm:text-4xl md:text-5xl">
              Pongamos tu tecnología a <span className="text-[#6fb1ff]">trabajar por ti</span>
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={whatsappUrl("Hola ATRIX, quiero que me asesoren.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary h-[3.25rem] px-6"
            >
              <WhatsAppIcon />
              Quiero que me asesoren
            </a>
            <SectionLink hash="contacto" className="btn btn-ghost-light h-[3.25rem] px-6">
              Enviar mensaje
              <ArrowIcon />
            </SectionLink>
          </div>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1.1fr] lg:gap-10">
          <div>
            <Link href="/" className="inline-flex items-center" aria-label="ATRIX Technologies">
              <Logo variant="lockup" size={190} className="shrink-0" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#8a97b2]">
              {site.tagline}. Ingeniería y atención personalizada en {site.coverage}.
            </p>
            <p className="osd mt-6 inline-flex items-center gap-2 text-[#93a0b8]">
              <span className="led" />
              Operando · Nuevo Laredo <LiveClock className="text-white" />
            </p>
          </div>

          <div>
            <p className="mono text-[11px] tracking-[0.16em] text-[#5d6984] uppercase">Explorar</p>
            <ul className="mt-5 space-y-3">
              {explore.map((item) => (
                <li key={item.hash}>
                  <SectionLink hash={item.hash} className={linkClass}>
                    {item.label}
                  </SectionLink>
                </li>
              ))}
              {pages.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono text-[11px] tracking-[0.16em] text-[#5d6984] uppercase">Servicios</p>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <SectionLink hash="servicios" className={linkClass}>
                    {service.title}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono text-[11px] tracking-[0.16em] text-[#5d6984] uppercase">Contacto</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <p className="text-[11px] text-[#5d6984]">WhatsApp</p>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display mt-1 inline-block text-lg font-medium text-white transition hover:text-[#5b9bff]"
                >
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <p className="text-[11px] text-[#5d6984]">Correo</p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-1 inline-block text-white/85 transition hover:text-[#5b9bff]"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <p className="text-[11px] text-[#5d6984]">Casos recientes</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {projects.slice(0, 6).map((project) => (
                    <Link
                      key={project.slug}
                      href={`/proyectos/${project.slug}`}
                      className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-[#8a97b2] transition hover:border-white/30 hover:text-white"
                    >
                      {project.name}
                    </Link>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/8 py-7 md:flex-row md:items-center md:justify-between">
          <p className="text-xs leading-relaxed text-[#5d6984]">
            © {year} {site.legalName} · {site.city}
          </p>
          <div className="flex items-center gap-5">
            <p className="mono hidden text-[10.5px] tracking-[0.14em] text-[#5d6984] uppercase sm:block">
              {site.motto}
            </p>
            <Link
              href="/login"
              className="text-xs text-[#5d6984] transition hover:text-white"
              rel="nofollow"
            >
              Acceso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
