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
        width: 1536,
        height: 1024,
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

          {/* Uniform — HD showcase, image first */}
          <section
            id="uniforme"
            className="relative scroll-mt-24 border-b border-line bg-[#06080c]"
            aria-labelledby="uniforme-heading"
          >
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16 md:px-8 md:py-20">
              <Reveal>
                <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-xl">
                    <p className="text-[10px] font-semibold tracking-[0.22em] text-accent uppercase sm:text-xs">
                      Identidad del equipo
                    </p>
                    <h2
                      id="uniforme-heading"
                      className="font-display mt-3 text-[1.65rem] font-bold tracking-tight text-white sm:text-3xl md:text-4xl"
                    >
                      Así se ve ATRIX
                    </h2>
                    <p className="mt-3 text-pretty text-[15px] leading-relaxed text-white/65 sm:text-base">
                      {unetePage.uniformCaption}
                    </p>
                  </div>
                  <p className="text-[11px] tracking-[0.16em] text-white/40 uppercase">
                    Alta definición · Marca oficial
                  </p>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <figure className="relative overflow-hidden border border-white/10 bg-black shadow-[0_40px_100px_-40px_rgba(26,107,255,0.55)]">
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                  <div className="relative aspect-[3/2] w-full sm:aspect-[16/10]">
                    <Image
                      src="/brand/atrix-uniforme.png"
                      alt="Uniforme ATRIX: polo negro, gorra y hoodie con logo plateado y acentos azul eléctrico"
                      fill
                      quality={100}
                      priority
                      className="object-contain object-center p-2 sm:p-4 md:p-6"
                      sizes="(max-width: 1152px) 100vw, 1152px"
                    />
                  </div>
                  <figcaption className="border-t border-white/10 bg-black/60 px-4 py-3 text-center text-xs text-white/55 sm:px-6 sm:text-sm">
                    Polo · Gorra · Hoodie — branding ATRIX Technologies · atrixnld.com
                  </figcaption>
                </figure>
              </Reveal>
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

              <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
                {uneteAreas.map((area, index) => (
                  <Reveal key={area.label} delay={index * 55}>
                    <li className="group h-full border border-line bg-bg-elevated/70 px-5 py-6 transition hover:border-accent/35 hover:bg-bg-elevated">
                      <p className="font-display text-xl font-extrabold text-accent/30 tabular-nums transition group-hover:text-accent/55">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-display mt-3 text-base font-semibold sm:text-[17px]">
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
            className="scroll-mt-24 border-b border-line bg-bg-elevated/35 py-16 md:py-24"
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
                  Proceso claro y directo
                </h2>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
                  WhatsApp para enviar tu CV al instante, o el formulario si
                  prefieres escribir desde el sitio.
                </p>
              </Reveal>

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
                  <div className="relative grid gap-8 px-5 py-10 sm:gap-10 sm:px-10 sm:py-16 md:grid-cols-[1.2fr_auto] md:items-center md:gap-12 md:px-14 md:py-20 lg:px-16">
                    <div className="max-w-2xl min-w-0">
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
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[14rem]">
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold"
                      >
                        Enviar CV por WhatsApp
                      </a>
                      <Link
                        href="/#contacto"
                        className="inline-flex w-full items-center justify-center rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-fg transition hover:border-accent/40 hover:bg-bg-elevated"
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
