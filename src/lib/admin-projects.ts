import { projects as siteProjects } from "@/content/projects";
import {
  decryptSecret,
  encryptSecretIfProvided,
} from "@/lib/project-secrets";

export type AdminProjectRow = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  public_url: string | null;
  logo_url: string | null;
  email_address: string | null;
  email_password_enc: string | null;
  domain_platform: string | null;
  domain_email: string | null;
  domain_password_enc: string | null;
  db_platform: string | null;
  db_email: string | null;
  db_password_enc: string | null;
  deploy_platform: string | null;
  deploy_email: string | null;
  deploy_password_enc: string | null;
  domain_registered_at: string | null;
  domain_renews_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminProjectPublic = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  publicUrl: string | null;
  logoUrl: string | null;
  emailAddress: string | null;
  emailPassword: string | null;
  domainPlatform: string | null;
  domainEmail: string | null;
  domainPassword: string | null;
  dbPlatform: string | null;
  dbEmail: string | null;
  dbPassword: string | null;
  deployPlatform: string | null;
  deployEmail: string | null;
  deployPassword: string | null;
  domainRegisteredAt: string | null;
  domainRenewsAt: string | null;
  daysUntilRenewal: number | null;
  renewalStatus: "ok" | "warn" | "danger" | "none";
  createdAt: string;
  updatedAt: string;
};

export type AdminProjectInput = {
  name?: string;
  slug?: string;
  shortDescription?: string | null;
  publicUrl?: string | null;
  logoUrl?: string | null;
  emailAddress?: string | null;
  emailPassword?: string | null;
  domainPlatform?: string | null;
  domainEmail?: string | null;
  domainPassword?: string | null;
  dbPlatform?: string | null;
  dbEmail?: string | null;
  dbPassword?: string | null;
  deployPlatform?: string | null;
  deployEmail?: string | null;
  deployPassword?: string | null;
  domainRegisteredAt?: string | null;
  domainRenewsAt?: string | null;
};

