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
  soporteRemotoPage,
  soporteServiciosIncluidos,
} from "@/content/soporte-remoto";
import { site, whatsappUrl } from "@/content/site";

const pageTitle = "Tu departamento de sistemas · Soporte remoto";
const pageDescription =
  "Tu departamento de sistemas remoto para empresas en Nuevo Laredo y Laredo, TX: mantenimiento, optimización, seguridad y atención prioritaria sin contratar personal de TI de planta.";

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
        alt: `${site.legalName} — Tu departamento de sistemas remoto`,
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

function FlowStep({
  step,
  label,
  href,
}: {
  step: string;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex shrink-0 items-center gap-2.5 px-1 py-1 transition hover:opacity-90 sm:min-w-0 sm:flex-1 sm:gap-3"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-signal/35 bg-signal/10 text-[11px] font-bold text-signal tabular-nums transition group-hover:border-signal/60 group-hover:bg-signal/15">
        {step}
      </span>
      <span className="whitespace-nowrap text-xs font-semibold tracking-wide text-muted transition group-hover:text-fg sm:truncate sm:text-sm">
        {label}
      </span>
    </a>
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
        name: `Soporte técnico remoto · Tu departamento de sistemas · ${site.legalName}`,
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

          {/* Ops flow rail — not a chapter index */}
          <nav
            aria-label="Flujo del servicio"
            className="border-b border-line bg-bg/70 backdrop-blur-sm"
          >
            <div className="mx-auto flex max-w-6xl items-stretch gap-0 overflow-x-auto overscroll-x-contain px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-5 md:px-8 [&::-webkit-scrollbar]:hidden">
              <FlowStep step="01" label="Enfoque" href="#enfoque" />
              <span
                className="mx-1 w-6 shrink-0 self-center border-t border-dashed border-line sm:mx-0 sm:w-8"
                aria-hidden
              />
              <FlowStep step="02" label="Problemas" href="#problemas" />
              <span
                className="mx-1 w-6 shrink-0 self-center border-t border-dashed border-line sm:mx-0 sm:w-8"
                aria-hidden
              />
              <FlowStep step="03" label="Cobertura" href="#servicios" />
              <span
                className="mx-1 w-6 shrink-0 self-center border-t border-dashed border-line sm:mx-0 sm:w-8"
                aria-hidden
              />
              <FlowStep step="04" label="Plan" href="#plan" />
              <span
                className="mx-1 w-6 shrink-0 self-center border-t border-dashed border-line sm:mx-0 sm:w-8"
                aria-hidden
              />
              <FlowStep step="05" label="Cotizar" href="#cotizar" />
            </div>
          </nav>

          {/* Enfoque — narrative intro + one mid-page reinforcement */}
          <section
            id="enfoque"
            className="scroll-mt-24 border-b border-line py-16 md:py-24"
            aria-labelledby="enfoque-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
              <Reveal>
                <blockquote className="mb-12 border-l-[3px] border-signal pl-5 sm:mb-14 sm:pl-7 md:mb-16">
                  <p className="font-display text-[1.45rem] font-bold leading-snug tracking-tight text-fg sm:text-2xl md:text-[2rem] md:leading-[1.2]">
                    <span className="text-signal">
                      {soporteRemotoPage.headline}
                    </span>
                    <span className="text-muted">
                      {" "}
                      — el respaldo de TI que tu operación necesita, sin
                      headcount interno.
                    </span>
                  </p>
                </blockquote>
              </Reveal>

              <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:gap-16">
                <Reveal>
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-signal uppercase">
                    Enfoque operativo
                  </p>
                  <h2
                    id="enfoque-heading"
                    className="font-display mt-4 text-[1.65rem] font-bold tracking-tight sm:text-3xl md:text-4xl"
                  >
                    Al servicio de tu operación
                  </h2>
                  <div className="animate-line mt-5 h-px w-16 bg-signal/55" />
                </Reveal>
                <div className="space-y-5 border-l-2 border-signal/25 pl-5 sm:pl-6 md:pl-8">
                  {soporteRemotoPage.intro.map((paragraph, index) => (
                    <Reveal key={paragraph.slice(0, 24)} delay={index * 80}>
                      <p className="text-[15px] leading-relaxed text-muted sm:text-base md:text-lg">
                        {paragraph}
                      </p>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Problema → Solución */}
          <section
            id="problemas"
            className="scroll-mt-24 border-b border-line py-16 md:py-28"
            aria-labelledby="problemas-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
              <Reveal>
                <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-signal uppercase">
                      Diagnóstico
                    </p>
                    <h2
                      id="problemas-heading"
                      className="font-display mt-3 text-[1.65rem] font-bold tracking-tight sm:text-3xl md:text-4xl"
                    >
                      Del problema a la solución
                    </h2>
                  </div>
                  <p className="max-w-sm text-sm leading-relaxed text-muted md:text-base">
                    Incidencias que frenan al equipo — y tu departamento de
                    sistemas remoto que las resuelve sin personal de TI interno.
                  </p>
                </div>
              </Reveal>

              <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                <Reveal>
                  <div className="h-full border border-line bg-bg-elevated/40 p-5 sm:p-8">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center border border-line text-muted">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden
                        >
                          <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-muted uppercase">
                          Sin cobertura
                        </p>
                        <p className="font-display text-lg font-bold">
                          Fricción diaria
                        </p>
                      </div>
                    </div>
                    <ul className="mt-7 space-y-4">
                      {soporteProblemas.map((item, index) => (
                        <li
                          key={item}
                          className="flex gap-3 border-t border-line pt-4 first:border-t-0 first:pt-0"
                        >
                          <span className="mt-0.5 text-[11px] font-bold text-muted/70 tabular-nums">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p className="text-sm leading-relaxed text-fg md:text-[15px]">
                            {item}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={100}>
                  <div className="relative h-full overflow-hidden border border-accent/35 bg-accent/[0.06] p-5 sm:p-8">
                    <div
                      className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/15 blur-3xl"
                      aria-hidden
                    />
                    <div className="relative">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center border border-accent/40 bg-accent/15 text-accent">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.25"
                            aria-hidden
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </span>
                        <div>
                          <p className="text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">
                            Tu departamento de TI
                          </p>
                          <p className="font-display text-lg font-bold">
                            Continuidad operativa
                          </p>
                        </div>
                      </div>
                      <p className="mt-7 text-base leading-relaxed text-muted md:text-lg">
                        {soporteRemotoPage.intro[1]}
                      </p>
                      <ul className="mt-8 space-y-3">
                        {[
                          "Técnico disponible cuando hay incidencia",
                          "Mantenimiento preventivo, no solo emergencias",
                          "Seguridad y respaldos como hábito",
                          "Equipo enfocado en el negocio, no en IT",
                        ].map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-3 text-sm text-fg md:text-[15px]"
                          >
                            <span
                              className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-accent text-[10px] font-bold text-accent-ink"
                              aria-hidden
                            >
                              ✓
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-flex text-sm font-semibold text-accent transition hover:brightness-110"
                      >
                        Hablar con un técnico →
                      </a>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Servicios incluidos — checklist */}
          <section
            id="servicios"
            className="scroll-mt-24 border-b border-line bg-bg-elevated/35 py-16 md:py-28"
            aria-labelledby="servicios-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
              <Reveal>
                <p className="text-[11px] font-semibold tracking-[0.22em] text-signal uppercase">
                  Cobertura incluida
                </p>
                <h2
                  id="servicios-heading"
                  className="font-display mt-3 max-w-2xl text-[1.65rem] font-bold tracking-tight sm:text-3xl md:text-4xl"
                >
                  Servicios incluidos
                </h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base md:text-lg">
                  Cobertura remota continua para mantener equipos y sistemas
                  estables, seguros y listos para trabajar.
                </p>
              </Reveal>

              <ul className="mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2">
                {soporteServiciosIncluidos.map((item, index) => (
                  <Reveal key={item} delay={Math.min(index * 40, 180)}>
                    <li className="flex items-start gap-3 border border-line bg-bg/50 px-4 py-4 transition hover:border-accent/35 hover:bg-bg-elevated sm:gap-4 sm:px-5">
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-accent/40 bg-accent/10 text-xs font-bold text-accent"
                        aria-hidden
                      >
                        ✓
                      </span>
                      <p className="min-w-0 text-sm leading-relaxed text-fg md:text-[15px]">
                        {item}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={80}>
                <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="tech-frame border border-line bg-bg/60 px-4 py-5 sm:px-6">
                    <p className="text-[10px] font-semibold tracking-[0.18em] text-signal uppercase">
                      Sistemas compatibles
                    </p>
                    <p className="mt-2 text-sm text-muted md:text-base">
                      {soporteRemotoPage.sistemas}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="border border-line px-3 py-1.5 text-xs font-bold tracking-wide">
                        Windows
                      </span>
                      <span className="border border-line px-3 py-1.5 text-xs font-bold tracking-wide">
                        macOS
                      </span>
                    </div>
                  </div>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110 sm:w-auto"
                  >
                    Consultar por WhatsApp
                  </a>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Plan personalizado */}
          <section
            id="plan"
            className="scroll-mt-24 border-b border-line py-16 md:py-28"
            aria-labelledby="plan-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
              <div className="relative overflow-hidden border border-line">
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(26,76,255,0.1),transparent_60%)]" />
                  <div className="grid-tech absolute inset-0 opacity-25" />
                </div>
                <div className="relative grid gap-8 p-5 sm:gap-10 sm:p-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:p-12 lg:p-14">
                  <Reveal>
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-signal uppercase">
                      Plan a medida
                    </p>
                    <h2
                      id="plan-heading"
                      className="font-display mt-3 text-[1.65rem] font-bold tracking-tight sm:text-3xl md:text-4xl"
                    >
                      Plan personalizado
                    </h2>
                    <p className="mt-5 text-[15px] leading-relaxed text-muted sm:text-base md:text-lg">
                      {soporteRemotoPage.planPersonalizado}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 border-t border-line pt-8">
                      {[
                        { label: "Equipos", detail: "Según inventario" },
                        { label: "Frecuencia", detail: "A tu ritmo" },
                        { label: "Alcance", detail: "Por necesidad" },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
                            {item.label}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-fg">
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Reveal>

                  <Reveal delay={90}>
                    <div className="border border-line bg-bg-elevated/70 p-5 sm:p-7">
                      <p className="text-[10px] font-semibold tracking-[0.2em] text-accent uppercase">
                        Ideal para
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-muted">
                        {soporteRemotoPage.idealPara}
                      </p>
                      <ul className="mt-7 flex flex-wrap gap-2">
                        {soporteIdealAudiences.map((label) => (
                          <li
                            key={label}
                            className="border border-line bg-bg/50 px-3 py-1.5 text-xs font-semibold tracking-wide text-fg"
                          >
                            {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>

          {/* Cotizar */}
          <section
            id="cotizar"
            className="scroll-mt-24 py-16 md:py-28"
            aria-labelledby="cotizar-heading"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
              <Reveal>
                <div className="relative overflow-hidden border border-signal/25 bg-signal/[0.04]">
                  <div className="pointer-events-none absolute inset-0" aria-hidden>
                    <div className="animate-orb absolute -right-8 top-0 h-40 w-40 rounded-full bg-signal/12 blur-3xl" />
                    <div className="scanline absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/35 to-transparent" />
                  </div>
                  <div className="relative px-5 py-10 sm:px-10 sm:py-14 md:px-14 md:py-16">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                      <div className="max-w-xl min-w-0">
                        <p className="text-[11px] font-semibold tracking-[0.22em] text-signal uppercase">
                          Siguiente paso
                        </p>
                        <h2
                          id="cotizar-heading"
                          className="font-display mt-3 text-[1.65rem] font-bold tracking-tight sm:text-3xl md:text-4xl"
                        >
                          {soporteRemotoPage.closing}
                        </h2>
                        <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted sm:text-base md:text-lg">
                          Cuéntanos cuántos equipos tienes y con qué frecuencia
                          necesitas soporte. Respondemos por WhatsApp al{" "}
                          {site.phoneDisplay}.
                        </p>
                      </div>
                      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col">
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
                          className="inline-flex w-full items-center justify-center rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-fg transition hover:border-signal/40 hover:bg-bg-elevated sm:w-auto"
                        >
                          Formulario de contacto
                        </Link>
                      </div>
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
