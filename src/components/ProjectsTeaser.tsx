import Link from "next/link";
import { ProjectLogo } from "@/components/ProjectLogo";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/content/projects";

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = Number.parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

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
              className="btn-primary inline-flex rounded-full px-6 py-3 text-sm font-semibold"
            >
              Ver portafolio de software
            </Link>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-4">
          {projects.map((project, index) => {
            const { accent, glow } = project.theme;
            return (
              <Reveal key={project.slug} delay={index * 70}>
                <li>
                  <Link
                    href={`/proyectos/${project.slug}`}
                    className="project-tile group relative flex min-w-0 flex-col gap-3 overflow-hidden border px-4 py-4 transition duration-300 hover:-translate-y-0.5 sm:px-5 sm:py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6 md:py-6"
                    style={
                      {
                        "--project-accent": accent,
                        "--project-glow": glow,
                        "--project-tint": hexToRgba(accent, 0.14),
                        "--project-tint-soft": hexToRgba(accent, 0.04),
                        "--project-border": hexToRgba(accent, 0.28),
                        "--project-border-hover": hexToRgba(accent, 0.5),
                        "--project-orb": hexToRgba(accent, 0.22),
                        "--accent": accent,
                        borderColor: "var(--project-border)",
                        background:
                          "linear-gradient(135deg, var(--project-tint) 0%, var(--project-tint-soft) 55%, transparent 100%)",
                      } as React.CSSProperties
                    }
                  >
                    <span
                      className="absolute inset-y-0 left-0 w-1 bg-[var(--project-accent)] transition-all duration-300 group-hover:w-1.5"
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[var(--project-orb)] blur-2xl transition duration-500 group-hover:scale-125"
                      aria-hidden
                    />

                    <div className="relative flex min-w-0 items-center gap-3 sm:gap-4">
                      {project.logo && (
                        <ProjectLogo src={project.logo} name={project.name} size="md" />
                      )}
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-semibold sm:text-xl md:text-2xl">
                          {project.name}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-[var(--project-accent)]">
                          {project.sector}
                        </p>
                      </div>
                    </div>
                    <p className="relative max-w-md text-pretty text-sm text-muted md:text-right">
                      {project.summary}
                    </p>
                  </Link>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
