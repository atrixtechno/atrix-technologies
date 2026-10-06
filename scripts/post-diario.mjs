// "Consejo del día" para Instagram (local). Cada día cambia el diseño (consejo, pasos, checklist,
// mito o realidad, error común, pregunta), la decoración y el estilo de color; el tema rota por
// servicio. El contenido vive en marketing-diario/<fecha>/plan.json:
//   - si no existe, se crea con un consejo real de src/content/tips.ts del tema del día;
//   - si existe (por ejemplo, escrito con más detalle), se dibuja tal cual.
//   npm run post:diario                 → plan del día (crea o usa plan.json) y dibuja feed + historia
//   npm run post:diario -- --nuevo      → vuelve a crear plan.json automático
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const { dailyCard, DAILY_LAYOUTS, DAILY_DECORS } = await import("../src/lib/marketing/daily-card.tsx");
const { services } = await import("../src/content/services.ts");
const { dailyTips } = await import("../src/content/tips.ts");
const { MARKETING_STYLES } = await import("../src/lib/marketing/styles.ts");

const today = new Date(Date.now() - 6 * 3_600_000).toISOString().slice(0, 10); // Ciudad de México
const day = Math.floor(Date.parse(`${today}T00:00:00Z`) / 86_400_000);
const FIRST_DAY = Math.floor(Date.parse("2026-10-06T00:00:00Z") / 86_400_000);
const out = path.join(process.cwd(), "marketing-diario", today);
const planFile = path.join(out, "plan.json");
mkdirSync(out, { recursive: true });

// Temas por servicio, con las palabras para elegir consejos reales de tips.ts.
const THEMES = [
  { slug: "cctv", kicker: "CCTV", match: /c[aá]mara|cctv|dvr|nvr|vigil|grabaci/i },
  { slug: "redes-infraestructura", kicker: "Redes y WiFi", match: /wifi|red(es)?\b|router|cable|puerto|ancho de banda|internet/i },
  { slug: "soporte-tecnico", kicker: "Soporte técnico", match: /\bpc\b|laptop|computadora|disco|ssd|mantenimiento|lent|optimiza|actualiza equipos/i },
  { slug: "desarrollo-software", kicker: "Plataformas digitales", match: /sitio|web|sistema|panel|app|software|whatsapp/i },
  { slug: "soporte-it-empresarial", kicker: "IT empresarial", match: /respaldo|contrase|acceso|seguridad|admin|ti\b|responsable/i },
  { slug: "impresoras-perifericos", kicker: "Impresoras", match: /impresora|perif|usb/i },
];

function autoPlan() {
  // Ritmos de 6, 4 y 5 días: la misma combinación de diseño, estilo y decoración tarda 60 días en volver.
  const theme = THEMES[day % THEMES.length];
  const service = services.find((s) => s.slug === theme.slug) ?? services[0];
  // Primero consejos cuyo título es del tema; si no hay, los que lo mencionan en el texto.
  const byTitle = dailyTips.filter((tip) => theme.match.test(tip.title));
  const tips = byTitle.length >= 3 ? byTitle : dailyTips.filter((tip) => theme.match.test(`${tip.title} ${tip.copy}`));
  const tip = (tips.length ? tips : dailyTips)[Math.floor(day / THEMES.length) % (tips.length || dailyTips.length)];
  return {
    fecha: today,
    servicio: service.slug,
    pagina: `https://atrixnld.com/servicios/${service.slug}`,
    layout: DAILY_LAYOUTS[day % DAILY_LAYOUTS.length],
    style: MARKETING_STYLES[day % MARKETING_STYLES.length].id,
    decor: DAILY_DECORS[day % DAILY_DECORS.length],
    number: day - FIRST_DAY + 1,
    kicker: theme.kicker,
    visual: service.image,
    cta: "Cotiza gratis en atrixnld.com",
    // Contenido automático (consejo real). Para "pasos", "checklist", "mito", "error" o "pregunta",
    // reescribe title/body/items con este mismo tema; si faltan items, se dibuja como "consejo".
    title: tip.title,
    body: tip.copy,
    items: [],
    consejo_base: tip,
    servicio_datos: { titulo: service.title, texto: service.copy, incluye: service.bullets },
  };
}

if (!existsSync(planFile) || process.argv.includes("--nuevo")) writeFileSync(planFile, JSON.stringify(autoPlan(), null, 2));
const plan = JSON.parse(readFileSync(planFile, "utf8"));

const date = new Date(`${today}T18:00:00Z`);
for (const format of ["feed", "historia"]) {
  const image = await dailyCard(plan, format, date);
  writeFileSync(path.join(out, `consejo-${format}.jpg`), Buffer.from(await image.arrayBuffer()));
}
console.log(JSON.stringify({ carpeta: out, plan: planFile, layout: plan.layout, style: plan.style, decor: plan.decor, number: plan.number, tema: plan.kicker, title: plan.title }, null, 2));
