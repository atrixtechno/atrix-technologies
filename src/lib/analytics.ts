export const ADMIN_SESSION_COOKIE = "atrix_admin_session";

export type PageViewRow = {
  id: string;
  path: string;
  hash: string | null;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
};

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
  recent: {
    path: string;
    hash: string | null;
    created_at: string;
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
    recent: [],
    updatedAt: new Date().toISOString(),
  };
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

export function aggregatePageViews(
  rows: Pick<PageViewRow, "path" | "hash" | "created_at">[],
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
    }
    if (t >= todayStart) today += 1;
    if (t >= fiveMinAgo) live5m += 1;
  }

  const topPages = [...pathCounts.entries()]
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topSections = [...sectionCounts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

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
    }));

  return {
    totals: {
      today,
      last7d,
      all: allTimeCount,
      live5m,
    },
    topPages,
    topSections,
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
