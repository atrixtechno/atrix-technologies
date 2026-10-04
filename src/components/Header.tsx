"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/Logo";
import { ProjectLogo } from "@/components/ProjectLogo";
import { SectionLink } from "@/components/SectionLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { projects } from "@/content/projects";
import { site, whatsappUrl } from "@/content/site";
import { useTheme } from "@/components/ThemeProvider";
import { WhatsAppIcon } from "@/components/ui";

const links = [
  { hash: "servicios", label: "Servicios" },
  { hash: "recomendaciones", label: "Opiniones" },
  { hash: "hogares", label: "Hogares" },
  { hash: "empresas", label: "Empresas" },
  { hash: "contacto", label: "Contacto" },
] as const;

const pageLinks = [
  { href: "/soporte-remoto", label: "Soporte remoto" },
  { href: "/conferencias", label: "Conferencias" },
  { href: "/quieres-ser-parte", label: "Sé parte" },
] as const;

const navLinkClass = "nav-link";

const noopSubscribe = () => () => {};

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

function isScrolled() {
  return window.scrollY > 24;
}

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

function ProjectsDropdown({
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
        className={navLinkClass}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={panelId}
        onClick={onClose}
      >
        Proyectos
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
        <div className="glass overflow-hidden rounded-2xl shadow-[var(--shadow-soft)]">
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-fg">Plataformas digitales</p>
            <p className="mt-1 text-xs text-muted">
              Sistemas integrados y presencia web en producción
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

export function Header() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const logoVariant = theme === "dark" ? "lockup" : "lockup-light";
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const portalReady = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const scrolled = useSyncExternalStore(subscribeScroll, isScrolled, () => false);

  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const scrollLockY = useRef(0);

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
    setMobileProjectsOpen(false);
  }

  function toggleMobileMenu() {
    setMobileOpen((v) => {
      if (v) setMobileProjectsOpen(false);
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

  const brandLink = (
    <Link
      href="/"
      className="group inline-flex min-w-0 shrink items-center"
      aria-label="ATRIX Technologies"
      onClick={onBrandClick}
    >
      <Logo
        key="drawer-lockup"
        variant={logoVariant}
        size={152}
        className="max-h-8 w-auto max-w-[160px] transition-transform duration-300 group-hover:scale-[1.02]"
        priority
      />
    </Link>
  );

  return (
    <header className={`nav-shell ${scrolled ? "is-scrolled" : ""}`}>
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-6 px-5 sm:px-8">
      <Link
        href="/"
        className="group inline-flex min-w-0 shrink items-center"
        aria-label="ATRIX Technologies"
        onClick={onBrandClick}
      >
        <Logo
          key="nav-lockup-dark-hero"
          variant={logoVariant}
          size={105}
          className="max-h-8 w-auto max-w-[148px] transition-transform duration-300 group-hover:scale-[1.02] sm:max-h-none sm:max-w-none"
          priority
        />
      </Link>

      <nav className="nav-links" aria-label="Principal">
        <SectionLink hash="servicios" className={navLinkClass}>
          Servicios
        </SectionLink>
        <ProjectsDropdown
          open={projectsOpen}
          onOpen={() => setProjectsOpen(true)}
          onClose={() => setProjectsOpen(false)}
        />
        {pageLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={navLinkClass}
            aria-current={pathname === link.href ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto hidden shrink-0 items-center gap-3 min-[1100px]:flex">
        <ThemeToggle className="!h-10" />
        <a
          href={whatsappUrl("Hola ATRIX, quiero que me asesoren.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary !min-h-10 !px-4 !text-[0.82rem]"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Cotizar ahora
        </a>
      </div>

      <div className="ml-auto flex items-center gap-2 min-[1100px]:hidden">
        <button
          type="button"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
          onClick={toggleMobileMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-fg"
        >
          <span className="sr-only">Menú</span>
          <HamburgerIcon open={mobileOpen} />
        </button>
      </div>

      {/* Portal to body so backdrop-filter on sticky header doesn't trap fixed coords. */}
      {portalReady &&
        mobileOpen &&
        createPortal(
          <div
            ref={mobilePanelRef}
            className="enter-panel fixed inset-0 z-[100] flex flex-col bg-bg min-[1100px]:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            onPointerDown={onMobileShellPointerDown}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-5 py-3.5">
              {brandLink}
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  aria-label="Cerrar menú"
                  onClick={closeMobileMenu}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-bg-elevated text-fg"
                >
                  <HamburgerIcon open />
                </button>
              </div>
            </div>

            <nav
              className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-8 pt-2"
              aria-label="Móvil"
            >

              {links.slice(0, 3).map((link) => (
                <SectionLink
                  key={link.hash}
                  hash={link.hash}
                  className="font-display border-b border-line py-4 text-lg font-medium text-fg"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </SectionLink>
              ))}

              <div className="border-b border-line">
                <div className="flex items-center justify-between gap-3 py-4">
                  <Link
                    href="/proyectos"
                    className="font-display text-lg font-medium text-fg"
                    onClick={closeMobileMenu}
                  >
                    Proyectos
                  </Link>
                  <button
                    type="button"
                    aria-label="Ver plataformas digitales"
                    aria-expanded={mobileProjectsOpen}
                    onClick={() => setMobileProjectsOpen((v) => !v)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-bg-elevated text-muted"
                  >
                    <Chevron open={mobileProjectsOpen} />
                  </button>
                </div>
                {mobileProjectsOpen && (
                  <ul className="mb-3 max-h-[calc(4*2.75rem)] space-y-0 overflow-y-auto overscroll-contain rounded-xl bg-bg-elevated pb-2 pl-1">
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
                  className="font-display border-b border-line py-4 text-lg font-medium text-fg"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}

              <SectionLink
                hash="contacto"
                className="font-display border-b border-line py-4 text-lg font-medium text-fg"
                onClick={closeMobileMenu}
              >
                Contacto
              </SectionLink>

              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-6"
                onClick={closeMobileMenu}
              >
                <WhatsAppIcon />
                WhatsApp · {site.phoneDisplay}
              </a>
            </nav>
          </div>,
          document.body,
        )}
      </div>
    </header>
  );
}
