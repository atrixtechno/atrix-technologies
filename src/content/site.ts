export const site = {
  name: "ATRIX",
  legalName: "ATRIX Technologies",
  city: "Nuevo Laredo, Tamaulipas",
  coverage: "Nuevo Laredo y Laredo, TX",
  tagline: "Soluciones tecnológicas para hogares y empresas",
  motto: "Tecnología · Innovación · Rendimiento",
  description:
    "ATRIX Technologies ofrece soporte técnico, CCTV, redes, impresoras, desarrollo de software y soporte IT empresarial en Nuevo Laredo y Laredo, TX. Tecnología confiable, atención personalizada.",
  phoneDisplay: "867 179 3155",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "528671793155",
  email: "atrix.techno@gmail.com",
  facebook: "https://www.facebook.com/atrixnld",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://atrixnld.com",
} as const;

export function whatsappUrl(message?: string) {
  const text = encodeURIComponent(
    message ??
      "Hola ATRIX Technologies, me interesa cotizar un servicio.",
  );
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}
