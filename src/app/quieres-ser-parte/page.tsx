import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageDecor } from "@/components/PageDecor";
import { QuieresSerParteHero } from "@/components/QuieresSerParteHero";
import { Reveal } from "@/components/Reveal";
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
        url: `${site.url}/brand/atrix-uniforme.png`,
        width: 1024,
        height: 576,
        alt: `${site.legalName} — Uniforme del equipo`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} · ${site.legalName}`,
    description: pageDescription,
    images: [`${site.url}/brand/atrix-uniforme.png`],
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
          url: `${site.url}/brand/atrix-uniforme.png`,
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

          {/* Uniform — dominant visual */}
          <section
            id="uniforme"
            className="relative scroll-mt-24 border-b border-line"
            aria-labelledby="uniforme-heading"
          >
            <div className="relative min-h-[min(70svh,40rem)] w-full overflow-hidden md:min-h-[min(78svh,48rem)]">
              <Image
                src="/brand/atrix-uniforme.png"
                alt="Uniforme ATRIX: polo, gorra y hoodie con logo de la marca"
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/25" />
              <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/40" />
              <div className="grid-tech pointer-events-none absolute inset-0 opacity-25" />

              <div className="absolute inset-x-0 bottom-0">
                <div className="mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-5 sm:pb-14 md:px-8 md:pb-16">
                  <Reveal>
                    <p className="text-[10px] font-semibold tracking-[0.22em] text-accent uppercase sm:text-xs">
                      Identidad del equipo
                    </p>
                    <h2
                      id="uniforme-heading"
                      className="font-display mt-3 max-w-xl text-[1.65rem] font-bold tracking-tight sm:text-3xl md:text-4xl"
                    >
                      Así se ve ATRIX en el campo
                    </h2>
                    <p className="mt-3 max-w-lg text-pretty text-[15px] leading-relaxed text-muted sm:mt-4 sm:text-base">
                      {unetePage.uniformCaption}
                    </p>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>

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

              <ul className="mt-10 grid grid-cols-1 gap-px bg-line sm:mt-12 sm:grid-cols-2 lg:grid-cols-5">
                {uneteAreas.map((area, index) => (
                  <Reveal key={area.label} delay={index * 60}>
                    <li className="h-full bg-bg-elevated/80 px-5 py-6 transition hover:bg-bg-elevated sm:px-5 sm:py-7">
                      <p className="font-display text-2xl font-extrabold text-accent/25 tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-display mt-2 text-base font-semibold sm:text-lg">
                        {area.label}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {area.copy}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>

          {/* Cómo unirte */}
          <section
            id="como-unirte"
            className="scroll-mt-24 border-b border-line bg-bg-elevated/40 py-16 md:py-24"
            aria-labelledby="como-unirte-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
              <Reveal>
                <p className="text-[10px] font-semibold tracking-[0.22em] text-accent uppercase">
                  Cómo unirte
                </p>
                <h2
                  id="como-unirte-heading"
                  className="font-display mt-3 max-w-2xl text-[1.65rem] font-bold tracking-tight sm:text-3xl md:text-4xl"
                >
                  Dos caminos claros
                </h2>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
                  Elige WhatsApp para enviar tu CV al instante, o el formulario
                  si prefieres escribir desde el sitio.
                </p>
              </Reveal>

              <ol className="mt-12 space-y-0 sm:mt-14">
                {uneteSteps.map((step, index) => (
                  <Reveal key={step.number} delay={index * 80}>
                    <li className="grid grid-cols-1 gap-4 border-t border-line py-8 first:border-t-0 first:pt-0 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8 sm:py-10 md:gap-12">
                      <span className="font-display text-3xl font-extrabold text-accent tabular-nums sm:text-4xl md:text-5xl">
                        {step.number}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-semibold sm:text-xl md:text-2xl">
                          {step.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted md:text-[15px]">
                          {step.copy}
                        </p>
                      </div>
                      {step.cta === "whatsapp" ? (
                        <a
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold sm:w-auto"
                        >
                          WhatsApp · CV
                        </a>
                      ) : step.cta === "form" ? (
                        <Link
                          href="/#contacto"
                          className="inline-flex w-full items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-fg transition hover:border-accent/40 hover:bg-bg sm:w-auto"
                        >
                          Ir al formulario
                        </Link>
                      ) : (
                        <span className="hidden sm:block sm:w-[8.5rem]" aria-hidden />
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
                <div className="relative overflow-hidden border border-line">
                  <div className="pointer-events-none absolute inset-0" aria-hidden>
                    <div className="grid-tech absolute inset-0 opacity-35" />
                    <div className="animate-orb absolute -left-12 top-0 h-48 w-48 rounded-full bg-accent/14 blur-3xl" />
                    <div className="animate-orb-delayed absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-signal/12 blur-3xl" />
                  </div>
                  <div className="relative grid gap-8 px-5 py-10 sm:gap-10 sm:px-10 sm:py-16 md:grid-cols-[1fr_auto] md:items-end md:gap-12 md:px-16 md:py-20">
                    <div className="max-w-2xl min-w-0">
                      <p className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
                        Listo para el siguiente paso
                      </p>
                      <h2
                        id="cta-unete-heading"
                        className="font-display mt-4 text-[1.65rem] font-bold tracking-tight sm:text-3xl md:text-4xl"
                      >
                        Sé parte del equipo ATRIX
                      </h2>
                      <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted sm:text-base md:text-lg">
                        Envíanos tu CV por WhatsApp al {site.phoneDisplay} o
                        completa el formulario de contacto. Revisamos cada
                        perfil con atención.
                      </p>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:flex-col">
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
