"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProjectLogo } from "@/components/ProjectLogo";
import {
  projectKindLabel,
  projects,
  type ProjectKind,
} from "@/content/projects";

const filters: { id: ProjectKind; label: string; hint: string }[] = [
  {
    id: "sitio-web",
    label: "Sitio web",
    hint: "Presencia digital, landings y sitios públicos en producción.",
  },
  {
    id: "sistema",
    label: "Sistema",
    hint: "Puntos de venta, paneles operativos e integraciones para el día a día del negocio.",
  },
];

export function ProjectsIndexGrid() {
  const [active, setActive] = useState<ProjectKind>("sitio-web");

  const filtered = useMemo(
    () => projects.filter((project) => project.kind === active),
    [active],
  );

  const activeHint = filters.find((filter) => filter.id === active)?.hint ?? "";

  return (
    <>
      <div
        className="mt-2 inline-flex flex-wrap gap-2 rounded-full border border-line bg-bg-elevated/40 p-1 sm:mt-4"
        role="tablist"
        aria-label="Filtrar proyectos por tipo"
      >
        {filters.map((filter) => {
          const selected = active === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(filter.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selected
                  ? "bg-accent text-accent-ink shadow-[0_0_24px_var(--accent-glow)]"
                  : "text-muted hover:bg-bg-elevated hover:text-fg"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-muted">{activeHint}</p>

      <ul className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2">
        {filtered.map((project) => (
          <li key={project.slug} className="min-w-0">
            <Link
              href={`/proyectos/${project.slug}`}
                  className="group block h-full overflow-hidden rounded-[1.5rem] border border-line bg-bg-elevated shadow-[0_12px_40px_rgba(11,18,32,0.06)] transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_20px_44px_rgba(26,107,255,0.12)]"
              style={{
                boxShadow: `inset 3px 0 0 ${project.theme.accent}`,
                ["--accent" as string]: project.theme.accent,
                ["--project-glow" as string]: project.theme.glow,
              }}
            >
              {project.previewImage ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-bg">
                  <Image
                    src={project.previewImage}
                    alt={`Vista previa de ${project.name}`}
                    fill
                    quality={85}
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-elevated/90 via-transparent to-transparent" />
                </div>
              ) : null}
              <div className="p-5 sm:p-6 md:p-8">
                <div className="flex items-start gap-3 sm:gap-4">
                  {project.logo && (
                    <ProjectLogo src={project.logo} name={project.name} size="md" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[10px] font-semibold tracking-[0.16em] text-muted uppercase sm:text-[11px] sm:tracking-[0.2em]">
                        {project.sector}
                      </p>
                      <span className="rounded-full border border-line bg-bg/80 px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-accent uppercase">
                        {projectKindLabel(project.kind)}
                      </span>
                    </div>
                    <h2 className="font-display mt-1.5 text-xl font-bold transition group-hover:text-accent sm:mt-2 sm:text-2xl md:text-3xl">
                      {project.name}
                    </h2>
                  </div>
                </div>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted sm:mt-4">
                  {project.summary}
                </p>
                <p className="mt-5 text-sm font-semibold text-accent sm:mt-6">
                  Ver caso completo →
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-[1.5rem] border border-dashed border-line bg-bg-elevated/40 px-5 py-8 text-center text-sm text-muted">
          Aún no hay proyectos en esta categoría.
        </p>
      ) : null}
    </>
  );
}
