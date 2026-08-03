import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site, whatsappUrl } from "@/content/site";

export function Footer({ light = false }: { light?: boolean }) {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 text-center md:flex-row md:items-center md:justify-between md:px-8 md:text-left">
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
          <Logo variant={light ? "mark-light" : "mark"} size={44} />
          <div>
            <p className="font-display text-sm font-extrabold tracking-[0.2em] uppercase">
              {site.legalName}
            </p>
            <p className="mt-1 text-xs tracking-[0.12em] text-muted uppercase">
              {site.motto}
            </p>
            <p className="mt-1 text-xs text-muted">{site.city}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted">
          <Link href="/proyectos" className="hover:text-accent">
            Proyectos
          </Link>
          <Link href="/#negocios" className="hover:text-accent">
            Para negocios
          </Link>
          <Link href="/#programadores" className="hover:text-accent">
            Para programadores
          </Link>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            WhatsApp
          </a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-5 text-center text-[11px] text-muted md:px-8 md:text-left">
        © {new Date().getFullYear()} {site.legalName}. Diseño y desarrollo en{" "}
        {site.city}.
      </p>
    </footer>
  );
}
