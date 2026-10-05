// Hora de Ciudad de México: sin horario de verano desde 2022, UTC−6 todo el año.
// Puro (sin dependencias) para el navegador y las pruebas.

const CDMX_OFFSET_MIN = -6 * 60;

/** "2026-10-04T19:00" (hora CDMX, como lo da <input type="datetime-local">) → ISO UTC. */
export function cdmxToIso(local: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local.trim());
  if (!match) return null;
  const [, y, m, d, h, min] = match.map(Number);
  return new Date(Date.UTC(y, m - 1, d, h, min) - CDMX_OFFSET_MIN * 60_000).toISOString();
}

/** ISO UTC → "YYYY-MM-DDTHH:mm" en hora CDMX. */
export function isoToCdmxInput(iso: string) {
  const date = new Date(new Date(iso).getTime() + CDMX_OFFSET_MIN * 60_000);
  return date.toISOString().slice(0, 16);
}

/** Lunes 00:00 (CDMX) de la semana que contiene `now`, como "YYYY-MM-DD". */
export function weekKey(now = new Date()) {
  const local = new Date(now.getTime() + CDMX_OFFSET_MIN * 60_000);
  const day = (local.getUTCDay() + 6) % 7;
  local.setUTCDate(local.getUTCDate() - day);
  return local.toISOString().slice(0, 10);
}

/** Fecha legible en CDMX: "dom 4 oct, 19:00". */
export function formatCdmx(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}
