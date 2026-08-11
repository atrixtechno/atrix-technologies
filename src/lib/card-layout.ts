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

/** Editor / 300 DPI canvas */
export const CARD_CANVAS = cardPixelSize(CARD_EXPORT_DPI);

export type CardTextElement = {
  id: string;
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
  letterSpacing?: number;
  opacity?: number;
  visible?: boolean;
};

export type CardShapeKind = "rect" | "ellipse" | "line" | "corner";

export type CardShapeElement = {
  id: string;
  type: "shape";
  shape: CardShapeKind;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  /** For corner triangles */
  corner?: "tl" | "tr" | "bl" | "br";
  opacity?: number;
  visible?: boolean;
};

export type CardElement = CardTextElement | CardShapeElement;

export type CardFaceLayout = {
  backgroundUrl: string;
  backgroundColor?: string;
  /** Scale of background image (1 = fit width) */
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
  assetUrls?: {
    frontPreview?: string;
    backPreview?: string;
  };
};

export const CARD_LAYOUT_KEY = "business_card_layout";

export const CARD_FONT_OPTIONS = [
  { value: "Syne, system-ui, sans-serif", label: "Syne (marca)" },
  { value: "Sora, system-ui, sans-serif", label: "Sora (cuerpo)" },
  { value: "Arial, Helvetica, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "system-ui, sans-serif", label: "Sistema" },
] as const;

export function isTextElement(el: CardElement): el is CardTextElement {
  return !el.type || el.type === "text";
}

export function isShapeElement(el: CardElement): el is CardShapeElement {
  return el.type === "shape";
}

export function isElementVisible(el: CardElement): boolean {
  return el.visible !== false;
}

/** Normalize legacy layouts (no type, wrong canvas size) into the current schema. */
export function normalizeCardLayout(
  raw: BusinessCardLayout | null | undefined,
): BusinessCardLayout {
  const base = raw ?? DEFAULT_CARD_LAYOUT;
  return {
    ...base,
    front: normalizeFace(base.front),
    back: normalizeFace(base.back),
  };
}

function normalizeFace(face: CardFaceLayout): CardFaceLayout {
  const width = face.width > 0 ? face.width : CARD_CANVAS.width;
  const height = face.height > 0 ? face.height : CARD_CANVAS.height;
  return {
    backgroundUrl: face.backgroundUrl || "",
    backgroundColor: face.backgroundColor || "#000c24",
    backgroundScale: face.backgroundScale ?? 1,
    backgroundOffsetX: face.backgroundOffsetX ?? 0,
    backgroundOffsetY: face.backgroundOffsetY ?? 0,
    width,
    height,
    elements: (face.elements ?? []).map(normalizeElement),
  };
}

function normalizeElement(el: CardElement): CardElement {
  if (isShapeElement(el)) {
    return {
      ...el,
      type: "shape",
      opacity: el.opacity ?? 1,
      visible: el.visible !== false,
      strokeWidth: el.strokeWidth ?? 0,
    };
  }
  return {
    ...el,
    type: "text",
    text: el.text ?? "",
    fontSize: el.fontSize || 18,
    fill: el.fill || "#f5f5f0",
    fontWeight: el.fontWeight || "500",
    fontFamily: el.fontFamily || CARD_FONT_OPTIONS[0].value,
    align: el.align || "left",
    opacity: el.opacity ?? 1,
    visible: el.visible !== false,
  };
}

export const DEFAULT_CARD_LAYOUT: BusinessCardLayout = {
  front: {
    backgroundUrl: "/brand/tarjeta-atrix-frente-300dpi.png",
    backgroundColor: "#000c24",
    backgroundScale: 1,
    backgroundOffsetX: 0,
    backgroundOffsetY: 0,
    width: CARD_CANVAS.width,
    height: CARD_CANVAS.height,
    elements: [
      {
        id: "front-name",
        type: "text",
        text: "ATRIX Technologies",
        x: 56,
        y: 72,
        fontSize: 34,
        fill: "#f5f5f0",
        fontWeight: "700",
        fontFamily: CARD_FONT_OPTIONS[0].value,
      },
      {
        id: "front-tag",
        type: "text",
        text: "Software · Web · Soporte",
        x: 56,
        y: 128,
        fontSize: 17,
        fill: "#c4a35a",
        fontFamily: CARD_FONT_OPTIONS[1].value,
      },
    ],
  },
  back: {
    backgroundUrl: "/brand/tarjeta-atrix-reverso-300dpi.png",
    backgroundColor: "#000c24",
    backgroundScale: 1,
    backgroundOffsetX: 0,
    backgroundOffsetY: 0,
    width: CARD_CANVAS.width,
    height: CARD_CANVAS.height,
    elements: [
      {
        id: "back-web",
        type: "text",
        text: "atrixnld.com",
        x: 56,
        y: 110,
        fontSize: 26,
        fill: "#f5f5f0",
        fontWeight: "600",
        fontFamily: CARD_FONT_OPTIONS[0].value,
      },
      {
        id: "back-phone",
        type: "text",
        text: "+52 867 179 3155",
        x: 56,
        y: 168,
        fontSize: 19,
        fill: "#c4a35a",
        fontFamily: CARD_FONT_OPTIONS[1].value,
      },
      {
        id: "back-mail",
        type: "text",
        text: "contacto@atrixnld.com",
        x: 56,
        y: 214,
        fontSize: 17,
        fill: "#d4d4d0",
        fontFamily: CARD_FONT_OPTIONS[1].value,
      },
    ],
  },
};
