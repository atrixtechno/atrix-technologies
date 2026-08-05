"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
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

const pageLinks = [
  { href: "/soporte-remoto", label: "Soporte remoto" },
  { href: "/conferencias", label: "Conferencias" },
] as const;

/** Compact at `lg` so many items fit; relax spacing at `xl`. */
const navLinkClass =
  "shrink-0 whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-medium tracking-wide text-muted transition-colors hover:bg-bg-elevated/70 hover:text-fg xl:px-3 xl:py-2 xl:text-[13px]";

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
        className={`inline-flex items-center gap-1 ${navLinkClass} xl:gap-1.5`}
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

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-4" aria-hidden>
      <span
        className={`absolute left-0 block h-0.5 w-4 bg-current transition ${
          open ? "top-1.5 rotate-45" : "top-0"
        }`}
      />
      <span
        className={`absolute left-0 top-1.5 block h-0.5 w-4 bg-current transition ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 block h-0.5 w-4 bg-current transition ${
          open ? "top-1.5 -rotate-45" : "top-3"
        }`}
      />
    </span>
  );
}

export function Header({
  solid: _solid = false,
  light = false,
  hideBrand = false,
}: {
  solid?: boolean;
  light?: boolean;
  /** En landing: menú sticky sin logo (el hero ya lleva la marca). */
  hideBrand?: boolean;
}) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const useLightLogo = light || theme === "light";
  const [softwareOpen, setSoftwareOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSoftwareOpen, setMobileSoftwareOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const scrollLockY = useRef(0);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    scrollLockY.current = window.scrollY;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    window.addEventListener("keydown", onKey);
    return () => {
      body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.scrollTo(0, scrollLockY.current);
    };
  }, [mobileOpen]);

  function closeMobileMenu() {
    setMobileOpen(false);
    setMobileSoftwareOpen(false);
  }

  function toggleMobileMenu() {
    setMobileOpen((v) => {
      if (v) setMobileSoftwareOpen(false);
      return !v;
    });
  }

  /** En `/` hace scroll al inicio; en otras rutas navega a home. */
  function onBrandClick(e: MouseEvent<HTMLAnchorElement>) {
    closeMobileMenu();
    if (pathname !== "/") return;
    e.preventDefault();
    // Evita que el unlock del menú móvil restaure la posición previa.
    scrollLockY.current = 0;
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }

  /** Cierra al tocar espacio vacío (no links/botones). */
  function onMobileShellPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    if (target.closest("a, button, input, select, textarea, label, [role='menuitem']")) {
      return;
    }
    closeMobileMenu();
  }

  const brandLink = !hideBrand && (
    <Link
      href="/"
      className="group inline-flex min-w-0 shrink items-center"
      aria-label="ATRIX Technologies"
      onClick={onBrandClick}
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
        size={168}
        className="hidden transition-transform duration-300 group-hover:scale-[1.02] lg:block xl:hidden"
        priority
      />
      <Logo
        key={useLightLogo ? "nav-lockup-light-xl" : "nav-lockup-dark-xl"}
        variant={useLightLogo ? "lockup-light" : "lockup"}
        size={196}
        className="hidden transition-transform duration-300 group-hover:scale-[1.02] xl:block"
        priority
      />
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur-md">
      <div
        className={`mx-auto flex max-w-6xl items-center gap-2 px-5 py-3.5 md:gap-3 md:px-8 md:py-5 ${
          hideBrand ? "justify-end" : "justify-between"
        }`}
      >
        {brandLink}

        <nav
          className="hidden min-w-0 items-center gap-0.5 lg:flex xl:gap-1"
          aria-label="Principal"
        >
          {links.slice(0, 3).map((link) => (
            <SectionLink key={link.hash} hash={link.hash} className={navLinkClass}>
              {link.label}
            </SectionLink>
          ))}

          <SoftwareDropdown
            open={softwareOpen}
            onOpen={() => setSoftwareOpen(true)}
            onClose={() => setSoftwareOpen(false)}
          />

          {pageLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}

          <SectionLink hash="contacto" className={navLinkClass}>
            Contacto
          </SectionLink>

          <div className="ml-1.5 flex shrink-0 items-center gap-1.5 border-l border-line pl-2.5 xl:ml-2 xl:gap-2 xl:pl-4">
            <ThemeToggle />
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-ink transition hover:brightness-110 xl:px-4 xl:py-2 xl:text-sm"
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
            onClick={toggleMobileMenu}
            className="inline-flex h-10 w-10 items-center justify-center border border-line bg-bg-elevated text-fg"
          >
            <span className="sr-only">Menú</span>
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Portal to body so backdrop-filter on sticky header doesn't trap fixed coords. */}
      {portalReady &&
        mobileOpen &&
        createPortal(
          <div
            ref={mobilePanelRef}
            className="fixed inset-0 z-[100] flex flex-col bg-bg lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            onPointerDown={onMobileShellPointerDown}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-5 py-3.5">
              <Link
                href="/"
                className="inline-flex min-w-0 items-center"
                aria-label="ATRIX Technologies"
                onClick={onBrandClick}
              >
                <Logo
                  key={useLightLogo ? "drawer-lockup-light" : "drawer-lockup-dark"}
                  variant={useLightLogo ? "lockup-light" : "lockup"}
                  size={152}
                  priority
                />
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  aria-label="Cerrar menú"
                  onClick={closeMobileMenu}
                  className="inline-flex h-10 w-10 items-center justify-center border border-line bg-bg-elevated text-fg"
                >
                  <HamburgerIcon open />
                </button>
              </div>
            </div>

            <nav
              className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-8 pt-2"
              aria-label="Móvil"
            >
              <p className="mb-1 pt-3 text-[10px] font-semibold tracking-[0.22em] text-accent uppercase">
                Menú
              </p>

              {links.slice(0, 3).map((link) => (
                <SectionLink
                  key={link.hash}
                  hash={link.hash}
                  className="border-b border-line py-4 text-[15px] font-semibold text-fg"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </SectionLink>
              ))}

              <div className="border-b border-line">
                <div className="flex items-center justify-between gap-3 py-4">
                  <Link
                    href="/proyectos"
                    className="text-[15px] font-semibold text-fg"
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

              {pageLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b border-line py-4 text-[15px] font-semibold text-fg"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}

              <SectionLink
                hash="contacto"
                className="border-b border-line py-4 text-[15px] font-semibold text-fg"
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
          </div>,
          document.body,
        )}
    </header>
  );
}
