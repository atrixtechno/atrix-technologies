import Link from "next/link";
import { ProjectLogo } from "@/components/ProjectLogo";
import { Reveal } from "@/components/Reveal";
import { projectKindLabel, projects, type Project } from "@/content/projects";

// Industrias donde ATRIX ya tiene casos en producción, armadas desde src/content/projects.ts
// (la primera parte del sector de cada caso). Si se agrega un caso, la sección se actualiza sola.

const ORDER = ["Salud", "Educación", "Empleo", "Finanzas", "Contabilidad", "Retail", "Deporte"];

const COPY: Record<string, string> = {
  Salud: "Consultorios con captación de pacientes y panel de recepción.",
  Educación: "Administración escolar: alumnos, cobros, caja y credenciales.",
  Empleo: "Bolsa de trabajo con apps, pagos y empresas verificadas.",
  Finanzas: "Casas de cambio y control de gastos que siempre cuadran.",
  Contabilidad: "Pólizas, bancos e impuestos con el catálogo del SAT.",
  Retail: "Tiendas en línea y puntos de venta multi-sucursal.",
  Deporte: "Academias, clubes y certificados para artes marciales.",
};

function groups() {
  const map = new Map<string, Project[]>();
  for (const project of projects) {
    const key = project.sector.split("·")[0].trim();
    map.set(key, [...(map.get(key) ?? []), project]);
  }
  return [...map.entries()].sort((a, b) => {
    const ia = ORDER.indexOf(a[0]);
    const ib = ORDER.indexOf(b[0]);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
}

export function Industries() {
  const list = groups();
  const kinds = new Set(projects.map((p) => p.kind));
  return (
    <section id="industrias" className="relative scroll-mt-16 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="section-title">Experiencia real en tu industria.</h2>
            <p className="section-lead">
              {projects.length} proyectos en {list.length} industrias: no empezamos de cero con tu negocio.
            </p>
          </div>
          <dl className="grid shrink-0 grid-cols-3 gap-6 text-left lg:text-right">
            <div>
              <dt className="osd text-muted">Proyectos</dt>
              <dd className="display mt-1 text-4xl tabular-nums">{projects.length}</dd>
            </div>
            <div>
              <dt className="osd text-muted">Industrias</dt>
              <dd className="display mt-1 text-4xl tabular-nums">{list.length}</dd>
            </div>
            <div>
              <dt className="osd text-muted">Tipos</dt>
              <dd className="display mt-1 text-4xl tabular-nums">{kinds.size}</dd>
            </div>
          </dl>
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(([industry, items], index) => (
            <Reveal as="li" key={industry} delay={(index % 3) * 60} className="tile flex flex-col p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-xl font-semibold tracking-tight text-fg">{industry}</h3>
                <span className="osd text-muted tabular-nums">
                  {items.length} {items.length === 1 ? "caso" : "casos"}
                </span>
              </div>
              {COPY[industry] ? <p className="mt-2 text-sm leading-relaxed text-muted">{COPY[industry]}</p> : null}
              <ul className="mt-5 space-y-1 border-t border-line pt-4">
                {items.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/proyectos/${project.slug}`}
                      className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]"
                    >
                      {project.logo ? (
                        <ProjectLogo src={project.logo} name={project.name} size="sm" />
                      ) : (
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: project.theme.accent }} aria-hidden />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-fg transition-colors group-hover:text-accent">{project.name}</span>
                        <span className="block truncate text-xs text-muted">{projectKindLabel(project.kind)}</span>
                      </span>
                      <span className="text-muted transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
