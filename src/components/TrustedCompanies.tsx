import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Marquee } from "@/components/Marquee";
import { projects } from "@/content/projects";

export function TrustedCompanies() {
  const items = projects.filter((p) => p.logo);

  return (
    <section
      aria-label="Empresas que confían en nosotros"
      className="relative border-b border-line bg-bg-soft"
    >
      <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-7 sm:px-8 md:flex-row md:items-center md:gap-10">
        <p className="mono shrink-0 text-[10.5px] tracking-[0.16em] text-subtle uppercase">
          Confían en ATRIX
        </p>
        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg-soft to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg-soft to-transparent md:w-24" />

          <Marquee duration={36} className="py-1">
            {items.map((project) => (
              <Link
                key={project.slug}
                href={`/proyectos/${project.slug}`}
                className="logobar-item flex shrink-0 items-center gap-3 px-5"
                style={
                  {
                    "--project": project.theme.accent,
                    "--project-glow": project.theme.glow,
                  } as CSSProperties
                }
              >
                <span className="logobar-logo relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-line">
                  <Image
                    src={project.logo!}
                    alt=""
                    fill
                    className="object-cover opacity-75 grayscale"
                    sizes="32px"
                  />
                </span>
                <span className="font-display text-base font-medium tracking-tight whitespace-nowrap">
                  {project.name}
                </span>
              </Link>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
