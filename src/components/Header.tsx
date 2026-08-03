import Link from "next/link";
import { site, whatsappUrl } from "@/content/site";

const links = [
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/#proceso", label: "Cómo trabajo" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#contacto", label: "Contacto" },
];

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 px-4 pt-4 md:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-fg/10 bg-white/80 px-4 py-2.5 shadow-[0_12px_40px_rgba(11,40,45,0.08)] backdrop-blur-md md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-bg-ink text-[11px] font-extrabold tracking-wide text-accent">
            A
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-fg">
            ATRIX
            <span className="ml-1.5 hidden text-xs font-medium tracking-[0.14em] text-accent-deep uppercase sm:inline">
              Technologies
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-accent-deep"
            >
              {link.label}
            </a>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,211,102,0.28)] transition hover:bg-[#1ebe57]"
          >
            WhatsApp
          </a>
        </nav>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#25D366] px-3.5 py-2 text-sm font-semibold text-white md:hidden"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}
