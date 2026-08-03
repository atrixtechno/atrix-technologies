export type ProjectTheme = {
  bg: string;
  bgElevated: string;
  fg: string;
  muted: string;
  accent: string;
  accentInk: string;
  glow: string;
  light?: boolean;
};

export type Project = {
  slug: string;
  name: string;
  sector: string;
  summary: string;
  result: string;
  url?: string;
  designerUrl?: string;
  highlights: string[];
  stackNote: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  theme: ProjectTheme;
  challenge: string;
  solution: string;
  impact: string[];
  modules: { title: string; copy: string }[];
  technologies: { name: string; role: string }[];
  process: { title: string; copy: string }[];
  persuasion: string[];
  year: string;
  location: string;
};

export const projects: Project[] = [
  {
    slug: "dentalmate",
    name: "DentalMate",
    sector: "Salud · Consultorio dental",
    summary:
      "Plataforma digital completa para el consultorio: marca, captación de pacientes y panel de recepción en un solo sistema.",
    result:
      "Presencia profesional en dentalmate.mx, SEO local, 9 idiomas y operación interna lista para el día a día.",
    url: "https://dentalmate.mx",
    designerUrl: "https://dentalmate.mx/disenador",
    highlights: [
      "Landing con video, servicios y conversión a WhatsApp",
      "14 páginas de tratamientos con SEO local",
      "Panel de recepción con leads y seguimiento",
      "9 idiomas y formularios conectados a Supabase",
    ],
    stackNote: "Next.js · Supabase · Netlify · i18n",
    seoTitle: "DentalMate — sitio y panel para consultorio dental",
    seoDescription:
      "Caso ATRIX Technologies: plataforma web de DentalMate en Nuevo Laredo con captación de pacientes, i18n y panel de recepción.",
    keywords: [
      "sitio web consultorio dental",
      "DentalMate Nuevo Laredo",
      "panel recepción dental",
      "ATRIX Technologies",
    ],
    theme: {
      bg: "#eef7f7",
      bgElevated: "#ffffff",
      fg: "#0b282d",
      muted: "#4a6b70",
      accent: "#00b5ad",
      accentInk: "#ffffff",
      glow: "rgba(0,181,173,0.28)",
      light: true,
    },
    challenge:
      "El consultorio necesitaba más que una página bonita: atraer pacientes en Nuevo Laredo y Laredo TX, explicar tratamientos con claridad y dar seguimiento desde recepción.",
    solution:
      "Diseñamos y desarrollamos de punta a punta identidad teal, hero con video, catálogo clínico, contacto multicanal y un panel administrativo para el equipo.",
    impact: [
      "Marca digital confiable lista para convertir visitas en citas",
      "Recepción con control de solicitudes entrantes",
      "Presencia bilingüe/multidioma para pacientes locales e internacionales",
    ],
    modules: [
      {
        title: "Landing de marca",
        copy: "Hero con video, tip del día, servicios, resultados, opiniones, FAQ, mapa y contacto.",
      },
      {
        title: "14 tratamientos",
        copy: "Páginas profundas con guía para el paciente, FAQ y SEO orientado a Nuevo Laredo.",
      },
      {
        title: "Panel de recepción",
        copy: "Login seguro, interesados, seguimiento y operación interna del consultorio.",
      },
      {
        title: "Integraciones",
        copy: "WhatsApp, Supabase, redes, mapa, privacidad LFPDPPP y despliegue continuo.",
      },
    ],
    technologies: [
      { name: "Next.js", role: "App Router + TypeScript" },
      { name: "Tailwind CSS", role: "Sistema visual DentalMate" },
      { name: "Supabase", role: "Auth, leads y datos de recepción" },
      { name: "Netlify", role: "Hosting y CI/CD" },
      { name: "i18n", role: "9 idiomas con selector de banderas" },
      { name: "SEO local", role: "Sitemap, JSON-LD y meta por servicio" },
    ],
    process: [
      {
        title: "Descubrimiento",
        copy: "Alcance del sitio, servicios prioritarios, tono de marca y flujo real de recepción.",
      },
      {
        title: "Diseño y contenido",
        copy: "UI teal, tipografía Sora, copy clínico claro y prototipo de conversión a cita.",
      },
      {
        title: "Desarrollo",
        copy: "Next.js, Supabase, WhatsApp, i18n, admin y SEO en producción.",
      },
      {
        title: "Entrega",
        copy: "Publicación en dentalmate.mx y ajustes según uso real del consultorio.",
      },
    ],
    persuasion: [
      "Tu consultorio también puede verse premium y convertir pacientes desde el celular.",
      "Incluye panel interno: no solo marketing, también operación.",
      "SEO local y tratamientos con página propia para aparecer cuando buscan tu servicio.",
    ],
    year: "2026",
    location: "Nuevo Laredo, Tamaulipas",
  },
  {
    slug: "grupo-gi-casa-de-cambio",
    name: "Grupo GI Casa de Cambio",
    sector: "Finanzas · Casa de cambio",
    summary:
      "Landing con sucursales, portal de empleados y panel de administración para operar con orden y confianza.",
    result:
      "Cara pública sólida y herramientas internas para personal y administración del grupo.",
    highlights: [
      "Sitio con sucursales del grupo",
      "Portal de empleados con acceso por ID",
      "Panel admin para personal y sucursales",
    ],
    stackNote: "Landing + portal + admin",
    seoTitle: "Grupo GI — landing, portal y admin para casa de cambio",
    seoDescription:
      "Caso ATRIX: plataforma digital de Grupo GI Casa de Cambio con sitio público, portal de empleados y panel administrativo.",
    keywords: [
      "casa de cambio sitio web",
      "portal empleados",
      "Grupo GI",
      "software financiero frontera",
    ],
    theme: {
      bg: "#0b1220",
      bgElevated: "#121a2b",
      fg: "#f4f7ff",
      muted: "#9aa8c7",
      accent: "#c9a227",
      accentInk: "#0b1220",
      glow: "rgba(201,162,39,0.28)",
    },
    challenge:
      "Una casa de cambio necesita transmitir confianza al público y, al mismo tiempo, orden interno para personal y sucursales.",
    solution:
      "Construimos una presencia pública clara más un portal de empleados y un panel admin para operar el día a día.",
    impact: [
      "Imagen institucional más sólida frente a clientes",
      "Acceso controlado para personal",
      "Administración centralizada de sucursales y usuarios",
    ],
    modules: [
      {
        title: "Landing pública",
        copy: "Marca, confianza, sucursales y llamado a contacto.",
      },
      {
        title: "Portal empleados",
        copy: "Acceso por identificador para el equipo operativo.",
      },
      {
        title: "Panel admin",
        copy: "Gestión de personal, sucursales y operación interna.",
      },
    ],
    technologies: [
      { name: "Web moderna", role: "Landing responsive de alto impacto" },
      { name: "Portal autenticado", role: "Acceso controlado para personal" },
      { name: "Panel admin", role: "Operación de usuarios y sucursales" },
      { name: "Hosting + CI", role: "Despliegue continuo y estable" },
    ],
    process: [
      {
        title: "Alcance",
        copy: "Definimos qué es público, qué es interno y quién administra.",
      },
      {
        title: "Diseño",
        copy: "Identidad sobria y financiera, pensada para confianza.",
      },
      {
        title: "Implementación",
        copy: "Landing, portal y panel conectados a la operación real.",
      },
      {
        title: "Entrega",
        copy: "Capacitación breve y ajustes según el flujo del grupo.",
      },
    ],
    persuasion: [
      "Tu negocio financiero también puede verse institucional y operar con menos fricción.",
      "Separamos lo público de lo interno: seguridad y claridad.",
      "Ideal para grupos con varias sucursales o equipos.",
    ],
    year: "2025",
    location: "Nuevo Laredo / frontera",
  },
  {
    slug: "dojangspace",
    name: "DojangSpace",
    sector: "Deporte · Directorio global",
    summary:
      "Directorio y perfiles digitales para dojangs de Taekwondo: presencia pública, registro y publicación administrada.",
    result:
      "Plataforma para que dojangs tengan casa en línea y se descubran por país y ciudad.",
    highlights: [
      "Directorio global con búsqueda",
      "Perfiles públicos por país y ciudad",
      "Flujo de registro y revisión admin",
    ],
    stackNote: "Producto / directorio SaaS",
    seoTitle: "DojangSpace — directorio global de dojangs",
    seoDescription:
      "Caso ATRIX: DojangSpace, directorio y perfiles digitales para academias de Taekwondo a escala global.",
    keywords: [
      "directorio taekwondo",
      "dojang online",
      "SaaS deportivo",
      "DojangSpace",
    ],
    theme: {
      bg: "#070b12",
      bgElevated: "#101826",
      fg: "#f5f8ff",
      muted: "#93a4bd",
      accent: "#ff4d4d",
      accentInk: "#ffffff",
      glow: "rgba(255,77,77,0.28)",
    },
    challenge:
      "Los dojangs necesitan presencia digital descubrible, no solo un Facebook suelto, y un proceso claro para registrarse y publicarse.",
    solution:
      "Creamos un directorio con perfiles públicos, búsqueda geográfica y un flujo admin de revisión.",
    impact: [
      "Visibilidad por país y ciudad",
      "Perfiles listos para compartir",
      "Crecimiento administrado del directorio",
    ],
    modules: [
      {
        title: "Directorio",
        copy: "Búsqueda y listados para descubrir dojangs.",
      },
      {
        title: "Perfiles públicos",
        copy: "Ficha digital por academia con datos clave.",
      },
      {
        title: "Registro + admin",
        copy: "Solicitudes de publicación y revisión centralizada.",
      },
    ],
    technologies: [
      { name: "Producto web", role: "Arquitectura de directorio escalable" },
      { name: "Búsqueda geo", role: "Descubrimiento por país/ciudad" },
      { name: "Admin review", role: "Calidad y control de publicaciones" },
      { name: "SEO de perfiles", role: "URLs y metadatos por dojang" },
    ],
    process: [
      {
        title: "Producto",
        copy: "Definimos el modelo de directorio, roles y publicación.",
      },
      {
        title: "UX",
        copy: "Flujos simples para visitantes, dojangs y administradores.",
      },
      {
        title: "Build",
        copy: "Directorio, perfiles, registro y panel de revisión.",
      },
      {
        title: "Evolución",
        copy: "Base lista para crecer con más países y features.",
      },
    ],
    persuasion: [
      "Si tu comunidad o red necesita descubrirse en línea, un directorio a medida es más poderoso que posts sueltos.",
      "Pensado como producto: no una landing estática.",
      "ATRIX te ayuda a definir alcance, roles y crecimiento.",
    ],
    year: "2025",
    location: "Global",
  },
  {
    slug: "tecos-elite-voleibol",
    name: "Tecos Elite Voleibol",
    sector: "Deporte · Club de voleibol",
    summary:
      "Plataforma integral del club: landing, portal alumno, admin, tienda, pagos, galería y comunicación.",
    result:
      "El club opera digitalmente: menos WhatsApp suelto, más control de operación y una marca deportiva fuerte.",
    url: "https://www.tecoseliteacademy.com",
    designerUrl: "https://www.tecoseliteacademy.com/diseñador.html",
    highlights: [
      "Landing pública con avisos, calendario y captación",
      "Portal alumno: pagos, documentos y tienda",
      "Panel admin: ventas, inventario, nómina y finanzas",
      "WhatsApp, exportaciones y configuración editable",
    ],
    stackNote: "React · Supabase · Vercel",
    seoTitle: "Tecos Elite Voleibol — plataforma de academia deportiva",
    seoDescription:
      "Caso ATRIX: sistema completo para Tecos Elite VOLLEYBALL con portal alumno, admin, tienda y operación diaria.",
    keywords: [
      "software academia voleibol",
      "Tecos Elite",
      "portal alumnos deportes",
      "gestión club deportivo",
    ],
    theme: {
      bg: "#071018",
      bgElevated: "#0d1a24",
      fg: "#f3fbff",
      muted: "#8eacbc",
      accent: "#2b6bff",
      accentInk: "#ffffff",
      glow: "rgba(43,107,255,0.32)",
    },
    challenge:
      "Una academia deportiva no puede vivir de hojas de cálculo y chats: necesita un sistema para alumnos, pagos, tienda y administración.",
    solution:
      "Entregamos una plataforma integrada: cara pública, portal alumno y panel admin con módulos operativos reales.",
    impact: [
      "Operación centralizada del club",
      "Mejor experiencia para alumnos y padres",
      "Control financiero y de inventario",
    ],
    modules: [
      {
        title: "Landing pública",
        copy: "Avisos, calendario, entrenadores, galería, tienda y leads.",
      },
      {
        title: "Portal alumno",
        copy: "Pagos, eventos, documentos, credencial y cartas de torneo.",
      },
      {
        title: "Panel admin",
        copy: "Alumnos, ventas, comprobantes, inventario, nómina y dashboard.",
      },
      {
        title: "Comunicación",
        copy: "WhatsApp, avisos, notificaciones y configuración editable.",
      },
    ],
    technologies: [
      { name: "React 18", role: "SPA modular: landing, admin y portal" },
      { name: "Supabase", role: "Auth, DB, Storage y Edge Functions" },
      { name: "PostgreSQL + RLS", role: "Seguridad por rol" },
      { name: "Vercel + GitHub", role: "CI/CD a producción" },
      { name: "ExcelJS · jsPDF · DOCX", role: "Exportaciones operativas" },
      { name: "WhatsApp bridge", role: "Mensajería y recordatorios" },
    ],
    process: [
      {
        title: "Descubrimiento",
        copy: "Módulos, reglas de negocio y flujos con el equipo Tecos.",
      },
      {
        title: "Diseño",
        copy: "Identidad deportiva, UI móvil y componentes reutilizables.",
      },
      {
        title: "Implementación",
        copy: "Supabase, permisos, archivos, exportaciones y bot.",
      },
      {
        title: "Entrega",
        copy: "Producción estable y secciones administrables sin tocar código.",
      },
    ],
    persuasion: [
      "Si tu academia crece, necesitas sistema — no más chats sueltos.",
      "ATRIX entrega operación real: pagos, alumnos, tienda y admin.",
      "Diseño profesional que también convence a padres y prospectos.",
    ],
    year: "2025–2026",
    location: "Nuevo Laredo, Tamaulipas",
  },
  {
    slug: "tecos-taekwondo",
    name: "Tecos Taekwondo",
    sector: "Deporte · Academia de Taekwondo",
    summary:
      "Gestión completa de la academia: alumnos, coaches, asistencias, eventos y comunicación.",
    result:
      "Misma línea operativa de un club serio, adaptada a la vertical de Taekwondo.",
    highlights: [
      "Panel admin para la academia",
      "Asistencias, eventos y galería",
      "Comunicación y módulos de operación",
    ],
    stackNote: "App de gestión deportiva",
    seoTitle: "Tecos Taekwondo — gestión digital de academia",
    seoDescription:
      "Caso ATRIX: plataforma de gestión para academia de Taekwondo con asistencias, eventos, galería y operación admin.",
    keywords: [
      "software taekwondo",
      "gestión academia artes marciales",
      "asistencias dojang",
      "Tecos Taekwondo",
    ],
    theme: {
      bg: "#0a0a0a",
      bgElevated: "#161616",
      fg: "#f7f7f7",
      muted: "#a3a3a3",
      accent: "#e11d48",
      accentInk: "#ffffff",
      glow: "rgba(225,29,72,0.3)",
    },
    challenge:
      "La academia necesitaba estructura digital para alumnos, coaches y el ritmo diario de clases y eventos.",
    solution:
      "Implementamos un sistema de gestión deportiva alineado a la identidad Tecos, con módulos de operación y comunicación.",
    impact: [
      "Mejor control de asistencias y eventos",
      "Comunicación más ordenada con la comunidad",
      "Base para crecer sin perder operación",
    ],
    modules: [
      {
        title: "Admin academia",
        copy: "Alumnos, coaches y configuración operativa.",
      },
      {
        title: "Asistencias y eventos",
        copy: "Control del día a día y calendario de actividades.",
      },
      {
        title: "Galería y avisos",
        copy: "Presencia visual y comunicación con la comunidad.",
      },
    ],
    technologies: [
      { name: "Web app", role: "Panel y módulos de gestión" },
      { name: "Base de datos", role: "Alumnos, eventos y operación" },
      { name: "Auth por roles", role: "Acceso según responsabilidad" },
      { name: "Media", role: "Galería y contenidos de la academia" },
    ],
    process: [
      {
        title: "Diagnóstico",
        copy: "Mapeamos operación real de la academia y prioridades.",
      },
      {
        title: "Diseño",
        copy: "UI fuerte, clara y alineada a la marca deportiva.",
      },
      {
        title: "Build",
        copy: "Módulos de alumnos, asistencias, eventos y comunicación.",
      },
      {
        title: "Ajuste",
        copy: "Refinamiento con uso real de coaches y administración.",
      },
    ],
    persuasion: [
      "Tu dojang puede operar con la seriedad de un club profesional.",
      "Menos fricción administrativa, más foco en el entrenamiento.",
      "ATRIX adapta el sistema a tu disciplina y forma de trabajar.",
    ],
    year: "2025",
    location: "Nuevo Laredo, Tamaulipas",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
