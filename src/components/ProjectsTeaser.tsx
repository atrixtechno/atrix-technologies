import Image from "next/image";
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

        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {projects.map((project, index) => {
            const { accent, glow } = project.theme;
            return (
              <Reveal key={project.slug} delay={index * 70}>
                <li className="h-full min-w-0">
                  <Link
                    href={`/proyectos/${project.slug}`}
                    className="project-tile group relative flex h-full min-w-0 flex-col overflow-hidden border transition duration-300 hover:-translate-y-0.5"
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
                          "linear-gradient(180deg, var(--project-tint) 0%, var(--project-tint-soft) 45%, transparent 100%)",
                      } as React.CSSProperties
                    }
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line/60 bg-bg">
                      {project.previewImage ? (
                        <Image
                          src={project.previewImage}
                          alt={`Vista previa de ${project.name}`}
                          fill
                          quality={85}
                          className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      ) : null}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
                    </div>

                    <div className="relative flex flex-1 flex-col gap-3 px-4 py-4 sm:px-5 sm:py-5">
                      <div className="flex min-w-0 items-center gap-3">
                        {project.logo && (
                          <ProjectLogo src={project.logo} name={project.name} size="sm" />
                        )}
                        <div className="min-w-0">
                          <h3 className="font-display text-lg font-semibold sm:text-xl">
                            {project.name}
                          </h3>
                          <p className="mt-0.5 text-sm font-medium text-[var(--project-accent)]">
                            {project.sector}
                          </p>
                        </div>
                      </div>
                      <p className="text-pretty text-sm text-muted">{project.summary}</p>
                      <p className="mt-auto pt-1 text-sm font-semibold text-[var(--project-accent)]">
                        Ver caso →
                      </p>
                    </div>
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
