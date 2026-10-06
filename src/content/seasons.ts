/**
 * Temporadas y festividades para el "Consejo del día" (Instagram). Cada una dice cuándo aplica,
 * con qué servicios conecta y qué ángulos de consejo tienen sentido (sin promociones ni
 * descuentos: ATRIX no las ofrece en el sitio). Fechas de Nuevo Laredo / Laredo, TX.
 * Puro (sin dependencias) para el script local y las pruebas.
 */

export type SeasonMotif = "flor" | "estrella" | "corazon" | "gota" | "sol" | "copo" | "confeti" | "tricolor" | "libro" | "calabaza";

export type Season = {
  id: string;
  name: string;
  /** "festividad": un día (o pocos) con cuenta regresiva; "temporada": semanas, una vez por semana. */
  kind: "festividad" | "temporada";
  /** Rango [inicio, fin] del año dado (UTC, fechas sin hora). */
  window: (year: number) => [Date, Date];
  /** Días antes del inicio en que ya se puede hablar de ella (festividades). */
  leadDays?: number;
  /** Color de acento de la imagen ese día. */
  accent: string;
  motif: SeasonMotif;
  /** Servicios con los que conecta (slugs de services.ts), en orden de preferencia. */
  services: string[];
  /** Ideas de consejo verdaderas y útiles para esa fecha. */
  angles: string[];
  hashtags: string[];
  /** Fechas que cambian cada año y no están confirmadas: no se escribe la fecha exacta en la publicación. */
  approximate?: boolean;
};

const d = (y: number, m: number, day: number) => new Date(Date.UTC(y, m - 1, day));

/** n-ésimo día de la semana del mes (weekday 0 = domingo). n = -1: el último. */
export function nthWeekday(year: number, month: number, weekday: number, n: number) {
  if (n < 0) {
    const last = d(year, month + 1, 0);
    return d(year, month, last.getUTCDate() - ((last.getUTCDay() - weekday + 7) % 7));
  }
  const first = d(year, month, 1);
  return d(year, month, 1 + ((weekday - first.getUTCDay() + 7) % 7) + (n - 1) * 7);
}

/** Domingo de Pascua (algoritmo de Meeus/Butcher). */
export function easter(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const h = (19 * a + b - Math.floor(b / 4) - Math.floor((b - Math.floor((8 * b + 13) / 25)) / 3) + 15) % 30;
  const l = (32 + 2 * (b % 4) + 2 * Math.floor(c / 4) - h - (c % 4)) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return d(year, month, day);
}

const one = (date: Date): [Date, Date] => [date, date];

