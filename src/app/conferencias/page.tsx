import type { Metadata } from "next";
import Link from "next/link";
import { ConferenceBacking } from "@/components/ConferenceBacking";
import { ConferenceSpeakerProfile } from "@/components/ConferenceSpeakerProfile";
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

          {/* Chapter index */}
          <nav
            aria-label="Secciones de la página"
            className="border-b border-line bg-bg-elevated/35"
          >
            <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 py-3.5 md:px-8 md:py-4">
              {conferenceChapters.map((ch) => (
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

          {/* 01 · Para quién */}
          <section
            id="para-quien"
            className="scroll-mt-24 border-b border-line py-20 md:py-28"
            aria-labelledby="para-quien-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <Reveal>
                <ChapterEyebrow number="01" label="Para quién" />
                <h2
                  id="para-quien-heading"
                  className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl"
                >
                  Empresas, escuelas y negocios
                </h2>
                <div className="animate-line mt-5 h-px w-24 bg-accent/50" />
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                  Contenido orientado a quien toma decisiones o forma a otros —
                  con ejemplos del contexto fronterizo, no de plantillas
                  genéricas.
                </p>
              </Reveal>

              <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
                {conferenceAudiences.map((item, index) => (
                  <Reveal key={item.id} delay={index * 90}>
                    <li className="relative border-t border-line pt-7 transition hover:border-accent/45">
                      <span
                        className="font-display pointer-events-none absolute -top-1 right-0 text-6xl font-extrabold text-accent/[0.08] tabular-nums md:text-7xl"
                        aria-hidden
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[11px] font-semibold tracking-[0.2em] text-signal uppercase">
                        {item.label}
                      </p>
                      <h3 className="font-display mt-3 text-xl font-semibold md:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                        {item.copy}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>

          {/* 02 · Utilidad */}
          <section
            id="utilidad"
            className="scroll-mt-24 border-b border-line bg-bg-elevated/40 py-20 md:py-28"
            aria-labelledby="utilidad-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:items-start">
                <Reveal>
                  <ChapterEyebrow number="02" label="Utilidad" />
                  <h2
                    id="utilidad-heading"
                    className="font-display mt-4 max-w-xl text-3xl font-bold tracking-tight md:text-5xl"
                  >
                    Qué se llevan tus asistentes
                  </h2>
                  <div className="animate-line mt-5 h-px w-24 bg-accent/50" />
                  <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                    Claridad técnica, riesgos reales y un puente hacia la
                    implementación — en el formato que tu organización necesita.
                  </p>
                </Reveal>

                <ul className="grid gap-8 sm:grid-cols-2">
                  {conferenceBenefits.map((item, index) => (
                    <Reveal key={item.title} delay={index * 70}>
                      <li className="border-t border-line pt-6">
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-signal uppercase tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="font-display mt-2 text-lg font-semibold md:text-xl">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted md:text-[15px]">
                          {item.copy}
                        </p>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>

              <Reveal delay={120}>
                <div className="mt-16 grid gap-8 border-t border-line pt-12 sm:grid-cols-3">
                  {conferenceFormats.map((fmt, index) => (
                    <div key={fmt.title}>
                      <p className="text-[10px] font-semibold tracking-[0.18em] text-muted uppercase tabular-nums">
                        Formato {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-display mt-2 text-base font-semibold md:text-lg">
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

          {/* 03 · Temario */}
          <section
            id="temas"
            className="scroll-mt-24 border-b border-line py-20 md:py-28"
            aria-labelledby="temas-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <Reveal>
                <ChapterEyebrow number="03" label="Temario" />
                <h2
                  id="temas-heading"
                  className="font-display mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl"
                >
                  Charlas centradas en inteligencia artificial y tecnología
                  aplicada
                </h2>
                <div className="animate-line mt-5 h-px w-24 bg-accent/50" />
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                  Cada tema tiene audiencia, resultados esperados y formato.
                  Podemos combinar o adaptar el contenido a tu evento.
                </p>
              </Reveal>

              <ul className="mt-14 divide-y divide-line border-y border-line">
                {conferenceTalks.map((talk, index) => (
                  <Reveal key={talk.slug} delay={Math.min(index * 55, 220)}>
                    <li className="group py-9 md:py-11">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-3">
                            <span className="font-display text-3xl font-extrabold text-accent/25 tabular-nums transition group-hover:text-accent/45 md:text-4xl">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <p className="text-[11px] font-semibold tracking-[0.18em] text-signal uppercase">
                              IA & tecnología
                            </p>
                          </div>
                          <h3 className="font-display mt-3 text-xl font-bold tracking-tight md:text-2xl lg:text-[1.65rem]">
                            {talk.title}
                          </h3>
                          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted md:text-base">
                            {talk.focus}
                          </p>
                          <p className="mt-5 text-sm text-fg">
                            <span className="font-semibold">Audiencia:</span>{" "}
                            <span className="text-muted">{talk.audience}</span>
                          </p>
                          <div className="mt-5">
                            <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                              Resultados esperados
                            </p>
                            <ul className="mt-3 space-y-2.5">
                              {talk.outcomes.map((outcome) => (
                                <li
                                  key={outcome}
                                  className="flex gap-2.5 text-sm text-muted"
                                >
                                  <span
                                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                                    aria-hidden
                                  />
                                  {outcome}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="shrink-0 border-t border-line pt-5 lg:w-52 lg:border-t-0 lg:border-l lg:pt-1 lg:pl-9">
                          <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                            Formato
                          </p>
                          <p className="mt-2 text-sm font-semibold text-fg">
                            {talk.format}
                          </p>
                          <p className="mt-1 text-sm text-muted">{talk.duration}</p>
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex text-sm font-semibold text-accent transition hover:brightness-110"
                          >
                            Solicitar este tema →
                          </a>
                        </div>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ul>

              {/* Mid-page CTA bridge */}
              <Reveal delay={80}>
                <div className="relative mt-14 overflow-hidden border border-line px-6 py-8 sm:px-8 sm:py-9">
                  <div className="pointer-events-none absolute inset-0" aria-hidden>
                    <div className="animate-orb absolute -left-8 top-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
                  </div>
                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
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
                      className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110"
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
            className="scroll-mt-24 border-b border-line bg-bg-elevated/40 py-20 md:py-28"
            aria-labelledby="servicios-conf-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <Reveal>
                <ChapterEyebrow number="04" label="Servicios ATRIX" />
                <h2
                  id="servicios-conf-heading"
                  className="font-display mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl"
                >
                  Lo que cubren las pláticas — y lo que podemos implementar
                </h2>
                <div className="animate-line mt-5 h-px w-24 bg-accent/50" />
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                  Las conferencias no viven en el vacío: se apoyan en la misma
                  oferta con la que operamos en {site.coverage}.
                </p>
              </Reveal>

              <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {conferenceServiceLinks.map((svc, index) => (
                  <Reveal key={svc.slug} delay={index * 55}>
                    <li className="h-full border-t border-line pt-6 transition hover:border-accent/45">
                      <p className="text-[10px] font-semibold tracking-[0.16em] text-signal uppercase tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-display mt-2 text-lg font-semibold">
                        {svc.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium tracking-wide text-signal uppercase">
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
                <p className="mt-12 text-sm text-muted">
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

          {/* 05 · Credenciales */}
          <section
            id="equipo"
            className="scroll-mt-24 border-b border-line py-20 md:py-28"
            aria-labelledby="equipo-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <Reveal>
                <ChapterEyebrow number="05" label="Credenciales" />
                <h2
                  id="equipo-heading"
                  className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl"
                >
                  Quién imparte y quién respalda
                </h2>
                <div className="animate-line mt-5 h-px w-24 bg-accent/50" />
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                  Un conferencista con experiencia de frontera, respaldado por
                  la empresa que implementa lo que se discute en la sala.
                </p>
              </Reveal>

              <Reveal delay={80}>
                <div className="mt-14 md:mt-16">
                  <ConferenceSpeakerProfile speaker={conferenceSpeaker} />
                </div>
              </Reveal>

              <Reveal delay={140}>
                <div className="mt-4 md:mt-6">
                  <ConferenceBacking />
                </div>
              </Reveal>
            </div>
          </section>

          {/* 06 · Agendar */}
          <section
            id="agendar"
            className="scroll-mt-24 py-20 md:py-28"
            aria-labelledby="agendar-heading"
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
                    <ChapterEyebrow number="06" label="Agenda tu sesión" />
                    <h2
                      id="agendar-heading"
                      className="font-display mt-4 text-3xl font-bold tracking-tight md:text-5xl"
                    >
                      Lleva una conferencia ATRIX a tu organización
                    </h2>
                    <p className="mt-5 text-pretty text-base leading-relaxed text-muted md:text-lg">
                      Cuéntanos el público, la duración y si prefieres presencial
                      o virtual. Respondemos por WhatsApp al{" "}
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
