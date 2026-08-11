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
    <section id="software" className="relative scroll-mt-10 border-t border-line py-14 md:py-16">
      <div className="pointer-events-none absolute right-0 top-6 h-32 w-32 rounded-full bg-signal/10 blur-3xl" />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.28em] text-accent uppercase sm:text-xs">
                Desarrollo de software
              </p>
              <h2 className="font-display mt-2 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Casos de sistemas y plataformas
              </h2>
              <div className="animate-line mt-3 h-px w-16 bg-accent/50 sm:w-20" />
              <p className="mt-3 max-w-lg text-sm text-muted sm:text-[15px]">
                Sitios, paneles y apps a la medida. Estos son algunos casos.
              </p>
            </div>
            <Link
              href="/proyectos"
              className="btn-primary inline-flex shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              Ver portafolio
            </Link>
          </div>
        </Reveal>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {projects.map((project, index) => {
            const { accent, glow } = project.theme;
            return (
              <Reveal key={project.slug} delay={Math.min(index * 50, 200)}>
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
                    <div className="relative aspect-[16/8] w-full overflow-hidden border-b border-line/60 bg-bg">
                      {project.previewImage ? (
                        <Image
                          src={project.previewImage}
                          alt={`Vista previa de ${project.name}`}
                          fill
                          quality={80}
                          className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : null}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                    </div>

                    <div className="relative flex flex-1 flex-col gap-1.5 px-3.5 py-3 sm:px-4 sm:py-3.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        {project.logo && (
                          <ProjectLogo src={project.logo} name={project.name} size="sm" />
                        )}
                        <div className="min-w-0">
                          <h3 className="font-display truncate text-[15px] font-semibold sm:text-base">
                            {project.name}
                          </h3>
                          <p className="truncate text-[11px] font-medium text-[var(--project-accent)] sm:text-xs">
                            {project.sector}
                          </p>
                        </div>
                      </div>
                      <p className="line-clamp-2 text-pretty text-xs leading-relaxed text-muted sm:text-[13px]">
                        {project.summary}
                      </p>
                      <p className="mt-auto pt-1 text-xs font-semibold text-[var(--project-accent)]">
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
