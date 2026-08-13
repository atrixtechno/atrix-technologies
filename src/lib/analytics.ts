export const ADMIN_SESSION_COOKIE = "atrix_admin_session";

export type PageViewRow = {
  id: string;
  path: string;
  hash: string | null;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  created_at: string;
};

export type AnalyticsPlace = { label: string; count: number };

export type AnalyticsStats = {
  configured: boolean;
  setupNote: string | null;
  totals: {
    today: number;
    last7d: number;
    all: number;
    live5m: number;
  };
  topPages: { path: string; count: number }[];
  topSections: { label: string; count: number }[];
  topCountries: AnalyticsPlace[];
  topCities: AnalyticsPlace[];
  topSources: AnalyticsPlace[];
  recent: {
    path: string;
    hash: string | null;
    created_at: string;
    city: string | null;
    region: string | null;
    country: string | null;
    source: string;
  }[];
  updatedAt: string;
};

export function shouldTrackPath(pathname: string): boolean {
  if (!pathname) return false;
  if (pathname.startsWith("/admin")) return false;
  if (pathname === "/login" || pathname.startsWith("/login/")) return false;
  if (pathname.startsWith("/api")) return false;
  return true;
}

export function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  const clean = pathname.split("?")[0] || "/";
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean || "/";
}

export function normalizeHash(hash: string | null | undefined): string | null {
  if (!hash) return null;
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  const trimmed = value.trim().slice(0, 120);
  return trimmed || null;
}

export function truncateUa(ua: string | null | undefined): string | null {
  if (!ua) return null;
  const trimmed = ua.trim().slice(0, 200);
  return trimmed || null;
}

export function emptyStats(setupNote: string | null): AnalyticsStats {
  return {
    configured: false,
    setupNote,
    totals: { today: 0, last7d: 0, all: 0, live5m: 0 },
    topPages: [],
    topSections: [],
    topCountries: [],
    topCities: [],
    topSources: [],
    recent: [],
    updatedAt: new Date().toISOString(),
  };
}

const COUNTRY_NAMES: Record<string, string> = {
  MX: "México",
  US: "Estados Unidos",
  CA: "Canadá",
  ES: "España",
  AR: "Argentina",
  CO: "Colombia",
  CL: "Chile",
  PE: "Perú",
  BR: "Brasil",
  GT: "Guatemala",
  HN: "Honduras",
  SV: "El Salvador",
  NI: "Nicaragua",
  CR: "Costa Rica",
  PA: "Panamá",
  DO: "República Dominicana",
  PR: "Puerto Rico",
  DE: "Alemania",
  FR: "Francia",
  GB: "Reino Unido",
  IT: "Italia",
  PT: "Portugal",
  NL: "Países Bajos",
  AU: "Australia",
  JP: "Japón",
  CN: "China",
  IN: "India",
};

function decodeHeaderValue(value: string | null): string | null {
  if (!value) return null;
  const raw = value.trim();
  if (!raw || raw === "unknown" || raw === "XX") return null;
  try {
    return decodeURIComponent(raw.replace(/\+/g, " ")).slice(0, 80) || null;
  } catch {
    return raw.slice(0, 80);
  }
}

/** Ciudad / región / país desde headers de Vercel o Cloudflare. No guarda IP. */
export function geoFromRequest(request: Request): {
  country: string | null;
  region: string | null;
  city: string | null;
} {
  const headers = request.headers;
  const country = decodeHeaderValue(
    headers.get("x-vercel-ip-country") ?? headers.get("cf-ipcountry"),
  );
  const region = decodeHeaderValue(
    headers.get("x-vercel-ip-country-region") ??
      headers.get("x-vercel-ip-region"),
  );
  const city = decodeHeaderValue(headers.get("x-vercel-ip-city"));
  return {
    country: country ? country.toUpperCase().slice(0, 8) : null,
    region: region ? region.toUpperCase().slice(0, 12) : null,
    city,
  };
}

export function countryLabel(code: string | null | undefined): string {
  if (!code) return "Desconocido";
  const upper = code.toUpperCase();
  return COUNTRY_NAMES[upper] ?? upper;
}

