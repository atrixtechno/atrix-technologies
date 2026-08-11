export type CardElement = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  fontWeight?: string;
  align?: "left" | "center" | "right";
};

export type CardFaceLayout = {
  backgroundUrl: string;
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

export const DEFAULT_CARD_LAYOUT: BusinessCardLayout = {
  front: {
    backgroundUrl: "/brand/tarjeta-atrix-frente.png",
    width: 1050,
    height: 600,
    elements: [
      {
        id: "front-name",
        text: "ATRIX Technologies",
        x: 60,
        y: 80,
        fontSize: 36,
        fill: "#f5f5f0",
        fontWeight: "700",
      },
      {
        id: "front-tag",
        text: "Software · Web · Soporte",
        x: 60,
        y: 140,
        fontSize: 18,
        fill: "#c4a35a",
      },
    ],
  },
  back: {
    backgroundUrl: "/brand/tarjeta-atrix-reverso.png",
    width: 1050,
    height: 600,
    elements: [
      {
        id: "back-web",
        text: "atrixnld.com",
        x: 60,
        y: 120,
        fontSize: 28,
        fill: "#f5f5f0",
        fontWeight: "600",
      },
      {
        id: "back-phone",
        text: "+52 867 179 3155",
        x: 60,
        y: 180,
        fontSize: 20,
        fill: "#c4a35a",
      },
      {
        id: "back-mail",
        text: "contacto@atrixnld.com",
        x: 60,
        y: 230,
        fontSize: 18,
        fill: "#d4d4d0",
      },
    ],
  },
};