function addOneYear(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00.000Z`);
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

export function resolveRenewalDates(
  registeredAt: string | null | undefined,
  renewsAt: string | null | undefined,
): { domain_registered_at: string | null; domain_renews_at: string | null } {
  const registered =
    registeredAt && registeredAt.trim() ? registeredAt.trim().slice(0, 10) : null;
  let renews =
    renewsAt && renewsAt.trim() ? renewsAt.trim().slice(0, 10) : null;
  if (registered && !renews) {
    renews = addOneYear(registered);
  }
  return { domain_registered_at: registered, domain_renews_at: renews };
}

export function daysUntil(dateIso: string | null): number | null {
  if (!dateIso) return null;
  const target = new Date(`${dateIso.slice(0, 10)}T12:00:00.000Z`);
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const then = Date.UTC(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate(),
  );
  return Math.round((then - today) / (24 * 60 * 60 * 1000));
}

export function renewalStatus(
  days: number | null,
): "ok" | "warn" | "danger" | "none" {
  if (days == null) return "none";
  if (days < 0) return "danger";
  if (days <= 30) return "danger";
  if (days <= 90) return "warn";
  return "ok";
}

export function toPublicProject(row: AdminProjectRow): AdminProjectPublic {
  const days = daysUntil(row.domain_renews_at);
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    publicUrl: row.public_url,
    logoUrl: row.logo_url,
    emailAddress: row.email_address,
    emailPassword: decryptSecret(row.email_password_enc),
    domainPlatform: row.domain_platform,
    domainEmail: row.domain_email,
    domainPassword: decryptSecret(row.domain_password_enc),
    dbPlatform: row.db_platform,
    dbEmail: row.db_email,
    dbPassword: decryptSecret(row.db_password_enc),
    deployPlatform: row.deploy_platform,
    deployEmail: row.deploy_email,
    deployPassword: decryptSecret(row.deploy_password_enc),
    domainRegisteredAt: row.domain_registered_at,
    domainRenewsAt: row.domain_renews_at,
    daysUntilRenewal: days,
    renewalStatus: renewalStatus(days),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function seedRowsFromSiteContent(): Omit<
  AdminProjectRow,
  "id" | "created_at" | "updated_at"
>[] {
  return siteProjects.map((p) => ({
    name: p.name,
    slug: p.slug,
    short_description: p.summary,
    public_url: p.url ?? null,
    logo_url: p.logo ?? null,
    email_address: null,
    email_password_enc: null,
    domain_platform: null,
    domain_email: null,
    domain_password_enc: null,
    db_platform: null,
    db_email: null,
    db_password_enc: null,
    deploy_platform: null,
    deploy_email: null,
    deploy_password_enc: null,
    domain_registered_at: null,
    domain_renews_at: null,
  }));
}

export function inputToDbPatch(input: AdminProjectInput): Record<string, unknown> {
  const patch: Record<string, unknown> = {};

  if (input.name !== undefined) patch.name = input.name.trim();
  if (input.slug !== undefined) patch.slug = slugify(input.slug) || slugify(input.name ?? "");
  if (input.shortDescription !== undefined)
    patch.short_description = input.shortDescription?.trim() || null;
  if (input.publicUrl !== undefined)
    patch.public_url = input.publicUrl?.trim() || null;
  if (input.logoUrl !== undefined) patch.logo_url = input.logoUrl?.trim() || null;
  if (input.emailAddress !== undefined)
    patch.email_address = input.emailAddress?.trim() || null;
  if (input.domainPlatform !== undefined)
    patch.domain_platform = input.domainPlatform?.trim() || null;
  if (input.domainEmail !== undefined)
    patch.domain_email = input.domainEmail?.trim() || null;
  if (input.dbPlatform !== undefined)
    patch.db_platform = input.dbPlatform?.trim() || null;
  if (input.dbEmail !== undefined) patch.db_email = input.dbEmail?.trim() || null;
  if (input.deployPlatform !== undefined)
    patch.deploy_platform = input.deployPlatform?.trim() || null;
  if (input.deployEmail !== undefined)
    patch.deploy_email = input.deployEmail?.trim() || null;

  const emailPw = encryptSecretIfProvided(input.emailPassword);
  if (emailPw !== undefined) patch.email_password_enc = emailPw;
  const domainPw = encryptSecretIfProvided(input.domainPassword);
  if (domainPw !== undefined) patch.domain_password_enc = domainPw;
  const dbPw = encryptSecretIfProvided(input.dbPassword);
  if (dbPw !== undefined) patch.db_password_enc = dbPw;
  const deployPw = encryptSecretIfProvided(input.deployPassword);
  if (deployPw !== undefined) patch.deploy_password_enc = deployPw;

  if (
    input.domainRegisteredAt !== undefined ||
    input.domainRenewsAt !== undefined
  ) {
    const dates = resolveRenewalDates(
      input.domainRegisteredAt === undefined
        ? undefined
        : input.domainRegisteredAt,
      input.domainRenewsAt === undefined ? undefined : input.domainRenewsAt,
    );
    // When only one field is sent, resolveRenewalDates may null the other —
    // callers that PATCH should merge with existing row first.
    if (input.domainRegisteredAt !== undefined) {
      patch.domain_registered_at = dates.domain_registered_at;
    }
    if (input.domainRenewsAt !== undefined || input.domainRegisteredAt !== undefined) {
      patch.domain_renews_at = dates.domain_renews_at;
    }
  }

  patch.updated_at = new Date().toISOString();
  return patch;
}

export function mergeDateFields(
  existing: AdminProjectRow,
  input: AdminProjectInput,
): { domain_registered_at: string | null; domain_renews_at: string | null } {
  const registered =
    input.domainRegisteredAt !== undefined
      ? input.domainRegisteredAt
      : existing.domain_registered_at;
  const renewsExplicit =
    input.domainRenewsAt !== undefined
      ? input.domainRenewsAt
      : existing.domain_renews_at;
  // If registered changed and renews not explicitly provided in this request, recalc.
  if (
    input.domainRegisteredAt !== undefined &&
    input.domainRenewsAt === undefined
  ) {
    return resolveRenewalDates(registered, null);
  }
  return resolveRenewalDates(registered, renewsExplicit);
}
