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
      <div className="atmosphere relative min-h-screen">
        <Header />
        <main className="relative z-10">
          <section className="relative overflow-hidden bg-[#050a16] text-white">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_20%,rgba(26,107,255,0.28),transparent_60%)]" />
            <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 md:pb-24 md:pt-36">
              <p className="font-display text-[clamp(2.4rem,8vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
                {site.name}
              </p>
              <p className="mt-2 text-sm font-semibold tracking-[0.22em] text-white/65 uppercase">
                Technologies · Portafolio
              </p>
              <h1 className="font-display mt-8 max-w-3xl text-balance text-[1.75rem] font-bold leading-[1.12] tracking-[-0.03em] sm:text-4xl md:text-5xl">
                Proyectos que operan en el mundo real
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-white/75 sm:text-base md:text-lg">
                Filtra por sitio web o sistema. Entra a cada caso para ver el reto,
                la solución y por qué un cliente elegiría algo similar.
              </p>
            </div>
          </section>

          <div className="relative overflow-hidden rounded-t-[2rem] bg-bg md:rounded-t-[2.5rem]">
            <div className="grid-tech pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-12 md:pt-14">
              <ProjectsIndexGrid />
            </div>
          </div>
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </>
  );
}
