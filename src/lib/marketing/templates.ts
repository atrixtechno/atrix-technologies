import { conferenceTalks, conferenciasPage } from "@/content/conferencias";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { soporteRemotoPage } from "@/content/soporte-remoto";
import { dailyTips } from "@/content/tips";
import { unetePage } from "@/content/unete";
import type { SocialTheme } from "./types";

// Plantillas de las publicaciones propias de ATRIX (Admin → Marketing en redes). Todo sale del
// contenido que ya existe en src/content: servicios, consejos, proyectos publicados, soporte remoto,
// conferencias y convocatoria. Sin datos inventados (cifras, testimonios ni precios).
// Seguro para el navegador (el compositor lista los temas).

export const CONTACT_PHONE = `+52 ${site.phoneDisplay}`;
export const SITE_HOST = "atrixnld.com";

export type ThemeInfo = {
  label: string;
  kicker: string;
  headline: string;
  subline: string;
  chips: string[];
  cta: string;
  /** Para quién escribe la IA. */
  audience: string;
};

export const SOCIAL_THEMES: Record<SocialTheme, ThemeInfo> = {
  servicio: {
    label: "Servicio de la semana",
    kicker: "SERVICIO",
    headline: services[0].title,
    subline: services[0].copy,
    chips: services[0].bullets.slice(0, 3),
    cta: `Cotiza gratis en ${SITE_HOST}`,
    audience: "hogares y negocios de Nuevo Laredo y Laredo, TX",
  },
  consejo: {
    label: "Consejo técnico",
    kicker: "CONSEJO ATRIX",
    headline: dailyTips[0].title,
    subline: dailyTips[0].copy,
    chips: ["Nuevo Laredo", "Laredo, TX"],
    cta: `Más consejos en ${SITE_HOST}`,
    audience: "hogares y negocios que quieren cuidar su tecnología",
  },
  proyecto: {
    label: "Proyecto / caso real",
    kicker: "CASO REAL",
    headline: projects[0].name,
    subline: projects[0].summary,
    chips: [projects[0].sector.split("·")[0].trim()],
    cta: `Mira el caso en ${SITE_HOST}/proyectos`,
    audience: "negocios que necesitan un sitio web, app o sistema",
  },
  soporte: {
    label: "Soporte remoto",
    kicker: "SOPORTE REMOTO",
    headline: soporteRemotoPage.headline,
    subline: soporteRemotoPage.lead,
    chips: ["Windows y macOS", "Atención prioritaria", "Plan a la medida"],
    cta: `Conoce el plan en ${SITE_HOST}/soporte-remoto`,
    audience: "oficinas, despachos y empresas sin personal de TI",
  },
  conferencias: {
    label: "Conferencias",
    kicker: "CONFERENCIAS",
    headline: conferenceTalks[0].title,
    subline: conferenciasPage.lead,
    chips: ["Empresas", "Escuelas", "Negocios"],
    cta: `Agenda en ${SITE_HOST}/conferencias`,
    audience: "empresas, escuelas y negocios que quieren entender la IA",
  },
  unete: {
    label: "Únete al equipo",
    kicker: "ÚNETE A ATRIX",
    headline: unetePage.title,
    subline: unetePage.lead,
    chips: ["Soporte", "CCTV", "Redes", "Software"],
    cta: `Postúlate en ${SITE_HOST}/quieres-ser-parte`,
    audience: "técnicos y profesionales de tecnología de la región",
  },
  cotiza: {
    label: "Cotiza por WhatsApp",
    kicker: "COTIZA GRATIS",
    headline: "Tecnología que opera y vende por tu negocio",
    subline: "Soporte, cámaras, redes y plataformas digitales en Nuevo Laredo y Laredo, TX.",
    chips: ["Hogares", "Empresas", "Respuesta rápida"],
    cta: `WhatsApp ${CONTACT_PHONE}`,
    audience: "hogares y negocios de Nuevo Laredo y Laredo, TX",
  },
};

/** Rotación del plan semanal: días seguidos nunca repiten tema. */
export const THEME_ORDER: SocialTheme[] = ["servicio", "consejo", "proyecto", "cotiza", "soporte", "consejo", "conferencias"];

export const HASHTAGS: Record<string, string> = {
  todos: "#NuevoLaredo #Laredo #Tamaulipas #ATRIX #Tecnologia",
  servicio: "#NuevoLaredo #Laredo #SoporteTecnico #CCTV #Tamaulipas",
  consejo: "#NuevoLaredo #Laredo #SoporteTecnico #Tamaulipas #TipsTech",
  proyecto: "#NuevoLaredo #Laredo #DesarrolloWeb #Software #Tamaulipas",
  soporte: "#NuevoLaredo #SoporteTecnico #SoporteRemoto #Empresas #Tamaulipas",
  conferencias: "#NuevoLaredo #Laredo #InteligenciaArtificial #Conferencias #Tamaulipas",
  unete: "#NuevoLaredo #Empleo #Tecnologia #Tamaulipas #ATRIX",
  cotiza: "#NuevoLaredo #Laredo #CCTV #SoporteTecnico #Tamaulipas",
};

const WEEK = 7 * 86_400_000;
const pick = <T>(list: readonly T[], index: number) => list[((index % list.length) + list.length) % list.length];