export function placeLabel(
  city: string | null | undefined,
  region: string | null | undefined,
  country: string | null | undefined,
): string {
  const countryName = countryLabel(country);
  if (city && country) return `${city}, ${countryName}`;
  if (city) return city;
  if (region && country) return `${region}, ${countryName}`;
  return countryName;
}

export function sourceFromReferrer(referrer: string | null | undefined): string {
  if (!referrer) return "Directo";
  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "Otro";
  }
  if (!host) return "Directo";
  if (host === "atrixnld.com" || host.endsWith(".atrixnld.com")) return "Interno";
  if (host.includes("google.")) return "Google";
  if (host.includes("facebook.") || host === "fb.com" || host.includes("fb.me")) {
    return "Facebook";
  }
  if (host.includes("instagram.")) return "Instagram";
  if (host.includes("whatsapp.")) return "WhatsApp";
  if (host.includes("bing.")) return "Bing";
  if (host.includes("yahoo.")) return "Yahoo";
  if (host.includes("tiktok.")) return "TikTok";
  if (host.includes("linkedin.")) return "LinkedIn";
  if (host.includes("youtube.") || host === "youtu.be") return "YouTube";
  return host;
}

/** Start of "today" in America/Mexico_City as ISO string. */
export function startOfTodayMexicoIso(now = new Date()): string {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    dtf
      .formatToParts(now)
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>;
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  const offsetMs = asUtc - now.getTime();
  const midnightUtcMs =
    Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      0,
      0,
      0,
    ) - offsetMs;
  return new Date(midnightUtcMs).toISOString();
}

function topFromMap(map: Map<string, number>, limit = 8): AnalyticsPlace[] {
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function aggregatePageViews(
  rows: Pick<
    PageViewRow,
    "path" | "hash" | "created_at" | "country" | "region" | "city" | "referrer"
  >[],
  allTimeCount: number,
): Omit<AnalyticsStats, "configured" | "setupNote" | "updatedAt"> {
  const now = Date.now();
  const fiveMinAgo = now - 5 * 60 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const todayStart = new Date(startOfTodayMexicoIso()).getTime();

  let today = 0;
  let last7d = 0;
  let live5m = 0;
  const pathCounts = new Map<string, number>();
  const sectionCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();
  const cityCounts = new Map<string, number>();
  const sourceCounts = new Map<string, number>();

  for (const row of rows) {
    const t = new Date(row.created_at).getTime();
    if (Number.isNaN(t)) continue;
    if (t >= sevenDaysAgo) {
      last7d += 1;
      pathCounts.set(row.path, (pathCounts.get(row.path) ?? 0) + 1);
      if (row.hash) {
        const label = `${row.path}#${row.hash}`;
        sectionCounts.set(label, (sectionCounts.get(label) ?? 0) + 1);
      }
      const country = countryLabel(row.country);
      countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);
      const city = placeLabel(row.city, row.region, row.country);
      cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
      const source = sourceFromReferrer(row.referrer);
      sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
    }
    if (t >= todayStart) today += 1;
    if (t >= fiveMinAgo) live5m += 1;
  }

  const recent = [...rows]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 20)
    .map((r) => ({
      path: r.path,
      hash: r.hash,
      created_at: r.created_at,
      city: r.city,
      region: r.region,
      country: r.country,
      source: sourceFromReferrer(r.referrer),
    }));

  return {
    totals: {
      today,
      last7d,
      all: allTimeCount,
      live5m,
    },
    topPages: topFromMap(pathCounts, 10).map((item) => ({
      path: item.label,
      count: item.count,
    })),
    topSections: topFromMap(sectionCounts, 10),
    topCountries: topFromMap(countryCounts, 8),
    topCities: topFromMap(cityCounts, 8),
    topSources: topFromMap(sourceCounts, 8),
    recent,
  };
}

/** Best-effort in-memory rate limit (per serverless instance). */
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimitOk(
  key: string,
  limit = 60,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}
