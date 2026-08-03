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
  /** Logo circular de marca para listados y casos. */
  logo?: string;
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
    logo: "/projects/logos/dentalmate.png",
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
      "Ecosistema integrado para casa de cambio: sitio público, intranet de empleados, panel administrativo y checador biométrico en sucursal.",
    result:
      "Plataforma sincronizada en tiempo real — desde el mostrador hasta la nube — en 7 sucursales de Nuevo Laredo.",
    url: "https://www.grupo-gi.com",
    designerUrl: "https://www.grupo-gi.com/atrix-technologies",
    previewImage: "/projects/grupo-gi-preview.jpg",
    logo: "/projects/logos/grupo-gi.png",
    tags: [
      "Full-stack",
      "Biometría",
      "Windows + Cloud",
      "Realtime",
      "Multi-sucursal",
      "RH & asistencia",
    ],
    stats: [
      { value: "7", label: "Sucursales conectadas" },
      { value: "Full-stack", label: "Web + Windows + Cloud" },
      { value: "Realtime", label: "Chat, huellas y asistencia" },
      { value: "1 equipo", label: "Diseño, build y despliegue" },
    ],
    story: [
      "Grupo GI Centro Cambiario necesitaba más que una landing: un ecosistema operativo para casa de cambio con presencia pública, intranet de empleados, panel administrativo y checador biométrico en sucursal.",
      "ATRIX Technologies diseñó y construyó una sola plataforma sincronizada en tiempo real: portal público con mapa y tipos de cambio, portal empleado (asistencia, chat, anuncios, calendario, credencial), panel admin con permisos granulares y RH, más checador Windows (.NET) con lector ZK9500 sincronizado a www.grupo-gi.com.",
      "El resultado está en producción multi-sucursal en Nuevo Laredo, con SSO checador→web, huella y chat en vivo, desplegado en Cloudflare Pages con backend Supabase.",
    ],
    approach: [
      {
        title: "Software a medida",
        copy: "Portales, paneles admin, apps Windows y flujos operativos diseñados al proceso real — no plantillas genéricas.",
      },
      {
        title: "Biometría & hardware",
        copy: "Integración de lectores de huella, kioscos de asistencia y sincronización con la nube.",
      },
      {
        title: "Cloud & operación",
        copy: "Supabase/PostgreSQL, hosting, DNS, CI/CD, reportes PDF e instaladores para sucursales.",
      },
    ],
    deliverables: [
      {
        title: "Portal público",
        copy: "Sitio corporativo con mapa de sucursales, tipos de cambio y acceso al portal de empleados.",
      },
      {
        title: "Intranet empleado",
        copy: "Asistencia, chat en vivo, anuncios, calendario y credencial digital.",
      },
      {
        title: "Panel administrativo",
        copy: "Permisos granulares, RH, reportes PDF, organigrama y gestión de sistemas.",
      },
      {
        title: "Checador Windows",
        copy: "App nativa .NET con ZK9500: huella, asistencia, chat y sync a la nube.",
      },
      {
        title: "Instaladores & ops",
        copy: "ZIP del checador, scripts PowerShell/Inno Setup y despliegue continuo.",
      },
      {
        title: "UX corporativa",
        copy: "Identidad visual, credenciales digitales y comunicaciones internas coherentes.",
      },
    ],
    lead: {
      name: "Ing. Néstor J. Resendiz",
      role: "Dirección técnica · Ingeniero de Tecnologías de la Información · ATRIX Technologies",
      badges: ["Ingeniería", "Full-stack"],
      copy: [
        "Diseño, arquitectura y desarrollo de la plataforma Grupo GI: capa web React, cloud Supabase y checador Windows con biometría ZKTeco.",
        "Enfoque: sistemas reales en producción, sincronizados entre sucursal y nube, con documentación y empaquetado listos para operar.",
      ],
    },
    highlights: [
      "Portal público con mapa Leaflet y 7 sucursales en Nuevo Laredo",
      "Portal empleado: asistencia, chat, anuncios, calendario y credencial",
      "Panel admin con permisos, RH, reportes PDF y sistemas",
      "Checador .NET + ZK9500 con sync realtime a grupo-gi.com",
      "SSO checador → web y despliegue en Cloudflare Pages + Supabase",
    ],
    stackNote: "React · Supabase · .NET · Cloudflare · ZKTeco",
    seoTitle:
      "Grupo GI Casa de Cambio — plataforma web, portal y checador biométrico",
    seoDescription:
      "Caso ATRIX Technologies: plataforma operativa de Grupo GI con sitio público, intranet, panel admin, checador Windows ZK9500 y cloud Supabase en Nuevo Laredo.",
    keywords: [
      "casa de cambio software",
      "Grupo GI Nuevo Laredo",
      "portal empleados casa de cambio",
      "checador biométrico ZK9500",
      "Supabase Cloudflare",
      "ATRIX Technologies",
      "sistema asistencia huella",
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
      "Una casa de cambio multi-sucursal necesita transmitir confianza al público y, al mismo tiempo, operar asistencia, RH, chat y biometría sin hojas de cálculo ni sistemas sueltos.",
    solution:
      "Construimos un ecosistema full-stack: cara pública, intranet, admin y checador Windows conectados en tiempo real a la misma nube.",
    impact: [
      "7 sucursales conectadas en Nuevo Laredo",
      "Asistencia y huella sincronizadas con la nube",
      "Operación RH y admin con permisos y reportes PDF",
    ],
    modules: [
      {
        title: "Portal público",
        copy: "Mapa de sucursales, tipos de cambio, confianza institucional y acceso al login.",
      },
      {
        title: "Portal empleado",
        copy: "Asistencia, chat, anuncios, calendario y credencial digital.",
      },
      {
        title: "Panel admin",
        copy: "Permisos granulares, RH, reportes PDF, organigrama y sistemas.",
      },
      {
        title: "Checador biométrico",
        copy: "WinForms + ZK9500: huella, match, sync y SSO hacia la web.",
      },
      {
        title: "Capa cloud",
        copy: "Supabase Auth, PostgreSQL, RLS, Realtime y Storage.",
      },
      {
        title: "Despliegue & ops",
        copy: "Cloudflare Pages, Wrangler, instaladores Windows y migraciones SQL.",
      },
    ],
    technologies: [
      { name: "React 18", role: "Portal público, login, empleado y admin" },
      { name: "JavaScript / JSX", role: "UI rápida compilada con esbuild + Babel" },
      { name: "Supabase", role: "Auth JWT, PostgreSQL, RPC, Realtime y Storage" },
      { name: "PostgreSQL + RLS", role: "Permisos y datos multi-sucursal seguros" },
      { name: "Cloudflare Pages", role: "Hosting global, HTTPS, DNS y CDN" },
      { name: "C# / .NET 4.8", role: "Checador nativo WinForms en sucursal" },
      { name: "ZKTeco ZK9500", role: "Biometría USB + ZKFinger SDK" },
      { name: "jsPDF", role: "Reportes de asistencia, huellas y credenciales" },
      { name: "Leaflet / OSM", role: "Mapa interactivo de sucursales" },
      { name: "Inno Setup + PowerShell", role: "Instaladores y scripts de despliegue" },
      { name: "Git / GitHub", role: "Versionado, migraciones y CI" },
      { name: "WebSocket Realtime", role: "Chat, asistencia y sync checador↔nube" },
    ],
    process: [
      {
        title: "Alcance operativo",
        copy: "Definimos capas: público, empleado, admin y dispositivo en sucursal.",
      },
      {
        title: "Diseño & arquitectura",
        copy: "Identidad corporativa, permisos, biometría y sync realtime.",
      },
      {
        title: "Build full-stack",
        copy: "React + Supabase + checador .NET + hardware ZKTeco.",
      },
      {
        title: "Producción multi-sucursal",
        copy: "Cloudflare, instaladores, capacitación y operación en vivo.",
      },
    ],
    persuasion: [
      "Tu operación financiera también puede verse institucional y funcionar sincronizada entre mostrador y nube.",
      "Web + Windows + biometría en un solo ecosistema: menos fricción, más control.",
      "Ideal para grupos con varias sucursales, asistencia y RH en tiempo real.",
    ],
    year: "2025–2026",
    location: "Nuevo Laredo, Tamaulipas · 7 sucursales",
  },
  {
    slug: "dojangspace",
    name: "DojangSpace",
    sector: "Deporte · Directorio global de Taekwondo",
    summary:
      "La casa digital de tu dojang: directorio global WT, perfiles de escuelas y atletas, planes Free/Pro/Premium y publicación administrada.",
    result:
      "dojangspace.com en producción — EN/ES/KO, directorio geográfico, perfiles verificados, planes de suscripción y flujo de registro con revisión admin.",
    url: "https://dojangspace.com",
    previewImage: "/projects/dojangspace-preview.jpg",
    logo: "/projects/logos/dojangspace.png",
    tags: [
      "SaaS / directorio",
      "UI/UX",
      "Frontend",
      "Supabase",
      "Multidioma",
      "Mapas",
      "Planes & perfiles",
    ],
    stats: [
      { value: "3", label: "Idiomas (EN · ES · KO)" },
      { value: "4", label: "Planes (Free → Annual)" },
      { value: "2", label: "Tipos de perfil (dojang / atleta)" },
      { value: "5", label: "Tenets del taekwondo en la marca" },
    ],
    story: [
      "DojangSpace nació para resolver un vacío real: las academias de Taekwondo (dojangs) y los atletas necesitan una presencia digital descubrible a escala global — no solo un Facebook suelto o un flyer en PDF.",
      "ATRIX Technologies diseñó y construyó la plataforma de punta a punta: identidad visual navy/cian con herencia WT y olímpica, landing con los cinco tenets (예의 · 염치 · 인내 · 극기 · 백절불굴), directorio mundial, perfiles destacados, planes Free/Pro/Premium/Annual, registro con revisión admin e idiomas EN/ES/KO.",
      "El resultado es dojangspace.com en producción: escuelas verificadas, URLs listas para compartir, contacto por WhatsApp, mapas y una experiencia pensada para familias que buscan dojang y para academias que quieren crecer en línea.",
    ],
    approach: [
      {
        title: "Cultura + producto",
        copy: "La marca celebra el espíritu del Taekwondo (tenets, WT, olímpico) sin perder claridad de producto SaaS.",
      },
      {
        title: "Descubrimiento global",
        copy: "Directorio y búsqueda por país, ciudad, escuela o atleta — pensado para familias y fans.",
      },
      {
        title: "Publicación cuidada",
        copy: "Registro, planes y revisión admin para que cada perfil publicado se vea profesional.",
      },
    ],
    deliverables: [
      {
        title: "Identidad DojangSpace",
        copy: "Logo pin + kick, paleta navy/cian/korea-red, motion y tipografía para una marca deportiva premium.",
      },
      {
        title: "Landing de producto",
        copy: "Hero, tenets, beneficios, cómo funciona, planes comparativos y CTAs de registro/exploración.",
      },
      {
        title: "Directorio global",
        copy: "Explorar dojangs y atletas, filtros, fichas verificadas/premium y destacados en home.",
      },
      {
        title: "Planes Free → Annual",
        copy: "Tarjetas Free, Pro ($10/mo), Premium ($20/mo) y Annual ($120/yr) con tabla comparativa.",
      },
      {
        title: "Auth + paneles",
        copy: "Registro, login, dashboard de dojang/atleta y panel admin de revisión y publicación.",
      },
      {
        title: "i18n EN / ES / KO",
        copy: "Selector de idioma y perfiles pensados para audiencia internacional de Taekwondo.",
      },
    ],
    languages: [
      { code: "ES", name: "Español" },
      { code: "EN", name: "English" },
      { code: "KO", name: "한국어" },
    ],
    lead: {
      name: "Ing. Néstor J. Resendiz, MBA",
      role: "Diseñador · Programador · Líder técnico · ATRIX Technologies",
      badges: ["Ingeniería", "MBA", "Producto SaaS"],
      copy: [
        "Definición de producto, diseño de interfaz y desarrollo full-stack de DojangSpace: directorio, perfiles, planes, autenticación, mapas y panel de administración sobre Next.js y Supabase.",
        "Enfoque: una plataforma que respete la cultura del Taekwondo y a la vez escale como producto digital real — no solo una landing.",
      ],
    },
    highlights: [
      "Directorio global WT con dojangs verificados y destacados",
      "Perfiles de escuelas y atletas con URL compartible",
      "Planes Free, Pro, Premium y Annual con comparación clara",
      "EN / ES / KO y contacto WhatsApp en fichas",
      "Mapas, galerías e instructores según plan",
      "Flujo admin: registro → revisión → publicación",
    ],
    stackNote: "Next.js · Supabase · SaaS directorio",
    seoTitle: "DojangSpace — directorio global de dojangs y atletas",
    seoDescription:
      "Caso ATRIX: DojangSpace (dojangspace.com), directorio global de Taekwondo con perfiles, planes Free/Pro/Premium, mapas e idiomas EN/ES/KO.",
    keywords: [
      "DojangSpace",
      "directorio taekwondo",
      "dojang online",
      "perfiles atletas taekwondo",
      "SaaS deportivo",
      "World Taekwondo directorio",
      "ATRIX Technologies",
    ],
    theme: {
      bg: "#f4f8fc",
      bgElevated: "#ffffff",
      fg: "#0a1628",
      muted: "#5b6b7c",
      accent: "#0284c7",
      accentInk: "#ffffff",
      glow: "rgba(56,189,248,0.22)",
      light: true,
    },
    themeDark: {
      bg: "#070b12",
      bgElevated: "#101826",
      fg: "#f5f8ff",
      muted: "#93a4bd",
      accent: "#38bdf8",
      accentInk: "#0a1628",
      glow: "rgba(56,189,248,0.28)",
    },
    challenge:
      "Los dojangs y atletas necesitaban una casa digital global: descubrirse por país/ciudad, verse profesionales y publicar con un proceso claro — no depender solo de redes sociales.",
    solution:
      "Construimos DojangSpace: directorio + perfiles + planes de suscripción + revisión admin, con marca WT/olímpica, i18n y herramientas de contacto (WhatsApp, mapas, galería).",
    impact: [
      "Visibilidad global para escuelas y atletas verificados",
      "URLs premium listas para compartir en redes y WhatsApp",
      "Monetización clara con planes Free → Annual",
      "Crecimiento del directorio con control de calidad admin",
    ],
    modules: [
      {
        title: "Landing de producto",
        copy: "Hero, tenets, beneficios, cómo funciona y planes — conversión a registro o exploración.",
      },
      {
        title: "Directorio de dojangs",
        copy: "Listados, destacados, verificación Premium y fichas por país/ciudad.",
      },
      {
        title: "Perfiles de atletas",
        copy: "Espacio para publicar trayectorias y descubrirse en el directorio de atletas.",
      },
      {
        title: "Planes y comparación",
        copy: "Free, Pro, Premium y Annual con features escalonadas (galería, mapa, cover, instructores).",
      },
      {
        title: "Registro + dashboard",
        copy: "Alta de cuenta (escuela o atleta), carga de datos y gestión del perfil.",
      },
      {
        title: "Admin review",
        copy: "Revisión y publicación centralizada para mantener calidad del directorio.",
      },
    ],
    technologies: [
      { name: "Next.js 16", role: "App Router, SSR/SSG y rutas de producto" },
      { name: "React 19", role: "UI, motion y formularios" },
      { name: "Supabase", role: "Auth, PostgreSQL, Storage y roles admin" },
      { name: "TypeScript", role: "Tipado extremo a extremo" },
      { name: "Tailwind CSS", role: "Sistema visual navy/cian responsive" },
      { name: "Leaflet / mapas", role: "Ubicación de dojangs en perfiles Pro+" },
      { name: "Framer Motion", role: "Microinteracciones y presencia de marca" },
      { name: "i18n EN·ES·KO", role: "Selector de idioma y audiencia global" },
    ],
    process: [
      {
        title: "Producto",
        copy: "Modelo de directorio, roles (visitante / dojang / atleta / admin) y planes.",
      },
      {
        title: "Marca & UX",
        copy: "Identidad WT-inspired, flujos claros y landing orientada a conversión.",
      },
      {
        title: "Build",
        copy: "Next.js + Supabase: auth, perfiles, directorio, admin y despliegue.",
      },
      {
        title: "Evolución",
        copy: "Base lista para más países, atletas y features de monetización.",
      },
    ],
    persuasion: [
      "Si tu red de academias o comunidad deportiva necesita descubrirse en línea, un directorio a medida supera a posts sueltos.",
      "DojangSpace combina cultura del Taekwondo con ejecución SaaS real: planes, perfiles y admin.",
      "ATRIX te ayuda a definir alcance, roles y crecimiento de un producto digital — no solo una página.",
    ],
    year: "2025–2026",
    location: "Global · WT / Olympic Taekwondo",
  },
  {
    slug: "tecos-elite-voleibol",
    name: "Tecos Elite Voleibol",
    sector: "Deporte · Club de voleibol",
    summary:
      "Plataforma integral del club: landing pública, portal alumno, panel admin, tienda/POS, pagos, galería y comunicación WhatsApp.",
    result:
      "Academia operando en la nube 24/7: 3 portales, 20+ módulos de gestión y configuración editable sin tocar código.",
    url: "https://www.tecoseliteacademy.com",
    designerUrl: "https://www.tecoseliteacademy.com/diseñador.html",
    previewImage: "/projects/tecos-elite-preview.jpg",
    logo: "/projects/logos/tecos-elite.png",
    tags: [
      "Branding & identidad",
      "UX / UI",
      "Desarrollo web",
      "Plataformas a medida",
      "Marketing digital",
      "Estrategia creativa",
    ],
    stats: [
      { value: "1", label: "Plataforma integrada" },
      { value: "3", label: "Portales · Público · Alumno · Admin" },
      { value: "20+", label: "Módulos de gestión" },
      { value: "100%", label: "Diseño responsive" },
      { value: "24/7", label: "Disponible en la nube" },
    ],
    story: [
      "Tecos Elite VOLLEYBALL necesitaba dejar atrás hojas de cálculo y chats sueltos: una plataforma completa para academia, alumnos, pagos, tienda y comunicación.",
      "ATRIX TECHNOLOGIES diseñó identidad, narrativa visual y software a medida — con sensibilidad artística (color, tipografía, motion) e ingeniería práctica: bases de datos seguras, paneles intuitivos y experiencias rápidas en móvil y escritorio.",
      "El resultado es un sistema en producción: landing pública, portal alumno, panel administrativo, tienda/POS, WhatsApp, exportaciones y secciones administrables sin tocar código.",
    ],
    approach: [
      {
        title: "Escuchar e imaginar",
        copy: "Cada proyecto lleva una historia: la del equipo y de quienes confían en la marca. Escuchamos, diseñamos y construimos para pantallas reales.",
      },
      {
        title: "Arte + ingeniería",
        copy: "Color, tipografía y motion con bases de datos seguras, permisos por rol y carga rápida en móvil y escritorio.",
      },
      {
        title: "Sin plantillas genéricas",
        copy: "Soluciones pensadas para la operación de la academia: pagos, inventario, eventos y comunicación conectados.",
      },
    ],
    deliverables: [
      {
        title: "Landing pública",
        copy: "Avisos, calendario, entrenadores, galería, tienda, mapa y formulario de interesados.",
      },
      {
        title: "Portal alumno",
        copy: "Pagos, eventos, tienda online, documentos, credencial digital y cartas de torneo.",
      },
      {
        title: "Panel administrativo",
        copy: "Alumnos, ventas, comprobantes, inventario, nómina, gastos y dashboard financiero.",
      },
      {
        title: "Tienda & POS",
        copy: "Catálogo web, órdenes con comprobante, venta en mostrador e inventario sincronizado.",
      },
      {
        title: "Comunicación",
        copy: "WhatsApp bot, avisos con registro, leads de interesados y notificaciones.",
      },
      {
        title: "Exportaciones & config",
        copy: "Excel, PDF, DOCX, credenciales, asistencias; textos, mapa, redes y tarifas editables.",
      },
    ],
    lead: {
      name: "Ing. Néstor J. Resendiz, MBA",
      role: "Diseñador · Programador · Líder técnico · ATRIX Technologies",
      badges: ["Ingeniería", "MBA", "Full stack"],
      copy: [
        "Encargado del diseño visual, la arquitectura y la programación de Tecos Elite VOLLEYBALL: UX, panel admin, tienda, formularios de interesados y conexión con la base de datos en la nube.",
        "Enfoque: código limpio, interfaces claras y comunicación directa con el cliente hasta que cada requisito quede en funcionalidad real.",
      ],
    },
    highlights: [
      "3 portales: público, alumno y administración",
      "20+ módulos: pagos, tienda, inventario, nómina y dashboard",
      "WhatsApp bot + Edge Functions (wa-bridge)",
      "Exportaciones Excel / PDF / DOCX y credenciales digitales",
      "Galería, eventos, mapa y configuración editable sin código",
      "Despliegue en Vercel con CI/CD vía GitHub Actions",
    ],
    stackNote: "React 18 · Supabase · Vercel · WhatsApp",
    seoTitle:
      "Tecos Elite Voleibol — plataforma de academia con portal, admin y tienda",
    seoDescription:
      "Caso ATRIX Technologies: plataforma integral de Tecos Elite VOLLEYBALL con landing, portal alumno, panel admin, tienda/POS, WhatsApp, exportaciones y cloud Supabase.",
    keywords: [
      "software academia voleibol",
      "Tecos Elite Academy",
      "portal alumnos deportes",
      "gestión club deportivo",
      "tienda POS academia",
      "Supabase React Vercel",
      "ATRIX Technologies",
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
      "Una academia deportiva no puede vivir de hojas de cálculo y chats: necesita un sistema para alumnos, pagos, tienda, eventos y administración.",
    solution:
      "Entregamos una plataforma integrada — cara pública, portal alumno y panel admin — con módulos operativos reales y configuración editable.",
    impact: [
      "Operación centralizada del club en la nube",
      "Mejor experiencia para alumnos y padres",
      "Control financiero, inventario y comunicación WhatsApp",
    ],
    modules: [
      {
        title: "Landing pública",
        copy: "Avisos, calendario, entrenadores, galería, tienda, mapa y leads.",
      },
      {
        title: "Portal alumno",
        copy: "Pagos, eventos, tienda, documentos, credencial y cartas de torneo.",
      },
      {
        title: "Panel administrativo",
        copy: "Alumnos, ventas, comprobantes, inventario, nómina, gastos y dashboard.",
      },
      {
        title: "Tienda & POS",
        copy: "Catálogo, órdenes, venta en mostrador e inventario sincronizado.",
      },
      {
        title: "Comunicación",
        copy: "WhatsApp bot, avisos, interesados y notificaciones.",
      },
      {
        title: "Galería & eventos",
        copy: "Álbumes, calendario, torneos, cumpleaños y confirmación de asistencia.",
      },
      {
        title: "Exportaciones",
        copy: "Excel, PDF, expedientes DOCX, credenciales y reportes de pagos.",
      },
      {
        title: "Configuración",
        copy: "Textos del sitio, ubicación, mapa, redes y tarifas sin tocar código.",
      },
    ],
    technologies: [
      { name: "React 18 + JSX", role: "SPA modular: landing, admin y portal alumno" },
      { name: "Supabase", role: "Auth, PostgreSQL, Storage y API realtime" },
      { name: "PostgreSQL + RLS", role: "Migraciones SQL y seguridad por rol" },
      { name: "Vercel + GitHub", role: "Hosting, CI/CD y verificación en cada push" },
      { name: "Babel + esbuild", role: "Compilación JSX optimizada bajo demanda" },
      { name: "Edge Functions", role: "Puente WhatsApp (wa-bridge) serverless" },
      { name: "WhatsApp Service", role: "Bot, recordatorios y envío masivo" },
      { name: "Google Maps + Leaflet", role: "Mapa interactivo con fallback OSM" },
      { name: "Chart.js & SVG", role: "Gráficas de ingresos en dashboard admin" },
      { name: "ExcelJS · jsPDF · DOCX", role: "Reportes, expedientes y cartas de torneo" },
      { name: "Storage + RPC", role: "Comprobantes, fotos, galería y funciones SQL" },
      { name: "Bebas Neue + Inter", role: "Tipografía deportiva y legible" },
    ],
    process: [
      {
        title: "Descubrimiento y alcance",
        copy: "Módulos: landing, admin, portal alumno, tienda, leads, galería, entrenadores y config editable.",
      },
      {
        title: "Diseño y prototipado",
        copy: "Identidad Tecos Elite, componentes reutilizables, animaciones y experiencia móvil.",
      },
      {
        title: "Implementación y pruebas",
        copy: "Supabase, permisos, archivos, exportaciones y ajustes con feedback del cliente.",
      },
      {
        title: "Entrega y evolución",
        copy: "Producción lista para operar, administrable sin código y abierta a nuevos módulos.",
      },
    ],
    persuasion: [
      "Si tu academia crece, necesitas sistema — no más chats y hojas sueltas.",
      "ATRIX entrega operación real: pagos, alumnos, tienda, admin y WhatsApp.",
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
      "Plataforma integral Tecos Taekwondo MBT: landing pública, portal alumno, panel admin, tienda/POS, pagos, galería y comunicación WhatsApp.",
    result:
      "Academia operando en la nube 24/7: 3 portales, 20+ módulos de gestión y configuración editable sin tocar código.",
    url: "https://www.tecostaekwondo.com",
    designerUrl: "https://www.tecostaekwondo.com/diseñador.html",
    previewImage: "/projects/tecos-tkd-preview.jpg",
    logo: "/projects/logos/tecos-taekwondo.png",
    tags: [
      "Branding & identidad",
      "UX / UI",
      "Desarrollo web",
      "Plataformas a medida",
      "Marketing digital",
      "Estrategia creativa",
    ],
    stats: [
      { value: "1", label: "Plataforma integrada" },
      { value: "3", label: "Portales · Público · Alumno · Admin" },
      { value: "20+", label: "Módulos de gestión" },
      { value: "100%", label: "Diseño responsive" },
      { value: "24/7", label: "Disponible en la nube" },
    ],
    story: [
      "Tecos Taekwondo MBT necesitaba dejar atrás hojas de cálculo y chats sueltos: una plataforma completa para academia, alumnos, pagos, tienda y comunicación.",
      "ATRIX TECHNOLOGIES diseñó identidad, narrativa visual y software a medida — con sensibilidad artística (color, tipografía, motion) e ingeniería práctica: bases de datos seguras, paneles intuitivos y experiencias rápidas en móvil y escritorio.",
      "El resultado es un sistema en producción alineado a la marca Tecos: landing pública, portal alumno, panel administrativo, tienda/POS, WhatsApp, exportaciones y secciones administrables sin tocar código.",
    ],
    approach: [
      {
        title: "Escuchar e imaginar",
        copy: "Cada proyecto lleva una historia: la del equipo y de quienes confían en la marca. Escuchamos, diseñamos y construimos para pantallas reales.",
      },
      {
        title: "Arte + ingeniería",
        copy: "Color, tipografía y motion con bases de datos seguras, permisos por rol y carga rápida en móvil y escritorio.",
      },
      {
        title: "Sin plantillas genéricas",
        copy: "Soluciones pensadas para la operación del dojang: pagos, inventario, eventos y comunicación conectados.",
      },
    ],
    deliverables: [
      {
        title: "Landing pública",
        copy: "Avisos, calendario, entrenadores, galería, tienda, mapa y formulario de interesados.",
      },
      {
        title: "Portal alumno",
        copy: "Pagos, eventos, tienda online, documentos, credencial digital y cartas de torneo.",
      },
      {
        title: "Panel administrativo",
        copy: "Alumnos, ventas, comprobantes, inventario, nómina, gastos y dashboard financiero.",
      },
      {
        title: "Tienda & POS",
        copy: "Catálogo web, órdenes con comprobante, venta en mostrador e inventario sincronizado.",
      },
      {
        title: "Comunicación",
        copy: "WhatsApp bot (OpenWA / whatsapp-web.js), avisos, leads y notificaciones.",
      },
      {
        title: "Exportaciones & config",
        copy: "Excel, PDF, DOCX, credenciales, asistencias; textos, mapa, redes y tarifas editables.",
      },
    ],
    lead: {
      name: "Ing. Néstor J. Resendiz, MBA",
      role: "Diseñador · Programador · Líder técnico · ATRIX Technologies",
      badges: ["Ingeniería", "MBA", "Full stack"],
      copy: [
        "Encargado del diseño visual, la arquitectura y la programación de Tecos Taekwondo MBT: UX, panel admin, tienda, formularios de interesados y conexión con la base de datos en la nube.",
        "Enfoque: código limpio, interfaces claras y comunicación directa con el cliente hasta que cada requisito quede en funcionalidad real.",
      ],
    },
    highlights: [
      "3 portales: público, alumno y administración",
      "20+ módulos: pagos, tienda, inventario, nómina y dashboard",
      "WhatsApp local OpenWA + servicio de notificaciones",
      "Exportaciones Excel / PDF / DOCX y credenciales digitales",
      "Galería, eventos, mapa y configuración editable sin código",
      "Despliegue en Vercel con CI/CD vía GitHub Actions",
    ],
    stackNote: "React 18 · Supabase · Vercel · WhatsApp",
    seoTitle:
      "Tecos Taekwondo MBT — plataforma de academia con portal, admin y tienda",
    seoDescription:
      "Caso ATRIX Technologies: plataforma integral de Tecos Taekwondo MBT con landing, portal alumno, panel admin, tienda/POS, WhatsApp, exportaciones y cloud Supabase.",
    keywords: [
      "software taekwondo",
      "Tecos Taekwondo MBT",
      "gestión academia artes marciales",
      "portal alumnos dojang",
      "tienda POS academia",
      "Supabase React Vercel",
      "ATRIX Technologies",
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
      "La academia necesitaba estructura digital para alumnos, coaches y el ritmo diario de clases, pagos, tienda y eventos — sin sistemas sueltos.",
    solution:
      "Implementamos una plataforma integrada alineada a Tecos Taekwondo MBT: cara pública, portal alumno y panel admin con módulos operativos reales.",
    impact: [
      "Operación centralizada del dojang en la nube",
      "Mejor experiencia para alumnos y padres",
      "Control financiero, inventario y comunicación WhatsApp",
    ],
    modules: [
      {
        title: "Landing pública",
        copy: "Avisos, calendario, entrenadores, galería, tienda, mapa y leads.",
      },
      {
        title: "Portal alumno",
        copy: "Pagos, eventos, tienda, documentos, credencial y cartas de torneo.",
      },
      {
        title: "Panel administrativo",
        copy: "Alumnos, ventas, comprobantes, inventario, nómina, gastos y dashboard.",
      },
      {
        title: "Tienda & POS",
        copy: "Catálogo, órdenes, venta en mostrador e inventario sincronizado.",
      },
      {
        title: "Comunicación",
        copy: "WhatsApp bot, avisos, interesados y notificaciones.",
      },
      {
        title: "Galería & eventos",
        copy: "Álbumes, calendario, torneos, cumpleaños y confirmación de asistencia.",
      },
      {
        title: "Exportaciones",
        copy: "Excel, PDF, expedientes DOCX, credenciales y reportes de pagos.",
      },
      {
        title: "Configuración",
        copy: "Textos del sitio, ubicación, mapa, redes y tarifas sin tocar código.",
      },
    ],
    technologies: [
      { name: "React 18 + JSX", role: "SPA modular: landing, admin y portal alumno" },
      { name: "Supabase", role: "Auth, PostgreSQL, Storage y API realtime" },
      { name: "PostgreSQL + RLS", role: "Migraciones SQL y seguridad por rol" },
      { name: "Vercel + GitHub", role: "Hosting, CI/CD y verificación en cada push" },
      { name: "Babel + esbuild", role: "Compilación JSX optimizada bajo demanda" },
      { name: "WhatsApp OpenWA", role: "Bot local en Mac para recordatorios desde admin" },
      { name: "WhatsApp Service", role: "Notificaciones y envío masivo (whatsapp-web.js)" },
      { name: "Google Maps + Leaflet", role: "Mapa interactivo con fallback OSM" },
      { name: "Chart.js & SVG", role: "Gráficas de ingresos en dashboard admin" },
      { name: "ExcelJS · jsPDF · DOCX", role: "Reportes, expedientes y cartas de torneo" },
      { name: "Storage + RPC", role: "Comprobantes, fotos, galería y funciones SQL" },
      { name: "Bebas Neue + Inter", role: "Tipografía deportiva y legible" },
    ],
    process: [
      {
        title: "Descubrimiento y alcance",
        copy: "Módulos: landing, admin, portal alumno, tienda, leads, galería, entrenadores y config editable.",
      },
      {
        title: "Diseño y prototipado",
        copy: "Identidad Tecos Taekwondo MBT, componentes reutilizables, animaciones y experiencia móvil.",
      },
      {
        title: "Implementación y pruebas",
        copy: "Supabase, permisos, archivos, exportaciones y ajustes con feedback del cliente.",
      },
      {
        title: "Entrega y evolución",
        copy: "Producción lista para operar, administrable sin código y abierta a nuevos módulos.",
      },
    ],
    persuasion: [
      "Tu dojang puede operar con la seriedad de un club profesional.",
      "ATRIX entrega operación real: pagos, alumnos, tienda, admin y WhatsApp.",
      "Menos fricción administrativa, más foco en el entrenamiento.",
    ],
    year: "2025–2026",
    location: "Nuevo Laredo, Tamaulipas",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
