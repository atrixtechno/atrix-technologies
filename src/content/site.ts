export const site = {
  name: "ATRIX",
  legalName: "ATRIX Technologies",
  city: "Nuevo Laredo, Tamaulipas",
  coverage: "Nuevo Laredo y Laredo, TX",
  tagline: "Tecnología que opera y vende por tu negocio",
  motto: "Tecnología · Innovación · Rendimiento",
  description:
    "ATRIX Technologies ofrece soporte técnico, CCTV, redes, impresoras, plataformas digitales y soporte IT empresarial en Nuevo Laredo y Laredo, TX. Diseño premium e ingeniería real para hogares y empresas.",
  phoneDisplay: "867 729 0445",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "528677290445",
  email: "atrix.techno@gmail.com",
  facebook: "https://www.facebook.com/atrixnld",
  facebookReviews:
    "https://www.facebook.com/atrixnld/reviews/?id=61590549456658&sk=reviews",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://atrixnld.com",
} as const;

export function whatsappUrl(message?: string) {
  const text = encodeURIComponent(
    message ??
      "Hola ATRIX Technologies, me interesa cotizar un servicio.",
  );
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}
