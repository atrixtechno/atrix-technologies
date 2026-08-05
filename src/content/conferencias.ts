import { services } from "@/content/services";
import { site } from "@/content/site";

export type ConferenceAudience = {
  id: string;
  label: string;
  title: string;
  copy: string;
};

export type ConferenceBenefit = {
  title: string;
  copy: string;
};

export type ConferenceTalk = {
  slug: string;
  title: string;
  focus: string;
  audience: string;
  outcomes: string[];
  format: string;
  duration: string;
  relatedServices: string[];
};

export type ConferenceServiceLink = {
  slug: string;
  title: string;
  short: string;
  talkAngle: string;
};

export type ConferenceTeamMember = {
  name: string;
  role: string;
  badges: string[];
  copy: string[];
  isSpeaker?: boolean;
};

export type ConferenceSpeakerVisual = {
  src: string;
  alt: string;
  caption?: string;
};

export type ConferenceSpeakerStat = {
  value: string;
  label: string;
};

export type ConferenceSpeaker = {
  name: string;
  role: string;
  badges: string[];
  themes: string[];
  stats: ConferenceSpeakerStat[];
  copy: string[];
  visuals: ConferenceSpeakerVisual[];
  whatsappMessage: string;
};

export const conferenciasPage = {
  eyebrow: "Conferencias · ATRIX",
  title: "Conferencias y charlas de inteligencia artificial para quien decide",
  lead:
    "Sesiones claras, sin humo: IA aplicada, ciberseguridad y transformación digital para empresas, escuelas y negocios de Nuevo Laredo y Laredo, TX.",
  whatsappMessage:
    "Hola ATRIX, me interesa agendar una conferencia o charla de inteligencia artificial.",
} as const;

export const conferenceAudiences: ConferenceAudience[] = [
  {
    id: "empresas",
    label: "Empresas",
    title: "Equipos que necesitan claridad, no moda",
    copy: "Directivos, gerencias y áreas de operación: cómo usar IA y tecnología con criterios de seguridad, costo y productividad real en la frontera.",
  },
  {
    id: "escuelas",
    label: "Escuelas",
    title: "Comunidades educativas listas para el cambio",
    copy: "Docentes, coordinadores y directivos: alfabetización en IA, usos responsables en el aula y criterios para proteger datos de alumnos y planteles.",
  },
  {
    id: "negocios",
    label: "Negocios",
    title: "PyMEs y comercios que quieren operar mejor",
    copy: "Dueños y equipos pequeños: herramientas prácticas, presencia digital, redes, CCTV y software que ordenan el día a día sin jerga innecesaria.",
  },
];

export const conferenceBenefits: ConferenceBenefit[] = [
  {
    title: "Decisiones con criterio técnico",
    copy: "Salen con un marco para evaluar herramientas de IA, proveedores y proyectos — qué conviene adoptar, qué posponer y qué evitar.",
  },
  {
    title: "Riesgos que sí importan",
    copy: "Phishing, contraseñas, respaldos, acceso remoto y vigilancia: conciencia útil alineada a cómo operan hogares y negocios en la frontera.",
  },
  {
    title: "De la charla a la acción",
    copy: "Cada tema conecta con servicios ATRIX (soporte, redes, CCTV, software, IT) para que, si quieren implementar, ya tengan un camino concreto.",
  },
  {
    title: "Formato a la medida",
    copy: "Presencial o virtual, 45–90 minutos o taller extendido. Adaptamos ejemplos a tu sector: retail, consultorio, escuela, logística o oficina.",
  },
];

