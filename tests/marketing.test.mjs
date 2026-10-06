// Marketing en redes y Campañas pagadas: reglas puras, armado de objetivos de Meta, Pixel,
// medición y candados de seguridad. Meta se simula: nada sale a internet.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

const ROOT = new URL("../", import.meta.url);
const src = (p) => readFileSync(new URL(p, ROOT), "utf8").replace(/\r\n/g, "\n");
const lib = (name) => import(new URL(`src/lib/marketing/${name}.ts`, ROOT).href);

const metaAds = await lib("meta-ads");
const rules = await lib("ads-rules");
const goals = await lib("ad-goals");
const locations = await lib("ad-locations");
const visits = await lib("visit-source");
const time = await lib("time");
const pixel = await lib("meta-pixel");
const templates = await lib("templates");
const social = await lib("social");
const store = await lib("store");

const ids = { pageId: "PAGE", igUserId: "IGU" };
const build = {
  name: "n",
  lifetimeBudgetCents: 30000,
  startAt: "2026-10-04T00:00:00Z",
  endAt: "2026-10-11T00:00:00Z",
  targeting: {},
  imageHash: "HASH",
  link: "https://atrixnld.com/a/x",
  message: "m",
  headline: "h",
  description: "d",
};
const s = (extra, i = ids) => metaAds.goalSettings({ ...build, ...extra }, i);

test("cada objetivo se arma con su objetivo, optimización, destino y botón de Meta", () => {
  const clics = s({});
  assert.equal(clics.objective, "OUTCOME_TRAFFIC");
  assert.equal(clics.adSet.optimization_goal, "LINK_CLICKS");
  assert.equal(clics.adSet.destination_type, "WEBSITE");
  assert.equal(clics.creative.object_story_spec.link_data.call_to_action.type, "GET_QUOTE");
  assert.equal(clics.creative.object_story_spec.link_data.link, build.link);

  const leads = s({ goal: "cotizaciones", conversionPixelId: "999" });
  assert.equal(leads.objective, "OUTCOME_LEADS");
  assert.equal(leads.adSet.optimization_goal, "OFFSITE_CONVERSIONS");
  assert.deepEqual(JSON.parse(leads.adSet.promoted_object), { pixel_id: "999", custom_event_type: "LEAD" });
  assert.throws(() => s({ goal: "cotizaciones" }), /Pixel/);

  const wa = s({ goal: "whatsapp", whatsappLinked: true });
  assert.equal(wa.objective, "OUTCOME_ENGAGEMENT");
  assert.equal(wa.adSet.optimization_goal, "CONVERSATIONS");
  assert.equal(wa.adSet.destination_type, "WHATSAPP");
  assert.equal(wa.creative.object_story_spec.link_data.call_to_action.type, "WHATSAPP_MESSAGE");
  assert.throws(() => s({ goal: "whatsapp" }), /WhatsApp/);

  const fb = s({ goal: "seguidores_fb" });
  assert.equal(fb.adSet.optimization_goal, "PAGE_LIKES");
  assert.equal(fb.adSet.destination_type, "ON_PAGE");
  assert.deepEqual(JSON.parse(fb.adSet.promoted_object), { page_id: "PAGE" });
  assert.deepEqual(fb.placements.publisher_platforms, ["facebook"], "los «me gusta» de página solo existen en Facebook");
  assert.deepEqual(fb.creative.object_story_spec.link_data.call_to_action, { type: "LIKE_PAGE", value: { page: "PAGE" } });

  const ig = s({ goal: "perfil_ig", igUsername: "atrixnld" });
  assert.equal(ig.adSet.optimization_goal, "VISIT_INSTAGRAM_PROFILE");
  assert.deepEqual(ig.placements.publisher_platforms, ["instagram"]);
  assert.equal(ig.creative.object_story_spec.link_data.link, "https://www.instagram.com/atrixnld");
  assert.throws(() => s({ goal: "perfil_ig", igUsername: "x" }, { pageId: "PAGE", igUserId: "" }), /Falta conectar Instagram/);
  assert.throws(() => s({ goal: "perfil_ig" }), /usuario de Instagram/);

  const post = s({ goal: "interaccion", postId: "PAGE_123" });
  assert.equal(post.adSet.optimization_goal, "POST_ENGAGEMENT");
  assert.deepEqual(post.creative, { object_story_id: "PAGE_123", instagram_user_id: "IGU" });
  assert.throws(() => s({ goal: "interaccion" }), /Elige la publicación/);

  const reach = s({ goal: "alcance" });
  assert.equal(reach.objective, "OUTCOME_AWARENESS");
  assert.equal(reach.adSet.optimization_goal, "REACH");
  assert.equal(reach.adSet.destination_type, undefined);
});

