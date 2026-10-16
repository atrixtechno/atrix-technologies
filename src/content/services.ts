export type Service = {
  slug: string;
  title: string;
  short: string;
  copy: string;
  bullets: string[];
  icon: "pc" | "printer" | "cctv" | "network" | "code" | "video" | "gear";
  image: string;
  imageAlt: string;
  /** Canal del muro de monitores. */
  channel: string;
  /** Etiqueta corta para el OSD del monitor. */
  osd: string;
  /** true cuando la imagen es una foto real (no render 3D). */
  photo?: boolean;
};

export const services: Service[] = [
  {
    slug: "soporte-tecnico",
    title: "Soporte técnico",
    short: "Computadoras, laptops y dispositivos",
    copy: "Diagnóstico, reparación y mantenimiento para que tu equipo vuelva a trabajar sin demoras.",
    bullets: [
      "PCs, laptops y dispositivos",
      "Limpieza, formato y optimización",
      "Soporte a domicilio o remoto",
    ],
    icon: "pc",
    image: "/images/renders/soporte.webp",
    imageAlt: "Render 3D de una PC abierta con herramientas de precisión y laptop",
    channel: "CH-01",
    osd: "SOPORTE",
  },
  {
    slug: "impresoras-perifericos",
    title: "Impresoras y periféricos",
    short: "Instalación, configuración y soporte",
    copy: "Dejamos listas impresoras, escáneres y periféricos para oficina o casa, sin dolores de cabeza.",
    bullets: [
      "Instalación y drivers",
      "Red / WiFi / USB",
      "Mantenimiento y revisión",
    ],
    icon: "printer",
    image: "/images/renders/impresoras.webp",
    imageAlt: "Render 3D de una impresora multifuncional con teclado y mouse",
    channel: "CH-02",
    osd: "PERIFÉRICOS",
  },
  {
    slug: "cctv",
    title: "Cámaras de seguridad (CCTV)",
    short: "Instalación, monitoreo y mantenimiento",
    copy: "Protege tu hogar o negocio con sistemas de videovigilancia claros, estables y bien instalados.",
    bullets: [
      "Diseño e instalación",
      "Acceso remoto desde el celular",
      "Mantenimiento y ampliación",
    ],
    icon: "cctv",
    image: "/images/renders/cctv.webp",
    imageAlt: "Render 3D de cámaras de seguridad domo y bala",
    channel: "CH-03",
    osd: "CCTV",
  },
  {
    slug: "redes-infraestructura",
    title: "Redes e infraestructura",
    short: "Cableado, WiFi, configuración y más",
    copy: "Internet estable, cobertura real y una red ordenada para trabajar o producir sin caídas constantes.",
    bullets: [
      "Cableado estructurado",
      "WiFi empresarial / hogar",
      "Routers, switches y acceso",
    ],
    icon: "network",
    image: "/images/renders/redes.webp",
    imageAlt: "Render 3D de un switch de red con cables y punto de acceso WiFi",
    channel: "CH-04",
    osd: "REDES",
  },
  {
    slug: "desarrollo-software",
    title: "Plataformas digitales",
    short: "Sistemas integrados y presencia web",
    copy: "Sitios, paneles, apps e integraciones operativas: plataformas completas pensadas para captar, administrar y hacer crecer tu negocio.",
    bullets: [
      "Presencia web y SEO local",
      "Paneles, portales e intranets",
      "Sistemas a la medida en producción",
    ],
    icon: "code",
    image: "/images/renders/software.webp",
    imageAlt: "Render 3D de laptop y celular con un panel de control",
    channel: "CH-05",
    osd: "PLATAFORMAS",
  },
  {
    slug: "edicion-videos",
    title: "Edición de videos",
    short: "Reels, video promocional y contenido para redes",
    copy: "Videos verticales para Instagram, Facebook y TikTok: guion, animación, voz, música y subtítulos para presentar tu negocio, tu producto o tu sistema.",
    bullets: [
      "Reels y videos para redes",
      "Guion, voz y subtítulos",
      "Animación de pantallas y productos",
    ],
    icon: "video",
    image: "/images/renders/video.webp",
    imageAlt: "Tres reels verticales editados por ATRIX sobre un escenario azul",
    channel: "CH-06",
    osd: "VIDEO",
  },
  {
    slug: "soporte-it-empresarial",
    title: "Soporte IT empresarial",
    short: "Tu departamento de sistemas",
    copy: "ATRIX como tu departamento de TI remoto: menos fallas, más productividad y tecnología bajo control, sin personal de planta.",
    bullets: [
      "Mantenimiento preventivo",
      "Respaldos y seguridad básica",
      "Optimización de equipos",
    ],
    icon: "gear",
    image: "/images/services/it-empresarial.jpg",
    imageAlt: "Rack de servidores e infraestructura IT empresarial",
    channel: "CH-07",
    osd: "IT EMPRESARIAL",
    photo: true,
  },
];

export const pillars = [
  {
    title: "Tecnología confiable",
    copy: "Soluciones seguras y de calidad para el día a día.",
  },
  {
    title: "Rendimiento que impulsa",
    copy: "Optimizamos tu productividad con sistemas que sí funcionan.",
  },
  {
    title: "Compromiso real",
    copy: "Atención personalizada y soporte continuo en la frontera.",
  },
];

export const values = [
  "Confianza",
  "Innovación",
  "Rendimiento",
  "Compromiso",
];

export const promises = [
  {
    title: "Servicio en Nuevo Laredo y Laredo, TX",
    copy: "Cobertura fronteriza para hogares y empresas.",
  },
  {
    title: "Soporte técnico rápido y efectivo",
    copy: "Diagnóstico claro y solución sin rodeos.",
  },
  {
    title: "Atención personalizada",
    copy: "Te explicamos en español sencillo qué necesitas y por qué.",
  },
];

export const benefits = [
  {
    title: "Todo en un solo equipo",
    copy: "Desde una laptop hasta CCTV, redes o tu sistema web: no tienes que lidiar con cinco proveedores distintos.",
  },
  {
    title: "Enfoque práctico de frontera",
    copy: "Entendemos hogares y negocios de Nuevo Laredo / Laredo: urgencia, presupuesto y operación real.",
  },
  {
    title: "Tecnología que se entiende",
    copy: "Sin tecnicismos innecesarios. Te dejamos funcionando y sabiendo cómo usarlo.",
  },
  {
    title: "Respuesta directa por WhatsApp",
    copy: "Cotiza, agenda visita o pide soporte al 867 729 0445. Comunicación clara, sin burocracia.",
  },
];
