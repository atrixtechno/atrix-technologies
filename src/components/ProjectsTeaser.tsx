import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/content/projects";

export function ProjectsTeaser() {
  return (
    <section id="software" className="relative scroll-mt-10 border-t border-line py-24 md:py-28">
      <div className="pointer-events-none absolute right-0 top-10 h-48 w-48 rounded-full bg-signal/10 blur-3xl" />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
                Desarrollo de software
              </p>
              <h2 className="font-display mt-4 max-w-xl text-3xl font-bold tracking-tight md:text-5xl">
                Casos de sistemas y plataformas
              </h2>
              <div className="animate-line mt-4 h-px w-24 bg-accent/50" />
              <p className="mt-4 max-w-xl text-muted">
                Además del soporte e infraestructura, construimos sitios, paneles y
                apps a la medida. Estos son algunos casos.
              </p>
            </div>
            <Link
              href="/proyectos"
              className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:brightness-110"
            >
              Ver portafolio de software
            </Link>
          </div>
        </Reveal>

        <ul className="mt-12 divide-y divide-line border-y border-line">
          {projects.slice(0, 4).map((project, index) => (
            <Reveal key={project.slug} delay={index * 70}>
              <li>
                <Link
                  href={`/proyectos/${project.slug}`}
                  className="group flex flex-col gap-2 py-6 transition md:flex-row md:items-center md:justify-between md:gap-8"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-semibold tracking-[0.2em] text-muted transition group-hover:text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold transition group-hover:text-accent md:text-2xl">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{project.sector}</p>
                    </div>
                  </div>
                  <p className="max-w-md text-sm text-muted transition group-hover:text-fg/80 md:text-right">
                    {project.summary}
                  </p>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
