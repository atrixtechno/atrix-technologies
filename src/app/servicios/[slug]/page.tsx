import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Process } from "@/components/Process";
import { Reveal } from "@/components/Reveal";
import { CheckIcon } from "@/components/ui";
import { servicePages } from "@/content/service-pages";
import { benefits, services } from "@/content/services";
import { site, whatsappUrl } from "@/content/site";

// Una página por servicio: a donde llevan los anuncios de Meta (Admin → Campañas). Un anuncio que
// abre la página del servicio convierte mejor que uno que abre la portada.

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export const dynamicParams = false;

function find(slug: string) {
  const service = services.find((row) => row.slug === slug);
  const extra = servicePages[slug];
  return service && extra ? { service, extra } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const found = find(slug);
  if (!found) return {};
  const { service, extra } = found;
  const description = `${service.copy} ${site.legalName} en ${site.coverage}.`;
  return {
    title: `${service.title} en Nuevo Laredo`,
    description,
    alternates: { canonical: `/servicios/${slug}` },
    openGraph: {
      title: `${extra.title} · ${site.legalName}`,
      description,
      url: `${site.url}/servicios/${slug}`,
      siteName: site.legalName,
      locale: "es_MX",
      type: "website",
      images: [{ url: `${site.url}/brand/og-atrix-v2.png`, width: 1200, height: 630, alt: site.legalName }],
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = find(slug);
  if (!found) notFound();
  const { service, extra } = found;
  const wa = whatsappUrl(extra.whatsappMessage);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${site.url}/servicios/${slug}#service`,
        name: service.title,
        description: service.copy,
        url: `${site.url}/servicios/${slug}`,
        provider: { "@id": `${site.url}/#organization` },
        areaServed: [
          { "@type": "City", name: "Nuevo Laredo", containedInPlace: { "@type": "State", name: "Tamaulipas" } },
          { "@type": "City", name: "Laredo", containedInPlace: { "@type": "State", name: "Texas" } },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: extra.faq.map((row) => ({ "@type": "Question", name: row.q, acceptedAnswer: { "@type": "Answer", text: row.a } })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="relative min-h-screen bg-bg">
        <Header />
        <main className="relative z-10">
          <PageHero
            eyebrow={service.osd}
            title={extra.title}
            lead={service.copy}
            image={service.image}
            primary={{ href: wa, label: "Cotizar por WhatsApp" }}
            secondary={{ href: "#contacto", label: "Enviar solicitud" }}
            meta={`${site.coverage} · ${service.short}`}
          />

          <section className="border-t border-line py-20 md:py-28">
            <div className="mx-auto grid max-w-[1240px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
              <Reveal>
                <h2 className="section-title">Qué incluye</h2>
                <ul className="mt-8 space-y-4">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-lg text-fg">
                      <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-accent" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="grid gap-4 sm:grid-cols-2">
                {extra.audiences.map((row) => (
                  <div key={`${row.label}-${row.title}`} className="tile p-6">
                    <p className="osd text-muted">{row.label}</p>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-fg">{row.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted">{row.copy}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </section>

          <section className="border-t border-line py-20 md:py-28">
            <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
              <Reveal className="max-w-3xl">
                <h2 className="section-title">Por qué ATRIX</h2>
              </Reveal>
              <Reveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {benefits.map((row) => (
                  <div key={row.title} className="tile p-6">
                    <h3 className="text-lg font-semibold tracking-tight text-fg">{row.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{row.copy}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </section>

          <Process />

          <section className="border-t border-line py-20 md:py-28">
            <div className="mx-auto max-w-[900px] px-5 sm:px-8">
              <Reveal>
                <h2 className="section-title">Preguntas frecuentes</h2>
              </Reveal>
              <div className="mt-10 divide-y divide-line border-y border-line">
                {extra.faq.map((row) => (
                  <details key={row.q} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-fg">
                      {row.q}
                      <span className="text-muted transition-transform duration-200 group-open:rotate-45" aria-hidden>
                        +
                      </span>
                    </summary>
                    <p className="mt-3 leading-relaxed text-muted">{row.a}</p>
                  </details>
                ))}
              </div>
              {slug === "desarrollo-software" ? (
                <Link href="/proyectos" className="btn btn-outline mt-10">
                  Ver proyectos en producción
                </Link>
              ) : null}
            </div>
          </section>

          <Contact service={slug} />
        </main>
        <Footer />
      </div>
    </>
  );
}
