export const site = {
  name: "ATRIX",
  legalName: "ATRIX Technologies",
  city: "Nuevo Laredo, Tamaulipas",
  tagline: "Software a la medida para negocios de la frontera",
  motto: "Tecnología · Innovación · Rendimiento",
  description:
    "Diseñamos y construimos sitios, paneles y apps para negocios reales en Nuevo Laredo y la zona frontera.",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "528671793155",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://atrixnld.com",
} as const;

export function whatsappUrl(message?: string) {
  const text = encodeURIComponent(
    message ??
      "Hola ATRIX, me interesa platicar sobre un proyecto para mi negocio.",
  );
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}
