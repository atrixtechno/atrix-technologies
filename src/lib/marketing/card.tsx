import { ImageResponse } from "next/og";
import { brandAssets, publicImage } from "./og-brand";
import type { DesignStyle } from "./styles";

// Imagen de marca para Instagram / Facebook y anuncios de Meta (Admin → Marketing y Campañas).
// Sigue DESIGN.md: escenario azul marino, luz de estudio cobalto, Geist 700 con tracking cerrado,
// el render del servicio flotando y el botón en píldora. Sin degradado en el texto.
// "feed" es 1080×1350 y "historia" 1080×1920. Siempre sale en JPEG (Instagram no acepta PNG).

export const MARKETING_SIZES = { feed: { width: 1080, height: 1350 }, historia: { width: 1080, height: 1920 } } as const;

export type CardFormat = keyof typeof MARKETING_SIZES;

/** El PNG de satori como JPEG liviano. Si falta el convertidor, sale el PNG tal cual. */
export async function asJpeg(image: ImageResponse) {
  const png = Buffer.from(await image.arrayBuffer());
  try {
    const sharp = (await import("sharp")).default;
    const jpeg = await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
    return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } });
  } catch {
    return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
  }
}

export type Palette = {
  background: string;
  glow: string;
  text: string;
  sub: string;
  osd: string;
  chipBorder: string;
  chipBg: string;
  ctaBg: string;
  ctaText: string;
  stripBg: string;
  stripText: string;
  light: boolean;
  /** El render va dentro de un marco oscuro (fondos que no son el escenario). */
  framedVisual: boolean;
};

export const ACCENT = "#1a63e6";

export const PALETTES: Record<DesignStyle, Palette> = {
  azul: {
    background: "#070a10",
    glow: "radial-gradient(circle at 50% 70%, rgba(47,123,255,0.30) 0%, rgba(26,99,230,0.08) 35%, rgba(7,10,16,0) 60%)",
    text: "#f2f4f8",
    sub: "#9aa6bd",
    osd: "#7aa9ff",
    chipBorder: "rgba(255,255,255,0.18)",
    chipBg: "rgba(255,255,255,0.04)",
    ctaBg: ACCENT,
    ctaText: "#ffffff",
    stripBg: "rgba(255,255,255,0.06)",
    stripText: "#f2f4f8",
    light: false,
    framedVisual: false,
  },
  cobalto: {
    background: "linear-gradient(160deg, #1f6cf0 0%, #1a63e6 45%, #0e44b0 100%)",
    glow: "radial-gradient(circle at 85% 10%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 45%)",
    text: "#ffffff",
    sub: "#dbe6ff",
    osd: "#ffffff",
    chipBorder: "rgba(255,255,255,0.35)",
    chipBg: "rgba(255,255,255,0.10)",
    ctaBg: "#ffffff",
    ctaText: "#0b3a99",
    stripBg: "rgba(5,10,30,0.28)",
    stripText: "#ffffff",
    light: false,
    framedVisual: true,
  },
  claro: {
    background: "linear-gradient(180deg, #ffffff 0%, #f1f4fa 60%, #e6ecf7 100%)",
    glow: "radial-gradient(circle at 50% 75%, rgba(26,99,230,0.14) 0%, rgba(26,99,230,0) 50%)",
    text: "#0b0f17",
    sub: "#4a5568",
    osd: ACCENT,
    chipBorder: "rgba(11,15,23,0.14)",
    chipBg: "#ffffff",
    ctaBg: ACCENT,
    ctaText: "#ffffff",
    stripBg: "#ffffff",
    stripText: "#0b0f17",
    light: true,
    framedVisual: true,
  },
  noche: {
    background: "#050506",
    glow: "radial-gradient(circle at 15% 10%, rgba(26,99,230,0.26) 0%, rgba(26,99,230,0) 50%)",
    text: "#ffffff",
    sub: "#8b93a5",
    osd: "#7aa9ff",
    chipBorder: "rgba(255,255,255,0.14)",
    chipBg: "rgba(255,255,255,0.03)",
    ctaBg: "#ffffff",
    ctaText: "#050506",
    stripBg: "rgba(255,255,255,0.06)",
    stripText: "#ffffff",
    light: false,
    framedVisual: false,
  },
};

