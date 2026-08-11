import { site } from "@/content/site";

export const recommendationsPage = {
  eyebrow: "Recomendaciones",
  title: "Personas que confían en nosotros",
  lead:
    "Opiniones reales de clientes en nuestra página de Facebook. Atención, velocidad y resultados que se notan.",
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
  source: "Facebook";
  recommends: boolean;
};

/** Reseñas públicas de Facebook · ATRIX (atrixnld). */
export const recommendations: Recommendation[] = [
  {
    name: "Jonathan Ruiz",
    recommends: true,
    source: "Facebook",
    excerpt:
      "Muy buen servicio. 100% Recomendado, si quieres una página web para tu negocio o emprendimiento sin duda es una excelente opción. Excelente atención, tiempo de respuesta rápida, muy accesible, trabajos súper rápidos y muy bien elaborados.",
  },
  {
    name: "Lisseth Mancilla",
    recommends: true,
    source: "Facebook",
    excerpt:
      "Excelente servicio, atención y calidad 10000/10. Sin duda es una gran opción para trabajos de calidad profesional.",
  },
  {
    name: "César De León",
    recommends: true,
    source: "Facebook",
    excerpt:
      "Súper recomendados siempre con buena actitud, entregan en tiempo y toman en cuenta todos los detalles. 10/10.",
  },
  {
    name: "Janett Rebro",
    recommends: true,
    source: "Facebook",
    excerpt:
      "Muy recomendado. Siempre responden rápido, te atienden muy bien y buscan la mejor solución. Se mira su profesionalismo y calidad. ATRIX es una excelente opción para un servicio de alta calidad.",
  },
  {
    name: "Diego Olivares",
    recommends: true,
    source: "Facebook",
    excerpt: "Excelente servicio, muy atentos. 10/10.",
  },
  {
    name: "Fátima Moreno",
    recommends: true,
    source: "Facebook",
    excerpt: "Excelente atención al cliente.",
  },
  {
    name: "ALe Ruiz",
    recommends: true,
    source: "Facebook",
    excerpt: "Muy buena atención y respuesta inmediata.",
  },
  {
    name: "Carla Zuñiga",
    recommends: true,
    source: "Facebook",
    excerpt:
      "Muy buen servicio. Me atendió muy bien, aclaró todas mis dudas y respondió rápido. Sin duda alguna los recomiendo.",
  },
  {
    name: "Citlali Díaz",
    recommends: true,
    source: "Facebook",
    excerpt:
      "Me encanta su trabajo, la verdad es muy atento con los clientes. Me gustó mucho tanto el servicio como el trabajo.",
  },
];
