import { ImageResponse } from "next/og";
import { ACCENT, MARKETING_SIZES, PALETTES, WHATSAPP_PATH, asJpeg, type CardFormat, type Palette } from "./card";
import { brandAssets, publicImage } from "./og-brand";
import type { DesignStyle } from "./styles";

// "Consejo del día" para Instagram: el contenido va escrito en la imagen (pasos, checklist, mito o
// realidad, error común, pregunta) y cada día cambia el diseño, la decoración y el estilo.
// Reglas de satori: todo es flex, los bloques de texto no se encogen (flexShrink 0) y nada usa
// overflow:hidden (deja rectángulos negros).

export const DAILY_LAYOUTS = ["consejo", "pasos", "checklist", "mito", "error", "pregunta"] as const;
export type DailyLayout = (typeof DAILY_LAYOUTS)[number];

export const DAILY_DECORS = ["rejilla", "numero", "banda", "puntos", "arcos"] as const;
export type DailyDecor = (typeof DAILY_DECORS)[number];

export type DailyItem = { title: string; text?: string };

export type DailySpec = {
  layout: DailyLayout;
  style: DesignStyle;
  decor: DailyDecor;
  /** Número del consejo (#12). */
  number: number;
  /** Etiqueta corta del tema (p. ej. "CCTV"). */
  kicker: string;
  /** Título o pregunta principal. */
  title: string;
  /** Párrafo (consejo, pregunta) o cierre corto (otros diseños). */
  body?: string;
  /** pasos/checklist: 3–4; mito y error: exactamente 2 (lo falso/incorrecto y lo correcto). */
  items?: DailyItem[];
  /** Render o foto de /public que acompaña (p. ej. /images/renders/cctv.webp). */
  visual?: string | null;
  cta?: string;
};

const clip = (text: string | undefined, max: number) => {
  const t = (text ?? "").replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : t;
};

/** Recorta y completa el plan del día para que siempre quepa en la imagen. */
export function normalizeSpec(spec: DailySpec): DailySpec {
  const layout = (DAILY_LAYOUTS as readonly string[]).includes(spec.layout) ? spec.layout : "consejo";
  const pairs = layout === "mito" || layout === "error";
  const list = layout === "pasos" || layout === "checklist";
  let items = (spec.items ?? []).filter((i) => i?.title).map((i) => ({ title: clip(i.title, list ? 46 : 110), text: clip(i.text, list ? 80 : 0) || undefined }));
  if (pairs) items = items.slice(0, 2);
  if (list) items = items.slice(0, 4);
  const valid = pairs ? items.length === 2 : list ? items.length >= 3 : true;
  return {
    ...spec,
    layout: valid ? layout : "consejo",
    decor: (DAILY_DECORS as readonly string[]).includes(spec.decor) ? spec.decor : "rejilla",
    number: Math.max(1, Math.floor(spec.number || 1)),
    kicker: clip(spec.kicker, 22),
    title: clip(spec.title, valid && (list || pairs) ? 70 : 90),
    body: clip(spec.body, valid && (list || pairs) ? 110 : 190) || undefined,
    items: valid ? items : [],
    cta: clip(spec.cta || "Cotiza gratis en atrixnld.com", 40),
  };
}

const lines = (text: string | undefined, size: number, width: number, em = 0.52) => (text ? Math.ceil((text.length * size * em * 1.08) / width) : 0);

function tones(p: Palette) {
  return p.light ? { bad: "#c93a3a", good: "#13875a", soft: "rgba(11,15,23,0.05)" } : { bad: "#ff6b6b", good: "#3ddc84", soft: "rgba(255,255,255,0.05)" };
}