test("todos los objetivos del catálogo tienen armado en Meta y número principal", () => {
  for (const goal of goals.AD_GOAL_ORDER) {
    const extra = { goal, conversionPixelId: "9", whatsappLinked: true, postId: "P_1", igUsername: "u" };
    assert.ok(s(extra).objective.startsWith("OUTCOME_"), goal);
    assert.equal(typeof metaAds.goalResult(goal, { reach: 1, clicks: 2, actions: {} }), "number");
  }
  assert.equal(metaAds.goalResult("cotizaciones", { reach: 0, clicks: 0, actions: { "offsite_conversion.fb_pixel_lead": 4 } }), 4);
  assert.equal(goals.adGoal("inventado"), "clics");
});

test("se crea todo en pausa y sin categoría especial de empleo; si falla se borra lo creado", async () => {
  const calls = [];
  const realFetch = globalThis.fetch;
  process.env.META_AD_ACCOUNT_ID = "act_123";
  process.env.META_ADS_TOKEN = "token-de-prueba";
  process.env.META_PAGE_ID = "PAGE";
  globalThis.fetch = async (url, init) => {
    const body = init?.body ? Object.fromEntries(new URLSearchParams(String(init.body))) : {};
    calls.push({ url: String(url), method: init?.method ?? "GET", body });
    if (String(url).includes("/adcreatives")) return new Response(JSON.stringify({ error: { message: "creativo rechazado" } }), { status: 400 });
    return new Response(JSON.stringify({ id: `id${calls.length}` }), { status: 200 });
  };
  try {
    await assert.rejects(metaAds.createPausedAd({ ...build, goal: "clics" }), /creativo rechazado/);
    const campaign = calls.find((c) => c.url.endsWith("/act_123/campaigns"));
    const adset = calls.find((c) => c.url.endsWith("/act_123/adsets"));
    assert.equal(campaign.body.status, "PAUSED");
    assert.equal(campaign.body.special_ad_categories, "[]");
    assert.equal(adset.body.status, "PAUSED");
    assert.equal(adset.body.lifetime_budget, "30000");
    assert.ok(calls.some((c) => c.method === "DELETE" && c.url.includes("/id1")), "borra la campaña a medio crear");
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.META_AD_ACCOUNT_ID;
    delete process.env.META_ADS_TOKEN;
    delete process.env.META_PAGE_ID;
  }
});

test("presupuesto: mínimo, máximo, al menos $20 por día y de 1 a 30 días", () => {
  assert.equal(rules.budgetError(300, 7), null);
  assert.match(rules.budgetError(99, 3), /mínimo/);
  assert.match(rules.budgetError(100, 6), /\$20 MXN por día/);
  assert.match(rules.budgetError(300, 0), /1 a 30/);
  assert.match(rules.budgetError(9000, 30), /máximo/);
  process.env.AD_MAX_BUDGET_MXN = "10000";
  assert.equal(rules.budgetError(9000, 30), null);
  delete process.env.AD_MAX_BUDGET_MXN;
});

