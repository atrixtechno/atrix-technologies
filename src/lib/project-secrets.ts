import { createHash, createCipheriv, createDecipheriv, randomBytes } from "crypto";

const PREFIX = "enc:v1:";

function resolveKeyMaterial(): Buffer | null {
  const explicit = process.env.PROJECT_SECRETS_KEY?.trim();
  if (explicit) {
    return createHash("sha256").update(explicit, "utf8").digest();
  }
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (service) {
    return createHash("sha256")
      .update(`atrix-project-secrets:${service}`, "utf8")
      .digest();
  }
  return null;
}

export function canEncryptProjectSecrets(): boolean {
  return Boolean(resolveKeyMaterial());
}

/** Encrypt plaintext for storage. Empty/null stays empty. Already-encrypted passthrough. */
export function encryptSecret(plaintext: string | null | undefined): string | null {
  if (plaintext == null) return null;
  const trimmed = plaintext.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith(PREFIX)) return trimmed;

  const key = resolveKeyMaterial();
  if (!key) {
    throw new Error(
      "Falta PROJECT_SECRETS_KEY o SUPABASE_SERVICE_ROLE_KEY para cifrar secretos.",
    );
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(trimmed, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, tag, encrypted]).toString("base64url");
  return `${PREFIX}${payload}`;
}

/** Decrypt for admin API responses. Returns null if empty. */
export function decryptSecret(stored: string | null | undefined): string | null {
  if (stored == null) return null;
  const trimmed = stored.trim();
  if (!trimmed) return null;
  if (!trimmed.startsWith(PREFIX)) {
    // Legacy/plaintext — do not return to client; treat as unset until re-saved.
    return null;
  }

  const key = resolveKeyMaterial();
  if (!key) {
    throw new Error(
      "Falta PROJECT_SECRETS_KEY o SUPABASE_SERVICE_ROLE_KEY para descifrar secretos.",
    );
  }

  const raw = Buffer.from(trimmed.slice(PREFIX.length), "base64url");
  if (raw.length < 12 + 16 + 1) return null;
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const data = raw.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString("utf8");
}

/** Encrypt only if value is a non-empty string; undefined means “leave column unchanged”. */
export function encryptSecretIfProvided(
  value: string | null | undefined,
): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value.trim() === "") return null;
  return encryptSecret(value);
}
