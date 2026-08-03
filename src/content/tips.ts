export type DailyTip = {
  title: string;
  copy: string;
  audience: "negocios" | "general" | "equipos";
};

/** Un consejo por día del año (ciclo continuo). */
export const dailyTips: DailyTip[] = [
  {
    title: "Tu WhatsApp no es tu sitio web",
    copy: "El chat cierra ventas; tu sitio construye confianza las 24 horas. Separar ambos multiplica resultados.",
    audience: "negocios",
  },
  {
    title: "Una sola acción clara",
    copy: "Cada página debe empujar a una acción: WhatsApp, cita o formulario. Si hay cinco CTAs, no hay ninguno.",
    audience: "negocios",
  },
  {
    title: "Móvil primero, siempre",
    copy: "La mayoría de tus clientes llegan desde el celular. Si no se lee bien en 5 segundos, pierdes la visita.",
    audience: "general",
  },
  {
    title: "Muestra prueba real",
    copy: "Fotos del local, resultados, opiniones y ubicación pesan más que frases genéricas de “calidad”.",
    audience: "negocios",
  },
  {
    title: "SEO local no es opcional",
    copy: "Nombre de ciudad, servicios y Google Business Profile alineados con tu sitio = más citas orgánicas.",
    audience: "negocios",
  },
  {
    title: "Velocidad es conversión",
    copy: "Un sitio lento se siente poco profesional. Optimiza imágenes, fuentes y scripts antes de sumar animaciones.",
    audience: "equipos",
  },
  {
    title: "Panel interno = menos caos",
    copy: "Si recepción o ventas viven en Excel y chats, un panel simple reduce errores y tiempos de respuesta.",
    audience: "negocios",
  },
  {
    title: "Habla el idioma del cliente",
    copy: "Menos jerga técnica o clínica. Más beneficios, tiempos y siguiente paso claro.",
    audience: "general",
  },
  {
    title: "Marca antes que plantilla",
    copy: "Una plantilla genérica se olvida. Tipografía, color y foto propios hacen que te recuerden.",
    audience: "negocios",
  },
  {
    title: "Mide una métrica útil",
    copy: "No mires solo visitas. Mira mensajes, formularios o citas. Eso es lo que paga el sitio.",
    audience: "equipos",
  },
  {
    title: "Contenido que responde dudas",
    copy: "FAQ, precios orientativos y “cómo agendar” bajan la fricción y aumentan contactos calificados.",
    audience: "negocios",
  },
  {
    title: "Seguridad básica visible",
    copy: "HTTPS, aviso de privacidad y formularios serios generan confianza — especialmente en salud y finanzas.",
    audience: "general",
  },
  {
    title: "Automatiza lo repetitivo",
    copy: "Confirmaciones, recordatorios y leads al panel liberan horas cada semana a tu equipo.",
    audience: "equipos",
  },
  {
    title: "Diseña para escanear",
    copy: "Títulos cortos, bloques claros, contraste alto. La gente no lee: escanea y decide.",
    audience: "general",
  },
];

export function getDailyTip(date = new Date()): DailyTip & { index: number; label: string } {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  const index = ((day % dailyTips.length) + dailyTips.length) % dailyTips.length;
  const tip = dailyTips[index];
  const label = date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return { ...tip, index, label };
}
