import Link from "next/link";
import { projects } from "@/content/projects";

export function Projects() {
  return (
    <section id="proyectos" className="scroll-mt-10 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
          Proyectos
        </p>
        <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
          Sistemas que ya operan en la frontera
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Casos reales: clínicas, casas de cambio, academias y clubes con software a su medida.
        </p>

        <ul className="mt-14 divide-y divide-line border-y border-line">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Link
                href={`/proyectos/${project.slug}`}
                className="group grid gap-3 py-8 transition-colors md:grid-cols-[5rem_1fr_auto] md:items-baseline md:gap-10"
              >
                <span className="font-display text-sm tracking-[0.2em] text-accent/70 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-accent md:text-3xl">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{project.sector}</p>
                  <p className="mt-3 max-w-2xl text-fg/75">{project.summary}</p>
                </div>
                <span className="text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100 md:justify-self-end">
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
