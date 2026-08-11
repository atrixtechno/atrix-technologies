/** Physical PVC card: 8.5 × 5.4 cm */
export const CARD_PHYSICAL_CM = { width: 8.5, height: 5.4 } as const;
export const CARD_EXPORT_DPI = 300;
export const CARD_EXPORT_DPI_HD = 600;

export function cardPixelSize(dpi: number = CARD_EXPORT_DPI) {
  return {
    width: Math.round((CARD_PHYSICAL_CM.width / 2.54) * dpi),
    height: Math.round((CARD_PHYSICAL_CM.height / 2.54) * dpi),
  };
}

/** Editor canvas = 300 DPI print size */
export const CARD_CANVAS = cardPixelSize(CARD_EXPORT_DPI);

export const CARD_ASSET = {
  front: "/brand/tarjeta-atrix-frente.png",
  back: "/brand/tarjeta-atrix-reverso.png",
  front300: "/brand/tarjeta-atrix-frente-300dpi.png",
  back300: "/brand/tarjeta-atrix-reverso-300dpi.png",
} as const;

export type CardTextElement = {
  id: string;
  /** Spanish label in the properties panel */
  label: string;
  type?: "text";
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  fontWeight?: string;
  fontFamily?: string;
  align?: "left" | "center" | "right";
  width?: number;
  /** Opaque pad under text so baked PNG text is covered on export */
  coverFill?: string;
  coverPad?: number;
  opacity?: number;
  visible?: boolean;
};

/** Text-only overlays over the finished card artwork */
export type CardElement = CardTextElement;

export type CardFaceLayout = {
  backgroundUrl: string;
  backgroundColor?: string;
  backgroundScale?: number;
  backgroundOffsetX?: number;
  backgroundOffsetY?: number;
  width: number;
  height: number;
  elements: CardElement[];
};

export type BusinessCardLayout = {
  front: CardFaceLayout;
  back: CardFaceLayout;
};

export const CARD_LAYOUT_KEY = "business_card_layout";

export const CARD_FONT_OPTIONS = [
  { value: "Arial, Helvetica, sans-serif", label: "Arial (impresión)" },
  { value: "Syne, system-ui, sans-serif", label: "Syne" },
  { value: "Sora, system-ui, sans-serif", label: "Sora" },
  { value: "system-ui, sans-serif", label: "Sistema" },
] as const;

const PRINT = "Arial, Helvetica, sans-serif";
const NAVY = "#001C48";
const BLUE = "#005AE7";
const BLACK = "#0c1018";
const GRAY = "#5a606c";
const MUTED = "#787e88";
const WHITE = "#ffffff";

export function isTextElement(el: CardElement): el is CardTextElement {
  return true;
}

export function isElementVisible(el: CardElement): boolean {
  return el.visible !== false;
}

function text(
  partial: Omit<
    CardTextElement,
    "type" | "fontFamily" | "coverFill" | "coverPad" | "opacity" | "visible"
  > &
    Partial<CardTextElement>,
): CardTextElement {
  return {
    type: "text",
    fontFamily: PRINT,
    coverFill: WHITE,
    coverPad: 4,
    opacity: 1,
    visible: true,
    align: "left",
    fontWeight: "500",
    ...partial,
  };
}

/**
 * Overlay regions for the finished ATRIX card (coords at 300 DPI / editor canvas).
 * Background remains the production PNG; overlays cover + re-draw editable copy.
 */
