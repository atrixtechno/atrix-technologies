import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageDecor } from "@/components/PageDecor";
import { Reveal } from "@/components/Reveal";
import { SoporteRemotoHero } from "@/components/SoporteRemotoHero";
import {
  soporteIdealAudiences,
  soporteProblemas,
  soporteRemotoChapters,
  soporteRemotoPage,
  soporteServiciosIncluidos,
} from "@/content/soporte-remoto";
import { site, whatsappUrl } from "@/content/site";

const pageTitle = "Soporte técnico remoto para empresas";
const pageDescription =
  "Respaldo de un departamento de TI remoto para empresas en Nuevo Laredo y Laredo, TX: mantenimiento, optimización, seguridad y atención prioritaria sin contratar personal de tiempo completo.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/soporte-remoto" },
  keywords: [
    "soporte técnico remoto empresas",
    "soporte IT remoto Nuevo Laredo",
    "mantenimiento computadoras empresas",
    "departamento TI externalizado",
    "soporte Windows macOS empresas",
    "ATRIX Technologies soporte remoto",
    "asistencia tecnológica empresas Laredo",
  ],
  openGraph: {
    title: `${pageTitle} · ${site.legalName}`,
    description: pageDescription,
    url: `${site.url}/soporte-remoto`,
    siteName: site.legalName,
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "https://atrixnld.com/brand/og-atrix-v2.png",
        width: 1200,
        height: 630,
        alt: `${site.legalName} — Soporte técnico remoto para empresas`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} · ${site.legalName}`,
    description: pageDescription,
    images: ["https://atrixnld.com/brand/og-atrix-v2.png"],
  },
};

function ChapterEyebrow({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
      <span className="tabular-nums text-signal">{number}</span>
      <span className="mx-2 text-line">·</span>
      {label}
    </p>
  );
}

export default function SoporteRemotoPage() {
  const wa = whatsappUrl(soporteRemotoPage.whatsappMessage);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${site.url}/soporte-remoto#webpage`,
        url: `${site.url}/soporte-remoto`,
        name: `${pageTitle} · ${site.legalName}`,
        description: pageDescription,
        inLanguage: "es-MX",
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/soporte-remoto#service` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${site.url}/brand/og-atrix-v2.png`,
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/soporte-remoto#service`,
        name: `Soporte técnico remoto · ${site.legalName}`,
        description: pageDescription,
        url: `${site.url}/soporte-remoto`,
        provider: { "@id": `${site.url}/#organization` },
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
        serviceType: [
          "Soporte técnico remoto",
          "Mantenimiento de computadoras",
          "Optimización de equipos",
          "Seguridad y respaldos",
          "Soporte IT empresarial",
        ],
        audience: {
          "@type": "BusinessAudience",
          audienceType: "Empresas y despachos profesionales",
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
          <SoporteRemotoHero whatsappHref={wa} />

          <nav
            aria-label="Secciones de la página"
            className="border-b border-line bg-bg-elevated/35"
          >
            <div className="mx-auto flex max-w-6xl justify-center gap-1 overflow-x-auto px-5 py-3.5 md:px-8 md:py-4">
              {soporteRemotoChapters.map((ch) => (
                <a
                  key={ch.id}
                  href={`#${ch.id}`}
                  className="shrink-0 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase transition hover:text-accent sm:text-xs sm:tracking-[0.16em]"
                >
                  <span className="tabular-nums text-signal/80">{ch.number}</span>
                  <span className="mx-1.5 text-line">·</span>
                  {ch.label}
                </a>
              ))}
            </div>
          </nav>

          {/* 01 · Enfoque */}
          <section
            id="enfoque"
            className="scroll-mt-24 border-b border-line py-20 md:py-28"
            aria-labelledby="enfoque-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:items-start">
                <Reveal>
                  <ChapterEyebrow number="01" label="Enfoque" />
                  <h2
                    id="enfoque-heading"
                    className="font-display mt-4 max-w-xl text-3xl font-bold tracking-tight md:text-5xl"
                  >
                    TI al servicio de tu operación
                  </h2>
                  <div className="animate-line mt-5 h-px w-24 bg-accent/50" />
                </Reveal>
                <div className="space-y-6">
                  {soporteRemotoPage.intro.map((paragraph, index) => (
                    <Reveal key={paragraph.slice(0, 24)} delay={index * 80}>
                      <p className="text-base leading-relaxed text-muted md:text-lg">
                        {paragraph}
                      </p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 02 · Problemas */}
          <section
            id="problemas"
            className="scroll-mt-24 border-b border-line bg-bg-elevated/40 py-20 md:py-28"
            aria-labelledby="problemas-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <Reveal>
                <ChapterEyebrow number="02" label="Problemas" />
                <h2
                  id="problemas-heading"
                  className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl"
                >
                  Problemas que se atienden
                </h2>
                <div className="animate-line mt-5 h-px w-24 bg-accent/50" />
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                  Incidencias que frenan al equipo — y que un técnico disponible
                  resuelve a distancia.
                </p>
              </Reveal>

              <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {soporteProblemas.map((item, index) => (
                  <Reveal key={item} delay={index * 55}>
                    <li className="relative h-full border-t border-line pt-6 transition hover:border-accent/45">
                      <span
                        className="font-display pointer-events-none absolute -top-1 right-0 text-5xl font-extrabold text-accent/[0.08] tabular-nums"
                        aria-hidden
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[10px] font-semibold tracking-[0.18em] text-signal uppercase tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-fg md:text-[15px]">
                        {item}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>

          {/* 03 · Servicios */}
          <section
            id="servicios"
            className="scroll-mt-24 border-b border-line py-20 md:py-28"
            aria-labelledby="servicios-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <Reveal>
                <ChapterEyebrow number="03" label="Servicios" />
                <h2
                  id="servicios-heading"
                  className="font-display mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl"
                >
                  Servicios incluidos
                </h2>
                <div className="animate-line mt-5 h-px w-24 bg-accent/50" />
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                  Cobertura remota continua para mantener equipos y sistemas
                  estables, seguros y listos para trabajar.
                </p>
              </Reveal>

              <ul className="mt-14 divide-y divide-line border-y border-line">
                {soporteServiciosIncluidos.map((item, index) => (
                  <Reveal key={item} delay={Math.min(index * 40, 200)}>
                    <li className="group flex items-start gap-4 py-5 md:gap-6 md:py-6">
                      <span className="font-display shrink-0 text-2xl font-extrabold text-accent/30 tabular-nums transition group-hover:text-accent/55 md:text-3xl">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="pt-1 text-sm leading-relaxed text-fg md:pt-1.5 md:text-base">
                        {item}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={80}>
                <div className="relative mt-14 overflow-hidden border border-line px-6 py-8 sm:px-8 sm:py-9">
                  <div className="pointer-events-none absolute inset-0" aria-hidden>
                    <div className="animate-orb absolute -left-8 top-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
                  </div>
                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
                        Sistemas compatibles
                      </p>
                      <p className="mt-2 max-w-md text-sm text-muted md:text-base">
                        {soporteRemotoPage.sistemas}
                      </p>
                    </div>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110"
                    >
                      Consultar por WhatsApp
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* 04 · Plan */}
          <section
            id="plan"
            className="scroll-mt-24 border-b border-line bg-bg-elevated/40 py-20 md:py-28"
            aria-labelledby="plan-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:items-start">
                <Reveal>
                  <ChapterEyebrow number="04" label="Plan" />
                  <h2
                    id="plan-heading"
                    className="font-display mt-4 max-w-xl text-3xl font-bold tracking-tight md:text-5xl"
                  >
                    Plan personalizado
                  </h2>
                  <div className="animate-line mt-5 h-px w-24 bg-accent/50" />
                  <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
                    {soporteRemotoPage.planPersonalizado}
                  </p>
                </Reveal>

                <Reveal delay={90}>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.2em] text-signal uppercase">
                      Ideal para
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                      {soporteRemotoPage.idealPara}
                    </p>
                    <ul className="mt-8 flex flex-wrap gap-2.5">
                      {soporteIdealAudiences.map((label) => (
                        <li
                          key={label}
                          className="border border-line px-3.5 py-2 text-xs font-semibold tracking-wide text-fg"
                        >
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* 05 · Cotizar */}
          <section
            id="cotizar"
            className="scroll-mt-24 py-20 md:py-28"
            aria-labelledby="cotizar-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <Reveal>
                <div className="relative overflow-hidden border border-line px-6 py-14 sm:px-10 sm:py-16 md:px-16 md:py-20">
                  <div className="pointer-events-none absolute inset-0" aria-hidden>
                    <div className="grid-tech absolute inset-0 opacity-30" />
                    <div className="animate-orb absolute -left-12 top-0 h-48 w-48 rounded-full bg-accent/14 blur-3xl" />
                    <div className="animate-orb-delayed absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-signal/12 blur-3xl" />
                  </div>
                  <div className="relative max-w-2xl">
                    <ChapterEyebrow number="05" label="Cotizar" />
                    <h2
                      id="cotizar-heading"
                      className="font-display mt-4 text-3xl font-bold tracking-tight md:text-5xl"
                    >
                      {soporteRemotoPage.closing}
                    </h2>
                    <p className="mt-5 text-pretty text-base leading-relaxed text-muted md:text-lg">
                      Cuéntanos cuántos equipos tienes y con qué frecuencia
                      necesitas soporte. Respondemos por WhatsApp al{" "}
                      {site.phoneDisplay}.
                    </p>
                    <div className="mt-9 flex flex-wrap gap-3">
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110"
                      >
                        WhatsApp · {site.phoneDisplay}
                      </a>
                      <Link
                        href="/#contacto"
                        className="inline-flex rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-fg transition hover:border-accent/40 hover:bg-bg-elevated"
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