/** Charlas IA-first + tecnología aplicada. Actualiza aquí para reflejar oferta vigente. */
export const conferenceTalks: ConferenceTalk[] = [
  {
    slug: "ia-practica-empresas",
    title: "IA práctica para empresas: productividad sin humo",
    focus:
      "Casos reales de uso de IA generativa en oficina, ventas y operaciones. Qué automatizar, qué no, y cómo medir si aporta valor.",
    audience: "Empresas y equipos de gerencia / operación",
    outcomes: [
      "Mapa de procesos candidatos a IA (y cuáles dejar humanos)",
      "Criterios de privacidad y datos sensibles",
      "Checklist de adopción responsable en PyMEs",
    ],
    format: "Charla + Q&A",
    duration: "60–75 min",
    relatedServices: ["desarrollo-software", "soporte-it-empresarial"],
  },
  {
    slug: "ciberseguridad-conciencia",
    title: "Ciberseguridad y conciencia digital en la frontera",
    focus:
      "Amenazas cotidianas: correos falsos, WiFi inseguro, dispositivos compartidos y accesos remotos. Cómo proteger personas, inventario y reputación.",
    audience: "Empresas, negocios y personal administrativo",
    outcomes: [
      "Hábitos de seguridad para el equipo completo",
      "Señales de alerta ante fraude digital",
      "Prioridades: respaldos, contraseñas, CCTV y red",
    ],
    format: "Charla práctica",
    duration: "45–60 min",
    relatedServices: ["cctv", "redes-infraestructura", "soporte-it-empresarial"],
  },
  {
    slug: "transformacion-digital-pymes",
    title: "Transformación digital para PyMEs de Nuevo Laredo / Laredo",
    focus:
      "Ordenar presencia web, WhatsApp, sistemas internos y soporte IT sin “proyectos eternos”. Priorizar lo que mueve ventas y reduce fricción.",
    audience: "Dueños de negocio y gerentes de PyME",
    outcomes: [
      "Hoja de ruta digital en 3 horizontes",
      "Cuándo basta un sitio vs. un sistema a la medida",
      "Cómo alinear tecnología con presupuesto real",
    ],
    format: "Sesión empresarial",
    duration: "60–90 min",
    relatedServices: [
      "desarrollo-software",
      "soporte-tecnico",
      "soporte-it-empresarial",
    ],
  },
  {
    slug: "ia-educacion",
    title: "IA en educación: usos responsables en el aula",
    focus:
      "Cómo docentes y alumnos pueden aprovechar IA para estudiar, planear y crear — con límites éticos, integridad académica y cuidado de datos.",
    audience: "Escuelas, universidades y centros de formación",
    outcomes: [
      "Políticas simples de uso aceptable",
      "Ejemplos de actividades con y sin IA",
      "Riesgos de privacidad en herramientas gratuitas",
    ],
    format: "Charla / taller corto",
    duration: "50–70 min",
    relatedServices: ["desarrollo-software", "redes-infraestructura"],
  },
  {
    slug: "software-ia-cuando-conviene",
    title: "Software a la medida e IA: cuándo sí tiene sentido",
    focus:
      "Diferencia entre chatbots genéricos, integraciones y plataformas propias. Lecciones de proyectos reales ATRIX en salud, deporte y comercio.",
    audience: "Empresas y organizaciones en crecimiento",
    outcomes: [
      "Señales de que necesitas software propio",
      "Alcance MVP vs. plataforma completa",
      "Cómo evaluar proveedores y continuidad",
    ],
    format: "Sesión técnica-ejecutiva",
    duration: "60–75 min",
    relatedServices: ["desarrollo-software", "soporte-it-empresarial"],
  },
  {
    slug: "infraestructura-operacion",
    title: "Redes, CCTV y operación estable: la base antes de la IA",
    focus:
      "Sin internet confiable, equipos sanos ni vigilancia clara, la IA no rinde. Infraestructura y soporte como cimiento de cualquier iniciativa digital.",
    audience: "Negocios, oficinas y planteles",
    outcomes: [
      "Diagnóstico rápido de red y equipos",
      "Buenas prácticas de CCTV y acceso remoto",
      "Mantenimiento preventivo vs. apagar incendios",
    ],
    format: "Taller práctico",
    duration: "60–90 min",
    relatedServices: [
      "redes-infraestructura",
      "cctv",
      "soporte-tecnico",
      "impresoras-perifericos",
    ],
  },
];

