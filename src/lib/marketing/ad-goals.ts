// Para qué es una campaña pagada (Admin → Campañas → "¿Qué quieres lograr?"). Seguro para el
// navegador: el formulario muestra estos objetivos como tarjetas y el panel agrupa por `group`.
// Cómo se arma cada objetivo en Meta vive en meta-ads.ts (goalSettings).

export type AdGoal = "clics" | "cotizaciones" | "whatsapp" | "seguidores_fb" | "perfil_ig" | "interaccion" | "alcance";

export type AdGoalGroup = "clientes" | "seguidores" | "publicaciones" | "alcance";

export const AD_GOAL_GROUPS: Record<AdGoalGroup, string> = {
  clientes: "Clientes",
  seguidores: "Seguidores",
  publicaciones: "Publicaciones",
  alcance: "Alcance",
};

export type AdGoalInfo = {
  label: string;
  hint: string;
  group: AdGoalGroup;
  /** Nombre del número principal en la tarjeta de la campaña. */
  result: string;
  /** Dibuja un flyer de marca (la publicación promocionada usa su propia imagen). */
  flyer: boolean;
  /** Texto del botón del flyer. */
  cta: string;
  /** Requisito para usarlo (se explica en el formulario). */
  needs?: "pixel" | "whatsapp" | "instagram" | "post";
};

export const AD_GOALS: Record<AdGoal, AdGoalInfo> = {
  clics: {
    label: "Más visitas a la página del servicio",
    hint: "Meta busca a quien hace clic. Lleva a la página del servicio con su botón de cotizar. Recomendado al empezar.",
    group: "clientes",
    result: "Clics al sitio",
    flyer: true,
    cta: "Cotiza gratis en atrixnld.com",
  },
  cotizaciones: {
    label: "Más cotizaciones (usa el Pixel de Meta)",
    hint: "Meta busca a quien envía el formulario o toca WhatsApp. Funciona mejor con unas 50 cotizaciones por semana.",
    group: "clientes",
    result: "Cotizaciones",
    flyer: true,
    cta: "Cotiza gratis en atrixnld.com",
    needs: "pixel",
  },
  whatsapp: {
    label: "Más mensajes por WhatsApp",
    hint: "El anuncio abre un chat de WhatsApp con ATRIX. Requiere el WhatsApp Business vinculado a la página de Facebook.",
    group: "clientes",
    result: "Conversaciones",
    flyer: true,
    cta: "Escríbenos por WhatsApp",
    needs: "whatsapp",
  },
  seguidores_fb: {
    label: "Más seguidores en Facebook",
    hint: "Muestra el anuncio con el botón «Me gusta» de la página de ATRIX. Solo en Facebook.",
    group: "seguidores",
    result: "Nuevos seguidores",
    flyer: true,
    cta: "Síguenos en Facebook: ATRIX",
  },
  perfil_ig: {
    label: "Más seguidores en Instagram",
    hint: "Lleva a la gente al perfil de Instagram de ATRIX para que te siga. Solo en Instagram.",
    group: "seguidores",
    result: "Visitas al perfil",
    flyer: true,
    cta: "Síguenos en Instagram",
    needs: "instagram",
  },
  interaccion: {
    label: "Promocionar una publicación",
    hint: "Más «me gusta», comentarios y compartidos en una publicación que ya está en tu página de Facebook.",
    group: "publicaciones",
    result: "Interacciones",
    flyer: false,
    cta: "",
    needs: "post",
  },
  alcance: {
    label: "Que más personas conozcan ATRIX",
    hint: "Meta muestra el anuncio al mayor número de personas posible. Ideal para darte a conocer en una ciudad.",
    group: "alcance",
    result: "Personas alcanzadas",
    flyer: true,
    cta: "Conócenos en atrixnld.com",
  },
};

export const AD_GOAL_ORDER: AdGoal[] = ["clics", "cotizaciones", "whatsapp", "seguidores_fb", "perfil_ig", "interaccion", "alcance"];

export function adGoal(value: unknown): AdGoal {
  return typeof value === "string" && Object.hasOwn(AD_GOALS, value) ? (value as AdGoal) : "clics";
}

/** Objetivos cuyo anuncio lleva a atrixnld.com (y por eso tienen embudo de visitas y cotizaciones). */
export function goalUsesSite(goal: AdGoal) {
  return goal === "clics" || goal === "cotizaciones" || goal === "alcance";
}

export function isFollowerGoal(goal?: AdGoal | null) {
  return goal === "seguidores_fb" || goal === "perfil_ig";
}