export const SEASONS: Season[] = [
  // --- Festividades ---------------------------------------------------------
  {
    id: "reyes", name: "Día de Reyes", kind: "festividad", window: (y) => one(d(y, 1, 6)), leadDays: 2, accent: "#f5b800", motif: "estrella",
    services: ["soporte-tecnico", "redes-infraestructura"],
    angles: ["Configura bien los equipos nuevos que llegaron (cuentas, contraseñas, actualizaciones).", "Controles parentales y red de invitados para tablets y consolas de los niños."],
    hashtags: ["#DiaDeReyes"],
  },
  {
    id: "san-valentin", name: "Día del Amor y la Amistad", kind: "festividad", window: (y) => one(d(y, 2, 14)), leadDays: 3, accent: "#ff4d7a", motif: "corazon",
    services: ["soporte-it-empresarial", "desarrollo-software"],
    angles: ["Cuidado con mensajes y enlaces de 'regalos' o 'tarjetas' que piden datos (phishing).", "Para negocios: tu sitio y WhatsApp listos para la temporada de pedidos."],
    hashtags: ["#SanValentin", "#14DeFebrero"],
  },
  {
    id: "bandera", name: "Día de la Bandera", kind: "festividad", window: (y) => one(d(y, 2, 24)), accent: "#0f8a4a", motif: "tricolor",
    services: ["soporte-tecnico", "cctv"], angles: ["Orgullo local: tecnología bien hecha en Nuevo Laredo."], hashtags: ["#DiaDeLaBandera"],
  },
  {
    id: "mujer", name: "Día Internacional de la Mujer", kind: "festividad", window: (y) => one(d(y, 3, 8)), accent: "#8b5cf6", motif: "confeti",
    services: ["cctv", "soporte-it-empresarial"],
    angles: ["Seguridad digital: privacidad en redes, contraseñas y verificación en dos pasos.", "Cámaras con acceso desde el celular para más tranquilidad en casa y el negocio."],
    hashtags: ["#8M", "#DiaDeLaMujer"],
  },
  {
    id: "semana-santa", name: "Semana Santa", kind: "festividad", window: (y) => { const e = easter(y); return [new Date(e.getTime() - 7 * 86_400_000), e]; }, leadDays: 5, accent: "#7c5cff", motif: "sol",
    services: ["cctv", "soporte-it-empresarial"],
    angles: ["Si sales de vacaciones: revisa que las cámaras graben y se vean desde tu celular.", "Negocio cerrado unos días: respaldos al día y equipos apagados o protegidos."],
    hashtags: ["#SemanaSanta", "#Vacaciones"],
  },
  {
    id: "dia-nino", name: "Día del Niño", kind: "festividad", window: (y) => one(d(y, 4, 30)), leadDays: 3, accent: "#00b4d8", motif: "confeti",
    services: ["redes-infraestructura", "soporte-tecnico"],
    angles: ["Controles parentales y red separada para los dispositivos de los niños.", "Configura bien la tablet o consola nueva antes de entregarla."],
    hashtags: ["#DiaDelNino"],
  },
  {
    id: "trabajo", name: "Día del Trabajo", kind: "festividad", window: (y) => one(d(y, 5, 1)), accent: "#1a63e6", motif: "confeti",
    services: ["soporte-it-empresarial", "soporte-tecnico"], angles: ["Herramientas que le ahorran tiempo a tu equipo de trabajo."], hashtags: ["#DiaDelTrabajo"],
  },
  {
    id: "madres", name: "Día de las Madres", kind: "festividad", window: (y) => one(d(y, 5, 10)), leadDays: 4, accent: "#ff5c8a", motif: "flor",
    services: ["cctv", "soporte-tecnico"],
    angles: ["Ayúdale a mamá a ver las cámaras de la casa desde su celular.", "Respaldo de las fotos familiares del celular antes de que se pierdan."],
    hashtags: ["#DiaDeLasMadres", "#10DeMayo"],
  },
  {
    id: "padre", name: "Día del Padre", kind: "festividad", window: (y) => one(nthWeekday(y, 6, 0, 3)), leadDays: 4, accent: "#1a63e6", motif: "estrella",
    services: ["soporte-tecnico", "redes-infraestructura"], angles: ["Esa laptop o PC que papá usa para trabajar: mantenimiento y respaldo.", "WiFi que llegue al taller o la cochera."], hashtags: ["#DiaDelPadre"],
  },
  {
    id: "4-julio", name: "4 de Julio", kind: "festividad", window: (y) => one(d(y, 7, 4)), leadDays: 2, accent: "#d62839", motif: "estrella",
    services: ["cctv"], angles: ["Si sales del lado americano por el puente largo: cámaras listas en casa y negocio."], hashtags: ["#Laredo", "#July4th"],
  },
  {
    id: "regreso-clases", name: "Regreso a clases", kind: "festividad", window: (y) => [d(y, 8, 18), d(y, 8, 24)], leadDays: 6, accent: "#ff9f1c", motif: "libro", approximate: true,
    services: ["soporte-tecnico", "impresoras-perifericos", "redes-infraestructura"],
    angles: ["Laptop lista para la escuela: limpieza, actualizaciones y antivirus.", "Impresora configurada en red antes de las tareas.", "WiFi que llegue al cuarto de estudio."],
    hashtags: ["#RegresoAClases"],
  },
  {
    id: "fiestas-patrias", name: "Fiestas Patrias", kind: "festividad", window: (y) => [d(y, 9, 15), d(y, 9, 16)], leadDays: 5, accent: "#0f8a4a", motif: "tricolor",
    services: ["cctv", "redes-infraestructura"],
    angles: ["Si tu negocio cierra por el puente: cámaras grabando y visibles desde el celular.", "Reunión en casa: red de invitados para no compartir tu contraseña principal."],
    hashtags: ["#FiestasPatrias", "#VivaMexico"],
  },
  {
    id: "halloween", name: "Halloween", kind: "festividad", window: (y) => one(d(y, 10, 31)), leadDays: 4, accent: "#ff7a00", motif: "calabaza",
    services: ["soporte-it-empresarial", "cctv"],
    angles: ["Lo que de verdad da miedo: perder tu información sin respaldo.", "Correos y mensajes 'que asustan' (cuentas bloqueadas, cobros falsos): no abras enlaces."],
    hashtags: ["#Halloween"],
  },
  {
    id: "muertos", name: "Día de Muertos", kind: "festividad", window: (y) => [d(y, 11, 1), d(y, 11, 2)], leadDays: 3, accent: "#ff8a00", motif: "flor",
    services: ["soporte-tecnico", "cctv"],
    angles: ["Respalda tus fotos familiares: los recuerdos también se cuidan.", "Con respeto: tecnología que ayuda a conservar la memoria familiar (respaldos en la nube y discos)."],
    hashtags: ["#DiaDeMuertos", "#Tradicion"],
  },
  {
    id: "buen-fin", name: "El Buen Fin", kind: "festividad", window: (y) => { const end = nthWeekday(y, 11, 1, 3); return [new Date(end.getTime() - 4 * 86_400_000), end]; }, leadDays: 6, accent: "#e63946", motif: "confeti", approximate: true,
    services: ["soporte-tecnico", "redes-infraestructura", "cctv"],
    angles: ["Antes de comprar equipo: revisa que sea compatible con lo que ya tienes.", "Compras en línea seguras: verifica la página y desconfía de ofertas por mensaje.", "¿Cámaras o router nuevos? Instalados bien rinden lo que pagaste."],
    hashtags: ["#ElBuenFin"],
  },
  {
    id: "revolucion", name: "Día de la Revolución", kind: "festividad", window: (y) => one(nthWeekday(y, 11, 1, 3)), accent: "#0f8a4a", motif: "tricolor",
    services: ["cctv"], angles: ["Puente largo: revisa que las cámaras de tu negocio graben."], hashtags: ["#20DeNoviembre"],
  },
  {
    id: "black-friday", name: "Black Friday y Cyber Monday", kind: "festividad", window: (y) => { const t = nthWeekday(y, 11, 4, 4); return [new Date(t.getTime() + 86_400_000), new Date(t.getTime() + 4 * 86_400_000)]; }, leadDays: 4, accent: "#111827", motif: "confeti",
    services: ["soporte-tecnico", "redes-infraestructura"],
    angles: ["Compras del lado americano o en línea: revisa voltaje, garantía y compatibilidad.", "Correos falsos de 'paquete retenido' en esta temporada: no abras enlaces."],
    hashtags: ["#BlackFriday", "#CyberMonday", "#Laredo"],
  },
  {
    id: "navidad", name: "Navidad", kind: "festividad", window: (y) => [d(y, 12, 24), d(y, 12, 25)], leadDays: 8, accent: "#d62839", motif: "estrella",
    services: ["cctv", "soporte-tecnico", "redes-infraestructura"],
    angles: ["Viajas en diciembre: cámaras grabando y alertas activas en tu celular.", "Equipos de regalo: configúralos bien desde el primer día.", "Visitas en casa: red de invitados separada de la tuya."],
    hashtags: ["#Navidad", "#FelizNavidad"],
  },
  {
    id: "ano-nuevo", name: "Año Nuevo", kind: "festividad", window: (y) => [d(y, 12, 31), d(y + 1, 1, 1)], leadDays: 4, accent: "#f5b800", motif: "confeti",
    services: ["soporte-it-empresarial", "soporte-tecnico"],
    angles: ["Propósitos tecnológicos del año: respaldos, contraseñas y mantenimiento.", "Para negocios: inventario de equipos y plan de soporte para el año."],
    hashtags: ["#AñoNuevo"],
  },
  // --- Temporadas (una vez por semana) -------------------------------------
  {
    id: "wbca", name: "Celebración de Washington en Laredo", kind: "temporada", window: (y) => [d(y, 1, 20), d(y, 2, 22)], accent: "#1d4ed8", motif: "estrella", approximate: true,
    services: ["cctv", "redes-infraestructura"],
    angles: ["Temporada de eventos y visitas en la frontera: negocios con cámaras y red listos.", "Más movimiento en tu local: WiFi de clientes separado del de caja."],
    hashtags: ["#Laredo", "#WBCA"],
  },
  {
    id: "frio", name: "Temporada de frío", kind: "temporada", window: (y) => [d(y, 12, 1), d(y + 1, 2, 28)], accent: "#38bdf8", motif: "copo",
    services: ["cctv", "soporte-tecnico"],
    angles: ["Cámaras exteriores en heladas: revisa conexiones y que sigan grabando.", "Apagones por frío: protege tus equipos con regulador o no-break."],
    hashtags: ["#Frio", "#NuevoLaredo"],
  },
  {
    id: "calor", name: "Temporada de calor", kind: "temporada", window: (y) => [d(y, 5, 1), d(y, 8, 31)], accent: "#ff6b00", motif: "sol",
    services: ["soporte-tecnico", "cctv", "redes-infraestructura"],
    angles: ["El calor calienta los equipos: limpia ventiladores y deja espacio para ventilar.", "Router y DVR encerrados en un mueble sin aire se apagan solos.", "Cámaras al sol directo: revisa ubicación y carcasa."],
    hashtags: ["#Calor", "#NuevoLaredo"],
  },
  {
    id: "lluvias", name: "Temporada de lluvias y huracanes", kind: "temporada", window: (y) => [d(y, 6, 1), d(y, 11, 30)], accent: "#0ea5e9", motif: "gota",
    services: ["soporte-tecnico", "cctv", "redes-infraestructura"],
    angles: ["Tormentas y variaciones de luz: no-break y regulador para PC, router y DVR.", "Respaldo de tu información antes de la temporada.", "Cámaras exteriores: revisa sellos y conexiones contra el agua."],
    hashtags: ["#TemporadaDeLluvias", "#NuevoLaredo"],
  },
];

