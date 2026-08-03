"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { SectionLink } from "@/components/SectionLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import { projects } from "@/content/projects";
import { site, whatsappUrl } from "@/content/site";

const links = [
  { hash: "servicios", label: "Servicios" },
  { hash: "hogares", label: "Hogares" },
  { hash: "empresas", label: "Empresas" },
  { hash: "contacto", label: "Contacto" },
] as const;

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-2.5 w-2.5 transition duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden
    >
      <path
        d="M2.5 4.25 6 7.75l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SoftwareDropdown({
  open,
  onOpen,
  onClose,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const panelId = useId();
  const closeTimer = useRef<number | null>(null);

  function clearClose() {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleClose() {
    clearClose();
    closeTimer.current = window.setTimeout(onClose, 120);
  }

  useEffect(() => () => clearClose(), []);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        clearClose();
        onOpen();
      }}
      onMouseLeave={scheduleClose}
      onFocusCapture={() => {
        clearClose();
        onOpen();
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          scheduleClose();
        }
      }}
    >
      <Link
        href="/proyectos"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium tracking-wide text-muted transition-colors hover:text-fg"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={panelId}
        onClick={onClose}
      >
        Software
        <Chevron open={open} />
      </Link>

      <div
        id={panelId}
        role="menu"
        aria-hidden={!open}
        className={`absolute left-1/2 top-full z-50 w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 pt-3 transition duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="overflow-hidden border border-line bg-bg-elevated/95 shadow-[0_24px_60px_rgba(11,26,36,0.14)] backdrop-blur-md">
          <div className="border-b border-line px-4 py-3">
            <p className="text-[10px] font-semibold tracking-[0.22em] text-accent uppercase">
              Portafolio de software
            </p>
            <p className="mt-1 text-xs text-muted">
              Sistemas y plataformas a la medida
            </p>
          </div>
          <ul className="max-h-[min(24rem,60vh)] overflow-y-auto py-1.5">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/proyectos/${project.slug}`}
                  role="menuitem"
                  className="group flex items-start gap-3 px-4 py-2.5 transition hover:bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                  onClick={onClose}
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: project.theme.accent }}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-fg transition group-hover:text-accent">
                      {project.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted">
                      {project.sector}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-line bg-bg/50 px-4 py-2.5">
            <Link
              href="/proyectos"
              className="text-xs font-semibold tracking-wide text-accent transition hover:text-fg"
              onClick={onClose}
            >
              Ver todos los proyectos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header({
  solid = false,
  light = false,
}: {
  solid?: boolean;
  light?: boolean;
}) {
  const { theme } = useTheme();
  const useLightLogo = light || theme === "light";
  const [softwareOpen, setSoftwareOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSoftwareOpen, setMobileSoftwareOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <header
      className={
        solid
          ? "sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md"
          : "absolute inset-x-0 top-0 z-40"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8 md:py-5">
        <Link href="/" className="group flex items-center gap-3">
          <Logo
            key={useLightLogo ? "mark-light" : "mark-dark"}
            variant={useLightLogo ? "mark-light" : "mark"}
            size={42}
            className="transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <span className="hidden sm:block">
            <span className="font-display block text-sm font-extrabold tracking-[0.22em] text-fg uppercase">
              {site.name}
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.28em] text-signal uppercase">
              Technologies
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {links.slice(0, 3).map((link) => (
            <SectionLink
              key={link.hash}
              hash={link.hash}
              className="rounded-full px-3.5 py-2 text-[13px] font-medium tracking-wide text-muted transition-colors hover:bg-bg-elevated/70 hover:text-fg"
            >
              {link.label}
            </SectionLink>
          ))}

          <SoftwareDropdown
            open={softwareOpen}
            onOpen={() => setSoftwareOpen(true)}
            onClose={() => setSoftwareOpen(false)}
          />

          <SectionLink
            hash="contacto"
            className="rounded-full px-3.5 py-2 text-[13px] font-medium tracking-wide text-muted transition-colors hover:bg-bg-elevated/70 hover:text-fg"
          >
            Contacto
          </SectionLink>

          <div className="ml-2 flex items-center gap-2 border-l border-line pl-4">
            <ThemeToggle />
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition hover:brightness-110"
            >
              WhatsApp
            </a>
          </div>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center border border-line bg-bg-elevated/70 text-fg backdrop-blur"
          >
            <span className="sr-only">Menú</span>
            <span className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 block h-0.5 w-4 bg-current transition ${
                  mobileOpen ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-4 bg-current transition ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-4 bg-current transition ${
                  mobileOpen ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-line bg-bg/95 backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-4 md:px-8" aria-label="Móvil">
            {links.slice(0, 3).map((link) => (
              <SectionLink
                key={link.hash}
                hash={link.hash}
                className="border-b border-line py-3.5 text-sm font-medium text-fg"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </SectionLink>
            ))}

            <div className="border-b border-line">
              <div className="flex items-center justify-between gap-3 py-3.5">
                <Link
                  href="/proyectos"
                  className="text-sm font-medium text-fg"
                  onClick={() => setMobileOpen(false)}
                >
                  Software
                </Link>
                <button
                  type="button"
                  aria-label="Ver proyectos de software"
                  aria-expanded={mobileSoftwareOpen}
                  onClick={() => setMobileSoftwareOpen((v) => !v)}
                  className="inline-flex h-8 w-8 items-center justify-center border border-line text-muted"
                >
                  <Chevron open={mobileSoftwareOpen} />
                </button>
              </div>
              {mobileSoftwareOpen && (
                <ul className="space-y-1 pb-3 pl-1">
                  {projects.map((project) => (
                    <li key={project.slug}>
                      <Link
                        href={`/proyectos/${project.slug}`}
                        className="flex items-center gap-2 py-2 text-sm text-muted"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: project.theme.accent }}
                          aria-hidden
                        />
                        {project.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/proyectos"
                      className="py-2 text-sm font-semibold text-accent"
                      onClick={() => setMobileOpen(false)}
                    >
                      Ver todos →
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            <SectionLink
              hash="contacto"
              className="border-b border-line py-3.5 text-sm font-medium text-fg"
              onClick={() => setMobileOpen(false)}
            >
              Contacto
            </SectionLink>

            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-ink"
              onClick={() => setMobileOpen(false)}
            >
              WhatsApp · {site.phoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