function Decor({ decor, p, w, h, number }: { decor: DailyDecor; p: Palette; w: number; h: number; number: number }) {
  const line = p.light ? "rgba(26,99,230,0.10)" : "rgba(122,169,255,0.10)";
  const base = { position: "absolute" as const, top: 0, left: 0, width: w, height: h, display: "flex" };
  switch (decor) {
    case "rejilla":
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={base}>
          <defs>
            <pattern id="g" width="54" height="54" patternUnits="userSpaceOnUse">
              <path d="M54 0H0V54" fill="none" stroke={line} strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width={w} height={h} fill="url(#g)" />
        </svg>
      );
    case "puntos":
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={base}>
          <defs>
            <pattern id="d" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="2.4" fill={line} />
            </pattern>
          </defs>
          <rect x={w * 0.45} width={w * 0.55} height={h * 0.5} fill="url(#d)" />
        </svg>
      );
    case "banda":
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={base}>
          <polygon points={`${w * 0.62},0 ${w},0 ${w},${h * 0.2} ${w * 0.36},${h * 0.58}`} fill={p.light ? "rgba(26,99,230,0.07)" : "rgba(26,99,230,0.16)"} />
          <polygon points={`${w * 0.8},0 ${w},0 ${w},${h * 0.07}`} fill={ACCENT} opacity={0.85} />
        </svg>
      );
    case "arcos":
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={base}>
          {[220, 340, 460, 580].map((r) => (
            <circle key={r} cx={w} cy={h * 0.12} r={r} fill="none" stroke={line} strokeWidth="2" />
          ))}
        </svg>
      );
    default:
      // Número gigante y tenue del consejo, a la derecha.
      return (
        <div style={{ ...base, justifyContent: "flex-end", alignItems: "flex-start" }}>
          <span style={{ display: "flex", marginTop: h * 0.08, marginRight: -20, fontSize: 520, fontWeight: 700, letterSpacing: -30, color: p.light ? "rgba(26,99,230,0.07)" : "rgba(122,169,255,0.07)" }}>
            {String(number).padStart(2, "0")}
          </span>
        </div>
      );
  }
}

