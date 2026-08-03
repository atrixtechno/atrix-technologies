export type Project = {
  slug: string;
  name: string;
  sector: string;
  summary: string;
  result: string;
  url?: string;
  highlights: string[];
  stackNote: string;
};

export const projects: Project[] = [
  {
    slug: "dentalmate",
    name: "DentalMate",
    sector: "Salud · Consultorio dental",
    summary:
      "Sitio web del consultorio con panel para recepción: información del servicio y operación del día a día en un solo lugar.",
    result:
      "Presencia profesional en línea y un panel interno para que recepción gestione el flujo del consultorio.",
    url: "https://dentalmate.mx",
    highlights: [
      "Landing clara para pacientes en Nuevo Laredo",
      "Panel de recepción con acceso controlado",
      "Listo para crecer con citas e información del consultorio",
    ],
    stackNote: "Web + panel administrativo",
  },
  {
    slug: "grupo-gi-casa-de-cambio",
    name: "Grupo GI Casa de Cambio",
    sector: "Finanzas · Casa de cambio",
    summary:
      "Landing con sucursales, portal de empleados y panel de administración para operar el negocio con orden.",
    result:
      "Una cara pública confiable y herramientas internas para personal y administración.",
    highlights: [
      "Sitio con las sucursales del grupo",
      "Portal de empleados con acceso por ID",
      "Panel admin para personal y sucursales",
    ],
    stackNote: "Landing + portal + admin",
  },
  {
    slug: "dojangspace",
    name: "DojangSpace",
    sector: "Deporte · Directorio global",
    summary:
      "Directorio y perfiles digitales para dojangs de Taekwondo: presencia pública, registro y publicación administrada.",
    result:
      "Una plataforma para que dojangs tengan casa en línea y se descubran por país y ciudad.",
    highlights: [
      "Directorio global con búsqueda",
      "Perfiles públicos por país y ciudad",
      "Flujo de registro y revisión admin",
    ],
    stackNote: "Producto / directorio SaaS",
  },
  {
    slug: "tecos-elite-voleibol",
    name: "Tecos Elite Voleibol",
    sector: "Deporte · Club de voleibol",
    summary:
      "Sistema de gestión del club: asistencias, eventos, galería, nómina y comunicación con el equipo.",
    result:
      "El club opera digitalmente: menos WhatsApp suelto, más control de operación.",
    highlights: [
      "Asistencias y eventos",
      "Galería y anuncios",
      "Nómina, gastos y notificaciones",
    ],
    stackNote: "App de gestión deportiva",
  },
  {
    slug: "tecos-taekwondo",
    name: "Tecos Taekwondo",
    sector: "Deporte · Academia de Taekwondo",
    summary:
      "Gestión completa de la academia: alumnos, coaches, asistencias, eventos y comunicación.",
    result:
      "Misma línea operativa que un club serio, adaptada a la vertical de Taekwondo.",
    highlights: [
      "Panel admin para la academia",
      "Asistencias, eventos y galería",
      "Comunicación y módulos de operación",
    ],
    stackNote: "App de gestión deportiva",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
