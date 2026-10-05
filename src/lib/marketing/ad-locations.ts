import type { AdAudience, AdLocation } from "./types";

// Dónde se muestra una campaña pagada y a qué página lleva cada servicio. Seguro para el navegador.
// Las ciudades se segmentan con un radio alrededor de la ciudad en Meta. Laredo, TX es otro país
// para Meta (US): su clave se busca con country_code=US.

export const AD_LOCATIONS: Record<AdLocation, { label: string; short: string; city?: string; region?: string; country: "MX" | "US"; radiusKm?: number }> = {
  nuevo_laredo: { label: "Nuevo Laredo, Tamaulipas (+25 km)", short: "Nuevo Laredo", city: "Nuevo Laredo", region: "Tamaulipas", country: "MX", radiusKm: 25 },
  laredo_tx: { label: "Laredo, Texas (+25 km)", short: "Laredo, TX", city: "Laredo", region: "Texas", country: "US", radiusKm: 25 },
  monterrey: { label: "Monterrey y área metropolitana, Nuevo León (+25 km)", short: "Monterrey", city: "Monterrey", region: "Nuevo León", country: "MX", radiusKm: 25 },
  mx: { label: "Todo México", short: "todo México", country: "MX" },
};

export function adLocation(value: unknown): AdLocation {
  return typeof value === "string" && Object.hasOwn(AD_LOCATIONS, value) ? (value as AdLocation) : "nuevo_laredo";
}

/** Una audiencia por servicio de src/content/services.ts: a qué página lleva el anuncio. */
export const AD_AUDIENCES: Record<AdAudience, { label: string; short: string; landing: string; service: string }> = {
  cctv: { label: "Cámaras de seguridad (CCTV)", short: "CCTV", landing: "/servicios/cctv", service: "cctv" },
  soporte: { label: "Soporte técnico", short: "Soporte técnico", landing: "/soporte-remoto", service: "soporte-tecnico" },
  redes: { label: "Redes e infraestructura", short: "Redes", landing: "/servicios/redes-infraestructura", service: "redes-infraestructura" },
  software: { label: "Plataformas digitales (sitios, apps y sistemas)", short: "Plataformas digitales", landing: "/servicios/desarrollo-software", service: "desarrollo-software" },
  empresas: { label: "Soporte IT empresarial", short: "Soporte IT", landing: "/servicios/soporte-it-empresarial", service: "soporte-it-empresarial" },
};

export const AD_AUDIENCE_ORDER: AdAudience[] = ["cctv", "soporte", "redes", "software", "empresas"];

export function adAudience(value: unknown): AdAudience {
  return typeof value === "string" && Object.hasOwn(AD_AUDIENCES, value) ? (value as AdAudience) : "cctv";
}
