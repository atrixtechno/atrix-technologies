import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/Marquee";
import { projects } from "@/content/projects";

export function TrustedCompanies() {
  const items = projects.filter((p) => p.logo);

  return (
    <section
      aria-label="Empresas que confían en nosotros"
      className="relative border-b border-line bg-bg-elevated/40 py-8 md:py-10"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-center text-[10px] font-semibold tracking-[0.28em] text-muted uppercase sm:text-xs">
          Empresas que confían en nosotros
        </p>
      </div>

      <div className="relative mt-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg-elevated to-transparent sm:w-20 md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg-elevated to-transparent sm:w-20 md:w-28" />

        <Marquee duration={36} className="py-1">
          {items.map((project) => (
            <Link
              key={project.slug}
              href={`/proyectos/${project.slug}`}
              className="group flex shrink-0 items-center gap-3 border border-line bg-bg/80 px-4 py-3 transition hover:border-accent/40 hover:bg-bg-elevated sm:gap-3.5 sm:px-5 sm:py-3.5"
            >
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-line bg-bg sm:h-11 sm:w-11">
                <Image
                  src={project.logo!}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </span>
              <span className="min-w-0">
                <span className="font-display block text-sm font-semibold tracking-tight transition group-hover:text-accent sm:text-[15px]">
                  {project.name}
                </span>
                <span className="mt-0.5 block max-w-[11rem] truncate text-[11px] text-muted sm:max-w-[13rem]">
                  {project.sector}
                </span>
              </span>
            </Link>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
