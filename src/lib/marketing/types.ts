// Tipos de Marketing en redes y Campañas pagadas (Admin → Marketing / Campañas).
// Seguros para el navegador: solo tipos.

import type { AdGoal } from "./ad-goals";
import type { DesignStyle } from "./styles";

export type SocialDestination = "ig_feed" | "ig_story" | "fb";

export type SocialTheme = "servicio" | "consejo" | "proyecto" | "soporte" | "conferencias" | "unete" | "cotiza";

export type SocialStatus = "borrador" | "aprobada" | "publicando" | "publicada" | "error";

export type SocialResult = { destination: SocialDestination; at: string; ok: boolean; id?: string; error?: string };

export type SocialPost = {
  id: string;
  createdAt: string;
  createdBy: string;
  source: "plan" | "manual";
  theme: SocialTheme | "propia";
  headline: string;
  subline: string;
  chips: string[];
  imageKey: string | null;
  style: DesignStyle;
  frame: boolean;
  designVersion: number;
  caption: string;
  destinations: SocialDestination[];
  scheduledAt: string;
  status: SocialStatus;
  approvedBy: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
  results: SocialResult[];
};

export type SocialSettings = {
  autoPlan: boolean;
  postsPerWeek: 3 | 5 | 7;
  /** Hora de CDMX (6–22). */
  hour: number;
  autoApprove: boolean;
  destinations: SocialDestination[];
  /** Franja "Cotiza por WhatsApp" en las imágenes. */
  contactStrip: boolean;
  lastPlanWeek: string | null;
};

export type AdAudience = "cctv" | "soporte" | "redes" | "software" | "empresas";

export type AdLocation = "nuevo_laredo" | "laredo_tx" | "monterrey" | "mx";

export type AdStatus = "borrador" | "pausada" | "activa" | "terminada" | "error";

export type AdStats = {
  spend: number;
  reach: number;
  impressions: number;
  clicks: number;
  actions?: Record<string, number>;
  updatedAt: string;
};

export type AdCampaign = {
  id: string;
  createdAt: string;
  createdBy: string;
  goal: AdGoal;
  audience: AdAudience;
  location: AdLocation;
  headline: string;
  subline: string;
  message: string;
  style: DesignStyle;
  designVersion: number;
  postId: string | null;
  postTitle: string | null;
  postImage: string | null;
  budgetMxn: number;
  days: number;
  status: AdStatus;
  meta: { campaignId?: string; adSetId?: string; creativeId?: string; adId?: string; imageHash?: string } | null;
  error: string | null;
  activatedAt: string | null;
  activatedBy: string | null;
  startAt: string | null;
  endAt: string | null;
  stats: AdStats | null;
  followers: { fbStart: number | null; igStart: number | null; fb: number | null; ig: number | null; at: string } | null;
};

export type AdFund = { id: string; at: string; amountMxn: number; by: string };
