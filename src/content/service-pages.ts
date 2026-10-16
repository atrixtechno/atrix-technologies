import { businessGuide, homeGuide } from "@/content/guides";

/**
 * Páginas por servicio (/servicios/[slug]): a donde llevan los anuncios de Meta. Complementan
 * src/content/services.ts con textos que ya existen en el sitio (guías de hogar y empresa).
 * Sin precios, cifras ni promesas nuevas.
 */
export type ServicePageExtra = {
  title: string;
  whatsappMessage: string;
  /** Para quién (sale de las guías de hogares y empresas). */
  audiences: { label: string; title: string; copy: string }[];
  faq: { q: string; a: string }[];
  /** Muestras de trabajo (videos verticales en /public/video/reels). */
  samples?: { title: string; video: string; poster: string }[];
};

const quoteFaq = {
  q: "¿Cómo cotizo?",
  a: "Escríbenos por WhatsApp al 867 729 0445 o llena el formulario de esta página. Un ingeniero te responde sin compromiso.",
};

const coverageFaq = {
  q: "¿Dónde dan servicio?",
  a: "En Nuevo Laredo, Tamaulipas, y Laredo, Texas, para hogares y empresas.",
};

const home = (index: number) => ({ label: "Hogares", ...homeGuide.items[index] });
const business = (index: number) => ({ label: "Empresas", ...businessGuide.items[index] });

export const servicePages: Record<string, ServicePageExtra> = {
  "soporte-tecnico": {
    title: "Soporte técnico para computadoras y laptops",
    whatsappMessage: "Hola ATRIX, necesito soporte técnico para mi equipo.",
    audiences: [home(2), business(0)],
    faq: [
      { q: "¿Van a domicilio o es remoto?", a: "Las dos cosas: soporte a domicilio o remoto, según lo que necesite tu equipo." },
      coverageFaq,
      quoteFaq,
    ],
  },
  "impresoras-perifericos": {
    title: "Impresoras y periféricos listos para trabajar",
    whatsappMessage: "Hola ATRIX, necesito ayuda con una impresora o periférico.",
    audiences: [home(3), business(0)],
    faq: [
      { q: "¿Configuran impresoras en red?", a: "Sí: instalación y drivers por red, WiFi o USB, más mantenimiento y revisión." },
      coverageFaq,
      quoteFaq,
    ],
  },
  cctv: {
    title: "Cámaras de seguridad con vista en tu celular",
    whatsappMessage: "Hola ATRIX, me interesa cotizar cámaras de seguridad (CCTV).",
    audiences: [home(1), business(2)],
    faq: [
      { q: "¿Puedo ver las cámaras desde mi celular?", a: "Sí: dejamos configurado el acceso remoto desde el celular como parte de la instalación." },
      { q: "¿Pueden ampliar un sistema que ya tengo?", a: "Sí: damos mantenimiento y ampliamos sistemas de videovigilancia existentes." },
      coverageFaq,
      quoteFaq,
    ],
  },
  "redes-infraestructura": {
    title: "Wi-Fi y red estables para tu casa o negocio",
    whatsappMessage: "Hola ATRIX, quiero mejorar el WiFi / la red de mi negocio.",
    audiences: [home(0), business(1)],
    faq: [
      { q: "¿Qué incluye el servicio de redes?", a: "Cableado estructurado, WiFi para empresa u hogar y configuración de routers, switches y puntos de acceso." },
      coverageFaq,
      quoteFaq,
    ],
  },
  "desarrollo-software": {
    title: "Sitios, apps y sistemas a la medida",
    whatsappMessage: "Hola ATRIX, me interesa un sitio web, app o sistema para mi negocio.",
    audiences: [business(3), { label: "Negocios", title: "Presencia y operación en un solo sistema", copy: "Sitios que captan clientes y paneles que ordenan citas, ventas e inventario." }],
    faq: [
      { q: "¿Tienen proyectos en producción?", a: "Sí. Puedes ver los casos reales, en línea hoy, en la sección de proyectos." },
      coverageFaq,
      quoteFaq,
    ],
  },
  "edicion-videos": {
    title: "Videos que explican tu negocio en segundos",
    whatsappMessage: "Hola ATRIX, me interesa la edición de videos para mi negocio.",
    audiences: [
      { label: "Negocios", title: "Presenta tu producto o servicio", copy: "Reels con guion, voz y subtítulos para mostrar qué haces y por qué elegirte." },
      { label: "Sistemas y apps", title: "Enseña cómo funciona", copy: "Animamos las pantallas reales de tu sitio, app o sistema paso a paso." },
    ],
    faq: [
      { q: "¿En qué formatos entregan?", a: "Videos verticales para Reels, historias y TikTok; también formatos para Facebook y YouTube si los necesitas." },
      { q: "¿Incluye el guion?", a: "Sí: escribimos el guion, la voz y los subtítulos contigo antes de editar." },
      quoteFaq,
    ],
    samples: [
      { title: "Tutorial de una app: CV en 5 pasos", video: "/video/reels/boombeejobs-cv.mp4", poster: "/video/reels/boombeejobs-cv.jpg" },
      { title: "Presentación de un sistema para casas de cambio", video: "/video/reels/moneychange-libreta.mp4", poster: "/video/reels/moneychange-libreta.jpg" },
      { title: "Contenido educativo: ¿mito o realidad?", video: "/video/reels/boombeejobs-mito.mp4", poster: "/video/reels/boombeejobs-mito.jpg" },
    ],
  },
  "soporte-it-empresarial": {
    title: "Tu departamento de sistemas, sin personal de planta",
    whatsappMessage: "Hola ATRIX, me interesa el soporte IT empresarial para mi empresa.",
    audiences: [business(0), business(1)],
    faq: [
      { q: "¿Trabajan con Windows y macOS?", a: "Sí, damos soporte a equipos con Windows y macOS." },
      { q: "¿El plan es igual para todas las empresas?", a: "No: se adapta a la cantidad de equipos, programas, frecuencia de soporte y requerimientos de cada negocio." },
      quoteFaq,
    ],
  },
};
