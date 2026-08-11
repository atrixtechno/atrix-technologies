import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Coverage } from "@/components/Coverage";
import { Benefits } from "@/components/Benefits";
import { AudienceGuides } from "@/components/Guides";
import { ProjectsTeaser } from "@/components/ProjectsTeaser";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { PageDecor } from "@/components/PageDecor";
import { site } from "@/content/site";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: `${site.legalName} · Soporte IT, CCTV y software en Nuevo Laredo`,
  description: site.description,
  alternates: { canonical: "/" },
  keywords: [
    "ATRIX Technologies",
    "soporte técnico Nuevo Laredo",
    "CCTV Laredo",
    "CCTV Nuevo Laredo",
    "redes e infraestructura",
    "desarrollo de software frontera",
    "soporte IT empresarial",
    "cámaras de seguridad Nuevo Laredo",
    "tecnología Laredo TX",
  ],
  openGraph: {
    title: `${site.legalName} · ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.legalName,
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "https://atrixnld.com/brand/og-atrix-v2.png",
        width: 1200,
        height: 630,
        alt: `${site.legalName} — ${site.motto}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.legalName} · ${site.tagline}`,
    description: site.description,
    images: ["https://atrixnld.com/brand/og-atrix-v2.png"],
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.legalName,
        url: site.url,
        logo: `${site.url}/brand/atrix-logo.png`,
        image: `${site.url}/brand/og-atrix-v2.png`,
        email: site.email,
        slogan: site.motto,
        sameAs: [site.facebook],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Nuevo Laredo",
          addressRegion: "Tamaulipas",
          addressCountry: "MX",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: "+52-867-179-3155",
          email: site.email,
          availableLanguage: ["Spanish", "English"],
          areaServed: ["MX", "US"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.legalName,
        description: site.description,
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: "es-MX",
      },
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": `${site.url}/#localbusiness`,
        name: site.legalName,
        image: [
          `${site.url}/brand/atrix-logo.png`,
          `${site.url}/brand/og-atrix-v2.png`,
        ],
        url: site.url,
        telephone: "+52-867-179-3155",
        email: site.email,
        priceRange: "$$",
        description: site.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Nuevo Laredo",
          addressRegion: "Tamaulipas",
          addressCountry: "MX",
        },
        areaServed: [
          {
            "@type": "City",
            name: "Nuevo Laredo",
            containedInPlace: {
              "@type": "State",
              name: "Tamaulipas",
            },
          },
          {
            "@type": "City",
            name: "Laredo",
            containedInPlace: {
              "@type": "State",
              name: "Texas",
            },
          },
        ],
        sameAs: [site.facebook],
        parentOrganization: { "@id": `${site.url}/#organization` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios ATRIX",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              description: s.copy,
              areaServed: site.coverage,
              provider: { "@id": `${site.url}/#localbusiness` },
            },
          })),
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="atmosphere relative">
        <PageDecor />
        <Header solid />
        <main className="relative z-10">
          <Hero />
          <Services />
          <Coverage />
          <Benefits />
          <AudienceGuides />
          <ProjectsTeaser />
          <Contact />
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </>
  );
}
