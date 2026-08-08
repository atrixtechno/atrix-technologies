import type { Metadata } from "next";
import Link from "next/link";
import { ConferenciasHero } from "@/components/ConferenciasHero";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageDecor } from "@/components/PageDecor";
import { Reveal } from "@/components/Reveal";
import {
  conferenceAudiences,
  conferenceBenefits,
  conferenceChapters,
  conferenceFormats,
  conferenceServiceLinks,
  conferenceSpeaker,
  conferenceTalks,
  conferenciasPage,
} from "@/content/conferencias";
import { site, whatsappUrl } from "@/content/site";

const pageTitle = "Conferencias y pláticas de IA y tecnología";
const pageDescription =
  "Conferencias y pláticas de inteligencia artificial, ciberseguridad y transformación digital para empresas, escuelas y negocios en Nuevo Laredo y Laredo, TX. Impartidas por ATRIX Technologies e Ing. Néstor J. Reséndiz, MBA.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/conferencias" },
  keywords: [
    "conferencias inteligencia artificial Nuevo Laredo",
    "pláticas IA Laredo TX",
    "charlas IA empresas escuelas negocios",
    "capacitaciones tecnológicas empresas frontera",
    "conferencias ciberseguridad Nuevo Laredo",
    "talleres transformación digital PyMEs",
    "IA en educación Nuevo Laredo",
    "ATRIX Technologies conferencias",
    "Néstor Reséndiz conferencista",
  ],
  openGraph: {
    title: `${pageTitle} · ${site.legalName}`,
    description: pageDescription,
    url: `${site.url}/conferencias`,
    siteName: site.legalName,
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "https://atrixnld.com/brand/og-atrix-v2.png",
        width: 1200,
        height: 630,
        alt: `${site.legalName} — Conferencias y pláticas de IA y tecnología`,
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

function ChapterMark({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="font-display text-4xl font-extrabold leading-none text-accent/20 tabular-nums sm:text-5xl md:text-6xl">
        {number}
      </span>
      <div>
        <p className="text-[10px] font-semibold tracking-[0.28em] text-signal uppercase">
          Capítulo
        </p>
        <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function ConferenciasPage() {
  const speaker = conferenceSpeaker;
  const wa = whatsappUrl(conferenciasPage.whatsappMessage);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${site.url}/conferencias#webpage`,
        url: `${site.url}/conferencias`,
        name: `${pageTitle} · ${site.legalName}`,
        description: pageDescription,
        inLanguage: "es-MX",
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/conferencias#service` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${site.url}/brand/og-atrix-v2.png`,
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/conferencias#service`,
        name: `Conferencias y capacitaciones · ${site.legalName}`,
        description: pageDescription,
        url: `${site.url}/conferencias`,
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
          "Conferencias de inteligencia artificial",
          "Pláticas tecnológicas",
          "Capacitación tecnológica",
          "Charlas de ciberseguridad",
          "Talleres de transformación digital",
        ],
        audience: conferenceAudiences.map((a) => ({
          "@type": "Audience",
          audienceType: a.label,
        })),
      },
      {
        "@type": "EventSeries",
        "@id": `${site.url}/conferencias#events`,
        name: "Serie de conferencias ATRIX · IA y tecnología",
        description:
          "Serie de pláticas y talleres sobre inteligencia artificial, ciberseguridad y transformación digital para empresas, escuelas y negocios.",
        url: `${site.url}/conferencias`,
        organizer: { "@id": `${site.url}/#organization` },
        performer: { "@id": `${site.url}/conferencias#speaker` },
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        location: {
          "@type": "Place",
          name: site.coverage,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Nuevo Laredo",
            addressRegion: "Tamaulipas",
            addressCountry: "MX",
          },
        },
        subEvent: conferenceTalks.map((talk) => ({
          "@type": "EducationEvent",
          name: talk.title,
          description: talk.focus,
          eventAttendanceMode:
            "https://schema.org/MixedEventAttendanceMode",
          organizer: { "@id": `${site.url}/#organization` },
          performer: { "@id": `${site.url}/conferencias#speaker` },
          about: talk.focus,
          audience: {
            "@type": "Audience",
            audienceType: talk.audience,
          },
        })),
      },
      {
        "@type": "Person",
        "@id": `${site.url}/conferencias#speaker`,
        name: speaker.name,
        jobTitle: speaker.role,
        description: speaker.copy.join(" "),
        worksFor: { "@id": `${site.url}/#organization` },
        url: `${site.url}/conferencias`,
        knowsAbout: [
          "Inteligencia artificial aplicada",
          "Desarrollo de software",
          "Soporte IT empresarial",
          "Ciberseguridad básica",
          "Transformación digital",
        ],
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
          <ConferenciasHero whatsappHref={wa} />

          {/* Editorial chapter index */}
          <nav
            aria-label="Índice de capítulos"
            className="border-b border-line bg-bg-elevated/50"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-5 md:flex-row md:items-center md:gap-8 md:px-8 md:py-6">
              <p className="shrink-0 text-[10px] font-semibold tracking-[0.28em] text-muted uppercase">
                Índice
              </p>
              <div className="flex gap-1 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:pb-0 [&::-webkit-scrollbar]:hidden">
                {conferenceChapters.map((ch) => (
                  <a
                    key={ch.id}
                    href={`#${ch.id}`}
                    className="group flex shrink-0 items-baseline gap-2 border-b-2 border-transparent px-2.5 py-2 transition hover:border-accent/50 sm:px-3"
                  >
                    <span className="font-display text-base font-extrabold text-accent/35 tabular-nums transition group-hover:text-accent/70 sm:text-lg">
                      {ch.number}
                    </span>
                    <span className="whitespace-nowrap text-[11px] font-semibold tracking-[0.14em] text-muted uppercase transition group-hover:text-fg sm:text-xs">
                      {ch.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* 01 · Para quién — magazine columns */}
          <section
            id="para-quien"
            className="scroll-mt-24 border-b border-line py-16 md:py-28"
            aria-labelledby="para-quien-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
              <Reveal>
                <ChapterMark number="01" label="Para quién" />
                <h2
                  id="para-quien-heading"
                  className="font-display mt-5 max-w-2xl text-[1.65rem] font-bold tracking-tight sm:mt-6 sm:text-3xl md:text-5xl"
                >
                  Empresas, escuelas y negocios
                </h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted sm:mt-5 sm:text-base md:text-lg">
                  Contenido orientado a quien toma decisiones o forma a otros —
                  con ejemplos del contexto fronterizo, no de plantillas
                  genéricas.
                </p>
              </Reveal>

              <div className="mt-12 grid grid-cols-1 gap-0 border-y border-line sm:mt-16 md:grid-cols-3">
                {conferenceAudiences.map((item, index) => (
                  <Reveal key={item.id} delay={index * 90}>
                    <article
                      className={`h-full px-0 py-8 sm:py-10 md:px-8 md:py-12 ${
                        index > 0 ? "border-t border-line md:border-t-0 md:border-l" : ""
                      }`}
                    >
                      <p className="font-display text-5xl font-extrabold text-signal/[0.12] tabular-nums sm:text-6xl">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="-mt-6 text-[11px] font-semibold tracking-[0.22em] text-signal uppercase sm:-mt-8">
                        {item.label}
                      </p>
                      <h3 className="font-display mt-3 text-lg font-semibold sm:mt-4 sm:text-xl md:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted sm:mt-4 md:text-base">
                        {item.copy}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* 02 · Utilidad — manifesto + formats */}
          <section
            id="utilidad"
            className="scroll-mt-24 border-b border-line bg-bg-elevated/40 py-16 md:py-28"
            aria-labelledby="utilidad-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
              <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
                <Reveal>
                  <ChapterMark number="02" label="Utilidad" />
                  <h2
                    id="utilidad-heading"
                    className="font-display mt-5 max-w-md text-[1.65rem] font-bold tracking-tight sm:mt-6 sm:text-3xl md:text-5xl"
                  >
                    Qué se llevan tus asistentes
                  </h2>
                  <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted sm:mt-5 sm:text-base">
                    Claridad técnica, riesgos reales y un puente hacia la
                    implementación — en el formato que tu organización necesita.
                  </p>
                </Reveal>

                <ol className="space-y-0">
                  {conferenceBenefits.map((item, index) => (
                    <Reveal key={item.title} delay={index * 70}>
                      <li className="grid grid-cols-[auto_1fr] gap-4 border-t border-line py-6 first:border-t-0 first:pt-0 sm:gap-5 sm:py-7 md:gap-8 md:py-8">
                        <span className="font-display pt-0.5 text-xl font-extrabold text-accent tabular-nums sm:text-2xl md:text-3xl">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-display text-base font-semibold sm:text-lg md:text-xl">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted md:text-[15px]">
                            {item.copy}
                          </p>
                        </div>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              </div>

              <Reveal delay={120}>
                <div className="mt-12 grid grid-cols-1 gap-4 border-t border-line pt-10 sm:mt-16 sm:gap-6 sm:pt-12 sm:grid-cols-3">
                  {conferenceFormats.map((fmt, index) => (
                    <div
                      key={fmt.title}
                      className="relative overflow-hidden border border-line bg-bg/40 px-4 py-5 sm:px-5 sm:py-6"
                    >
                      <p className="text-[10px] font-semibold tracking-[0.18em] text-muted uppercase tabular-nums">
                        Formato {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-display mt-3 text-base font-semibold md:text-lg">
                        {fmt.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {fmt.copy}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* 03 · Temario — agenda program */}
          <section
            id="temas"
            className="scroll-mt-24 border-b border-line py-16 md:py-28"
            aria-labelledby="temas-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
              <Reveal>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
                  <div>
                    <ChapterMark number="03" label="Temario" />
                    <h2
                      id="temas-heading"
                      className="font-display mt-5 max-w-3xl text-[1.65rem] font-bold tracking-tight sm:mt-6 sm:text-3xl md:text-5xl"
                    >
                      Agenda de charlas
                    </h2>
                  </div>
                  <p className="max-w-md text-[15px] leading-relaxed text-muted sm:text-base lg:pb-1">
                    Cada tema tiene audiencia, resultados esperados y formato.
                    Podemos combinar o adaptar el contenido a tu evento.
                  </p>
                </div>
              </Reveal>

              <div className="mt-10 space-y-4 sm:mt-14">
                {conferenceTalks.map((talk, index) => (
                  <Reveal key={talk.slug} delay={Math.min(index * 50, 200)}>
                    <article className="group relative overflow-hidden border border-line bg-bg-elevated/30 transition hover:border-accent/40 hover:bg-bg-elevated/55">
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-accent/0 transition group-hover:bg-accent/70" />
                      <div className="flex flex-col gap-5 p-5 sm:gap-6 sm:p-8 lg:flex-row lg:gap-10">
                        <div className="flex shrink-0 items-start gap-3 sm:gap-4 lg:w-28 lg:flex-col lg:gap-2">
                          <span className="font-display text-3xl font-extrabold text-accent/30 tabular-nums transition group-hover:text-accent/55 sm:text-4xl md:text-5xl">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="pt-1 lg:pt-0">
                            <p className="text-[10px] font-semibold tracking-[0.16em] text-signal uppercase">
                              Sesión
                            </p>
                            <p className="mt-1 text-xs font-semibold text-muted">
                              {talk.duration}
                            </p>
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-lg font-bold tracking-tight sm:text-xl md:text-2xl">
                            {talk.title}
                          </h3>
                          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted md:text-base">
                            {talk.focus}
                          </p>
                          <p className="mt-4 text-sm">
                            <span className="font-semibold text-fg">Audiencia:</span>{" "}
                            <span className="text-muted">{talk.audience}</span>
                          </p>
                          <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {talk.outcomes.map((outcome) => (
                              <li
                                key={outcome}
                                className="flex gap-2.5 text-sm text-muted"
                              >
                                <span
                                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                                  aria-hidden
                                />
                                <span className="min-w-0">{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex shrink-0 flex-col justify-between gap-4 border-t border-line pt-5 lg:w-44 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                          <div>
                            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
                              Formato
                            </p>
                            <p className="mt-2 text-sm font-semibold text-fg">
                              {talk.format}
                            </p>
                          </div>
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex text-sm font-semibold text-accent transition hover:brightness-110"
                          >
                            Solicitar tema →
                          </a>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={80}>
                <div className="relative mt-10 overflow-hidden border border-line px-5 py-7 sm:mt-12 sm:px-8 sm:py-8">
                  <div className="pointer-events-none absolute inset-0" aria-hidden>
                    <div className="animate-orb absolute -left-8 top-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
                  </div>
                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
                        ¿No encuentras tu tema?
                      </p>
                      <p className="mt-2 max-w-md text-sm text-muted md:text-base">
                        Adaptamos el contenido a tu sector, duración y formato —
                        presencial o virtual.
                      </p>
                    </div>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full shrink-0 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110 sm:w-auto"
                    >
                      Consultar por WhatsApp
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* 04 · Servicios */}
          <section
            id="servicios-conferencias"
            className="scroll-mt-24 border-b border-line bg-bg-elevated/40 py-16 md:py-28"
            aria-labelledby="servicios-conf-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
              <Reveal>
                <ChapterMark number="04" label="Servicios ATRIX" />
                <h2
                  id="servicios-conf-heading"
                  className="font-display mt-5 max-w-3xl text-[1.65rem] font-bold tracking-tight sm:mt-6 sm:text-3xl md:text-5xl"
                >
                  Lo que cubren las pláticas — y lo que podemos implementar
                </h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted sm:mt-5 sm:text-base md:text-lg">
                  Las conferencias no viven en el vacío: se apoyan en la misma
                  oferta con la que operamos en {site.coverage}.
                </p>
              </Reveal>

              <ul className="mt-10 grid grid-cols-1 gap-px bg-line sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
                {conferenceServiceLinks.map((svc, index) => (
                  <Reveal key={svc.slug} delay={index * 55}>
                    <li className="h-full bg-bg-elevated/80 p-5 transition hover:bg-bg-elevated sm:p-6 md:p-7">
                      <p className="text-[10px] font-semibold tracking-[0.16em] text-signal uppercase tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-display mt-3 text-lg font-semibold">
                        {svc.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium tracking-wide text-accent uppercase">
                        {svc.short}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {svc.talkAngle}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={100}>
                <p className="mt-10 text-sm text-muted sm:mt-12">
                  ¿Quieres ver proyectos reales?{" "}
                  <Link
                    href="/proyectos"
                    className="font-semibold text-accent transition hover:brightness-110"
                  >
                    Explora el portafolio →
                  </Link>
                </p>
              </Reveal>
            </div>
          </section>

          {/* 05 · Agendar */}
          <section
            id="agendar"
            className="scroll-mt-24 py-16 md:py-28"
            aria-labelledby="agendar-heading"
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
                      <ChapterMark number="05" label="Agenda tu sesión" />
                      <h2
                        id="agendar-heading"
                        className="font-display mt-5 text-[1.65rem] font-bold tracking-tight sm:mt-6 sm:text-3xl md:text-5xl"
                      >
                        Lleva una conferencia ATRIX a tu organización
                      </h2>
                      <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted sm:mt-5 sm:text-base md:text-lg">
                        Cuéntanos el público, la duración y si prefieres
                        presencial o virtual. Respondemos por WhatsApp al{" "}
                        {site.phoneDisplay}.
                      </p>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:flex-col">
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110 sm:w-auto"
                      >
                        WhatsApp · {site.phoneDisplay}
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
