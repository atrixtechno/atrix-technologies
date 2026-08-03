import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { BusinessGuide, DeveloperGuide } from "@/components/Guides";
import { ProjectsTeaser } from "@/components/ProjectsTeaser";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { site } from "@/content/site";
import { getDailyTip } from "@/content/tips";

export const metadata: Metadata = {
  title: `${site.legalName} · Software a la medida en ${site.city}`,
  description: site.description,
  alternates: { canonical: "/" },
  keywords: [
    "ATRIX Technologies",
    "desarrollo web Nuevo Laredo",
    "software a la medida",
    "páginas web frontera",
    "paneles administrativos",
    "SEO local",
  ],
  openGraph: {
    title: `${site.legalName} · ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
};

export default function HomePage() {
  const tip = getDailyTip();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.legalName,
        url: site.url,
        logo: `${site.url}/brand/atrix-logo.png`,
        slogan: site.motto,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Nuevo Laredo",
          addressRegion: "Tamaulipas",
          addressCountry: "MX",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: "+52-867-179-3155",
          availableLanguage: ["es", "en"],
        },
        sameAs: ["https://dentalmate.mx", "https://www.tecoseliteacademy.com"],
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
        "@type": "ProfessionalService",
        name: site.legalName,
        image: `${site.url}/brand/atrix-logo.png`,
        url: site.url,
        areaServed: ["Nuevo Laredo", "Laredo", "Tamaulipas", "Texas border"],
        serviceType: [
          "Diseño web",
          "Desarrollo de software",
          "Paneles administrativos",
          "SEO",
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero tip={tip} />
        <Benefits />
        <BusinessGuide />
        <DeveloperGuide />
        <ProjectsTeaser />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
