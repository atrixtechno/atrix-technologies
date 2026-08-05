import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site, whatsappUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Conferencias",
  description:
    "Conferencias y capacitaciones tecnológicas de ATRIX Technologies para hogares y empresas en Nuevo Laredo y Laredo, TX.",
  alternates: { canonical: "/conferencias" },
  openGraph: {
    title: `Conferencias · ${site.legalName}`,
    description:
      "Charlas y talleres prácticos sobre tecnología, seguridad y productividad digital.",
    url: `${site.url}/conferencias`,
    type: "website",
    images: [
      {
        url: "https://atrixnld.com/brand/og-atrix-v2.png",
        width: 1200,
        height: 630,
        alt: `${site.legalName} — Conferencias`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Conferencias · ${site.legalName}`,
    description:
      "Charlas y talleres prácticos sobre tecnología, seguridad y productividad digital.",
    images: ["https://atrixnld.com/brand/og-atrix-v2.png"],
  },
  keywords: [
    "conferencias ATRIX",
    "capacitaciones tecnológicas Nuevo Laredo",
    "charlas de tecnología",
    "talleres IT frontera",
  ],
};

const upcomingPlaceholders = [
  {
    topic: "Seguridad digital en casa y en la oficina",
    format: "Charla · Presencial / virtual",
  },
  {
    topic: "Redes, CCTV y buenas prácticas de infraestructura",
    format: "Taller práctico",
  },
  {
    topic: "Software a la medida: de la idea a la operación",
    format: "Sesión empresarial",
  },
] as const;

export default function ConferenciasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Conferencias · ${site.legalName}`,
    description:
      "Conferencias y capacitaciones tecnológicas para hogares y empresas.",
    url: `${site.url}/conferencias`,
    isPartOf: { "@type": "WebSite", name: site.legalName, url: site.url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header solid />
      <main className="atmosphere min-h-screen">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:pb-24 sm:pt-16 md:px-8 md:pt-20">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase sm:text-xs sm:tracking-[0.28em]">
            Formación
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-balance text-3xl font-extrabold tracking-tight sm:mt-4 sm:text-4xl md:text-6xl">
            Conferencias
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base text-muted sm:mt-5 sm:text-lg">
            Charlas y capacitaciones prácticas para hogares y empresas: tecnología
            clara, seguridad real y decisiones que mejoran el día a día. Próximos
            eventos se publicarán aquí.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
            <a
              href={whatsappUrl(
                "Hola ATRIX, me interesa una conferencia o capacitación tecnológica.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110"
            >
              Solicitar por WhatsApp
            </a>
            <Link
              href="/#contacto"
              className="inline-flex rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-fg transition hover:border-accent/40 hover:bg-bg-elevated"
            >
              Contacto
            </Link>
          </div>

          <section className="mt-14 sm:mt-16" aria-labelledby="proximos-heading">
            <h2
              id="proximos-heading"
              className="font-display text-xl font-bold tracking-tight sm:text-2xl"
            >
              Próximos eventos
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Temas que ya estamos armando. Fechas y sedes se confirman con
              anticipación.
            </p>

            <ul className="mt-8 divide-y divide-line border-y border-line">
              {upcomingPlaceholders.map((item) => (
                <li
                  key={item.topic}
                  className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <p className="text-base font-semibold text-fg sm:text-lg">
                    {item.topic}
                  </p>
                  <p className="shrink-0 text-sm text-muted">{item.format}</p>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-muted">
              ¿Quieres una sesión para tu equipo o comunidad? Escríbenos y
              armamos el formato.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
