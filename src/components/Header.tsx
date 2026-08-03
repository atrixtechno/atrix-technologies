import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site, whatsappUrl } from "@/content/site";

const links = [
  { href: "/proyectos", label: "Proyectos" },
  { href: "/#consejo", label: "Consejo" },
  { href: "/#beneficios", label: "Beneficios" },
  { href: "/#negocios", label: "Negocios" },
  { href: "/#contacto", label: "Contacto" },
];

export function Header({
  solid = false,
  light = false,
}: {
  solid?: boolean;
  light?: boolean;
}) {
  return (
    <header
      className={
        solid
          ? "sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md"
          : "absolute inset-x-0 top-0 z-30"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8 md:py-5">
        <Link href="/" className="group flex items-center gap-3">
          <Logo
            variant={light ? "mark-light" : "mark"}
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
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
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
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/proyectos"
            className="rounded-full border border-line px-3 py-2 text-sm text-fg"
          >
            Proyectos
          </Link>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-accent-ink"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
