"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SectionLink } from "@/components/SectionLink";
import { useTheme } from "@/components/ThemeProvider";
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

export function Footer({ light = false }: { light?: boolean }) {
  const { theme } = useTheme();
  const useLightLogo = light || theme === "light";
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-bg-elevated/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" />

      <div className="mx-auto max-w-6xl px-5 pt-14 pb-10 md:px-8 md:pt-16">
        <div className="grid gap-12 md:grid-cols-[1.35fr_1fr_1fr_1.1fr] md:gap-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Logo
                variant={useLightLogo ? "mark-light" : "mark"}
                size={44}
                className="shrink-0"
              />
              <span>
                <span className="font-display block text-sm font-extrabold tracking-[0.2em] text-fg uppercase">
                  {site.name}
                </span>
                <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.28em] text-signal uppercase">
                  Technologies
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              {site.tagline}. Atención personalizada en {site.coverage}.
            </p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110"
            >
              Cotizar por WhatsApp
            </a>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
              Explorar
            </p>
            <ul className="mt-4 space-y-2.5">
              {explore.map((item) => (
                <li key={item.hash}>
                  <SectionLink
                    hash={item.hash}
                    className="text-sm text-muted transition hover:text-fg"
                  >
                    {item.label}
                  </SectionLink>
                </li>
              ))}
              <li>
                <Link
                  href="/proyectos"
                  className="text-sm text-muted transition hover:text-fg"
                >
                  Software
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
              Servicios
            </p>
            <ul className="mt-4 space-y-2.5">
              {services.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <SectionLink
                    hash="servicios"
                    className="text-sm text-muted transition hover:text-fg"
                  >
                    {service.title}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
              Contacto
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <p className="text-[11px] tracking-[0.16em] text-fg/50 uppercase">
                  Cobertura
                </p>
                <p className="mt-1 text-fg">{site.coverage}</p>
              </li>
              <li>
                <p className="text-[11px] tracking-[0.16em] text-fg/50 uppercase">
                  WhatsApp
                </p>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block font-medium text-fg transition hover:text-accent"
                >
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <p className="text-[11px] tracking-[0.16em] text-fg/50 uppercase">
                  Casos recientes
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {projects.map((project) => (
                    <Link
                      key={project.slug}
                      href={`/proyectos/${project.slug}`}
                      className="border border-line px-2.5 py-1 text-xs text-muted transition hover:border-accent/40 hover:text-accent"
                    >
                      {project.name}
                    </Link>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] leading-relaxed text-muted">
            © {year} {site.legalName}. Soporte técnico, CCTV, redes y desarrollo
            en {site.coverage}.
          </p>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
            {site.motto}
          </p>
        </div>
      </div>
    </footer>
  );
}
