import Link from "next/link";
import { site, whatsappUrl } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-display text-lg font-bold tracking-[0.12em]">{site.name}</p>
          <p className="mt-1 text-sm text-muted">
            {site.legalName} · {site.city}
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-muted">
          <Link href="/#proyectos" className="hover:text-fg">
            Proyectos
          </Link>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
