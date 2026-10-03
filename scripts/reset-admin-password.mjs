#!/usr/bin/env node
/**
 * Owner script: set a random one-time admin password and clear lockouts.
 * The temporary password is printed once; the panel forces a change on first login.
 *
 * Usage (from repo root, with .env.local loaded):
 *   node --env-file=.env.local scripts/reset-admin-password.mjs
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL.
 * Prints only the generated temporary password.
 */

import { randomBytes, scryptSync } from "crypto";
import { createClient } from "@supabase/supabase-js";

// Same format as src/lib/admin-server-auth.ts → hashPassword().
function hashPassword(password) {
  const b64url = (buf) => buf.toString("base64url");
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return ["scrypt", 16384, 8, 1, b64url(salt), b64url(hash)].join("$");
}

const TEMP_PASSWORD = randomBytes(12).toString("base64url");
const DEFAULT_HASH = hashPassword(TEMP_PASSWORD);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function tableMissing(message) {
  return /relation .* does not exist|Could not find the table|PGRST205/i.test(
    message || "",
  );
}

async function resetCredentials() {
  const payload = {
    id: 1,
    password_hash: DEFAULT_HASH,
    password_changed: false,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("admin_credentials")
    .upsert(payload, { onConflict: "id" });

  if (!error) {
    console.log("admin_credentials: password reset (password_changed=false).");
    return "table";
  }

  if (!tableMissing(error.message)) {
    throw new Error(`admin_credentials: ${error.message}`);
  }

  const { error: settingsError } = await supabase.from("site_settings").upsert(
    {
      key: "admin_credentials",
      value: {
        password_hash: DEFAULT_HASH,
        password_changed: false,
      },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (settingsError) {
    throw new Error(`site_settings admin_credentials: ${settingsError.message}`);
  }

  console.log(
    "site_settings.admin_credentials: password reset (password_changed=false).",
  );
  return "settings";
}

async function clearLockouts() {
  const { error, count } = await supabase
    .from("admin_login_attempts")
    .delete({ count: "exact" })
    .neq("ip", "__never__");

  if (!error) {
    console.log(
      `admin_login_attempts: cleared${typeof count === "number" ? ` (${count} row(s))` : ""}.`,
    );
    return;
  }

  if (!tableMissing(error.message)) {
    throw new Error(`admin_login_attempts: ${error.message}`);
  }

  const { error: settingsError } = await supabase.from("site_settings").upsert(
    {
      key: "admin_login_attempts",
      value: {},
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (settingsError) {
    throw new Error(
      `site_settings admin_login_attempts: ${settingsError.message}`,
    );
  }

  console.log("site_settings.admin_login_attempts: cleared.");
}

try {
  await resetCredentials();
  await clearLockouts();
  console.log("");
  console.log("Login with:");
  console.log("  Usuario:   admin   (UI shows @atrix.com)");
  console.log(`  Password:  ${TEMP_PASSWORD}   (temporal, de un solo uso)`);
  console.log("You will be prompted to change the password on first login.");
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
