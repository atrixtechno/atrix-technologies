import { site } from "@/content/site";

export const recommendationsPage = {
  eyebrow: "Recomendaciones",
  title: "Lo que dicen de ATRIX",
  lead:
    "Opiniones reales de clientes en nuestra página de Facebook. Atención, velocidad y resultados que se notan.",
  facebookLabel: "Ver en Facebook",
  facebookUrl: site.facebookReviews,
  summary: {
    scoreLabel: "100% recomiendan",
    reviewCount: 9,
    source: "Facebook · ATRIX",
  },
} as const;

export type Recommendation = {
  name: string;
  excerpt: string;
  source: "Facebook";
  recommends: boolean;
};

/**
 * Reseñas públicas de https://www.facebook.com/atrixnld/reviews
 * Agrega aquí cada nueva recomendación (nombre + texto completo).
 */
export const recommendations: Recommendation[] = [
  {
    name: "Jonathan Ruiz",
    recommends: true,
    source: "Facebook",
    excerpt:
      "Muy buen servicio. 100% Recomendado, si quieres una página web para tu negocio o emprendimiento sin duda es una excelente opción. Excelente atención, tiempo de respuesta rápida, muy accesible, trabajos súper rápidos y muy bien elaborados.",
  },
];
