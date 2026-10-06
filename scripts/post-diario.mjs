// Publicación del día para Instagram (local): dibuja la imagen de marca del servicio que toca hoy
// (feed 1080×1350 e historia 1080×1920) con el logo, el texto del servicio, su render y la franja de
// WhatsApp, y deja los datos reales del servicio para escribir el guion.
//   npm run post:diario            → el servicio de hoy
//   npm run post:diario -- cctv    → un servicio en particular (slug de src/content/services.ts)
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const { marketingCard } = await import("../src/lib/marketing/card.tsx");
const { services } = await import("../src/content/services.ts");
const { CONTACT_PHONE } = await import("../src/lib/marketing/templates.ts");
const { MARKETING_STYLES } = await import("../src/lib/marketing/styles.ts");

// Fecha de Ciudad de México (UTC−6).
const today = new Date(Date.now() - 6 * 3_600_000).toISOString().slice(0, 10);
const day = Math.floor(Date.parse(`${today}T00:00:00Z`) / 86_400_000);
const wanted = process.argv[2];
const service = (wanted && services.find((s) => s.slug === wanted)) || services[day % services.length];
// El estilo rota con otro ritmo que el servicio, así no se repite la misma combinación cada semana.
const style = MARKETING_STYLES[Math.floor(day / services.length) % MARKETING_STYLES.length].id;

const card = {
  kicker: service.osd,
  headline: service.title,
  subline: service.copy,
  // Las etiquetas van en el texto de la publicación: así el render del servicio gana espacio.
  chips: [],
  cta: "Cotiza gratis en atrixnld.com",
  style,
  visual: service.image,
  contactPhone: CONTACT_PHONE,
};

const out = path.join(process.cwd(), "marketing-diario", today);
mkdirSync(out, { recursive: true });
for (const format of ["feed", "historia"]) {
  const image = await marketingCard({ ...card, format });
  writeFileSync(path.join(out, `${service.slug}-${format}.jpg`), Buffer.from(await image.arrayBuffer()));
}
const data = { fecha: today, servicio: service.title, slug: service.slug, texto: service.copy, incluye: service.bullets, corto: service.short, estilo: style, pagina: `https://atrixnld.com/servicios/${service.slug}`, whatsapp: CONTACT_PHONE };
writeFileSync(path.join(out, "datos.json"), JSON.stringify(data, null, 2));
console.log(JSON.stringify({ carpeta: out, ...data }, null, 2));
