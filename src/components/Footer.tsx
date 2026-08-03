import Link from "next/link";
import { site, whatsappUrl } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white/80 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-display text-lg font-bold tracking-[0.08em]">
            {site.name}
            <span className="ml-2 text-xs font-medium tracking-[0.16em] text-accent-deep uppercase">
              Technologies
            </span>
          </p>
          <p className="mt-1 text-sm text-muted">
            {site.legalName} · {site.city}
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-muted">
          <Link href="/#proyectos" className="hover:text-accent-deep">
            Proyectos
          </Link>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-deep"
          >
            WhatsApp
          </a>
          <a
            href="https://dentalmate.mx/disenador"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-deep"
          >
            Caso DentalMate
          </a>
        </div>
      </div>
    </footer>
  );
}
