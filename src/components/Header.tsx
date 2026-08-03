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
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-lg font-extrabold tracking-[0.12em] text-fg">
            {site.name}
          </span>
          <span className="hidden text-xs tracking-wide text-muted sm:inline">
            Technologies
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
          >
            WhatsApp
          </a>
        </nav>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm bg-accent px-3 py-2 text-sm font-medium text-accent-ink md:hidden"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}
