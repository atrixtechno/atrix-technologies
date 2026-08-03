import Link from "next/link";
import { projects } from "@/content/projects";

export function Projects() {
  return (
    <section id="proyectos" className="scroll-mt-8 border-t border-line py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-accent-deep uppercase">
          Proyectos
        </p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
          Trabajo real para negocios reales
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Cada proyecto resuelve una necesidad concreta: presencia en línea, operación
          interna o ambas.
        </p>

        <ul className="mt-12 space-y-4">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Link
                href={`/proyectos/${project.slug}`}
                className="group block rounded-[1.35rem] border border-line bg-white p-6 shadow-[0_14px_40px_rgba(11,40,45,0.05)] transition hover:border-accent/35 hover:shadow-[0_18px_50px_rgba(0,181,173,0.12)] md:p-8"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-8">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-accent-deep uppercase">
                      {String(index + 1).padStart(2, "0")} · {project.sector}
                    </p>
                    <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent-deep md:text-3xl">
                      {project.name}
                    </h3>
                    <p className="mt-3 max-w-2xl text-muted">{project.summary}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-accent-deep opacity-0 transition-opacity group-hover:opacity-100 md:pt-8">
                    Ver caso →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