export const DEFAULT_CARD_LAYOUT: BusinessCardLayout = {
  front: {
    backgroundUrl: CARD_ASSET.front,
    backgroundColor: WHITE,
    backgroundScale: 1,
    backgroundOffsetX: 0,
    backgroundOffsetY: 0,
    width: CARD_CANVAS.width,
    height: CARD_CANVAS.height,
    elements: [
      text({
        id: "front-name",
        label: "Nombre",
        text: "Ing. Néstor J. Resendiz, MBA",
        x: 552,
        y: 42,
        fontSize: 36,
        fill: BLACK,
        fontWeight: "700",
        width: 420,
      }),
      text({
        id: "front-title",
        label: "Cargo",
        text: "Ingeniero en sistemas",
        x: 552,
        y: 88,
        fontSize: 22,
        fill: BLUE,
        fontWeight: "400",
        width: 360,
      }),
      text({
        id: "front-phone",
        label: "Teléfono",
        text: "+52 867 179 3155",
        x: 612,
        y: 158,
        fontSize: 24,
        fill: BLACK,
        width: 340,
      }),
      text({
        id: "front-email",
        label: "Correo",
        text: "atrix.techno@gmail.com",
        x: 612,
        y: 228,
        fontSize: 22,
        fill: BLACK,
        width: 340,
      }),
      text({
        id: "front-web",
        label: "Sitio web",
        text: "atrixnld.com",
        x: 612,
        y: 298,
        fontSize: 24,
        fill: BLACK,
        width: 300,
      }),
      text({
        id: "front-loc1",
        label: "Ubicación (línea 1)",
        text: "Nuevo Laredo, Tamps.",
        x: 612,
        y: 362,
        fontSize: 24,
        fill: BLACK,
        width: 340,
      }),
      text({
        id: "front-loc2",
        label: "Ubicación (línea 2)",
        text: "Laredo, TX",
        x: 612,
        y: 392,
        fontSize: 22,
        fill: BLACK,
        width: 300,
      }),
      text({
        id: "front-motto",
        label: "Lema",
        text: "TECNOLOGÍA  •  INNOVACIÓN  •  RENDIMIENTO",
        x: 36,
        y: 592,
        fontSize: 11,
        fill: BLACK,
        fontWeight: "700",
        width: 420,
      }),
    ],
  },
  back: {
    backgroundUrl: CARD_ASSET.back,
    backgroundColor: WHITE,
    backgroundScale: 1,
    backgroundOffsetX: 0,
    backgroundOffsetY: 0,
    width: CARD_CANVAS.width,
    height: CARD_CANVAS.height,
    elements: [
      text({
        id: "back-title",
        label: "Título",
        text: "SOLUCIONES TECNOLÓGICAS",
        x: 502,
        y: 48,
        fontSize: 32,
        fill: NAVY,
        fontWeight: "800",
        align: "center",
        width: 900,
      }),
      text({
        id: "back-subtitle",
        label: "Subtítulo",
        text: "PARA HOGARES Y EMPRESAS",
        x: 502,
        y: 108,
        fontSize: 16,
        fill: MUTED,
        fontWeight: "700",
        align: "center",
        width: 700,
      }),
      text({
        id: "svc1-title",
        label: "Servicio 1 — título",
        text: "SOPORTE TÉCNICO",
        x: 168,
        y: 268,
        fontSize: 15,
        fill: BLUE,
        fontWeight: "700",
        align: "center",
        width: 280,
      }),
      text({
        id: "svc1-desc",
        label: "Servicio 1 — descripción",
        text: "Computadoras, Laptops Mantenimiento y Reparación",
        x: 168,
        y: 298,
        fontSize: 12,
        fill: GRAY,
        align: "center",
        width: 280,
      }),
      text({
        id: "svc2-title",
        label: "Servicio 2 — título",
        text: "CCTV Y SEGURIDAD",
        x: 502,
        y: 268,
        fontSize: 15,
        fill: "#2e8c46",
        fontWeight: "700",
        align: "center",
        width: 280,
      }),
      text({
        id: "svc2-desc",
        label: "Servicio 2 — descripción",
        text: "Instalación, Monitoreo y Acceso Remoto",
        x: 502,
        y: 298,
        fontSize: 12,
        fill: GRAY,
        align: "center",
        width: 280,
      }),
      text({
        id: "svc3-title",
        label: "Servicio 3 — título",
        text: "REDES E INFRAESTRUCTURA",
        x: 836,
        y: 268,
        fontSize: 15,
        fill: "#7846be",
        fontWeight: "700",
        align: "center",
        width: 280,
      }),
      text({
        id: "svc3-desc",
        label: "Servicio 3 — descripción",
        text: "Cableado Estructurado WiFi, Routers, Switches y más",
        x: 836,
        y: 298,
        fontSize: 12,
        fill: GRAY,
        align: "center",
        width: 280,
      }),
      text({
        id: "svc4-title",
        label: "Servicio 4 — título",
        text: "DESARROLLO DE SOFTWARE",
        x: 168,
        y: 448,
        fontSize: 15,
        fill: "#e65f2d",
        fontWeight: "700",
        align: "center",
        width: 280,
      }),
      text({
        id: "svc4-desc",
        label: "Servicio 4 — descripción",
        text: "Sitios Web, Sistemas a la Medida, Paneles y Plataformas",
        x: 168,
        y: 478,
        fontSize: 12,
        fill: GRAY,
        align: "center",
        width: 280,
      }),
      text({
        id: "svc5-title",
        label: "Servicio 5 — título",
        text: "SOPORTE IT EMPRESARIAL",
        x: 502,
        y: 448,
        fontSize: 15,
        fill: "#2882b9",
        fontWeight: "700",
        align: "center",
        width: 280,
      }),
      text({
        id: "svc5-desc",
        label: "Servicio 5 — descripción",
        text: "Mantenimiento, Respaldos, Seguridad y Optimización",
        x: 502,
        y: 478,
        fontSize: 12,
        fill: GRAY,
        align: "center",
        width: 280,
      }),
      text({
        id: "svc6-title",
        label: "Servicio 6 — título",
        text: "IMPRESORAS Y PERIFÉRICOS",
        x: 836,
        y: 448,
        fontSize: 15,
        fill: "#c8284b",
        fontWeight: "700",
        align: "center",
        width: 280,
      }),
      text({
        id: "svc6-desc",
        label: "Servicio 6 — descripción",
        text: "Instalación, Configuración y Soporte",
        x: 836,
        y: 478,
        fontSize: 12,
        fill: GRAY,
        align: "center",
        width: 280,
      }),
      text({
        id: "foot-home",
        label: "Pie — domicilio",
        text: "SOPORTE A DOMICILIO\nY REMOTO",
        x: 210,
        y: 568,
        fontSize: 10,
        fill: BLACK,
        fontWeight: "700",
        width: 160,
      }),
      text({
        id: "foot-projects",
        label: "Pie — proyectos",
        text: "PROYECTOS\nEMPRESARIALES",
        x: 480,
        y: 568,
        fontSize: 10,
        fill: BLACK,
        fontWeight: "700",
        width: 160,
      }),
      text({
        id: "foot-web",
        label: "Pie — web",
        text: "atrixnld.com",
        x: 760,
        y: 578,
        fontSize: 12,
        fill: BLACK,
        fontWeight: "700",
        width: 160,
      }),
    ],
  },
};

