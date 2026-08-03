"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { ProjectLogo } from "@/components/ProjectLogo";
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
          <ul className="max-h-[calc(4*3.35rem)] overflow-y-auto overscroll-contain py-1.5 [scrollbar-gutter:stable]">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/proyectos/${project.slug}`}
                  role="menuitem"
                  className="group flex h-[3.35rem] items-center gap-3 px-4 transition hover:bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                  onClick={onClose}
                  style={
                    {
                      "--accent": project.theme.accent,
                      "--project-glow": project.theme.glow,
                    } as React.CSSProperties
                  }
                >
                  {project.logo ? (
                    <ProjectLogo src={project.logo} name={project.name} size="sm" />
                  ) : (
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: project.theme.accent }}
                      aria-hidden
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-fg transition group-hover:text-accent">
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

  const mobilePanelRef = useRef<HTMLDivElement>(null);

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

  function closeMobileMenu() {
    setMobileOpen(false);
    setMobileSoftwareOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur-md">
      <div className="relative z-50 mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5 md:px-8 md:py-5">
        <Link
          href="/"
          className="group relative z-[60] inline-flex min-w-0 shrink items-center"
          aria-label="ATRIX Technologies"
          onClick={closeMobileMenu}
        >
          <Logo
            key={useLightLogo ? "nav-lockup-light-sm" : "nav-lockup-dark-sm"}
            variant={useLightLogo ? "lockup-light" : "lockup"}
            size={152}
            className="transition-transform duration-300 group-hover:scale-[1.02] lg:hidden"
            priority
          />
          <Logo
            key={useLightLogo ? "nav-lockup-light-lg" : "nav-lockup-dark-lg"}
            variant={useLightLogo ? "lockup-light" : "lockup"}
            size={196}
            className="hidden transition-transform duration-300 group-hover:scale-[1.02] lg:block"
            priority
          />
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

        <div className="relative z-[60] flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen((v) => {
                if (v) setMobileSoftwareOpen(false);
                return !v;
              })
            }
            className="inline-flex h-10 w-10 items-center justify-center border border-line bg-bg-elevated text-fg"
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
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            className="fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--fg)_45%,transparent)] lg:hidden"
            onClick={closeMobileMenu}
          />
          <div
            ref={mobilePanelRef}
            className="fixed inset-x-0 top-0 z-50 flex max-h-[100dvh] flex-col border-b border-line bg-bg shadow-[0_24px_60px_rgba(11,26,36,0.18)] lg:hidden"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
              <Link
                href="/"
                className="inline-flex min-w-0 items-center"
                aria-label="ATRIX Technologies"
                onClick={closeMobileMenu}
              >
                <Logo
                  key={useLightLogo ? "drawer-lockup-light" : "drawer-lockup-dark"}
                  variant={useLightLogo ? "lockup-light" : "lockup"}
                  size={168}
                  priority
                />
              </Link>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={closeMobileMenu}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-bg-elevated text-fg"
              >
                <span className="relative block h-3.5 w-4">
                  <span className="absolute left-0 top-1.5 block h-0.5 w-4 rotate-45 bg-current" />
                  <span className="absolute left-0 top-1.5 block h-0.5 w-4 -rotate-45 bg-current" />
                </span>
              </button>
            </div>

            <nav
              className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-6 pt-2"
              aria-label="Móvil"
            >
              <p className="mb-1 pt-3 text-[10px] font-semibold tracking-[0.22em] text-accent uppercase">
                Menú
              </p>

              {links.slice(0, 3).map((link) => (
                <SectionLink
                  key={link.hash}
                  hash={link.hash}
                  className="border-b border-line py-3.5 text-sm font-semibold text-fg"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </SectionLink>
              ))}

              <div className="border-b border-line">
                <div className="flex items-center justify-between gap-3 py-3.5">
                  <Link
                    href="/proyectos"
                    className="text-sm font-semibold text-fg"
                    onClick={closeMobileMenu}
                  >
                    Software
                  </Link>
                  <button
                    type="button"
                    aria-label="Ver proyectos de software"
                    aria-expanded={mobileSoftwareOpen}
                    onClick={() => setMobileSoftwareOpen((v) => !v)}
                    className="inline-flex h-8 w-8 items-center justify-center border border-line bg-bg-elevated text-muted"
                  >
                    <Chevron open={mobileSoftwareOpen} />
                  </button>
                </div>
                {mobileSoftwareOpen && (
                  <ul className="max-h-[calc(4*2.75rem)] space-y-0 overflow-y-auto overscroll-contain bg-bg-elevated pb-2 pl-1">
                    {projects.map((project) => (
                      <li key={project.slug}>
                        <Link
                          href={`/proyectos/${project.slug}`}
                          className="flex h-[2.75rem] items-center gap-2.5 px-2 text-sm text-muted"
                          onClick={closeMobileMenu}
                          style={
                            {
                              "--accent": project.theme.accent,
                              "--project-glow": project.theme.glow,
                            } as React.CSSProperties
                          }
                        >
                          {project.logo ? (
                            <ProjectLogo src={project.logo} name={project.name} size="sm" />
                          ) : (
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: project.theme.accent }}
                              aria-hidden
                            />
                          )}
                          <span className="truncate">{project.name}</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/proyectos"
                        className="flex h-[2.75rem] items-center px-2 text-sm font-semibold text-accent"
                        onClick={closeMobileMenu}
                      >
                        Ver todos →
                      </Link>
                    </li>
                  </ul>
                )}
              </div>

              <SectionLink
                hash="contacto"
                className="border-b border-line py-3.5 text-sm font-semibold text-fg"
                onClick={closeMobileMenu}
              >
                Contacto
              </SectionLink>

              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-accent px-4 py-3.5 text-sm font-semibold text-accent-ink"
                onClick={closeMobileMenu}
              >
                WhatsApp · {site.phoneDisplay}
              </a>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
