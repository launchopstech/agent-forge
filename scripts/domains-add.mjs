#!/usr/bin/env node
/**
 * domains-add.mjs
 *
 * Registers a new project in scripts/domains.json — the single source of truth for
 * all deployment config. Run this first when onboarding a new client.
 *
 * Usage:
 *   node scripts/domains-add.mjs \
 *     --alias   ploutos-new-client \
 *     --dir     apps/ploutos/clients/new-client \
 *     --domain  newclient.com \
 *     --brand   new-client
 *
 *   node scripts/domains-add.mjs --list
 *   node scripts/domains-add.mjs --dry-run --alias ... --dir ... --domain ... --brand ...
 *
 * After adding, run:
 *   node scripts/vercel-project-create.mjs --project <alias>
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dir = dirname(fileURLToPath(import.meta.url))

// ── Pure helpers (exported for testing) ──────────────────────────────────────

/**
 * Build a domains.json project entry from primitive inputs.
 * Generates the standard 4-env domain structure (dev, preview, staging, production).
 */
export function buildProjectEntry(alias, dir, domain, brand) {
  return {
    dir,
    domains: {
      development: `dev.${domain}`,
      preview: `preview.${domain}`,
      staging: `staging.${domain}`,
      production: domain,
    },
    envVars: {
      NEXT_PUBLIC_BRAND: brand,
      NEXT_PUBLIC_APP_ENV: {
        development: 'development',
        preview: 'staging',
        staging: 'staging',
        production: 'production',
      },
    },
    secrets: ['NEXT_PUBLIC_PHONE', 'RESEND_API_KEY'],
  }
}

// ── CLI ───────────────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // DOMAINS_FILE lets tests inject a temp copy so we never modify the real file
  const registryPath = process.env.DOMAINS_FILE ?? resolve(__dir, 'domains.json')
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'))

  const args = process.argv.slice(2)
  const get = (f) => {
    const i = args.indexOf(f)
    return i !== -1 ? args[i + 1] : null
  }
  const has = (f) => args.includes(f)

  const alias = get('--alias')
  const dir = get('--dir')
  const domain = get('--domain')
  const brand = get('--brand') ?? alias
  const dryRun = has('--dry-run')
  const list = has('--list')

  if (list) {
    console.log('\nRegistered projects:\n')
    for (const [name, cfg] of Object.entries(registry.projects)) {
      const prod = cfg.domains.production ?? Object.values(cfg.domains)[0]
      console.log(`  ${name.padEnd(28)} ${prod}`)
    }
    console.log()
    process.exit(0)
  }

  // Validate
  if (!alias) {
    console.error('Error: --alias is required (e.g. ploutos-new-client)')
    process.exit(1)
  }
  if (!dir) {
    console.error('Error: --dir is required (e.g. apps/ploutos/clients/new-client)')
    process.exit(1)
  }
  if (!domain) {
    console.error('Error: --domain is required (e.g. newclient.com)')
    process.exit(1)
  }
  if (/^https?:\/\//i.test(domain)) {
    console.error('Error: --domain must be a bare domain (e.g. newclient.com), not a URL')
    process.exit(1)
  }
  if (domain.startsWith('.')) {
    console.error('Error: --domain must not start with a dot')
    process.exit(1)
  }
  if (registry.projects[alias]) {
    console.error(
      `Error: project "${alias}" already exists in domains.json. Use a different alias.`
    )
    process.exit(1)
  }

  const entry = buildProjectEntry(alias, dir, domain, brand ?? alias)

  if (dryRun) {
    console.log('\n[DRY RUN] Would add to domains.json:\n')
    console.log(JSON.stringify({ [alias]: entry }, null, 2))
    console.log()
    process.exit(0)
  }

  registry.projects[alias] = entry
  writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf8')

  console.log(`✓ Added "${alias}" to domains.json`)
  console.log(`  domain: ${domain}`)
  console.log(`  dir:    ${dir}`)
  console.log(`\nNext steps:`)
  console.log(`  node scripts/vercel-project-create.mjs --project ${alias}`)
  console.log(`  node scripts/godaddy-dns-set.mjs       --project ${alias}`)
  console.log(`  node scripts/setup-domain.mjs          --project ${alias} --all-envs`)
  console.log(`  node scripts/vercel-env-set.mjs        --project ${alias} --all-envs`)
}
