"use client";

import Image from "next/image";
import Link from "next/link";
import { ProjectLogo } from "@/components/ProjectLogo";
import { Reveal } from "@/components/Reveal";
import type { Project } from "@/content/projects";
import { whatsappUrl } from "@/content/site";

export function ProjectCase({ project }: { project: Project }) {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="animate-orb absolute -left-24 top-32 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="animate-orb-delayed absolute -right-16 top-[38%] h-80 w-80 rounded-full bg-[var(--accent)]/8 blur-3xl" />
        <div className="animate-orb absolute bottom-24 left-1/3 h-56 w-56 rounded-full bg-[var(--accent)]/6 blur-3xl" />
        <div className="scanline absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/35 to-transparent" />
      </div>

      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div
          className="animate-glow pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 80% 0%, var(--project-glow), transparent 55%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:items-end md:gap-12 md:px-8 md:pb-20 md:pt-16">
          <div className="animate-rise">
            <Link
              href="/proyectos"
              className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
            >
              ← Todos los proyectos
            </Link>
            <div className="mt-10 flex items-center gap-5">
              {project.logo && (
                <ProjectLogo src={project.logo} name={project.name} size="xl" />
              )}
              <div>
                <p className="text-xs font-semibold tracking-[0.28em] text-[var(--accent)] uppercase">
                  {project.sector}
                </p>
                <h1 className="font-display mt-3 max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl">
                  {project.name}
                </h1>
              </div>
            </div>
            <div className="project-section-line mt-4 h-px w-24 bg-[var(--accent)]/50" />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
              {project.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
              <span>{project.year}</span>
              <span>·</span>
              <span>{project.location}</span>
              <span>·</span>
              <span>{project.stackNote}</span>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="project-tag rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-cta-pulse inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-bold text-[var(--accent-ink)] transition hover:brightness-110"
                  style={{
                    outline:
                      "4px solid color-mix(in srgb, var(--accent) 22%, transparent)",
                  }}
                >
                  Ver sitio en vivo
                  <span aria-hidden>↗</span>
                </a>
              )}
              <a
                href={whatsappUrl(
                  `Hola ATRIX Technologies, vi el proyecto ${project.name} y me interesa algo similar.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-5 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Quiero algo así
              </a>
              {project.designerUrl && (
                <a
                  href={project.designerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                >
                  Página del diseñador
                </a>
              )}
            </div>
          </div>

          {(project.previewImage || project.url) && (
            <div className="animate-fade-scale relative">
              <div
                className="animate-glow pointer-events-none absolute -inset-3 -z-10 rounded-[1.5rem] blur-2xl"
                style={{ background: "var(--project-glow)" }}
              />
              <a
                href={project.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="project-preview-float group block overflow-hidden rounded-[1.15rem] border border-[var(--line)] bg-[var(--bg-elevated)] shadow-[0_24px_60px_rgba(11,40,45,0.12)] transition hover:-translate-y-1"
                aria-label={`Abrir ${project.name} en vivo`}
              >
                <div className="flex items-center gap-2 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--fg)_4%,transparent)] px-3 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-2 truncate font-mono text-[11px] text-[var(--muted)]">
                    {project.url?.replace(/^https?:\/\//, "")}
                  </span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg)]">
                  {project.previewImage ? (
                    <Image
                      src={project.previewImage}
                      alt={`Vista previa de ${project.name}`}
                      fill
                      className="object-cover object-top transition duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 480px"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
                      Vista previa
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[var(--fg)]/55 via-transparent to-transparent p-5 transition group-hover:from-[var(--fg)]/70">
                    <span className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-bold tracking-wide text-[var(--accent-ink)] uppercase shadow-lg transition group-hover:scale-105">
                      Abrir sitio en vivo →
                    </span>
                  </div>
                </div>
              </a>
            </div>
          )}
        </div>
      </section>

      {project.stats && project.stats.length > 0 && (
        <section className="relative border-b border-[var(--line)] bg-[var(--bg-elevated)]">
          <div className="mx-auto grid max-w-6xl gap-3 px-5 py-8 sm:grid-cols-2 md:grid-cols-4 md:px-8">
            {project.stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 70}>
                <div className="project-card tech-frame border border-[var(--line)] bg-[var(--bg)] px-5 py-5">
                  <p className="project-stat-value font-display text-3xl font-bold">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {project.story && project.story.length > 0 ? (
        <section className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.28em] text-[var(--accent)] uppercase">
              De qué trató el proyecto
            </p>
            <h2 className="font-display mt-3 text-2xl font-bold md:text-3xl">
              Una plataforma digital completa
            </h2>
            <div className="project-section-line mt-4 h-px w-24 bg-[var(--accent)]/50" />
            <div className="mt-6 max-w-3xl space-y-4 text-[var(--muted)]">
              {project.story.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </section>
      ) : (
        <section className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:gap-14 md:px-8 md:py-20">
          <Reveal>
            <h2 className="font-display text-2xl font-bold md:text-3xl">El reto</h2>
            <div className="project-section-line mt-4 h-px w-16 bg-[var(--accent)]/50" />
            <p className="mt-4 leading-relaxed text-[var(--muted)]">{project.challenge}</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-2xl font-bold md:text-3xl">La solución</h2>
            <div className="project-section-line mt-4 h-px w-16 bg-[var(--accent)]/50" />
            <p className="mt-4 leading-relaxed text-[var(--muted)]">{project.solution}</p>
          </Reveal>
        </section>
      )}

      <section className="relative border-y border-[var(--line)] bg-[var(--bg-elevated)] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Impacto</h2>
            <div className="project-section-line mt-4 h-px w-24 bg-[var(--accent)]/50" />
          </Reveal>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {project.impact.map((item, index) => (
              <Reveal key={item} delay={index * 80}>
                <li className="project-card border border-[var(--line)] bg-[var(--bg)] p-5 text-sm leading-relaxed">
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <Reveal>
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Módulos entregados
          </h2>
          <div className="project-section-line mt-4 h-px w-24 bg-[var(--accent)]/50" />
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            Lo que el cliente puede usar hoy — no un mockup.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {project.modules.map((mod, index) => (
            <Reveal key={mod.title} delay={index * 60}>
              <article className="project-card tech-frame border border-[var(--line)] bg-[var(--bg-elevated)] p-5">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-2 text-lg font-semibold">{mod.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{mod.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {project.deliverables && project.deliverables.length > 0 && (
        <section className="relative border-y border-[var(--line)] bg-[var(--bg-elevated)] py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <Reveal>
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Todo lo que se construyó
              </h2>
              <div className="project-section-line mt-4 h-px w-24 bg-[var(--accent)]/50" />
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Del concepto de marca a la operación diaria.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.deliverables.map((item, index) => (
                <Reveal key={item.title} delay={index * 60}>
                  <article className="project-card border border-[var(--line)] bg-[var(--bg)] p-5">
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-display mt-2 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {item.copy}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {project.approach && project.approach.length > 0 && (
        <section className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Enfoque ATRIX</h2>
            <div className="project-section-line mt-4 h-px w-24 bg-[var(--accent)]/50" />
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              Criterio visual con implementación real.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {project.approach.map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <article className="project-card border border-[var(--line)] bg-[var(--bg-elevated)] p-5">
                  <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="relative border-y border-[var(--line)] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Tecnologías</h2>
            <div className="project-section-line mt-4 h-px w-24 bg-[var(--accent)]/50" />
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              Stack elegido para rendimiento, mantenimiento y escala.
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {project.technologies.map((tech, index) => (
              <Reveal key={tech.name} delay={index * 40}>
                <li className="project-card flex flex-col border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-4">
                  <span className="font-semibold">{tech.name}</span>
                  <span className="mt-1 text-sm text-[var(--muted)]">{tech.role}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {project.languages && project.languages.length > 0 && (
        <section className="relative mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Idiomas del sitio</h2>
            <div className="project-section-line mt-4 h-px w-24 bg-[var(--accent)]/50" />
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              Experiencia global para pacientes locales e internacionales.
            </p>
          </Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {project.languages.map((lang, index) => (
              <Reveal key={lang.code} delay={index * 40}>
                <li className="project-card border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-3">
                  <p className="text-sm font-semibold">{lang.code}</p>
                  <p className="mt-0.5 truncate text-[11px] text-[var(--muted)]">{lang.name}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      <section className="relative border-t border-[var(--line)] bg-[var(--bg-elevated)] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Cómo lo construimos</h2>
            <div className="project-section-line mt-4 h-px w-24 bg-[var(--accent)]/50" />
          </Reveal>
          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {project.process.map((step, index) => (
              <Reveal key={step.title} delay={index * 80}>
                <li className="transition hover:translate-x-1">
                  <p className="font-display text-3xl font-extrabold text-[var(--accent)]/40">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{step.copy}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {project.lead && (
        <section className="relative border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--fg)_92%,#000)] py-16 text-[var(--bg)] md:py-20">
          <Reveal>
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <p className="text-xs font-semibold tracking-[0.2em] text-[var(--accent)] uppercase">
                Conoce al responsable
              </p>
              <h2 className="font-display mt-3 text-2xl font-bold text-[var(--bg)] sm:text-3xl">
                {project.lead.name}
              </h2>
              <p className="mt-2 text-xs font-semibold tracking-[0.16em] text-[var(--bg)]/55 uppercase">
                {project.lead.role}
              </p>
              {project.lead.badges && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.lead.badges.map((badge) => (
                    <span
                      key={badge}
                      className="project-tag rounded-full border border-[var(--bg)]/20 bg-[var(--bg)]/10 px-3 py-1 text-xs font-semibold text-[var(--bg)]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-[var(--bg)]/70">
                {project.lead.copy.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      )}

      <section className="relative border-t border-[var(--line)] bg-[var(--bg-elevated)] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Por qué un cliente elegiría esto
            </h2>
            <div className="project-section-line mt-4 h-px w-24 bg-[var(--accent)]/50" />
          </Reveal>
          <ul className="mt-8 space-y-4">
            {project.persuasion.map((item, index) => (
              <Reveal key={item} delay={index * 60}>
                <li className="flex gap-3 text-[var(--fg)]/90 transition hover:translate-x-1">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  {item}
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={120}>
            <ul className="mt-10 space-y-3 border-t border-[var(--line)] pt-8">
              {project.highlights.map((item) => (
                <li key={item} className="text-sm text-[var(--muted)]">
                  · {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-12 flex flex-wrap gap-3">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-cta-pulse rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-[var(--accent-ink)] transition hover:brightness-110"
                >
                  Ver {project.name} en vivo ↗
                </a>
              )}
              <a
                href={whatsappUrl(
                  `Hola ATRIX, quiero un proyecto similar a ${project.name}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[var(--line)] px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
              >
                Cotizar un proyecto similar
              </a>
              <Link
                href="/proyectos"
                className="rounded-full border border-[var(--line)] px-6 py-3.5 text-sm transition hover:-translate-y-0.5"
              >
                Ver más casos
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
