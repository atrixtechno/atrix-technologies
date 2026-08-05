import type { Metadata } from "next";
import Link from "next/link";
import { ConferenceBacking } from "@/components/ConferenceBacking";
import { ConferenceSpeakerProfile } from "@/components/ConferenceSpeakerProfile";
import { ConferenciasHeroBrand } from "@/components/ConferenciasHeroBrand";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageDecor } from "@/components/PageDecor";
import { Reveal } from "@/components/Reveal";
import {
  conferenceAudiences,
  conferenceBenefits,
  conferenceFormats,
  conferenceServiceLinks,
  conferenceSpeaker,
  conferenceTalks,
  conferenciasPage,
} from "@/content/conferencias";
import { site, whatsappUrl } from "@/content/site";

const pageTitle = "Conferencias de IA y tecnología";
const pageDescription =
  "Conferencias y charlas de inteligencia artificial, ciberseguridad y transformación digital para empresas, escuelas y negocios en Nuevo Laredo y Laredo, TX. Impartidas por ATRIX Technologies e Ing. Néstor J. Resendiz, MBA.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/conferencias" },
  keywords: [
    "conferencias inteligencia artificial Nuevo Laredo",
    "charlas IA Laredo TX",
    "capacitaciones tecnológicas empresas",
    "conferencias ciberseguridad frontera",
    "talleres transformación digital PyMEs",
    "IA en educación Nuevo Laredo",
    "ATRIX Technologies conferencias",
    "Néstor Resendiz conferencista",
    "charlas tecnología empresas escuelas negocios",
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
        alt: `${site.legalName} — Conferencias de IA y tecnología`,
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
        name: `Serie de conferencias ATRIX · IA y tecnología`,
        description:
          "Serie de charlas y talleres sobre inteligencia artificial, ciberseguridad y transformación digital para empresas, escuelas y negocios.",
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
          {/* Hero */}
          <section className="relative overflow-hidden border-b border-line">
            <div className="grid-tech pointer-events-none absolute inset-0 opacity-40" />
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="animate-orb absolute left-[6%] top-[18%] h-44 w-44 rounded-full bg-accent/15 blur-3xl" />
              <div className="animate-orb-delayed absolute right-[8%] bottom-[12%] h-52 w-52 rounded-full bg-signal/12 blur-3xl" />
            </div>

            <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-14 sm:pb-20 sm:pt-16 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-12 md:px-8 md:pb-24 md:pt-20">
              <div className="animate-rise min-w-0">
                <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase sm:text-xs sm:tracking-[0.28em]">
                  {conferenciasPage.eyebrow}
                </p>
                <h1 className="font-display mt-3 max-w-3xl text-balance text-3xl font-extrabold tracking-tight sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
                  {conferenciasPage.title}
                </h1>
                <div className="animate-line mt-5 h-px w-24 bg-accent/50" />
                <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
                  {conferenciasPage.lead}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110"
                  >
                    Solicitar por WhatsApp
                  </a>
                  <Link
                    href="#temas"
                    className="inline-flex rounded-full border border-line px-6 py-3 text-sm font-semibold text-fg transition hover:border-accent/40 hover:bg-bg-elevated"
                  >
                    Ver temas
                  </Link>
                </div>
                <p className="mt-5 text-sm text-muted">
                  {site.coverage} · Presencial o virtual
                </p>
              </div>

              <ConferenciasHeroBrand />
            </div>
          </section>

          {/* Para quién */}
          <section
            id="para-quien"
            className="scroll-mt-24 border-b border-line py-20 md:py-24"
            aria-labelledby="para-quien-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
                  Para quién
                </p>
                <h2
                  id="para-quien-heading"
                  className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl"
                >
                  Empresas, escuelas y negocios
                </h2>
                <div className="animate-line mt-4 h-px w-24 bg-accent/50" />
                <p className="mt-4 max-w-2xl text-muted">
                  Contenido orientado a quien toma decisiones o forma a otros —
                  con ejemplos del contexto fronterizo, no de Silicon Valley.
                </p>
              </Reveal>

              <ul className="mt-12 grid gap-8 md:grid-cols-3">
                {conferenceAudiences.map((item, index) => (
                  <Reveal key={item.id} delay={index * 90}>
                    <li className="border-t border-line pt-6 transition hover:border-accent/40">
                      <p className="text-[11px] font-semibold tracking-[0.2em] text-signal uppercase">
                        {String(index + 1).padStart(2, "0")} · {item.label}
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

          {/* Utilidad */}
          <section
            id="utilidad"
            className="scroll-mt-24 border-b border-line bg-bg-elevated/40 py-20 md:py-24"
            aria-labelledby="utilidad-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
                  Utilidad
                </p>
                <h2
                  id="utilidad-heading"
                  className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl"
                >
                  Qué se llevan tus asistentes
                </h2>
                <div className="animate-line mt-4 h-px w-24 bg-accent/50" />
              </Reveal>

              <ul className="mt-12 grid gap-6 sm:grid-cols-2">
                {conferenceBenefits.map((item, index) => (
                  <Reveal key={item.title} delay={index * 70}>
                    <li className="border-t border-line pt-6">
                      <h3 className="font-display text-lg font-semibold md:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                        {item.copy}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={120}>
                <div className="mt-14 grid gap-6 border-t border-line pt-10 sm:grid-cols-3">
                  {conferenceFormats.map((fmt) => (
                    <div key={fmt.title}>
                      <h3 className="font-display text-base font-semibold">
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

          {/* Temas */}
          <section
            id="temas"
            className="scroll-mt-24 border-b border-line py-20 md:py-24"
            aria-labelledby="temas-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
                  Temario
                </p>
                <h2
                  id="temas-heading"
                  className="font-display mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl"
                >
                  Charlas centradas en inteligencia artificial y tecnología
                  aplicada
                </h2>
                <div className="animate-line mt-4 h-px w-24 bg-accent/50" />
                <p className="mt-4 max-w-2xl text-muted">
                  Cada tema tiene audiencia, resultados esperados y formato.
                  Podemos combinar o adaptar el contenido a tu evento.
                </p>
              </Reveal>

              <ul className="mt-12 divide-y divide-line border-y border-line">
                {conferenceTalks.map((talk, index) => (
                  <Reveal key={talk.slug} delay={Math.min(index * 60, 240)}>
                    <li className="py-8 md:py-10">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold tracking-[0.18em] text-signal uppercase">
                            {String(index + 1).padStart(2, "0")} · IA & tech
                          </p>
                          <h3 className="font-display mt-2 text-xl font-bold tracking-tight md:text-2xl">
                            {talk.title}
                          </h3>
                          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted md:text-base">
                            {talk.focus}
                          </p>
                          <p className="mt-4 text-sm text-fg">
                            <span className="font-semibold">Audiencia:</span>{" "}
                            <span className="text-muted">{talk.audience}</span>
                          </p>
                          <div className="mt-4">
                            <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                              Resultados esperados
                            </p>
                            <ul className="mt-3 space-y-2">
                              {talk.outcomes.map((outcome) => (
                                <li
                                  key={outcome}
                                  className="flex gap-2 text-sm text-muted"
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
                        <div className="shrink-0 border-t border-line pt-4 lg:w-48 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                          <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                            Formato
                          </p>
                          <p className="mt-2 text-sm font-semibold text-fg">
                            {talk.format}
                          </p>
                          <p className="mt-1 text-sm text-muted">
                            {talk.duration}
                          </p>
                        </div>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>

          {/* Servicios */}
          <section
            id="servicios-conferencias"
            className="scroll-mt-24 border-b border-line bg-bg-elevated/40 py-20 md:py-24"
            aria-labelledby="servicios-conf-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
                  Servicios ATRIX
                </p>
                <h2
                  id="servicios-conf-heading"
                  className="font-display mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl"
                >
                  Lo que cubren las charlas — y lo que podemos implementar
                </h2>
                <div className="animate-line mt-4 h-px w-24 bg-accent/50" />
                <p className="mt-4 max-w-2xl text-muted">
                  Las conferencias no viven en el vacío: se apoyan en la misma
                  oferta con la que operamos en {site.coverage}.
                </p>
              </Reveal>

              <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {conferenceServiceLinks.map((svc, index) => (
                  <Reveal key={svc.slug} delay={index * 60}>
                    <li className="h-full border-t border-line pt-5 transition hover:border-accent/40">
                      <h3 className="font-display text-lg font-semibold">
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
                <p className="mt-10 text-sm text-muted">
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

          {/* Quién imparte / quién respalda */}
          <section
            id="equipo"
            className="scroll-mt-24 border-b border-line bg-bg-elevated/30 py-20 md:py-24"
            aria-labelledby="equipo-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
                  Credenciales
                </p>
                <h2
                  id="equipo-heading"
                  className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl"
                >
                  Quién imparte y quién respalda
                </h2>
                <div className="animate-line mt-4 h-px w-24 bg-accent/50" />
                <p className="mt-4 max-w-2xl text-muted">
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

          {/* CTA */}
          <section
            id="agendar"
            className="scroll-mt-24 py-20 md:py-24"
            aria-labelledby="agendar-heading"
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <Reveal>
                <div className="relative overflow-hidden border border-line bg-bg-elevated/50 px-6 py-12 sm:px-10 sm:py-14 md:px-14">
                  <div className="pointer-events-none absolute inset-0" aria-hidden>
                    <div className="animate-orb absolute -left-10 top-0 h-40 w-40 rounded-full bg-accent/12 blur-3xl" />
                    <div className="animate-orb-delayed absolute -right-8 bottom-0 h-44 w-44 rounded-full bg-signal/10 blur-3xl" />
                  </div>
                  <div className="relative max-w-2xl">
                    <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
                      Agenda tu sesión
                    </p>
                    <h2
                      id="agendar-heading"
                      className="font-display mt-4 text-3xl font-bold tracking-tight md:text-4xl"
                    >
                      Lleva una conferencia ATRIX a tu organización
                    </h2>
                    <p className="mt-4 text-pretty text-muted">
                      Cuéntanos el público, la duración y si prefieres presencial
                      o virtual. Respondemos por WhatsApp al{" "}
                      {site.phoneDisplay}.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110"
                      >
                        WhatsApp · {site.phoneDisplay}
                      </a>
                      <Link
                        href="/#contacto"
                        className="inline-flex rounded-full border border-line px-6 py-3 text-sm font-semibold text-fg transition hover:border-accent/40 hover:bg-bg"
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
