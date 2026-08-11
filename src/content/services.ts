export type Service = {
  slug: string;
  title: string;
  short: string;
  copy: string;
  bullets: string[];
  icon: "pc" | "printer" | "cctv" | "network" | "code" | "gear";
  image: string;
  imageAlt: string;
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
    image: "/images/services/soporte-tecnico.jpg",
    imageAlt: "Estación de trabajo con laptop y herramientas de soporte técnico",
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
    image: "/images/services/impresoras.jpg",
    imageAlt: "Impresora multifunción y periféricos de oficina",
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
    image: "/images/services/cctv.jpg",
    imageAlt: "Cámaras de seguridad CCTV con iluminación técnica",
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
    image: "/images/services/redes.jpg",
    imageAlt: "Infraestructura de red, switches y cableado estructurado",
  },
  {
    slug: "desarrollo-software",
    title: "Desarrollo de software",
    short: "Sistemas a la medida y soluciones web",
    copy: "Sitios, paneles, apps y plataformas pensadas para tu operación: captación, administración y crecimiento.",
    bullets: [
      "Sitios web y SEO local",
      "Paneles y portales",
      "Software a la medida",
    ],
    icon: "code",
    image: "/images/services/software.jpg",
    imageAlt: "Entorno de desarrollo de software con monitores",
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
    copy: "Cotiza, agenda visita o pide soporte al 867 179 3155. Comunicación clara, sin burocracia.",
  },
];