const DAY = 86_400_000;

export type ActiveSeason = { season: Season; phase: "hoy" | "proxima" | "temporada"; daysTo: number };

/**
 * La temporada o festividad que toca hoy (o null). Prioridad: festividad hoy > festividad próxima
 * (la más cercana) > temporada. Las temporadas solo salen un día por semana para no cansar.
 */
export function activeSeason(dateISO: string): ActiveSeason | null {
  const today = new Date(`${dateISO.slice(0, 10)}T00:00:00Z`);
  const year = today.getUTCFullYear();
  const candidates: ActiveSeason[] = [];
  for (const season of SEASONS) {
    for (const y of [year - 1, year]) {
      const [start, end] = season.window(y);
      if (today >= start && today <= end) {
        // Festividades de más de dos días (Buen Fin, Semana Santa…): un día sí y uno no, y el último.
        const index = Math.round((today.getTime() - start.getTime()) / DAY);
        const length = Math.round((end.getTime() - start.getTime()) / DAY) + 1;
        const show = season.kind === "temporada" || length <= 2 || index % 2 === 0 || index === length - 1;
        if (show) candidates.push({ season, phase: season.kind === "festividad" ? "hoy" : "temporada", daysTo: 0 });
      } else if (season.kind === "festividad" && season.leadDays && today < start) {
        const daysTo = Math.round((start.getTime() - today.getTime()) / DAY);
        if (daysTo <= season.leadDays) candidates.push({ season, phase: "proxima", daysTo });
      }
    }
  }
  const hoy = candidates.find((c) => c.phase === "hoy");
  if (hoy) return hoy;
  const next = candidates.filter((c) => c.phase === "proxima").sort((a, b) => a.daysTo - b.daysTo)[0];
  // Cuenta regresiva: un día sí y uno no, y siempre la víspera.
  if (next && (next.daysTo <= 1 || next.daysTo % 2 === 0)) return next;
  const weekly = Math.floor(today.getTime() / DAY) % 7 === 3;
  const temporada = candidates.find((c) => c.phase === "temporada");
  return weekly && temporada ? temporada : null;
}
