import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ProjectsIndexGrid } from "@/components/ProjectsIndexGrid";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Portafolio de ATRIX Technologies: sitios web y sistemas operativos como MOE'S Market, DentalMate, Grupo GI, DojangSpace y Tecos Elite en Nuevo Laredo.",
  alternates: { canonical: "/proyectos" },
  openGraph: {
    title: `Proyectos · ${site.legalName}`,
    description:
      "Casos reales de sitios web, puntos de venta, paneles y plataformas construidas para negocios de la frontera.",
    url: `${site.url}/proyectos`,
    type: "website",
    images: [
      {
        url: "https://atrixnld.com/brand/og-atrix-v2.png",
        width: 1200,
        height: 630,
        alt: `${site.legalName} — Proyectos`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Proyectos · ${site.legalName}`,
    description:
      "Casos reales de sitios web, puntos de venta, paneles y plataformas construidas para negocios de la frontera.",
    images: ["https://atrixnld.com/brand/og-atrix-v2.png"],
  },
  keywords: [
    "portafolio ATRIX",
    "desarrollo web Nuevo Laredo",
    "punto de venta a medida",
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
      <div className="relative min-h-screen bg-bg">
        <Header />
        <main className="relative">
          <PageHero
            eyebrow={`Portafolio · ${projects.length} casos`}
            title={
              <>
                Proyectos que operan en el{" "}
                <span className="text-accent">
                  mundo real
                </span>
              </>
            }
            lead="Filtra por sitio web o sistema. Entra a cada caso para ver el reto, la solución y por qué un cliente elegiría algo similar."
            meta="Web · iOS · Android · Paneles en producción"
          />

          <div className="relative overflow-hidden bg-bg">
            <div className="grid-tech pointer-events-none absolute inset-0 opacity-70" />
            <div className="relative mx-auto max-w-[1240px] px-5 pt-14 pb-24 sm:px-8 md:pt-16 md:pb-32">
              <ProjectsIndexGrid />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
