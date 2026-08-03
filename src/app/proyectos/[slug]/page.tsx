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
      images: [{ url: "/brand/atrix-logo.png", width: 1024, height: 1024 }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.seoTitle,
      description: project.seoDescription,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const t = project.theme;
  const isLight = Boolean(t.light);

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
        <Header solid light={isLight} />
        <main>
          <section className="relative overflow-hidden border-b border-[var(--line)]">
            <div
              className="pointer-events-none absolute inset-0 opacity-90"
              style={{
                background: `radial-gradient(ellipse 70% 55% at 80% 0%, ${t.glow}, transparent 55%)`,
              }}
            />
            <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-14 md:px-8 md:pb-20 md:pt-16">
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
              <div className="mt-10 flex flex-wrap gap-3">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-[var(--line)] px-5 py-3 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    Ver sitio en vivo
                  </a>
                )}
                {project.designerUrl && (
                  <a
                    href={project.designerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-[var(--line)] px-5 py-3 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    Página del diseñador
                  </a>
                )}
                <a
                  href={whatsappUrl(
                    `Hola ATRIX Technologies, vi el proyecto ${project.name} y me interesa algo similar.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-ink)] transition hover:brightness-110"
                >
                  Quiero algo así
                </a>
              </div>
            </div>
          </section>

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

          <section className="border-y border-[var(--line)] bg-[var(--bg-elevated)] py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <h2 className="font-display text-2xl font-bold md:text-3xl">Impacto</h2>
              <ul className="mt-8 grid gap-4 md:grid-cols-3">
                {project.impact.map((item) => (
                  <li
                    key={item}
                    className="border border-[var(--line)] p-5 text-sm leading-relaxed"
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
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
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

          <section className="border-y border-[var(--line)] py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Tecnologías
              </h2>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Stack elegido para rendimiento, mantenimiento y escala.
              </p>
              <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

          <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
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
          </section>

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
                <a
                  href={whatsappUrl(
                    `Hola ATRIX, quiero un proyecto similar a ${project.name}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-[var(--accent-ink)]"
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
        <Footer light={isLight} />
      </div>
    </>
  );
}
