import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Portafolio de ATRIX Technologies: DentalMate, Grupo GI, DojangSpace, Tecos Elite y más plataformas a la medida en Nuevo Laredo.",
  alternates: { canonical: "/proyectos" },
  openGraph: {
    title: `Proyectos · ${site.legalName}`,
    description:
      "Casos reales de sitios, paneles y apps construidos para negocios de la frontera.",
    url: `${site.url}/proyectos`,
  },
  keywords: [
    "portafolio ATRIX",
    "desarrollo web Nuevo Laredo",
    "software a la medida",
    "casos de éxito",
  ],
};

export default function ProjectsIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Proyectos · ${site.legalName}`,
    description:
      "Portafolio de plataformas digitales diseñadas y desarrolladas por ATRIX Technologies.",
    url: `${site.url}/proyectos`,
    isPartOf: { "@type": "WebSite", name: site.legalName, url: site.url },
    hasPart: projects.map((p) => ({
      "@type": "CreativeWork",
      name: p.name,
      url: `${site.url}/proyectos/${p.slug}`,
      description: p.summary,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header solid />
      <main className="atmosphere min-h-screen">
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 md:px-8 md:pt-20">
          <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
            Portafolio
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
            Proyectos que operan en el mundo real
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Entra a cada caso para ver el reto, la solución, módulos, tecnologías y
            por qué un cliente elegiría algo similar.
          </p>

          <ul className="mt-14 grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/proyectos/${project.slug}`}
                  className="group block h-full border border-line bg-bg-elevated/50 p-6 transition hover:border-accent/40 hover:bg-bg-elevated md:p-8"
                  style={{
                    boxShadow: `inset 3px 0 0 ${project.theme.accent}`,
                  }}
                >
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">
                    {project.sector}
                  </p>
                  <h2 className="font-display mt-3 text-2xl font-bold transition group-hover:text-accent md:text-3xl">
                    {project.name}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {project.summary}
                  </p>
                  <p className="mt-6 text-sm font-semibold text-accent">
                    Ver caso completo →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