/** Palabras del tema para una fecha: el servicio y el proyecto rotan por semana, el consejo por día. */
export function themeContent(theme: SocialTheme, date = new Date()) {
  const day = Math.floor(date.getTime() / 86_400_000);
  const week = Math.floor(date.getTime() / WEEK);
  const base = SOCIAL_THEMES[theme];
  switch (theme) {
    case "servicio": {
      const s = pick(services, week);
      return { headline: s.title, subline: s.copy, chips: s.bullets.slice(0, 3) };
    }
    case "consejo": {
      const tip = pick(dailyTips, day);
      return { headline: tip.title, subline: tip.copy, chips: base.chips };
    }
    case "proyecto": {
      const p = pick(projects, week);
      return { headline: p.name, subline: p.summary, chips: [p.sector.split("·")[0].trim()].filter(Boolean) };
    }
    case "conferencias": {
      const talk = pick(conferenceTalks, week);
      return { headline: talk.title, subline: talk.focus, chips: base.chips };
    }
    default:
      return { headline: base.headline, subline: base.subline, chips: base.chips };
  }
}

/** Render o captura de /public que acompaña a cada tema en la imagen. */
export function themeVisual(theme: SocialTheme | "propia", headline: string): string | null {
  switch (theme) {
    case "servicio":
      return services.find((s) => s.title === headline)?.image ?? "/images/renders/software.webp";
    case "proyecto":
      return projects.find((p) => p.name === headline)?.previewImage ?? "/images/renders/software.webp";
    case "consejo":
    case "soporte":
      return "/images/renders/soporte.webp";
    case "cotiza":
    case "conferencias":
      return "/images/renders/software.webp";
    case "unete":
      return "/brand/atrix-identidad.png";
    default:
      return null;
  }
}

/** Otras palabras para "Rediseñar" cuando la IA está apagada. */
export const ALT_WORDS: Record<SocialTheme, { headline: string; subline: string }[]> = {
  servicio: [
    { headline: "Tecnología bien instalada, sin dolores de cabeza", subline: "Soporte, CCTV, redes y plataformas digitales para hogares y negocios." },
    { headline: "Un solo equipo para tu tecnología", subline: "Diagnóstico claro, instalación profesional y seguimiento en Nuevo Laredo." },
  ],
  consejo: [
    { headline: "Prevenir cuesta menos que reparar", subline: "Mantenimiento, respaldos y una red ordenada evitan que tu negocio se detenga." },
    { headline: "Tu tecnología también necesita revisión", subline: "Equipos, WiFi y cámaras: revísalos antes de que fallen en el peor momento." },
  ],
  proyecto: [
    { headline: "Plataformas que hoy operan negocios reales", subline: "Sitios, paneles y sistemas en producción hechos por ATRIX." },
    { headline: "Tu negocio también puede vender en línea", subline: "Diseño, SEO local y sistemas a la medida, de la idea a producción." },
  ],
  soporte: [
    { headline: "Tu área de TI, sin contratar un equipo completo", subline: "Mantenimiento, seguridad y atención prioritaria a distancia." },
    { headline: "Menos fallas, más productividad", subline: "Soporte técnico remoto con un plan adaptado a tu empresa." },
  ],
  conferencias: [
    { headline: "IA con criterio técnico, no con moda", subline: "Pláticas para empresas, escuelas y negocios de la frontera." },
    { headline: "Lleva una plática de tecnología a tu equipo", subline: "Presencial o virtual, adaptada a tu sector." },
  ],
  unete: [
    { headline: "Buscamos talento técnico", subline: "Soporte, CCTV, redes y software en Nuevo Laredo y Laredo, TX." },
    { headline: "Crece con un equipo que va en serio", subline: "Identidad, profesionalismo y proyectos reales." },
  ],
  cotiza: [
    { headline: "¿Tu tecnología te está frenando?", subline: "Escríbenos por WhatsApp y te decimos cómo resolverlo." },
    { headline: "Cotiza sin compromiso", subline: "Soporte, cámaras, redes y sitios web en Nuevo Laredo y Laredo, TX." },
  ],
};

export function alternateWords(theme: SocialTheme, current: string) {
  const options = [{ headline: SOCIAL_THEMES[theme].headline, subline: SOCIAL_THEMES[theme].subline }, ...ALT_WORDS[theme]];
  const index = options.findIndex((row) => row.headline === current);
  const next = options[(index + 1) % options.length];
  return { headline: next.headline, subline: next.subline };
}

/** Texto de la publicación cuando la IA no está disponible. */
export function fallbackCaption(theme: SocialTheme | "propia", headline: string, subline: string) {
  const info = theme === "propia" ? null : SOCIAL_THEMES[theme];
  const lines = [
    headline.trim(),
    subline.trim(),
    "",
    info ? `👉 ${info.cta}` : `👉 Cotiza en ${SITE_HOST}`,
    `WhatsApp: ${CONTACT_PHONE}`,
    "",
    HASHTAGS[theme === "propia" ? "todos" : theme] ?? HASHTAGS.todos,
  ];
  return lines.filter((line, i, all) => line || (all[i - 1] ?? "") !== "").join("\n").trim();
}
