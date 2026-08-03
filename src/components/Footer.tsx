import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site, whatsappUrl } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 text-center md:flex-row md:items-center md:justify-between md:px-8 md:text-left">
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
          <Logo variant="mark" size={44} />
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
          <Link href="/#proyectos" className="hover:text-accent">
            Proyectos
          </Link>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            WhatsApp
          </a>
          <a
            href="https://dentalmate.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            DentalMate
          </a>
        </div>
      </div>
    </footer>
  );
}