/** Merge saved overlay edits onto the finished-card template (drops shapes / extra junk). */
export function normalizeCardLayout(
  raw: BusinessCardLayout | null | undefined,
): BusinessCardLayout {
  return mergeWithDefaults(raw);
}

export function mergeWithDefaults(
  saved: BusinessCardLayout | null | undefined,
): BusinessCardLayout {
  if (!saved?.front || !saved?.back) {
    return cloneLayout(DEFAULT_CARD_LAYOUT);
  }
  return {
    front: mergeFace(DEFAULT_CARD_LAYOUT.front, saved.front, CARD_ASSET.front),
    back: mergeFace(DEFAULT_CARD_LAYOUT.back, saved.back, CARD_ASSET.back),
  };
}

function mergeFace(
  def: CardFaceLayout,
  saved: CardFaceLayout,
  lockedBg: string,
): CardFaceLayout {
  const byId = new Map(
    (saved.elements ?? [])
      .filter((el) => el && typeof el === "object" && "id" in el)
      .map((el) => [el.id, el as CardTextElement]),
  );
  return {
    backgroundUrl: lockedBg,
    backgroundColor: def.backgroundColor || WHITE,
    backgroundScale: saved.backgroundScale ?? 1,
    backgroundOffsetX: saved.backgroundOffsetX ?? 0,
    backgroundOffsetY: saved.backgroundOffsetY ?? 0,
    width: CARD_CANVAS.width,
    height: CARD_CANVAS.height,
    elements: def.elements.map((el) => {
      const s = byId.get(el.id);
      if (!s) return { ...el };
      return {
        ...el,
        text: typeof s.text === "string" ? s.text : el.text,
        x: typeof s.x === "number" ? s.x : el.x,
        y: typeof s.y === "number" ? s.y : el.y,
        fontSize: typeof s.fontSize === "number" ? s.fontSize : el.fontSize,
        fill: typeof s.fill === "string" ? s.fill : el.fill,
        fontWeight: s.fontWeight || el.fontWeight,
        fontFamily: s.fontFamily || el.fontFamily,
        align: s.align || el.align,
        width: typeof s.width === "number" ? s.width : el.width,
        coverFill: el.coverFill,
        coverPad: el.coverPad,
        visible: s.visible !== false,
        opacity: typeof s.opacity === "number" ? s.opacity : el.opacity,
      };
    }),
  };
}

function cloneLayout(layout: BusinessCardLayout): BusinessCardLayout {
  return JSON.parse(JSON.stringify(layout)) as BusinessCardLayout;
}
