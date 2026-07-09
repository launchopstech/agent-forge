/**
 * godaddy-credentials.mjs
 *
 * Loads GoDaddy API credentials from macOS Keychain (preferred) or env vars (fallback).
 * Supports two environments: 'ote' (sandbox) and 'prod' (production).
 *
 * Keychain setup (one-time):
 *   security add-generic-password -s "godaddy-ote-key"     -a "launchops" -w "<key>"
 *   security add-generic-password -s "godaddy-ote-secret"  -a "launchops" -w "<secret>"
 *   security add-generic-password -s "godaddy-prod-key"    -a "launchops" -w "<key>"
 *   security add-generic-password -s "godaddy-prod-secret" -a "launchops" -w "<secret>"
 *
 * Env var fallback (CI / testing):
 *   GODADDY_OTE_API_KEY, GODADDY_OTE_API_SECRET   (for ote)
 *   GODADDY_API_KEY,     GODADDY_API_SECRET        (for prod)
 */

import { execFileSync } from 'node:child_process'

export const BASE_URLS = {
  ote: 'https://api.ote-godaddy.com',
  prod: 'https://api.godaddy.com',
}

const KEYCHAIN_NAMES = {
  ote: { key: 'godaddy-ote-key', secret: 'godaddy-ote-secret' },
  prod: { key: 'godaddy-prod-key', secret: 'godaddy-prod-secret' },
}

const ENV_VAR_NAMES = {
  ote: { key: 'GODADDY_OTE_API_KEY', secret: 'GODADDY_OTE_API_SECRET' },
  prod: { key: 'GODADDY_API_KEY', secret: 'GODADDY_API_SECRET' },
}

function keychainGet(service) {
  // SKIP_KEYCHAIN=1 lets tests bypass keychain (agents can't run `security`)
  if (process.env.SKIP_KEYCHAIN === '1') return null
  try {
    return execFileSync(
      'security',
      ['find-generic-password', '-s', service, '-a', 'launchops', '-w'],
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim()
  } catch {
    return null
  }
}

/**
 * Load credentials for the given GoDaddy environment.
 * Returns { apiKey, apiSecret, baseUrl } or throws if credentials are missing.
 *
 * @param {'ote'|'prod'} env
 * @param {{ allowMissing?: boolean }} opts — set allowMissing to suppress the throw
 */
export function loadCredentials(env, { allowMissing = false } = {}) {
  if (env !== 'ote' && env !== 'prod') {
    throw new Error(`Unknown env "${env}". Use "ote" or "prod".`)
  }

  const baseUrl = process.env.GODADDY_API_BASE_URL ?? BASE_URLS[env]
  const kn = KEYCHAIN_NAMES[env]
  const en = ENV_VAR_NAMES[env]

  // Try Keychain first, fall back to env vars
  const apiKey = keychainGet(kn.key) ?? process.env[en.key] ?? null
  const apiSecret = keychainGet(kn.secret) ?? process.env[en.secret] ?? null

  if (!allowMissing && (!apiKey || !apiSecret)) {
    const envLabel = env === 'ote' ? 'OTE' : 'Production'
    console.error(`Error: No ${envLabel} GoDaddy credentials found.`)
    console.error(`  Option 1 — Keychain (recommended):`)
    console.error(`    security add-generic-password -s "${kn.key}"    -a "launchops" -w "<key>"`)
    console.error(
      `    security add-generic-password -s "${kn.secret}" -a "launchops" -w "<secret>"`
    )
    console.error(`  Option 2 — env vars:`)
    console.error(`    export ${en.key}=<key>`)
    console.error(`    export ${en.secret}=<secret>`)
    console.error(`  Get keys at: https://developer.godaddy.com/keys`)
    process.exit(1)
  }

  return { apiKey, apiSecret, baseUrl }
}
