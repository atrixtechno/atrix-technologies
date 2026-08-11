"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { projects, type Project } from "@/content/projects";

export function AdminProjectsPanel() {
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.sector.toLowerCase().includes(q),
    );
  }, [query]);

  const selected =
    filtered.find((p) => p.slug === selectedSlug) ??
    projects.find((p) => p.slug === selectedSlug) ??
    null;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
          2. Proyecto
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          Proyectos del sitio
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Vista de lectura del catálogo en{" "}
          <code className="text-fg">src/content/projects.ts</code>. Abre el
          detalle aquí o visita la página pública.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="project-search">
          Buscar proyecto
        </label>
        <input
          id="project-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, slug o sector…"
          className="min-w-[220px] flex-1 border border-line bg-bg px-4 py-2.5 text-sm text-fg outline-none transition focus:border-accent"
        />
        <p className="text-xs text-muted">
          {filtered.length} de {projects.length}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ul className="divide-y divide-line border border-line bg-bg-elevated/70 backdrop-blur">
          {filtered.map((project) => (
            <li key={project.slug}>
              <button
                type="button"
                onClick={() => setSelectedSlug(project.slug)}
                className={`flex w-full items-start gap-4 px-4 py-4 text-left transition hover:bg-bg/50 md:px-5 ${
                  selected?.slug === project.slug ? "bg-accent/10" : ""
                }`}
              >
                {project.logo ? (
                  <span className="relative mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-full border border-line bg-bg">
                    <Image
                      src={project.logo}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </span>
                ) : (
                  <span
                    className="mt-0.5 h-10 w-10 shrink-0 rounded-full"
                    style={{ background: project.theme.accent }}
                    aria-hidden
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-fg">{project.name}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {project.sector}
                  </span>
                  <span className="mt-1 block font-mono text-[11px] text-muted">
                    /proyectos/{project.slug}
                  </span>
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-muted">
              Sin coincidencias.
            </li>
          )}
        </ul>

        <ProjectDetail project={selected} />
      </div>
    </div>
  );
}

function ProjectDetail({ project }: { project: Project | null }) {
  if (!project) {
    return (
      <div className="flex min-h-[280px] items-center justify-center border border-dashed border-line bg-bg-elevated/40 p-6 text-center text-sm text-muted">
        Selecciona un proyecto para ver el detalle.
      </div>
    );
  }

  return (
    <article className="border border-line bg-bg-elevated/70 p-5 backdrop-blur md:p-6">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
        Detalle
      </p>
      <h2 className="font-display mt-2 text-2xl font-semibold text-fg">
        {project.name}
      </h2>
      <p className="mt-1 text-sm text-muted">{project.sector}</p>
      <p className="mt-4 text-sm leading-relaxed text-fg/90">{project.summary}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{project.result}</p>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs tracking-[0.14em] text-muted uppercase">Slug</dt>
          <dd className="mt-1 font-mono text-fg">{project.slug}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.14em] text-muted uppercase">Año</dt>
          <dd className="mt-1 text-fg">{project.year}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs tracking-[0.14em] text-muted uppercase">
            Ubicación
          </dt>
          <dd className="mt-1 text-fg">{project.location}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs tracking-[0.14em] text-muted uppercase">Stack</dt>
          <dd className="mt-1 text-fg">{project.stackNote}</dd>
        </div>
      </dl>

      {project.tags && project.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="border border-line px-2.5 py-1 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={`/proyectos/${project.slug}`}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition hover:brightness-110"
        >
          Ver página pública
        </Link>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg transition hover:border-accent/40 hover:text-accent"
          >
            Sitio en vivo
          </a>
        )}
      </div>
    </article>
  );
}
