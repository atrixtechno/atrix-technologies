export const unetePage = {
  eyebrow: "Carreras · Equipo ATRIX",
  title: "¿Quieres ser parte de ATRIX?",
  lead:
    "Únete al equipo tech que impulsa soporte, CCTV, redes, software y conferencias en la frontera.",
  uniformCaption:
    "Nuestra identidad de equipo: polo, gorra y hoodie con la marca ATRIX. Profesionalismo visible en cada visita y cada proyecto.",
  whatsappMessage:
    "Hola ATRIX Technologies, quiero unirme al equipo. Les envío mi CV / estoy interesado(a) en formar parte de ATRIX.",
} as const;

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
    copy: "Escríbenos con una breve presentación y adjunta tu currículum. Respondemos al mismo canal.",
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
    copy: "Revisamos perfil, experiencia y encaje con las necesidades del equipo en Nuevo Laredo y Laredo, TX.",
    cta: null,
  },
] as const;