export const WHATSAPP_PATH = "M4 20l1.3-4A8 8 0 1 1 8 18.8zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 1a4 4 0 0 1-2.5-2.5l1-1-1-2z";

export type CardInput = {
  /** Etiqueta corta estilo OSD del monitor (p. ej. "CCTV"). */
  kicker: string;
  headline: string;
  subline: string;
  chips: string[];
  cta: string;
  format: CardFormat;
  style?: DesignStyle;
  /** Render o foto de /public que flota en la parte baja (p. ej. /images/renders/cctv.webp). */
  visual?: string | null;
  /** Foto propia del admin (data URL) como fondo, bajo un velo oscuro, con la marca encima. */
  photo?: string | null;
  /** Franja "Cotiza por WhatsApp" con este teléfono. */
  contactPhone?: string | null;
};

export async function marketingCard(input: CardInput) {
  const { logoOnDark, logoOnLight, fonts } = await brandAssets();
  const size = MARKETING_SIZES[input.format];
  const tall = input.format === "historia";
  const photo = input.photo ?? null;
  const palette = photo ? PALETTES.azul : PALETTES[input.style ?? "azul"];
  const logo = palette.light ? (logoOnLight ?? logoOnDark) : logoOnDark;
  const visual = !photo && input.visual ? await publicImage(input.visual, tall ? 1000 : 900, "jpeg") : null;

  const headline = input.headline.length > 90 ? `${input.headline.slice(0, 87)}…` : input.headline;
  const subline = input.subline.length > 150 ? `${input.subline.slice(0, 147)}…` : input.subline;
  const headlineSize = headline.length > 60 ? (tall ? 82 : 70) : headline.length > 34 ? (tall ? 98 : 84) : tall ? 118 : 104;
  const chips = input.chips.filter(Boolean).slice(0, 3);
  const pad = tall ? 90 : 76;
  const inner = size.width - pad * 2;
  const sublineSize = tall ? 42 : 36;
  const hasFonts = fonts.length > 0;
  // satori no mide el render contra el texto: se estima el alto de los textos y el render usa el
  // espacio que sobra (si sobra poco, no se dibuja). Los bloques de texto no se encogen.
  const lines = (text: string, fontSize: number, width: number, em: number) => (text ? Math.ceil((text.length * fontSize * em * 1.1) / width) : 0);
  const chipsWidth = chips.reduce((sum, chip) => sum + chip.length * (tall ? 16 : 14) + (tall ? 70 : 62), 0);
  const used =
    (tall ? 250 : pad * 2) +
    (tall ? 73 : 64) +
    (tall ? 110 : 64) +
    lines(headline, headlineSize, inner, 0.52) * headlineSize * 1.08 +
    (subline ? (tall ? 40 : 30) + lines(subline, sublineSize, Math.min(inner, 860), 0.5) * sublineSize * 1.32 : 0) +
    (chips.length ? (tall ? 44 : 34) + Math.ceil(chipsWidth / inner) * (tall ? 82 : 73) : 0) +
    (tall ? 108 : 93) +
    (input.contactPhone ? (tall ? 144 : 120) : 0) +
    30;
  const room = size.height - used;
  const visualHeight = Math.min(tall ? 640 : 420, Math.floor(room));
  const showVisual = Boolean(visual) && visualHeight >= 200;

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
            background: photo ? "#070a10" : palette.background,
            color: palette.text,
            ...(hasFonts ? { fontFamily: "Geist" } : {}),
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element -- lo dibuja ImageResponse, no el navegador
            <img src={photo} alt="" width={size.width} height={size.height} style={{ position: "absolute", top: 0, left: 0, width: size.width, height: size.height, objectFit: "cover" }} />
          ) : null}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: size.width,
              height: size.height,
              display: "flex",
              background: photo ? "linear-gradient(180deg, rgba(5,7,12,0.86) 0%, rgba(5,7,12,0.5) 45%, rgba(5,7,12,0.9) 100%)" : palette.glow,
            }}
          />

          {/* Logo a la izquierda, etiqueta tipo OSD a la derecha. */}
          <div style={{ display: "flex", flexShrink: 0, alignItems: "center", justifyContent: "space-between", width: inner }}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- lo dibuja ImageResponse, no el navegador
              <img src={logo} alt="" width={tall ? 330 : 290} height={tall ? 73 : 64} style={{ width: tall ? 330 : 290, height: tall ? 73 : 64, objectFit: "contain" }} />
            ) : (
              <span style={{ fontSize: 56, fontWeight: 700, letterSpacing: -2 }}>ATRIX</span>
            )}
            <div style={{ display: "flex", alignItems: "center", fontSize: tall ? 28 : 24, fontWeight: 500, letterSpacing: 3, color: palette.osd, ...(hasFonts ? { fontFamily: "Geist Mono" } : {}) }}>
              <div style={{ display: "flex", width: 14, height: 14, marginRight: 14, borderRadius: 999, background: palette.light ? ACCENT : "#3ddc84" }} />
              {input.kicker.toUpperCase()}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexShrink: 0,
              marginTop: tall ? 110 : 64,
              fontSize: headlineSize,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -headlineSize * 0.045,
              width: inner,
            }}
          >
            {headline}
          </div>
          {subline ? (
            <div style={{ display: "flex", flexShrink: 0, marginTop: tall ? 40 : 30, fontSize: sublineSize, fontWeight: 500, lineHeight: 1.32, color: palette.sub, width: Math.min(inner, 860) }}>{subline}</div>
          ) : null}
          {chips.length ? (
            <div style={{ display: "flex", flexShrink: 0, flexWrap: "wrap", marginTop: tall ? 44 : 34, width: inner }}>
              {chips.map((chip) => (
                <span
                  key={chip}
                  style={{
                    display: "flex",
                    margin: "0 14px 14px 0",
                    padding: tall ? "14px 28px" : "12px 24px",
                    borderRadius: 999,
                    border: `2px solid ${palette.chipBorder}`,
                    background: palette.chipBg,
                    fontSize: tall ? 30 : 26,
                    fontWeight: 500,
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}

          {/* El render del servicio, flotando en el espacio libre. */}
          <div style={{ display: "flex", flexGrow: 1, flexShrink: 1, minHeight: 0, alignItems: "center", justifyContent: "center", width: inner, marginTop: 10, marginBottom: 10 }}>
            {showVisual && visual ? (
              // Sin overflow:hidden: satori lo dibuja con una máscara que deja un rectángulo negro.
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
                  borderRadius: palette.framedVisual ? 36 : 0,
                  // En el escenario oscuro el borde del render se funde con el fondo (como .render-feather).
                  ...(palette.framedVisual ? { boxShadow: "0 30px 60px rgba(5,10,30,0.35)" } : { maskImage: "radial-gradient(circle, rgba(0,0,0,1) 45%, rgba(0,0,0,0) 72%)" }),
                }}
              />
            ) : null}
          </div>

          <div style={{ display: "flex", flexShrink: 0, flexDirection: "column", width: inner }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: tall ? "30px 46px" : "26px 40px",
                borderRadius: 999,
                background: palette.ctaBg,
                color: palette.ctaText,
                fontSize: tall ? 40 : 34,
                fontWeight: 700,
                letterSpacing: -0.5,
              }}
            >
              {input.cta}
            </div>
            {input.contactPhone ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: tall ? 30 : 24,
                  padding: tall ? "20px 26px" : "16px 22px",
                  borderRadius: 26,
                  background: palette.stripBg,
                  border: palette.light ? "2px solid rgba(11,15,23,0.08)" : "2px solid rgba(255,255,255,0.08)",
                  color: palette.stripText,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: tall ? 70 : 60, height: tall ? 70 : 60, marginRight: 20, borderRadius: 999, background: "#25d366" }}>
                  <svg width={tall ? 42 : 36} height={tall ? 42 : 36} viewBox="0 0 24 24">
                    <path d={WHATSAPP_PATH} fill="none" stroke="#ffffff" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ display: "flex", fontSize: tall ? 36 : 31, fontWeight: 700, letterSpacing: -0.5 }}>Cotiza por WhatsApp {input.contactPhone}</span>
              </div>
            ) : null}
          </div>
        </div>
      ),
      { ...size, fonts: hasFonts ? fonts : undefined },
    ),
  );
}
