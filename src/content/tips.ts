export type DailyTip = {
  title: string;
  copy: string;
};

/**
 * Consejos orientados a negocios que quieren (o deben) tener sitio web.
 * Se muestra 1 por día en el hero (ciclo continuo por día del año).
 */
export const dailyTips: DailyTip[] = [
  {
    title: "Tu negocio necesita más que un WhatsApp",
    copy: "El chat cierra ventas; un sitio web construye confianza las 24 horas y te hace ver profesional antes del primer mensaje.",
  },
  {
    title: "Una sola acción en tu página",
    copy: "WhatsApp, cita o formulario: elige una. Si pides cinco cosas a la vez, el cliente no hace ninguna.",
  },
  {
    title: "Diseña primero para celular",
    copy: "La mayoría te encuentra desde el teléfono. Si tu sitio no se entiende en 5 segundos en móvil, pierdes la visita.",
  },
  {
    title: "Muestra prueba real, no frases vacías",
    copy: "Fotos del local, resultados, opiniones y mapa convencen más que decir “somos los mejores”.",
  },
  {
    title: "SEO local: que te encuentren en tu ciudad",
    copy: "Nombre, servicios y ciudad en tu sitio + Google Business Profile = más clientes que buscan cerca de ti.",
  },
  {
    title: "Un sitio lento se siente poco serio",
    copy: "Si tarda en cargar, el cliente duda de tu negocio. Velocidad también es imagen de marca.",
  },
  {
    title: "No copies una plantilla genérica",
    copy: "Tu marca debe verse tuya: colores, tipografía y fotos propias. Lo genérico se olvida al instante.",
  },
  {
    title: "Explica qué haces en una frase",
    copy: "En el hero: qué ofreces, para quién y en qué ciudad. Si eso no está claro, el resto del sitio tampoco ayuda.",
  },
  {
    title: "Cada servicio importante merece su página",
    copy: "Así te encuentran cuando buscan el problema (“implantes”, “cambio de dólares”), no solo tu nombre.",
  },
  {
    title: "Facilita el siguiente paso",
    copy: "Horarios, ubicación, WhatsApp y “cómo agendar” visibles. Menos fricción = más contactos calificados.",
  },
  {
    title: "Tu sitio también ordena la operación",
    copy: "Un panel simple para leads o citas evita que se pierdan mensajes entre Excel y chats sueltos.",
  },
  {
    title: "Habla como tu cliente",
    copy: "Menos jerga técnica. Más beneficios, tiempos y qué pasa después de contactarte.",
  },
  {
    title: "La confianza se diseña",
    copy: "HTTPS, aviso de privacidad y formularios claros importan — sobre todo en salud, finanzas y datos personales.",
  },
  {
    title: "Mide lo que paga el sitio",
    copy: "No solo visitas: cuenta mensajes, formularios y citas. Eso dice si tu página está trabajando.",
  },
  {
    title: "Actualiza lo que cambia",
    copy: "Precios, horarios y servicios desactualizados queman confianza. Un sitio vivo vende más que uno abandonado.",
  },
  {
    title: "Antes/después y casos reales venden",
    copy: "En consultorios, talleres o academias, la evidencia visual acorta la decisión de escribirte.",
  },
  {
    title: "Presencia bilingüe en la frontera",
    copy: "Si atiendes Nuevo Laredo y Laredo, un sitio en español (y más idiomas si hace falta) abre más puertas.",
  },
  {
    title: "No escondas cómo contactarte",
    copy: "El botón de WhatsApp y el teléfono deben verse sin buscar. El cliente impaciente se va con el de al lado.",
  },
  {
    title: "Tu competencia ya está en Google",
    copy: "Si no tienes sitio, alguien más aparece cuando buscan tu giro. Estar online ya no es opcional.",
  },
  {
    title: "Empieza sólido, luego escala",
    copy: "Primero marca, contacto y servicios claros. Después panel, citas o tienda. ATRIX construye para crecer.",
  },
  {
    title: "Las redes no reemplazan tu sitio",
    copy: "Facebook e Instagram cambian reglas y algoritmos. Tu dominio es el lugar que controlas tú.",
  },
  {
    title: "Responde dudas antes de que pregunten",
    copy: "FAQ, tiempos de atención y qué incluye el servicio bajan mensajes repetidos y suben conversiones.",
  },
  {
    title: "La primera impresión es el hero",
    copy: "Logo, promesa y llamado a acción. Si el inicio confunde, casi nadie llega al final de la página.",
  },
  {
    title: "Invierte donde te ven todos los días",
    copy: "Un buen sitio trabaja de noche, en fin de semana y cuando tú estás ocupado atendiendo.",
  },
  {
    title: "Coherencia visual = marca fuerte",
    copy: "Mismos colores, tipografía y tono en web, WhatsApp y redes. Así te reconocen al instante.",
  },
  {
    title: "Captura el lead, no lo dejes en el chat",
    copy: "Guardar nombre, teléfono e interés en un panel evita olvidar prospectos en la conversación del día.",
  },
  {
    title: "Piensa en el cliente nuevo, no en ti",
    copy: "Él no conoce tu negocio. Guiarlo con claridad es más valioso que lucir “moderno” sin mensaje.",
  },
  {
    title: "Un dominio propio transmite seriedad",
    copy: "tunegocio.com genera más confianza que un link de redes o una bio temporal.",
  },
  {
    title: "Revisa tu sitio como cliente",
    copy: "Entra desde el celular, busca el WhatsApp y prueba el formulario. Si te cuesta a ti, al cliente también.",
  },
  {
    title: "El diseño debe vender, no solo decorar",
    copy: "Bonito sin conversión es un folleto caro. Bonito + claro + contacto fácil es un sistema que trae clientes.",
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
