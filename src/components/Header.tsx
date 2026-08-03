import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site, whatsappUrl } from "@/content/site";

const links = [
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/#proceso", label: "Proceso" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#contacto", label: "Contacto" },
];

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8 md:py-5">
        <Link href="/" className="group flex items-center gap-3">
          <Logo
            variant="mark"
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
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition hover:bg-white"
          >
            WhatsApp
          </a>
        </nav>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-accent-ink md:hidden"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}
