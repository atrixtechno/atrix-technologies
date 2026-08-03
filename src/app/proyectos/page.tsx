import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectLogo } from "@/components/ProjectLogo";
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
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:pb-24 sm:pt-16 md:px-8 md:pt-20">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase sm:text-xs sm:tracking-[0.28em]">
            Portafolio
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-balance text-3xl font-extrabold tracking-tight sm:mt-4 sm:text-4xl md:text-6xl">
            Proyectos que operan en el mundo real
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base text-muted sm:mt-5 sm:text-lg">
            Entra a cada caso para ver el reto, la solución, módulos, tecnologías y
            por qué un cliente elegiría algo similar.
          </p>

          <ul className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <li key={project.slug} className="min-w-0">
                <Link
                  href={`/proyectos/${project.slug}`}
                  className="group block h-full overflow-hidden border border-line bg-bg-elevated/50 p-5 transition hover:border-accent/40 hover:bg-bg-elevated sm:p-6 md:p-8"
                  style={{
                    boxShadow: `inset 3px 0 0 ${project.theme.accent}`,
                    ["--accent" as string]: project.theme.accent,
                    ["--project-glow" as string]: project.theme.glow,
                  }}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {project.logo && (
                      <ProjectLogo src={project.logo} name={project.name} size="md" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold tracking-[0.16em] text-muted uppercase sm:text-[11px] sm:tracking-[0.2em]">
                        {project.sector}
                      </p>
                      <h2 className="font-display mt-1.5 text-xl font-bold transition group-hover:text-accent sm:mt-2 sm:text-2xl md:text-3xl">
                        {project.name}
                      </h2>
                    </div>
                  </div>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted sm:mt-4">
                    {project.summary}
                  </p>
                  <p className="mt-5 text-sm font-semibold text-accent sm:mt-6">
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
