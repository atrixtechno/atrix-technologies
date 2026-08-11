export const unetePage = {
  eyebrow: "Carreras · Equipo ATRIX",
  title: "¿Quieres ser parte de ATRIX?",
  lead:
    "Buscamos personas con actitud técnica y profesionalismo. Soporte, CCTV, redes, software y conferencias en Nuevo Laredo y Laredo, TX.",
  identityEyebrow: "Nuestra identidad",
  identityTitle: "Identidad. Profesionalismo. Presencia.",
  identityLead:
    "Así se presenta ATRIX ante el cliente y en cada proyecto: con orden, marca clara y la seriedad de un equipo que va en serio.",
  identityPillars: [
    {
      label: "Presencia",
      copy: "Una imagen coherente en campo, en oficina y frente al cliente.",
    },
    {
      label: "Detalle",
      copy: "Cada pieza comunica precisión, cuidado y estándares altos.",
    },
    {
      label: "Compromiso",
      copy: "No improvisamos: trabajamos con identidad y responsabilidad.",
    },
  ],
  whatsappMessage:
    "Hola ATRIX Technologies, quiero unirme al equipo. Les envío mi CV / estoy interesado(a) en formar parte de ATRIX.",
} as const;

export const uneteIdentityGallery = [
  {
    src: "/brand/atrix-identidad.png",
    alt: "Identidad ATRIX Technologies: polo, gorra y hoodie con marca oficial",
    caption: "Colección de marca · Polo, gorra y hoodie",
  },
  {
    src: "/brand/atrix-uniforme.png",
    alt: "Identidad ATRIX Technologies: detalles de logo, mangas y presencia de equipo",
    caption: "Detalle de marca · Crest, mangas y presencia",
  },
] as const;

export const uneteAreas = [
  { label: "Soporte técnico", copy: "Campo y remoto para hogares y empresas." },
  { label: "CCTV y seguridad", copy: "Instalación, configuración y mantenimiento." },
  { label: "Redes", copy: "Conectividad estable en oficinas y comercios." },
  { label: "Software", copy: "Productos y herramientas que construimos." },
  { label: "Conferencias", copy: "IA, ciberseguridad y transformación digital." },
] as const;

export const uneteSteps = [
  {
    number: "01",
    title: "Envía tu CV por WhatsApp",
    copy: "Escríbenos con una breve presentación y adjunta tu currículum. Respondemos por el mismo canal.",
    cta: "whatsapp" as const,
  },
  {
    number: "02",
    title: "O completa el formulario",
    copy: "Si prefieres el sitio, usa el formulario de contacto e indícanos que quieres unirte al equipo.",
    cta: "form" as const,
  },
  {
    number: "03",
    title: "Conversamos",
    copy: "Revisamos perfil, experiencia y encaje con las necesidades del equipo en la frontera.",
    cta: null,
  },
] as const;
