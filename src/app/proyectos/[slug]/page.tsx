import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getProject, projects } from "@/content/projects";
import { whatsappUrl } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Header />
      <main className="atmosphere min-h-screen pt-28">
        <article className="mx-auto max-w-3xl px-6 pb-24 md:px-8">
          <Link
            href="/#proyectos"
            className="text-sm text-muted transition-colors hover:text-fg"
          >
            ← Proyectos
          </Link>
          <p className="mt-10 text-xs font-semibold tracking-[0.2em] text-accent-deep uppercase">
            {project.sector}
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
            {project.name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-fg/85">{project.summary}</p>
          <p className="mt-4 text-muted">{project.result}</p>

          <ul className="mt-12 space-y-4 border-t border-line pt-10">
            {project.highlights.map((item) => (
              <li key={item} className="flex gap-3 text-fg/90">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-muted">{project.stackNote}</p>

          <div className="mt-12 flex flex-wrap gap-3">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-fg/15 bg-white px-5 py-3 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent-deep"
              >
                Ver sitio en vivo
              </a>
            )}
            <a
              href={whatsappUrl(
                `Hola ATRIX Technologies, vi el proyecto ${project.name} y me interesa algo similar.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(37,211,102,0.28)] transition hover:bg-[#1ebe57]"
            >
              Quiero algo así
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