/** Ángulo de cada servicio ATRIX dentro de la oferta de conferencias. */
export const conferenceServiceLinks: ConferenceServiceLink[] = services.map(
  (s) => {
    const angles: Record<string, string> = {
      "soporte-tecnico":
        "Las charlas explican por qué equipos lentos o mal configurados limitan cualquier adopción de IA o productividad digital.",
      "impresoras-perifericos":
        "Incluimos el día a día de oficina: periféricos, drivers y flujos que siguen fallando aunque haya “herramientas nuevas”.",
      cctv:
        "Conectamos conciencia de seguridad física y digital: videovigilancia, acceso remoto y protección de inventario.",
      "redes-infraestructura":
        "Sin cobertura WiFi ni red ordenada, no hay cloud ni IA útiles. Habitualmente es el primer diagnóstico.",
      "desarrollo-software":
        "Mostramos cuándo un sitio, panel o sistema a la medida — con o sin IA — resuelve captura de clientes y operación.",
      "soporte-it-empresarial":
        "Mantenimiento, respaldos y continuidad: el acompañamiento después de la conferencia, si el equipo quiere implementar.",
    };
    return {
      slug: s.slug,
      title: s.title,
      short: s.short,
      talkAngle: angles[s.slug] ?? s.copy,
    };
  },
);

/** Perfil del conferencista principal — visual + CTAs en la sección Equipo. */
export const conferenceSpeaker: ConferenceSpeaker = {
  name: "Ing. Néstor J. Resendiz, MBA",
  role: "Fundador y conferencista · ATRIX Technologies",
  badges: ["Ingeniería", "MBA", "IA aplicada", "Conferencias"],
  themes: [
    "IA práctica para empresas",
    "Ciberseguridad en la frontera",
    "Transformación digital para PyMEs",
    "IA responsable en educación",
    "Software e infraestructura que sí opera",
  ],
  stats: [
    { value: "6+", label: "Temas listos" },
    { value: "3", label: "Públicos" },
    { value: "45–90'", label: "Duración" },
    { value: "NL · TX", label: "Cobertura" },
  ],
  copy: [
    "Ingeniero y líder de ATRIX: dirige las charlas de inteligencia artificial y tecnología para empresas, escuelas y negocios en la frontera.",
    "Lleva a la sala lo que el equipo vive en campo — soporte IT, redes, CCTV y software en producción — con un lenguaje claro, serio y orientado a decisiones, no a moda.",
  ],
  visuals: [
    {
      src: "/brand/hero-poster.jpg",
      alt: "Atmósfera tecnológica ATRIX",
      caption: "ATRIX",
    },
    {
      src: "/projects/grupo-gi-preview.jpg",
      alt: "Plataforma Grupo GI",
      caption: "Grupo GI",
    },
    {
      src: "/projects/tecos-elite-preview.jpg",
      alt: "Plataforma Tecos Elite Voleibol",
      caption: "Tecos Elite",
    },
    {
      src: "/projects/dojangspace-preview.jpg",
      alt: "Producto DojangSpace",
      caption: "DojangSpace",
    },
    {
      src: "/projects/dentalmate-preview.jpg",
      alt: "Plataforma DentalMate",
      caption: "DentalMate",
    },
  ],
  whatsappMessage:
    "Hola ATRIX, quiero agendar una conferencia o charla con el Ing. Néstor J. Resendiz.",
};

export const conferenceTeam: ConferenceTeamMember[] = [
  {
    name: conferenceSpeaker.name,
    role: conferenceSpeaker.role,
    badges: conferenceSpeaker.badges,
    isSpeaker: true,
    copy: conferenceSpeaker.copy,
  },
  {
    name: "Equipo ATRIX Technologies",
    role: "Soporte, infraestructura y entrega en Nuevo Laredo / Laredo, TX",
    badges: ["Soporte técnico", "CCTV", "Redes", "Software"],
    copy: [
      "Detrás de cada charla hay un equipo que instala, repara, configura y construye: la misma práctica que alimenta los ejemplos de las conferencias.",
      `${site.motto}. Cobertura en ${site.coverage}.`,
    ],
  },
];

export const conferenceFormats = [
  {
    title: "Charla magistral",
    copy: "45–75 min + preguntas. Ideal para eventos, kickoffs y asambleas.",
  },
  {
    title: "Taller práctico",
    copy: "90–120 min con ejercicios. Ideal para equipos que van a implementar.",
  },
  {
    title: "Sesión in-company",
    copy: "Agenda cerrada a tu sector. Presencial en planta/oficina o virtual.",
  },
] as const;