test("segmentación: ciudad con radio, Laredo TX en Estados Unidos y sin Advantage+ audience", () => {
  const nl = rules.targetingSpec("nuevo_laredo", "KEY1");
  assert.deepEqual(nl.geo_locations, { cities: [{ key: "KEY1", radius: 25, distance_unit: "kilometer" }] });
  assert.equal(nl.targeting_automation.advantage_audience, 0);
  assert.equal(locations.AD_LOCATIONS.laredo_tx.country, "US");
  assert.deepEqual(rules.targetingSpec("mx", null).geo_locations, { countries: ["MX"] });
  assert.deepEqual(rules.targetingSpec("laredo_tx", null).geo_locations, { countries: ["US"] });
});

test("cada servicio lleva a su página y tiene textos sin inventar precios", () => {
  for (const audience of locations.AD_AUDIENCE_ORDER) {
    const landing = locations.AD_AUDIENCES[audience].landing;
    assert.ok(landing === "/soporte-remoto" || landing.startsWith("/servicios/"), landing);
    for (const goal of goals.AD_GOAL_ORDER) {
      const words = rules.adDefaults(audience, "nuevo_laredo", goal);
      assert.doesNotMatch(`${words.headline} ${words.subline} ${words.message}`, /\$\s?\d|%|garantiza/i, `${audience}/${goal}`);
    }
  }
  const pages = readdirSync(new URL("src/app/servicios/", ROOT));
  assert.ok(pages.includes("[slug]"));
});

test("embudo, fondos, presupuesto apartado y seguidores ganados", () => {
  const funnel = rules.campaignFunnel({ stats: { impressions: 1000, clicks: 50, reach: 800, spend: 10, updatedAt: "" } }, { visits: 40, leads: 4, whatsapp: 10 });
  assert.deepEqual(
    funnel.map((step) => [step.key, step.value, step.rate]),
    [
      ["vistas", 1000, null],
      ["clics", 50, 5],
      ["visitas", 40, 80],
      ["cotizaciones", 4, 10],
      ["whatsapp", 10, 25],
    ],
  );
  assert.equal(rules.campaignFunnel({ stats: null }, undefined)[1].rate, null);
  const funds = rules.adFundsSummary(150.5, [
    { id: "a", at: "2026-10-01", amountMxn: 100, by: "admin" },
    { id: "b", at: "2026-10-03", amountMxn: 200, by: "admin" },
  ]);
  assert.equal(funds.addedMxn, 300);
  assert.equal(funds.leftMxn, 149.5);
  assert.equal(funds.entries[0].id, "b");
  assert.equal(rules.adFundsSummary(10, []).leftMxn, null);
  assert.equal(
    rules.reservedBudgetMxn([
      { status: "activa", budgetMxn: 300, stats: { spend: 100 } },
      { status: "pausada", budgetMxn: 200, stats: null },
      { status: "terminada", budgetMxn: 500, stats: null },
    ]),
    400,
  );
  assert.deepEqual(rules.followersGained({ goal: "seguidores_fb", followers: { fbStart: 100, igStart: 5, fb: 130, ig: 5, at: "" } }), { start: 100, now: 130, gained: 30 });
  assert.equal(rules.followersGained({ goal: "clics", followers: null }), null);
});

test("origen de la visita y campaña del anuncio", () => {
  assert.equal(visits.visitSource({ utmSource: "meta", utmMedium: "paid" }), "anuncios");
  assert.equal(visits.visitSource({ referrer: "https://l.instagram.com/x" }), "instagram");
  assert.equal(visits.visitSource({ fbclid: true }), "facebook");
  assert.equal(visits.visitSource({ referrer: "https://www.google.com.mx/" }), "google");
  assert.equal(visits.visitSource({ referrer: "https://atrixnld.com/proyectos", host: "atrixnld.com" }), "directo");
  assert.equal(visits.visitSource({ referrer: "https://otro.com" }), "otro");
  assert.equal(visits.campaignFromUtm("6F1C2A9E-1111-4222-8333-944455556666"), "6f1c2a9e-1111-4222-8333-944455556666");
  assert.equal(visits.campaignFromUtm("<script>"), null);
});

