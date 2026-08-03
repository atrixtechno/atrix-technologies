import Link from "next/link";
import { projects } from "@/content/projects";

export function Projects() {
  return (
    <section id="proyectos" className="scroll-mt-8 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="text-sm tracking-[0.2em] text-muted uppercase">Proyectos</p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
          Trabajo real para negocios reales
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Cada proyecto resuelve una necesidad concreta: presencia en línea, operación
          interna o ambas.
        </p>

        <ul className="mt-14 divide-y divide-line border-y border-line">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Link
                href={`/proyectos/${project.slug}`}
                className="group grid gap-3 py-8 transition-colors md:grid-cols-[4rem_1fr_auto] md:items-baseline md:gap-8"
              >
                <span className="text-sm text-muted tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent md:text-3xl">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{project.sector}</p>
                  <p className="mt-3 max-w-2xl text-fg/80">{project.summary}</p>
                </div>
                <span className="text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100 md:justify-self-end">
                  Ver caso →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
