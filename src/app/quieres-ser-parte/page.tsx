import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageDecor } from "@/components/PageDecor";
import { QuieresSerParteHero } from "@/components/QuieresSerParteHero";
import { QuieresSerParteIdentidad } from "@/components/QuieresSerParteIdentidad";
import { Reveal } from "@/components/Reveal";
import { SectionMedia } from "@/components/SectionMedia";
import { uneteAreas, unetePage, uneteSteps } from "@/content/unete";
import { site, whatsappUrl } from "@/content/site";

const pageTitle = "¿Quieres ser parte de ATRIX?";
const pageDescription =
  "Únete al equipo de ATRIX Technologies en Nuevo Laredo y Laredo, TX. Soporte técnico, CCTV, redes, software y conferencias. Envía tu CV por WhatsApp o completa el formulario.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/quieres-ser-parte" },
  keywords: [
    "empleo ATRIX Technologies",
    "trabajar en ATRIX Nuevo Laredo",
    "vacantes tech Laredo TX",
    "CV soporte técnico CCTV redes",
    "unirse equipo ATRIX",
    "carreras tecnología frontera",
  ],
  openGraph: {
    title: `${pageTitle} · ${site.legalName}`,
    description: pageDescription,
    url: `${site.url}/quieres-ser-parte`,
    siteName: site.legalName,
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: `${site.url}/brand/atrix-identidad.png`,
        width: 1536,
        height: 1024,
        alt: `${site.legalName} — Identidad y profesionalismo`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} · ${site.legalName}`,
    description: pageDescription,
    images: [`${site.url}/brand/atrix-identidad.png`],
  },
};

export default function QuieresSerPartePage() {
  const wa = whatsappUrl(unetePage.whatsappMessage);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${site.url}/quieres-ser-parte#webpage`,
        url: `${site.url}/quieres-ser-parte`,
        name: `${pageTitle} · ${site.legalName}`,
        description: pageDescription,
        inLanguage: "es-MX",
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/#organization` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${site.url}/brand/atrix-identidad.png`,
          width: 1536,
          height: 1024,
        },
      },
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.legalName,
        url: site.url,
        logo: `${site.url}/brand/atrix-logo.png`,
        email: site.email,
        sameAs: [site.facebook],
        areaServed: site.coverage,
      },
      {
        "@type": "JobPosting",
        "@id": `${site.url}/quieres-ser-parte#hiring`,
        title: "Únete al equipo ATRIX Technologies",
        description: pageDescription,
        datePosted: "2026-01-01",
        employmentType: "OTHER",
        hiringOrganization: {
          "@type": "Organization",
          "@id": `${site.url}/#organization`,
          name: site.legalName,
          sameAs: site.url,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Nuevo Laredo",
            addressRegion: "Tamaulipas",
            addressCountry: "MX",
          },
        },
        applicantLocationRequirements: {
          "@type": "Country",
          name: "MX",
        },
        url: `${site.url}/quieres-ser-parte`,
        directApply: true,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative">
        <PageDecor />
        <Header solid />
        <main className="atmosphere relative z-10 min-h-screen">
          <QuieresSerParteHero whatsappHref={wa} />

          <QuieresSerParteIdentidad />

          {/* Areas */}
          <section
            className="border-b border-line py-14 md:py-20"
            aria-labelledby="areas-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
              <Reveal>
                <p className="text-[10px] font-semibold tracking-[0.22em] text-signal uppercase">
                  En qué trabajamos
                </p>
                <h2
                  id="areas-heading"
                  className="font-display mt-3 max-w-2xl text-[1.65rem] font-bold tracking-tight sm:text-3xl md:text-4xl"
                >
                  Un equipo tech de punta a punta
                </h2>
              </Reveal>

              <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
                {uneteAreas.map((area, index) => (
                  <Reveal key={area.label} delay={index * 55}>
                    <li className="group h-full overflow-hidden border border-line bg-bg-elevated/70 transition hover:border-accent/35 hover:bg-bg-elevated">
                      <div className="relative aspect-[16/11] w-full overflow-hidden border-b border-line bg-bg">
                        <Image
                          src={area.image}
                          alt={area.label}
                          fill
                          quality={85}
                          className="object-cover transition duration-500 group-hover:scale-[1.04]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-elevated via-transparent to-transparent opacity-80" />
                      </div>
                      <div className="px-5 py-5">
                        <p className="font-display text-xl font-extrabold text-accent/30 tabular-nums transition group-hover:text-accent/55">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="font-display mt-2 text-base font-semibold sm:text-[17px]">
                          {area.label}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {area.copy}
                        </p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>

          {/* Cómo unirte */}
          <section
            id="como-unirte"
            className="scroll-mt-24 border-b border-line bg-bg-elevated/35 py-16 md:py-24"
            aria-labelledby="como-unirte-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
              <div className="grid items-end gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
                <Reveal>
                  <p className="text-[10px] font-semibold tracking-[0.22em] text-accent uppercase">
                    Cómo unirte
                  </p>
                  <h2
                    id="como-unirte-heading"
                    className="font-display mt-3 max-w-2xl text-[1.65rem] font-bold tracking-tight sm:text-3xl md:text-4xl"
                  >
                    Proceso claro y directo
                  </h2>
                  <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
                    WhatsApp para enviar tu CV al instante, o el formulario si
                    prefieres escribir desde el sitio.
                  </p>
                </Reveal>
                <Reveal delay={80}>
                  <SectionMedia
                    src="/images/unete/proceso-cv.jpg"
                    alt="Proceso profesional para unirte al equipo ATRIX"
                    aspect="aspect-[16/10]"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </Reveal>
              </div>

              <ol className="mt-12 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
                {uneteSteps.map((step, index) => (
                  <Reveal key={step.number} delay={index * 70}>
                    <li className="flex h-full flex-col border border-line bg-bg p-6 sm:p-7">
                      <span className="font-display text-3xl font-extrabold text-accent tabular-nums">
                        {step.number}
                      </span>
                      <h3 className="font-display mt-4 text-lg font-semibold sm:text-xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted md:text-[15px]">
                        {step.copy}
                      </p>
                      {step.cta === "whatsapp" ? (
                        <a
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
                        >
                          WhatsApp · CV
                        </a>
                      ) : step.cta === "form" ? (
                        <Link
                          href="/#contacto"
                          className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-fg transition hover:border-accent/40 hover:bg-bg-elevated"
                        >
                          Ir al formulario
                        </Link>
                      ) : (
                        <span className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-dashed border-line px-5 py-3 text-sm text-muted">
                          Te contactamos
                        </span>
                      )}
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </section>

          {/* Final CTA */}
          <section
            className="py-16 md:py-24"
            aria-labelledby="cta-unete-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
              <Reveal>
                <div className="relative overflow-hidden border border-line bg-gradient-to-br from-bg-elevated via-bg to-bg">
                  <div className="pointer-events-none absolute inset-0" aria-hidden>
                    <div className="grid-tech absolute inset-0 opacity-30" />
                    <div className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
                    <div className="absolute -right-12 bottom-0 h-56 w-56 rounded-full bg-signal/12 blur-3xl" />
                  </div>
                  <div className="relative grid gap-0 md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
                    <div className="px-5 py-10 sm:px-10 sm:py-16 md:px-12 md:py-20 lg:px-16">
                      <p className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
                        Siguiente paso
                      </p>
                      <h2
                        id="cta-unete-heading"
                        className="font-display mt-4 text-[1.65rem] font-bold tracking-tight sm:text-3xl md:text-4xl"
                      >
                        Sé parte del equipo ATRIX
                      </h2>
                      <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted sm:text-base md:text-lg">
                        Envíanos tu CV por WhatsApp al {site.phoneDisplay} o
                        completa el formulario. Revisamos cada perfil con
                        atención.
                      </p>
                      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <a
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold sm:w-auto"
                        >
                          Enviar CV por WhatsApp
                        </a>
                        <Link
                          href="/#contacto"
                          className="inline-flex w-full items-center justify-center rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-fg transition hover:border-accent/40 hover:bg-bg-elevated sm:w-auto"
                        >
                          Formulario de contacto
                        </Link>
                      </div>
                    </div>
                    <div className="relative min-h-[18rem] border-t border-line md:min-h-[28rem] md:border-t-0 md:border-l">
                      <SectionMedia
                        src="/images/unete/cta-equipo.jpg"
                        alt="Incorporación profesional al equipo ATRIX Technologies"
                        aspect="absolute inset-0 h-full w-full"
                        className="border-0"
                        sizes="(max-width: 768px) 100vw, 45vw"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </>
  );
}