test("hora de Ciudad de México (UTC−6) y semana", () => {
  assert.equal(time.cdmxToIso("2026-10-05T19:00"), "2026-10-06T01:00:00.000Z");
  assert.equal(time.isoToCdmxInput("2026-10-06T01:00:00.000Z"), "2026-10-05T19:00");
  assert.equal(time.cdmxToIso("mañana"), null);
  assert.equal(time.weekKey(new Date("2026-10-07T12:00:00Z")), "2026-10-05");
});

test("Pixel: correo y teléfono con SHA-256, solo con permiso de cookies", async () => {
  const data = pixel.normalizedUserData({ email: " Hola@Atrix.MX ", phone: "867 729 0445" });
  assert.deepEqual(data.em, [pixel.sha256("hola@atrix.mx")]);
  assert.deepEqual(data.ph, [pixel.sha256("528677290445")], "10 dígitos llevan 52 delante");
  const ctx = { consent: true, ip: "1.2.3.4", userAgent: "UA", fbp: "fb.1.x", fbc: "", url: "https://atrixnld.com/" };
  const body = pixel.pixelEventBody("Lead", { phone: "8677290445" }, ctx, 1_700_000_000_000, "evt-12345678");
  assert.equal(body.event_name, "Lead");
  assert.equal(body.event_id, "evt-12345678");
  assert.equal(body.event_time, 1_700_000_000);
  assert.equal(body.user_data.fbp, "fb.1.x");
  assert.equal(body.user_data.fbc, undefined);

  assert.equal(await pixel.sendPixelEvent("Lead", {}, ctx), "off", "sin Pixel configurado no manda nada");
  process.env.META_PIXEL_ID = "PIX";
  process.env.META_CAPI_TOKEN = "capi";
  try {
    assert.equal(await pixel.sendPixelEvent("Lead", {}, { ...ctx, consent: false }), "no-consent");
    let sent = "";
    const fake = async (url, init) => {
      sent = `${url} ${init.body}`;
      return new Response("{}", { status: 200 });
    };
    assert.equal(await pixel.sendPixelEvent("Lead", { phone: "8677290445" }, ctx, "evt-12345678", fake), "sent");
    assert.match(sent, /\/PIX\/events/);
    assert.doesNotMatch(decodeURIComponent(sent), /8677290445/, "el teléfono nunca viaja legible");
  } finally {
    delete process.env.META_PIXEL_ID;
    delete process.env.META_CAPI_TOKEN;
  }

  const request = new Request("https://atrixnld.com/api/contact", { headers: { cookie: "atrix_cookie_consent=accepted; _fbp=fb.1.abc", "x-forwarded-for": "9.9.9.9, 1.1.1.1" } });
  const fromRequest = pixel.pixelContext(request, "/servicios/cctv");
  assert.equal(fromRequest.consent, true);
  assert.equal(fromRequest.fbp, "fb.1.abc");
  assert.equal(fromRequest.ip, "9.9.9.9");
  assert.equal(pixel.pixelContext(new Request("https://x", { headers: { cookie: "atrix_cookie_consent=rejected" } })).consent, false);
  assert.equal(pixel.safeEventId("evt-12345678"), "evt-12345678");
  const replaced = pixel.safeEventId("bad id!");
  assert.notEqual(replaced, "bad id!", "ids inválidos se reemplazan");
  assert.equal(replaced.length, 36);
});

