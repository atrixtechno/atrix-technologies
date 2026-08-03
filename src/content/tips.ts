export type DailyTip = {
  title: string;
  copy: string;
};

/** Consejos diarios para hogares y negocios (oferta completa ATRIX). */
export const dailyTips: DailyTip[] = [
  {
    title: "Un negocio sin respaldo tecnológico se frena",
    copy: "PC lenta, WiFi inestable o sin cámaras: son costos ocultos. La tecnología bien puesta se paga sola.",
  },
  {
    title: "Tu WhatsApp no reemplaza un sistema",
    copy: "El chat ayuda a vender; un sitio o panel ordena leads, citas y seguimiento sin perder prospectos.",
  },
  {
    title: "La seguridad empieza en casa y en el local",
    copy: "CCTV con acceso al celular te da tranquilidad cuando no estás. Ver es prevenir.",
  },
  {
    title: "WiFi débil = productividad rota",
    copy: "Antes de comprar más equipos, revisa cobertura y cableado. Una red estable cambia el día completo.",
  },
  {
    title: "Mantenimiento preventivo ahorra emergencias",
    copy: "Limpiar, actualizar y respaldar a tiempo cuesta menos que detener la operación por una falla.",
  },
  {
    title: "Impresoras mal configuradas queman horas",
    copy: "Instalación correcta en red evita “no imprime” cada semana. Un setup bien hecho dura.",
  },
  {
    title: "Tu marca también vive en línea",
    copy: "Un sitio claro con tus servicios y WhatsApp genera confianza antes del primer mensaje.",
  },
  {
    title: "No esperes a que falle lo crítico",
    copy: "Respaldos y soporte IT empresarial existen para que un disco dañado no borre tu negocio.",
  },
  {
    title: "El cableado ordenado evita dolores futuros",
    copy: "Redes improvisadas fallan en el peor momento. Infraestructura limpia = menos caídas.",
  },
  {
    title: "Atiende ambos lados de la frontera",
    copy: "Si tus clientes están en Nuevo Laredo y Laredo, tu tecnología y tu presencia digital deben llegar a ambos.",
  },
  {
    title: "Soporte remoto resuelve más de lo que crees",
    copy: "Muchas fallas se arreglan sin visita. Lo importante es diagnóstico rápido y comunicación clara.",
  },
  {
    title: "La tecnología debe adaptarse a ti",
    copy: "No compres por moda. Compra (o desarrolla) lo que tu casa o empresa realmente necesita.",
  },
  {
    title: "Un panel interno ordena el caos",
    copy: "Si recepción o ventas viven en Excel y chats, un sistema simple reduce errores y tiempos.",
  },
  {
    title: "CCTV visible también disuade",
    copy: "Además de grabar, una instalación profesional comunica que tu espacio está cuidado.",
  },
  {
    title: "Actualiza equipos antes de que te frenen",
    copy: "Una laptop antigua puede costarte más en tiempo perdido que invertir en una solución adecuada.",
  },
  {
    title: "Documenta accesos y contraseñas con orden",
    copy: "Redes, DVR y cuentas del negocio no pueden vivir en un papel suelto. Organización es seguridad.",
  },
  {
    title: "El sitio web trabaja cuando tú no",
    copy: "Horarios, servicios y contacto visibles 24/7. Ideal para captar mientras atiendes otra cosa.",
  },
  {
    title: "Soporte IT no es lujo: es continuidad",
    copy: "Empresas que miden uptime entienden que un técnico de confianza es parte del equipo.",
  },
  {
    title: "Elige un proveedor que explique",
    copy: "Si no entiendes qué te instalaron, dependes de alguien más. ATRIX te deja claridad, no misterio.",
  },
  {
    title: "Empieza por lo que más duele hoy",
    copy: "¿Red? ¿Cámaras? ¿PC? ¿Página web? Prioriza el cuello de botella y escala con plan.",
  },
  {
    title: "Monitorea tu negocio desde el celular",
    copy: "Cámaras y sistemas accesibles en móvil te dan control real, no solo “estar instalados”.",
  },
  {
    title: "Una red doméstica también merece diseño",
    copy: "Home office, streaming y cámaras compiten por ancho de banda. Se configura, no se improvisa.",
  },
  {
    title: "Software a la medida cuando lo genérico no alcanza",
    copy: "Si tu operación no cabe en una app genérica, un sistema propio puede ser la ventaja.",
  },
  {
    title: "La primera impresión también es técnica",
    copy: "Equipo lento o WiFi caído frente al cliente afecta tu imagen tanto como un local descuidado.",
  },
  {
    title: "Agenda soporte antes de temporada alta",
    copy: "En fechas fuertes, todos necesitan ayuda. Adelántate: revisa equipos y redes con tiempo.",
  },
  {
    title: "Integrar es más poderoso que acumular gadgets",
    copy: "Cámaras, red, PCs y web deben hablar el mismo idioma operativo: el de tu negocio.",
  },
  {
    title: "Pide evidencia de trabajo",
    copy: "Pruebas de grabación, cobertura WiFi o sitio en producción. Lo bien hecho se demuestra.",
  },
  {
    title: "Tu número de WhatsApp merece respaldo digital",
    copy: "Un sitio o ficha clara lleva gente calificada al chat — no solo curiosos sin contexto.",
  },
  {
    title: "Optimizar es más barato que reemplazar siempre",
    copy: "A veces una limpieza, SSD o reconfiguración alarga la vida útil sin comprar todo nuevo.",
  },
  {
    title: "Tecnología con compromiso local",
    copy: "En la frontera necesitas alguien que responda cerca. ATRIX está en Nuevo Laredo y Laredo, TX.",
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
