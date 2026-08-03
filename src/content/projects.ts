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
  previewImage?: string;
  tags?: string[];
  stats?: { value: string; label: string }[];
  story?: string[];
  approach?: { title: string; copy: string }[];
  deliverables?: { title: string; copy: string }[];
  languages?: { code: string; name: string }[];
  lead?: {
    name: string;
    role: string;
    badges?: string[];
    copy: string[];
  };
  highlights: string[];
  stackNote: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  theme: ProjectTheme;
  /** Paleta cuando el sitio está en tema oscuro (mantiene acento de marca). */
  themeDark?: ProjectTheme;
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
    previewImage: "/projects/dentalmate-preview.jpg",
    tags: [
      "UI/UX",
      "Frontend",
      "Branding web",
      "SEO local",
      "Panel admin",
      "Multidioma",
    ],
    stats: [
      { value: "14", label: "Tratamientos con página propia" },
      { value: "9", label: "Idiomas en el sitio" },
      { value: "1", label: "Panel de recepción" },
      { value: "100%", label: "Diseño responsive" },
    ],
    story: [
      "DentalMate necesitaba más que una página bonita: una marca digital confiable para atraer pacientes en Nuevo Laredo (y visitantes de Laredo, TX), mostrar tratamientos con claridad y dar seguimiento a solicitudes desde recepción.",
      "ATRIX Technologies diseñó y desarrolló el sitio de punta a punta: identidad visual teal, hero con video, catálogo de servicios, casos antes/después, opiniones, FAQ, mapa, contacto multicanal y un panel administrativo para el equipo del consultorio.",
      "El resultado es dentalmate.mx en producción: SEO local, 9 idiomas, formularios conectados a Supabase y una experiencia pensada para convertir visitas en citas.",
    ],
    approach: [
      {
        title: "Precisión visual",
        copy: "Jerarquía, tipografía y detalle para que la marca se sienta profesional desde el primer viewport.",
      },
      {
        title: "Enfoque en el paciente",
        copy: "Mensajes claros, menos jerga clínica y caminos simples hacia WhatsApp o el formulario.",
      },
      {
        title: "Ejecución completa",
        copy: "Diseño, desarrollo, SEO, datos, panel interno y despliegue — no solo un mockup.",
      },
    ],
    deliverables: [
      {
        title: "Identidad digital",
        copy: "Sistema visual teal, tipografía Sora/Outfit, motion y microinteracciones coherentes.",
      },
      {
        title: "Catálogo clínico web",
        copy: "Servicios filtrables y páginas profundas para ortodoncia, implantes, estética y más.",
      },
      {
        title: "Conversión a cita",
        copy: "CTAs de WhatsApp, formulario de solicitud y flujo pensado para agendar valoración.",
      },
      {
        title: "Operación interna",
        copy: "Panel de recepción para revisar y marcar seguimiento de contactos entrantes.",
      },
      {
        title: "Experiencia global",
        copy: "Selector de idioma con banderas reales para pacientes locales e internacionales.",
      },
      {
        title: "Legal y confianza",
        copy: "Aviso de privacidad LFPDPPP, créditos ATRIX y estructura lista para crecer.",
      },
    ],
    languages: [
      { code: "ES", name: "Español (México)" },
      { code: "EN", name: "English" },
      { code: "PT", name: "Português" },
      { code: "FR", name: "Français" },
      { code: "ZH", name: "中文" },
      { code: "DE", name: "Deutsch" },
      { code: "IT", name: "Italiano" },
      { code: "JA", name: "日本語" },
      { code: "KO", name: "한국어" },
    ],
    lead: {
      name: "Ing. Néstor J. Resendiz, MBA",
      role: "Diseñador · Programador · Líder técnico · ATRIX Technologies",
      badges: ["Ingeniería", "MBA"],
      copy: [
        "Encargado del diseño visual, la arquitectura de la aplicación y la programación de DentalMate. Coordinó la experiencia de usuario, las páginas de tratamientos, el panel de recepción, los formularios de contacto y la conexión con Supabase para que el consultorio gestione leads y seguimiento de forma clara.",
        "Enfoque: código limpio, interfaces claras y comunicación directa con el cliente hasta que cada requisito quede reflejado en funcionalidad real.",
      ],
    },
    highlights: [
      "Landing con video, tip del día, servicios y conversión a WhatsApp",
      "14 páginas de tratamientos con SEO local",
      "Panel de recepción con leads y seguimiento",
      "9 idiomas con selector de banderas",
      "Formularios conectados a Supabase",
      "Casos antes/después, opiniones, FAQ, mapa y privacidad",
    ],
    stackNote: "Next.js · Supabase · Netlify · i18n",
    seoTitle: "DentalMate — sitio y panel para consultorio dental",
    seoDescription:
      "Caso ATRIX Technologies: plataforma web de DentalMate en Nuevo Laredo con captación de pacientes, i18n, SEO local y panel de recepción.",
    keywords: [
      "sitio web consultorio dental",
      "DentalMate Nuevo Laredo",
      "panel recepción dental",
      "ATRIX Technologies",
      "desarrollo web dental",
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
    themeDark: {
      bg: "#041618",
      bgElevated: "#0a2529",
      fg: "#e8f7f6",
      muted: "#8eb3b0",
      accent: "#2ee6d6",
      accentInk: "#031018",
      glow: "rgba(46,230,214,0.22)",
    },
    challenge:
      "El consultorio necesitaba más que una página bonita: atraer pacientes en Nuevo Laredo y Laredo TX, explicar tratamientos con claridad y dar seguimiento desde recepción.",
    solution:
      "Diseñamos y desarrollamos de punta a punta identidad teal, hero con video, catálogo clínico, contacto multicanal y un panel administrativo para el equipo.",
    impact: [
      "Marca digital confiable lista para convertir visitas en citas",
      "Recepción con control de solicitudes entrantes",
      "Presencia multidioma para pacientes locales e internacionales",
    ],
    modules: [
      {
        title: "Landing de marca",
        copy: "Hero con video, recomendación del día, servicios destacados, resultados, opiniones, FAQ, ubicación y contacto.",
      },
      {
        title: "14 páginas de tratamientos",
        copy: "Cada procedimiento con contenido propio, guía para el paciente, FAQ y SEO local orientado a Nuevo Laredo.",
      },
      {
        title: "Panel de recepción",
        copy: "Login seguro, listado de leads/solicitudes y seguimiento para el equipo interno del consultorio.",
      },
      {
        title: "Formularios e i18n",
        copy: "Contacto con prefijos internacionales, 9 idiomas con banderas y copy adaptado al paciente.",
      },
      {
        title: "Integraciones",
        copy: "WhatsApp, Supabase (leads + auth), redes oficiales, mapa y branding del consultorio.",
      },
      {
        title: "SEO y producción",
        copy: "Sitemap, JSON-LD, meta local, dominio dentalmate.mx y despliegue continuo en Netlify.",
      },
    ],
    technologies: [
      { name: "Next.js 16", role: "App Router + TypeScript" },
      { name: "React 19", role: "UI moderna y formularios" },
      { name: "Tailwind CSS", role: "Sistema visual DentalMate" },
      { name: "Supabase", role: "Auth + leads de contacto" },
      { name: "Netlify", role: "Hosting y despliegue continuo" },
      { name: "i18n", role: "9 idiomas con banderas" },
      { name: "SEO local", role: "Sitemap, JSON-LD y meta por servicio" },
      { name: "WhatsApp", role: "CTAs y captación directa" },
    ],
    process: [
      {
        title: "Descubrimiento",
        copy: "Alcance del sitio, servicios prioritarios, tono de marca y necesidades del panel de recepción.",
      },
      {
        title: "Diseño y contenido",
        copy: "UI teal, tipografía Sora, copy clínico claro y prototipo de conversión a cita.",
      },
      {
        title: "Desarrollo e integraciones",
        copy: "Next.js, Supabase, WhatsApp, i18n, admin y formularios conectados a producción.",
      },
      {
        title: "Entrega y ajustes",
        copy: "Publicación en dentalmate.mx, pruebas y refinamiento según uso real del consultorio.",
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
      bg: "#f6f4ec",
      bgElevated: "#ffffff",
      fg: "#0b1220",
      muted: "#5c6780",
      accent: "#b8921f",
      accentInk: "#0b1220",
      glow: "rgba(201,162,39,0.22)",
      light: true,
    },
    themeDark: {
      bg: "#0b1220",
      bgElevated: "#121a2b",
      fg: "#f4f7ff",
      muted: "#9aa8c7",
      accent: "#e0b83a",
      accentInk: "#0b1220",
      glow: "rgba(224,184,58,0.28)",
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
      bg: "#f7f4f4",
      bgElevated: "#ffffff",
      fg: "#140a0a",
      muted: "#6b5a5a",
      accent: "#e11d48",
      accentInk: "#ffffff",
      glow: "rgba(225,29,72,0.18)",
      light: true,
    },
    themeDark: {
      bg: "#070b12",
      bgElevated: "#101826",
      fg: "#f5f8ff",
      muted: "#93a4bd",
      accent: "#ff5c5c",
      accentInk: "#ffffff",
      glow: "rgba(255,92,92,0.28)",
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
      bg: "#eef4fb",
      bgElevated: "#ffffff",
      fg: "#071018",
      muted: "#4d6473",
      accent: "#1a4cff",
      accentInk: "#ffffff",
      glow: "rgba(43,107,255,0.18)",
      light: true,
    },
    themeDark: {
      bg: "#071018",
      bgElevated: "#0d1a24",
      fg: "#f3fbff",
      muted: "#8eacbc",
      accent: "#4d86ff",
      accentInk: "#ffffff",
      glow: "rgba(77,134,255,0.32)",
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
      bg: "#f6f2f3",
      bgElevated: "#ffffff",
      fg: "#14080c",
      muted: "#6b555c",
      accent: "#e11d48",
      accentInk: "#ffffff",
      glow: "rgba(225,29,72,0.16)",
      light: true,
    },
    themeDark: {
      bg: "#0a0a0a",
      bgElevated: "#161616",
      fg: "#f7f7f7",
      muted: "#a3a3a3",
      accent: "#fb2d5a",
      accentInk: "#ffffff",
      glow: "rgba(251,45,90,0.3)",
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
