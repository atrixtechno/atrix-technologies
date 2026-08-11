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
                Sitios, paneles y apps a la medida. Desliza la lista para ver más casos.
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

        <Reveal delay={60}>
          <div className="relative mt-7 sm:mt-8">
            <div
              className="software-scroll max-h-[22.5rem] overflow-y-auto overscroll-contain border border-line bg-bg-elevated/30 sm:max-h-[24rem]"
              tabIndex={0}
              aria-label="Lista de proyectos de software. Desliza para ver más."
            >
              <ul className="divide-y divide-line">
                {projects.map((project) => {
                  const { accent, glow } = project.theme;
                  return (
                    <li key={project.slug} className="min-w-0">
                      <Link
                        href={`/proyectos/${project.slug}`}
                        className="project-tile group relative flex min-h-[10.5rem] gap-3 overflow-hidden px-3 py-3 transition hover:bg-bg-elevated/70 sm:min-h-[11rem] sm:gap-4 sm:px-4 sm:py-3.5"
                        style={
                          {
                            "--project-accent": accent,
                            "--project-glow": glow,
                            "--project-tint": hexToRgba(accent, 0.1),
                            "--project-border": hexToRgba(accent, 0.28),
                            "--accent": accent,
                            boxShadow: `inset 3px 0 0 ${accent}`,
                            background:
                              "linear-gradient(90deg, var(--project-tint) 0%, transparent 42%)",
                          } as React.CSSProperties
                        }
                      >
                        <div className="relative hidden h-[8.75rem] w-[11.5rem] shrink-0 overflow-hidden border border-line/70 bg-bg sm:block">
                          {project.previewImage ? (
                            <Image
                              src={project.previewImage}
                              alt=""
                              fill
                              quality={75}
                              className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                              sizes="184px"
                            />
                          ) : null}
                        </div>

                        <div className="relative flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-0.5">
                          <div className="flex min-w-0 items-center gap-2.5">
                            {project.logo && (
                              <ProjectLogo
                                src={project.logo}
                                name={project.name}
                                size="sm"
                              />
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
                          <p className="text-xs font-semibold text-[var(--project-accent)]">
                            Ver caso →
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg via-bg/70 to-transparent"
              aria-hidden
            />
            <p className="mt-3 text-center text-[11px] tracking-[0.16em] text-muted uppercase">
              Desliza para ver más · {projects.length} proyectos
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
