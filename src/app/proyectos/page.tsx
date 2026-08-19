import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
            Filtra por sitio web o sistema operativo. Entra a cada caso para ver el
            reto, la solución, módulos, tecnologías y por qué un cliente elegiría
            algo similar.
          </p>

          <ProjectsIndexGrid />
        </div>
      </main>
      <Footer />
    </>
  );
}