test("plantillas: temas del contenido real, rotación y texto de respaldo con WhatsApp", () => {
  const monday = new Date("2026-10-05T18:00:00Z");
  const nextWeek = new Date("2026-10-12T18:00:00Z");
  assert.notEqual(templates.themeContent("servicio", monday).headline, templates.themeContent("servicio", nextWeek).headline, "el servicio rota cada semana");
  const caption = templates.fallbackCaption("servicio", "Cámaras", "Con vista en tu celular");
  assert.match(caption, /\+52 867 729 0445/);
  assert.match(caption, /#NuevoLaredo/);
  assert.equal(templates.alternateWords("cotiza", templates.SOCIAL_THEMES.cotiza.headline).headline, templates.ALT_WORDS.cotiza[0].headline);
  for (const theme of Object.keys(templates.SOCIAL_THEMES)) assert.ok(templates.SOCIAL_THEMES[theme].headline, theme);
});

test("plan semanal: 5 borradores a la hora de CDMX, sin horas pasadas ni repetidas", async () => {
  const settings = { ...store.DEFAULT_SOCIAL, postsPerWeek: 5, hour: 19 };
  const now = new Date("2026-10-05T20:00:00Z"); // lunes 14:00 CDMX
  const posts = await social.buildWeekPlan(settings, "admin", now, new Set(), async () => "texto");
  assert.equal(posts.length, 5);
  assert.equal(posts[0].scheduledAt, "2026-10-06T01:00:00.000Z", "hoy a las 19:00 CDMX todavía no pasa");
  assert.ok(posts.every((p) => p.status === "borrador" && p.source === "plan"));
  for (let i = 1; i < posts.length; i += 1) assert.notEqual(posts[i].theme, posts[i - 1].theme, "días seguidos no repiten tema");
  const late = await social.buildWeekPlan(settings, "admin", new Date("2026-10-06T02:00:00Z"), new Set(), async () => "t");
  assert.ok(late.every((p) => new Date(p.scheduledAt) > new Date("2026-10-06T02:15:00Z")), "salta la hora que ya pasó");
  const again = await social.buildWeekPlan(settings, "admin", now, new Set(posts.map((p) => p.scheduledAt)), async () => "t");
  assert.equal(again.length, 0, "generar dos veces no duplica");
  const auto = await social.buildWeekPlan({ ...settings, autoApprove: true }, "admin", now, new Set(), async () => "t");
  assert.ok(auto.every((p) => p.status === "aprobada"));
});

test("las filas de Supabase se leen y escriben sin perder campos", () => {
  const row = {
    id: "6f1c2a9e-1111-4222-8333-944455556666",
    created_at: "2026-10-04T00:00:00Z",
    created_by: "admin",
    source: "plan",
    theme: "servicio",
    headline: "H",
    subline: "S",
    chips: ["a"],
    image_key: null,
    style: "cobalto",
    frame: false,
    design_version: 2,
    caption: "c",
    destinations: ["ig_feed", "otro"],
    scheduled_at: "2026-10-06T01:00:00+00:00",
    status: "aprobada",
    results: [],
  };
  const post = store.postFromRow(row);
  assert.equal(post.style, "cobalto");
  assert.deepEqual(post.destinations, ["ig_feed"], "destinos desconocidos se descartan");
  assert.equal(post.scheduledAt, "2026-10-06T01:00:00.000Z");
  assert.deepEqual(store.postToRow({ headline: "X", designVersion: 3, scheduledAt: "z" }), { headline: "X", design_version: 3, scheduled_at: "z" });
  assert.equal(store.campaignFromRow({ goal: "nada", audience: "nada", location: "nada", budget_mxn: "300" }).goal, "clics");
  assert.equal(store.isUuid("x"), false);
});

test("candados: cada acción y página del panel valida la sesión de admin primero", () => {
  for (const file of ["src/lib/marketing/social-actions.ts", "src/lib/marketing/ads-actions.ts"]) {
    const code = src(file);
    assert.match(code, /^"use server";/);
    const fns = [...code.matchAll(/export async function (\w+)\([^)]*\)[^{]*\{\n([^\n]*)/g)];
    assert.ok(fns.length >= 8, file);
    for (const [, name, firstLine] of fns) assert.match(firstLine, /await requireAdmin\(\)/, `${file} → ${name}`);
  }
  for (const file of ["src/app/admin/redes/page.tsx", "src/app/admin/campanas/page.tsx"]) assert.match(src(file), /await requireAdmin\(\)/, file);
  for (const file of ["src/app/admin/redes/vista-previa/route.ts", "src/app/admin/campanas/vista-previa/route.ts"]) assert.match(src(file), /currentAdmin\(\)\)\) return new Response\("Solo administración\."/, file);
});

test("candados: RLS sin políticas públicas, cron con secreto y activar pide el monto exacto", () => {
  const sql = src("supabase/migrations/20261004_marketing.sql");
  for (const table of ["social_posts", "ad_campaigns", "ad_funds", "whatsapp_clicks"]) assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`));
  assert.doesNotMatch(sql, /create policy/i);
  const cron = src("src/app/api/cron/social/route.ts");
  assert.match(cron, /CRON_SECRET no está configurado/);
  assert.match(cron, /Bearer \$\{secret\}/);
  const actions = src("src/lib/marketing/ads-actions.ts");
  assert.match(actions, /confirmedBudgetMxn\)\) !== campaign\.budgetMxn/);
});

test("sin tokens en el código y sin mezclar marcas", () => {
  const files = readdirSync(new URL("src/lib/marketing/", ROOT)).map((f) => `src/lib/marketing/${f}`);
  for (const file of [...files, "src/components/MetaPixel.tsx", "src/app/a/[id]/route.ts"]) {
    const code = src(file);
    assert.doesNotMatch(code, /EAA[A-Za-z0-9]{20,}/, `${file}: parece un token de Meta`);
    assert.doesNotMatch(code, /sk-ant-[A-Za-z0-9-]{10,}/, `${file}: parece una clave de Anthropic`);
    assert.doesNotMatch(code, /boombee/i, `${file}: menciona BoomBeeJobs`);
  }
});

test("el Pixel del navegador solo se monta con permiso y la cotización guarda la campaña", () => {
  const gated = src("src/components/ConsentGatedAnalytics.tsx");
  assert.match(gated, /if \(!allowed\) return null;[\s\S]*<MetaPixel \/>/);
  const contact = src("src/app/api/contact/route.ts");
  assert.match(contact, /ad_campaign_id: campaign\?\.id \?\? null/);
  assert.match(contact, /sendPixelEvent\("Lead"/);
  const redirect = src("src/app/a/[id]/route.ts");
  assert.match(redirect, /httpOnly: true/);
  assert.match(redirect, /utm_medium", "paid"/);
});

test("temporadas: fechas móviles bien calculadas y no todos los días son de temporada", async () => {
  const seasons = await import(new URL("src/content/seasons.ts", ROOT).href);
  assert.equal(seasons.easter(2026).toISOString().slice(0, 10), "2026-04-05");
  assert.equal(seasons.easter(2027).toISOString().slice(0, 10), "2027-03-28");
  assert.equal(seasons.nthWeekday(2026, 11, 4, 4).toISOString().slice(0, 10), "2026-11-26", "Thanksgiving 2026");
  assert.equal(seasons.nthWeekday(2027, 6, 0, 3).toISOString().slice(0, 10), "2027-06-20", "Día del Padre 2027");
  assert.equal(seasons.activeSeason("2026-11-01")?.season.id, "muertos");
  assert.equal(seasons.activeSeason("2026-12-25")?.season.id, "navidad");
  const eve = seasons.activeSeason("2026-12-23");
  assert.equal(eve?.phase, "proxima");
  assert.equal(eve?.daysTo, 1);
  let count = 0;
  for (let t = Date.parse("2026-10-06"); t < Date.parse("2027-10-06"); t += 86_400_000) if (seasons.activeSeason(new Date(t).toISOString())) count += 1;
  assert.ok(count > 60 && count < 160, `días de temporada: ${count}`);
  for (const s of seasons.SEASONS) {
    assert.match(s.accent, /^#[0-9a-f]{6}$/i, s.id);
    assert.ok(s.angles.length && s.services.length, s.id);
    assert.doesNotMatch(s.angles.join(" "), /descuento|promoci|% |\$\d/i, `${s.id}: ATRIX no ofrece promociones`);
  }
});