function Check({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export async function dailyCard(raw: DailySpec, format: CardFormat, date: Date = new Date()) {
  const spec = normalizeSpec(raw);
  const { logoOnDark, logoOnLight, fonts } = await brandAssets();
  const size = MARKETING_SIZES[format];
  const tall = format === "historia";
  const p = PALETTES[spec.style] ?? PALETTES.azul;
  const t = tones(p);
  const logo = p.light ? (logoOnLight ?? logoOnDark) : logoOnDark;
  const pad = tall ? 90 : 76;
  const inner = size.width - pad * 2;
  const k = tall ? 1.14 : 1; // escala de tipografía para la historia
  const items = spec.items ?? [];
  const isList = spec.layout === "pasos" || spec.layout === "checklist";
  const isPair = spec.layout === "mito" || spec.layout === "error";

  const titleSize = Math.round((spec.title.length > 60 ? 64 : spec.title.length > 36 ? 76 : 92) * k * (isList || isPair ? 0.86 : 1));
  const bodySize = Math.round(34 * k);
  const itemTitle = Math.round(34 * k);
  const itemText = Math.round(27 * k);
  const dateLabel = new Intl.DateTimeFormat("es-MX", { timeZone: "America/Mexico_City", day: "numeric", month: "long" }).format(date);

  // Alto estimado del contenido: el render usa lo que sobre (si sobra poco, no se dibuja).
  let content = (tall ? 130 : 60) + lines(spec.title, titleSize, inner) * titleSize * 1.06;
  if (spec.body) content += 28 + lines(spec.body, bodySize, inner * (spec.layout === "pregunta" ? 0.9 : 1), 0.5) * bodySize * 1.34 + (spec.layout === "pregunta" ? 56 : 0);
  if (isList) content += 30 + items.reduce((sum, i) => sum + 34 + itemTitle * 1.2 + (i.text ? lines(i.text, itemText, inner - 110, 0.5) * itemText * 1.3 + 6 : 0), 0);
  if (isPair) content += 30 + items.reduce((sum, i) => sum + 20 + 60 + 34 + lines(i.title, itemTitle, inner - 70, 0.5) * itemTitle * 1.25, 0);
  const used = (tall ? 250 : pad * 2) + (tall ? 73 : 64) + content + (tall ? 104 : 92) + (tall ? 150 : 50);
  const visualHeight = Math.min(tall ? 640 : 460, Math.floor(size.height - used));
  const visual = spec.visual && visualHeight >= 190 ? await publicImage(spec.visual, tall ? 1000 : 900, "jpeg") : null;

  // Las fotos reales llevan marco; los renders 3D se funden con el escenario.
  const framed = p.framedVisual || !/\/renders\//.test(spec.visual ?? "");
  // Sobre cobalto, el círculo azul se perdería: va blanco con el número azul.
  const stepBg = spec.style === "cobalto" ? "#ffffff" : ACCENT;
  const stepInk = spec.style === "cobalto" ? ACCENT : "#ffffff";
  const panel = { display: "flex", flexShrink: 0, border: `2px solid ${p.chipBorder}`, background: p.chipBg, borderRadius: 28 } as const;

  const body =
    spec.layout === "pregunta" && spec.body ? (
      <div style={{ ...panel, marginTop: 28, padding: `${26 * k}px ${30 * k}px`, borderLeft: `8px solid ${ACCENT}`, width: inner }}>
        <span style={{ display: "flex", fontSize: bodySize, fontWeight: 500, lineHeight: 1.34, color: p.text }}>{spec.body}</span>
      </div>
    ) : spec.body ? (
      <div style={{ display: "flex", flexShrink: 0, marginTop: 28, fontSize: bodySize, fontWeight: 500, lineHeight: 1.34, color: p.sub, width: inner }}>{spec.body}</div>
    ) : null;

  const list = isList ? (
    <div style={{ display: "flex", flexDirection: "column", flexShrink: 0, marginTop: 30, width: inner }}>
      {items.map((item, i) => (
        <div key={item.title} style={{ display: "flex", flexShrink: 0, alignItems: "flex-start", marginBottom: 22 * k }}>
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              alignItems: "center",
              justifyContent: "center",
              width: 64 * k,
              height: 64 * k,
              marginRight: 26,
              borderRadius: spec.layout === "pasos" ? 999 : 18,
              background: spec.layout === "pasos" ? stepBg : t.soft,
              border: spec.layout === "pasos" ? "none" : `2px solid ${p.chipBorder}`,
              color: stepInk,
              fontSize: 30 * k,
              fontWeight: 700,
            }}
          >
            {spec.layout === "pasos" ? String(i + 1) : <Check color={t.good} size={36 * k} />}
          </div>
          <div style={{ display: "flex", flexDirection: "column", flexShrink: 0, width: inner - 64 * k - 26 }}>
            <span style={{ display: "flex", fontSize: itemTitle, fontWeight: 700, lineHeight: 1.2, letterSpacing: -0.6, color: p.text }}>{item.title}</span>
            {item.text ? <span style={{ display: "flex", marginTop: 6, fontSize: itemText, fontWeight: 500, lineHeight: 1.3, color: p.sub }}>{item.text}</span> : null}
          </div>
        </div>
      ))}
    </div>
  ) : null;

  const pair = isPair ? (
    <div style={{ display: "flex", flexDirection: "column", flexShrink: 0, marginTop: 30, width: inner }}>
      {items.map((item, i) => {
        const good = i === 1;
        const label = spec.layout === "mito" ? (good ? "REALIDAD" : "MITO") : good ? "MEJOR ASÍ" : "ERROR COMÚN";
        const color = good ? t.good : t.bad;
        return (
          <div key={label} style={{ ...panel, flexDirection: "column", marginBottom: 20, padding: `${24 * k}px ${30 * k}px`, borderColor: good ? color : p.chipBorder }}>
            <div style={{ display: "flex", alignItems: "center", fontSize: 24 * k, fontWeight: 700, letterSpacing: 3, color }}>
              {good ? <Check color={color} size={32 * k} /> : <Cross color={color} size={30 * k} />}
              <span style={{ display: "flex", marginLeft: 12 }}>{label}</span>
            </div>
            <span style={{ display: "flex", marginTop: 12, fontSize: itemTitle, fontWeight: good ? 700 : 500, lineHeight: 1.25, color: good ? p.text : p.sub }}>{item.title}</span>
          </div>
        );
      })}
    </div>
  ) : null;

  return asJpeg(
    new ImageResponse(
      (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: tall ? `130px ${pad}px 120px` : `${pad}px`,
            background: p.background,
            color: p.text,
            ...(fonts.length ? { fontFamily: "Geist" } : {}),
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, width: size.width, height: size.height, display: "flex", background: p.glow }} />
          <Decor decor={spec.decor} p={p} w={size.width} h={size.height} number={spec.number} />

          {/* Logo y etiqueta "Consejo del día". */}
          <div style={{ display: "flex", flexShrink: 0, alignItems: "center", justifyContent: "space-between", width: inner }}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- lo dibuja ImageResponse, no el navegador
              <img src={logo} alt="" width={tall ? 330 : 290} height={tall ? 73 : 64} style={{ width: tall ? 330 : 290, height: tall ? 73 : 64, objectFit: "contain" }} />
            ) : (
              <span style={{ fontSize: 56, fontWeight: 700 }}>ATRIX</span>
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", ...(fonts.length ? { fontFamily: "Geist Mono" } : {}) }}>
              <span style={{ display: "flex", fontSize: 24 * k, letterSpacing: 3, color: p.osd }}>CONSEJO DEL DÍA · #{spec.number}</span>
              <span style={{ display: "flex", marginTop: 6, fontSize: 21 * k, letterSpacing: 2, color: p.sub }}>
                {spec.kicker.toUpperCase()} · {dateLabel.toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexShrink: 0, marginTop: tall ? 130 : 60, fontSize: titleSize, fontWeight: 700, lineHeight: 1.06, letterSpacing: -titleSize * 0.035, width: inner }}>
            {spec.layout === "pregunta" && !spec.title.startsWith("¿") ? `¿${spec.title.replace(/\?*$/, "")}?` : spec.title}
          </div>
          {list}
          {pair}
          {body}

          <div style={{ display: "flex", flexGrow: 1, flexShrink: 1, minHeight: 0, alignItems: "center", justifyContent: spec.layout === "consejo" ? "flex-end" : "center", width: inner }}>
            {visual ? (
              // eslint-disable-next-line @next/next/no-img-element -- lo dibuja ImageResponse, no el navegador
              <img
                src={visual}
                alt=""
                width={Math.round(visualHeight * (4 / 3))}
                height={visualHeight}
                style={{
                  width: Math.round(visualHeight * (4 / 3)),
                  height: visualHeight,
                  objectFit: "cover",
                  borderRadius: framed ? 32 : 0,
                  ...(framed ? { boxShadow: "0 30px 60px rgba(5,10,30,0.35)" } : { maskImage: "radial-gradient(circle, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 72%)" }),
                }}
              />
            ) : null}
          </div>

          {/* Pie: botón y WhatsApp en una fila. */}
          <div style={{ display: "flex", flexShrink: 0, alignItems: "center", justifyContent: "space-between", width: inner }}>
            <div style={{ display: "flex", padding: tall ? "28px 40px" : "24px 34px", borderRadius: 999, background: p.ctaBg, color: p.ctaText, fontSize: 29 * k, fontWeight: 700, letterSpacing: -0.4 }}>
              {spec.cta}
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: tall ? "16px 26px 16px 16px" : "14px 22px 14px 14px", borderRadius: 999, background: p.stripBg, border: `2px solid ${p.chipBorder}`, color: p.stripText }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 52 * k, height: 52 * k, marginRight: 14, borderRadius: 999, background: "#25d366" }}>
                <svg width={30 * k} height={30 * k} viewBox="0 0 24 24">
                  <path d={WHATSAPP_PATH} fill="none" stroke="#ffffff" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ display: "flex", fontSize: 28 * k, fontWeight: 700 }}>867 729 0445</span>
            </div>
          </div>
        </div>
      ),
      { ...size, fonts: fonts.length ? fonts : undefined },
    ),
  );
}
