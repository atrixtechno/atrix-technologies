import Link from "next/link";
import { ProjectLogo } from "@/components/ProjectLogo";
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

        <ul className="mt-14 grid gap-4">
          {projects.map((project, index) => {
            const { accent, glow } = project.theme;
            return (
              <li key={project.slug}>
                <Link
                  href={`/proyectos/${project.slug}`}
                  className="project-tile group relative grid gap-4 overflow-hidden border px-5 py-6 transition duration-300 hover:-translate-y-0.5 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:px-6 md:py-7"
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
                    className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[var(--project-orb)] blur-2xl"
                    aria-hidden
                  />
                  <div className="relative flex items-center gap-4">
                    {project.logo ? (
                      <ProjectLogo src={project.logo} name={project.name} size="lg" />
                    ) : (
                      <span className="font-display text-sm tracking-[0.2em] text-[var(--project-accent)] tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[var(--project-accent)]">
                      {project.sector}
                    </p>
                    <p className="mt-3 max-w-2xl text-fg/75">{project.summary}</p>
                  </div>
                  <span className="relative text-sm font-medium text-[var(--project-accent)] opacity-70 transition group-hover:opacity-100 md:justify-self-end">
                    Ver caso →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
