import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { site, whatsappUrl } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-3">
          <LogoMark size={32} />
          <div>
            <p className="font-display text-sm font-extrabold tracking-[0.18em] uppercase">
              {site.name}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {site.legalName} · {site.city}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-muted">
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
