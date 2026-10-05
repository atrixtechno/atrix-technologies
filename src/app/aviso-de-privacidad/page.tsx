import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: `Cómo ${site.legalName} usa los datos que nos compartes en el sitio, las cookies y el Pixel de Meta.`,
  alternates: { canonical: "/aviso-de-privacidad" },
};

const sections = [
  {
    title: "Quién es responsable",
    body: [
      `${site.legalName}, con operación en ${site.city}, es responsable de los datos personales que nos compartes en ${site.url.replace(/^https?:\/\//, "")}. Para cualquier tema de privacidad escríbenos a ${site.email}.`,
    ],
  },
  {
    title: "Qué datos recibimos",
    body: [
      "En el formulario de contacto: tu nombre, teléfono (opcional), negocio (opcional) y el mensaje que escribes. Si nos escribes por WhatsApp, los datos de esa conversación.",
      "Al navegar, y solo si aceptas las cookies: la página que visitas, el sitio desde el que llegaste, el tipo de navegador y una ubicación aproximada (ciudad y país, sin tu IP).",
    ],
  },
  {
    title: "Para qué los usamos",
    body: [
      "Para responder tu solicitud, cotizar y darte seguimiento. Con tu aceptación de cookies, también para entender qué páginas y anuncios funcionan y mejorar el sitio.",
      "No vendemos tus datos ni los usamos para fines distintos a los descritos aquí.",
    ],
  },
  {
    title: "Cookies y Pixel de Meta",
    body: [
      "Usamos cookies necesarias para recordar el tema del sitio, tu elección de cookies y la sesión del panel interno.",
      "Solo si eliges «Aceptar» en el aviso de cookies, cargamos el Pixel de Meta (Facebook e Instagram), que usa las cookies _fbp y _fbc, y medimos visitas propias. Con eso sabemos si una visita o una solicitud de cotización llegó desde uno de nuestros anuncios. Si envías el formulario después de aceptar, mandamos a Meta tu teléfono cifrado con SHA-256 (Meta no recibe el número legible) para atribuir la cotización al anuncio.",
      "Con «Solo necesarias» no se carga el Pixel ni se manda nada a Meta. Puedes cambiar tu elección borrando las cookies de este sitio en tu navegador.",
    ],
  },
  {
    title: "Tus derechos",
    body: [
      `Puedes pedir acceso, rectificación, cancelación u oposición al uso de tus datos (derechos ARCO), o revocar tu consentimiento, escribiendo a ${site.email}. Te respondemos por el mismo medio.`,
    ],
  },
];

export default function AvisoPrivacidadPage() {
  return (
    <div className="relative min-h-screen bg-bg">
      <Header />
      <main className="relative z-10 mx-auto max-w-[820px] px-5 pt-32 pb-24 sm:px-8">
        <h1 className="page-hero-title">Aviso de privacidad</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">Qué datos recibimos en este sitio, para qué los usamos y cómo puedes decidir sobre ellos.</p>
        <div className="mt-14 space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold tracking-tight text-fg">{section.title}</h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-16 text-sm text-muted">Última actualización: octubre de 2026.</p>
      </main>
      <Footer />
    </div>
  );
}
