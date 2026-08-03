import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getProject, projects } from "@/content/projects";
import { site, whatsappUrl } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const ogImage = project.previewImage ?? "/brand/atrix-logo.png";
  return {
    title: project.seoTitle,
    description: project.seoDescription,
    keywords: project.keywords,
    alternates: { canonical: `/proyectos/${project.slug}` },
    openGraph: {
      title: project.seoTitle,
      description: project.seoDescription,
      url: `${site.url}/proyectos/${project.slug}`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 720 }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.seoTitle,
      description: project.seoDescription,
      images: [ogImage],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const t = project.theme;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    name: project.name,
    description: project.seoDescription,
    url: `${site.url}/proyectos/${project.slug}`,
    creator: {
      "@type": "Organization",
      name: site.legalName,
      url: site.url,
    },
    about: project.sector,
    keywords: project.keywords.join(", "),
    inLanguage: "es-MX",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header solid />
      <div
        style={
          {
            "--bg": t.bg,
            "--bg-elevated": t.bgElevated,
            "--fg": t.fg,
            "--muted": t.muted,
            "--accent": t.accent,
            "--accent-ink": t.accentInk,
            "--line": `${t.fg}18`,
            "--signal": t.accent,
          } as CSSProperties
        }
        className="min-h-screen bg-[var(--bg)] text-[var(--fg)]"
      >
        <main>
          <section className="relative overflow-hidden border-b border-[var(--line)]">
            <div
              className="pointer-events-none absolute inset-0 opacity-90"
              style={{
                background: `radial-gradient(ellipse 70% 55% at 80% 0%, ${t.glow}, transparent 55%)`,
              }}
            />
            <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:items-end md:gap-12 md:px-8 md:pb-20 md:pt-16">
              <div>
                <Link
                  href="/proyectos"
                  className="text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"
                >
                  ← Todos los proyectos
                </Link>
                <p className="mt-10 text-xs font-semibold tracking-[0.28em] text-[var(--accent)] uppercase">
                  {project.sector}
                </p>
                <h1 className="font-display mt-4 max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl">
                  {project.name}
                </h1>
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
                        className="rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)] uppercase"
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
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-bold text-[var(--accent-ink)] transition hover:brightness-110"
                      style={{
                        boxShadow: `0 16px 40px ${t.glow}`,
                        outline: `4px solid color-mix(in srgb, ${t.accent} 22%, transparent)`,
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
                    className="rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-5 py-3.5 text-sm font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
                <div className="relative">
                  <div
                    className="pointer-events-none absolute -inset-3 -z-10 rounded-[1.5rem] blur-2xl"
                    style={{ background: t.glow }}
                  />
                  <a
                    href={project.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-[1.15rem] border border-[var(--line)] bg-[var(--bg-elevated)] shadow-[0_24px_60px_rgba(11,40,45,0.12)] transition hover:-translate-y-1"
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
                          className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 480px"
                          priority
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
                          Vista previa
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[var(--fg)]/55 via-transparent to-transparent p-5 opacity-100 transition group-hover:from-[var(--fg)]/70">
                        <span className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-bold tracking-wide text-[var(--accent-ink)] uppercase shadow-lg">
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
            <section className="border-b border-[var(--line)] bg-[var(--bg-elevated)]">
              <div className="mx-auto grid max-w-6xl gap-3 px-5 py-8 sm:grid-cols-2 md:grid-cols-4 md:px-8">
                {project.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border border-[var(--line)] bg-[var(--bg)] px-5 py-5"
                  >
                    <p className="font-display text-3xl font-bold text-[var(--accent)]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.story && project.story.length > 0 ? (
            <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
              <p className="text-xs font-semibold tracking-[0.28em] text-[var(--accent)] uppercase">
                De qué trató el proyecto
              </p>
              <h2 className="font-display mt-3 text-2xl font-bold md:text-3xl">
                Una plataforma digital completa
              </h2>
              <div className="mt-6 max-w-3xl space-y-4 text-[var(--muted)]">
                {project.story.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ) : (
            <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:gap-14 md:px-8 md:py-20">
              <div>
                <h2 className="font-display text-2xl font-bold md:text-3xl">El reto</h2>
                <p className="mt-4 leading-relaxed text-[var(--muted)]">{project.challenge}</p>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold md:text-3xl">La solución</h2>
                <p className="mt-4 leading-relaxed text-[var(--muted)]">{project.solution}</p>
              </div>
            </section>
          )}

          <section className="border-y border-[var(--line)] bg-[var(--bg-elevated)] py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <h2 className="font-display text-2xl font-bold md:text-3xl">Impacto</h2>
              <ul className="mt-8 grid gap-4 md:grid-cols-3">
                {project.impact.map((item) => (
                  <li
                    key={item}
                    className="border border-[var(--line)] bg-[var(--bg)] p-5 text-sm leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Módulos entregados
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              Lo que el cliente puede usar hoy — no un mockup.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {project.modules.map((mod, index) => (
                <article
                  key={mod.title}
                  className="border border-[var(--line)] bg-[var(--bg-elevated)] p-5"
                >
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display mt-2 text-lg font-semibold">{mod.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {mod.copy}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {project.deliverables && project.deliverables.length > 0 && (
            <section className="border-y border-[var(--line)] bg-[var(--bg-elevated)] py-16 md:py-20">
              <div className="mx-auto max-w-6xl px-5 md:px-8">
                <h2 className="font-display text-2xl font-bold md:text-3xl">
                  Todo lo que se construyó
                </h2>
                <p className="mt-3 max-w-2xl text-[var(--muted)]">
                  Del concepto de marca a la operación diaria.
                </p>
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {project.deliverables.map((item, index) => (
                    <article
                      key={item.title}
                      className="border border-[var(--line)] bg-[var(--bg)] p-5"
                    >
                      <p className="text-[11px] font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-display mt-2 text-lg font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                        {item.copy}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {project.approach && project.approach.length > 0 && (
            <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Enfoque ATRIX
              </h2>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Criterio visual con implementación real.
              </p>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {project.approach.map((item) => (
                  <article
                    key={item.title}
                    className="border border-[var(--line)] bg-[var(--bg-elevated)] p-5"
                  >
                    <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {item.copy}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="border-y border-[var(--line)] py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Tecnologías
              </h2>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Stack elegido para rendimiento, mantenimiento y escala.
              </p>
              <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {project.technologies.map((tech) => (
                  <li
                    key={tech.name}
                    className="flex flex-col border border-[var(--line)] bg-[var(--bg-elevated)] px-4 py-4"
                  >
                    <span className="font-semibold">{tech.name}</span>
                    <span className="mt-1 text-sm text-[var(--muted)]">{tech.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {project.languages && project.languages.length > 0 && (
            <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Idiomas del sitio
              </h2>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Experiencia global para pacientes locales e internacionales.
              </p>
              <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {project.languages.map((lang) => (
                  <li
                    key={lang.code}
                    className="border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-3"
                  >
                    <p className="text-sm font-semibold">{lang.code}</p>
                    <p className="mt-0.5 truncate text-[11px] text-[var(--muted)]">
                      {lang.name}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="border-t border-[var(--line)] bg-[var(--bg-elevated)] py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Cómo lo construimos
              </h2>
              <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {project.process.map((step, index) => (
                  <li key={step.title}>
                    <p className="font-display text-3xl font-extrabold text-[var(--accent)]/40">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-display mt-2 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {step.copy}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {project.lead && (
            <section className="border-t border-[var(--line)] bg-[#0a0a0a] py-16 text-white md:py-20">
              <div className="mx-auto max-w-6xl px-5 md:px-8">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#5b8cff] uppercase">
                  Conoce al responsable
                </p>
                <h2 className="font-display mt-3 text-2xl font-bold sm:text-3xl">
                  {project.lead.name}
                </h2>
                <p className="mt-2 text-xs font-semibold tracking-[0.16em] text-white/55 uppercase">
                  {project.lead.role}
                </p>
                {project.lead.badges && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.lead.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-white/70">
                  {project.lead.copy.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="border-t border-[var(--line)] bg-[var(--bg-elevated)] py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Por qué un cliente elegiría esto
              </h2>
              <ul className="mt-8 space-y-4">
                {project.persuasion.map((item) => (
                  <li key={item} className="flex gap-3 text-[var(--fg)]/90">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: t.accent }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="mt-10 space-y-3 border-t border-[var(--line)] pt-8">
                {project.highlights.map((item) => (
                  <li key={item} className="text-sm text-[var(--muted)]">
                    · {item}
                  </li>
                ))}
              </ul>

              <div className="mt-12 flex flex-wrap gap-3">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-[var(--accent-ink)] transition hover:brightness-110"
                    style={{ boxShadow: `0 14px 36px ${t.glow}` }}
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
                  className="rounded-full border border-[var(--line)] px-6 py-3.5 text-sm font-semibold"
                >
                  Cotizar un proyecto similar
                </a>
                <Link
                  href="/proyectos"
                  className="rounded-full border border-[var(--line)] px-6 py-3.5 text-sm"
                >
                  Ver más casos
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
