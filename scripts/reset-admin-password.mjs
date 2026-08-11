#!/usr/bin/env node
/**
 * One-time owner script: reset admin password to 12345678 and clear lockouts.
 *
 * Usage (from repo root, with .env.local loaded):
 *   node --env-file=.env.local scripts/reset-admin-password.mjs
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL.
 * Does not print secrets.
 */

import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_PASSWORD = "12345678";
const DEFAULT_HASH = createHash("sha256")
  .update(DEFAULT_PASSWORD, "utf8")
  .digest("hex");

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
  console.log("  Password:  12345678");
  console.log("You will be prompted to change the password on first login.");
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
