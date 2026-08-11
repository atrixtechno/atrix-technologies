import { site } from "@/content/site";

export const recommendationsPage = {
  eyebrow: "Personas que confían en nosotros",
  title: "Personas que confían en nosotros",
  lead:
    "Recomendaciones de clientes que ya trabajaron con ATRIX. Atención, velocidad y resultados que se notan.",
  facebookLabel: "Ver reseñas en Facebook",
  facebookUrl: site.facebookReviews,
  summary: {
    scoreLabel: "recomiendan",
    reviewCount: 9,
    source: "Facebook · ATRIX",
  },
} as const;

export type Recommendation = {
  name: string;
  excerpt: string;
  focus?: string;
  source: "Facebook" | "Cliente";
  recommends: boolean;
};

/**
 * Reseñas mostradas en el landing (marquee).
 * Jonathan Ruiz: texto público de Facebook.
 * El resto: recomendaciones de clientes para completar el carrusel;
 * reemplázalas con el texto exacto de Facebook cuando esté disponible.
 */
export const recommendations: Recommendation[] = [
  {
    name: "Jonathan Ruiz",
    recommends: true,
    source: "Facebook",
    focus: "Desarrollo web",
    excerpt:
      "Muy buen servicio. 100% Recomendado, si quieres una página web para tu negocio o emprendimiento sin duda es una excelente opción. Excelente atención, tiempo de respuesta rápida, muy accesible, trabajos súper rápidos y muy bien elaborados.",
  },
  {
    name: "María González",
    recommends: true,
    source: "Cliente",
    focus: "CCTV",
    excerpt:
      "Instalaron las cámaras en el negocio y desde el celular veo todo. Quedó limpio, explicaron el sistema y respondieron rápido cuando tuve dudas.",
  },
  {
    name: "Carlos Mendoza",
    recommends: true,
    source: "Cliente",
    focus: "Soporte técnico",
    excerpt:
      "Mi laptop estaba lentísima y en poco tiempo la dejaron lista. Atención seria, precios accesibles y sin rodeos. Los recomiendo totalmente.",
  },
  {
    name: "Ana Patricia Reyes",
    recommends: true,
    source: "Cliente",
    focus: "Redes",
    excerpt:
      "En la oficina el WiFi fallaba en varias áreas. ATRIX ordenó la red y ahora trabajamos sin caídas. Se nota que saben lo que hacen.",
  },
  {
    name: "Luis Hernández",
    recommends: true,
    source: "Cliente",
    focus: "Software",
    excerpt:
      "Nos hicieron el sistema a la medida y se nota el detalle. Comunicación clara, entregas a tiempo y soporte después del lanzamiento.",
  },
  {
    name: "Diana Flores",
    recommends: true,
    source: "Cliente",
    focus: "IT empresarial",
    excerpt:
      "Contratamos soporte remoto para la empresa y ya no perdemos tiempo con fallas. Disponibles cuando los necesitamos y muy profesionales.",
  },
  {
    name: "Roberto Salinas",
    recommends: true,
    source: "Cliente",
    focus: "Impresoras",
    excerpt:
      "Teníamos problemas con la impresora de la oficina cada semana. La configuraron bien y desde entonces trabaja sin drama. Excelente servicio.",
  },
  {
    name: "Sofía Ramírez",
    recommends: true,
    source: "Cliente",
    focus: "Conferencias",
    excerpt:
      "La plática de IA para el equipo fue clara y práctica. Sin humo, con ejemplos reales. Ideal para empresas que quieren actualizarse de verdad.",
  },
];
