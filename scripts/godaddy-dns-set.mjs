#!/usr/bin/env node
/**
 * godaddy-dns-set.mjs
 *
 * Creates or updates DNS records in GoDaddy via API for all Vercel environments.
 * Reads domain config from scripts/domains.json. Idempotent — safe to re-run.
 *
 * Usage:
 *   node scripts/godaddy-dns-set.mjs --project ploutos-blue-stone --dry-run
 *   node scripts/godaddy-dns-set.mjs --project ploutos-blue-stone              # prod (default)
 *   node scripts/godaddy-dns-set.mjs --project ploutos-blue-stone --env ote    # OTE sandbox
 *   node scripts/godaddy-dns-set.mjs --domain bluestoneconstruction.llc --dry-run
 *   node scripts/godaddy-dns-set.mjs --all-projects --dry-run
 *   node scripts/godaddy-dns-set.mjs --list
 *
 * Credentials loaded from macOS Keychain (preferred) or env vars (fallback).
 * See scripts/godaddy-credentials.mjs for setup instructions.
 *
 * Override API base for testing:
 *   GODADDY_API_BASE_URL=http://localhost:9001
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadCredentials } from './godaddy-credentials.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const registryPath = resolve(__dir, 'domains.json')
const registry = JSON.parse(readFileSync(registryPath, 'utf8'))

const VERCEL_A_IP  = '76.76.21.21'
const VERCEL_CNAME = 'cname.vercel-dns.com'
const DEFAULT_TTL  = 3600

// ── Pure helpers (exported for testing) ──────────────────────────────────────

export function rootDomain(domain) {
  return domain.split('.').slice(-2).join('.')
}

export function buildRecords(domains) {
  const records = []
  const production = domains.production

  if (production) {
    records.push({ type: 'A',     name: '@',   data: VERCEL_A_IP,  ttl: DEFAULT_TTL })
    records.push({ type: 'CNAME', name: 'www', data: VERCEL_CNAME, ttl: DEFAULT_TTL })
  }

  for (const [env, domain] of Object.entries(domains)) {
    if (env === 'production') continue
    const parts = domain.split('.')
    const subdomain = parts.slice(0, -2).join('.')
    if (subdomain && subdomain !== 'www') {
      records.push({ type: 'CNAME', name: subdomain, data: VERCEL_CNAME, ttl: DEFAULT_TTL })
    }
  }

  // Deduplicate by type+name (last write wins)
  const seen = new Map()
  for (const r of records) seen.set(`${r.type}:${r.name}`, r)
  return [...seen.values()]
}

// ── API ───────────────────────────────────────────────────────────────────────

export async function putRecord(domain, record, apiKey, apiSecret, baseUrl) {
  const url = `${baseUrl}/v1/domains/${domain}/records/${record.type}/${record.name}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization:  `sso-key ${apiKey}:${apiSecret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{ data: record.data, ttl: record.ttl }]),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GoDaddy API ${res.status} for ${record.type} ${record.name}: ${body}`)
  }
}

// ── CLI ───────────────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const get  = f => { const i = args.indexOf(f); return i !== -1 ? args[i + 1] : null }
  const has  = f => args.includes(f)

  const projectArg  = get('--project')
  const domainArg   = get('--domain')
  const envArg      = get('--env') ?? 'prod'
  const allProjects = has('--all-projects')
  const dryRun      = has('--dry-run')
  const list        = has('--list')

  if (!['ote', 'prod'].includes(envArg)) {
    console.error(`Error: --env must be "ote" or "prod" (got "${envArg}")`)
    process.exit(1)
  }

  if (list) {
    console.log('\nRegistered projects and root domains:\n')
    for (const [project, cfg] of Object.entries(registry.projects)) {
      const prod = cfg.domains.production ?? Object.values(cfg.domains)[0]
      console.log(`  ${project.padEnd(24)} ${prod}`)
      const records = buildRecords(cfg.domains)
      records.forEach(r => console.log(`    ${r.type.padEnd(5)} ${r.name.padEnd(12)} → ${r.data}`))
    }
    console.log()
    process.exit(0)
  }

  if (!projectArg && !domainArg && !allProjects) {
    console.error('Error: provide --project <name>, --domain <domain>, or --all-projects')
    process.exit(1)
  }

  if (projectArg && !registry.projects[projectArg]) {
    console.error(`Error: unknown project "${projectArg}". Run --list to see options.`)
    process.exit(1)
  }

  // Build work list
  const work = []
  if (allProjects) {
    for (const [name, cfg] of Object.entries(registry.projects)) {
      const prod = cfg.domains.production
      if (!prod) { console.warn(`  Warning: no production domain for ${name}, skipping`); continue }
      work.push({ name, root: rootDomain(prod), records: buildRecords(cfg.domains) })
    }
  } else if (projectArg) {
    const cfg  = registry.projects[projectArg]
    const prod = cfg.domains.production
    if (!prod) { console.error(`Error: no production domain for "${projectArg}"`); process.exit(1) }
    work.push({ name: projectArg, root: rootDomain(prod), records: buildRecords(cfg.domains) })
  } else {
    work.push({ name: domainArg, root: rootDomain(domainArg), records: buildRecords({ production: domainArg }) })
  }

  if (work.length === 0) { console.log('Nothing to do.'); process.exit(0) }

  const { apiKey, apiSecret, baseUrl } = dryRun
    ? { apiKey: null, apiSecret: null, baseUrl: process.env.GODADDY_API_BASE_URL ?? `https://api.${envArg === 'ote' ? 'ote-' : ''}godaddy.com` }
    : loadCredentials(envArg)

  const envLabel = envArg === 'ote' ? ' [OTE sandbox]' : ' [Production]'
  if (dryRun) console.log(`\n[DRY RUN] No changes will be made.${envLabel}\n`)

  for (const { name, root, records } of work) {
    console.log(`\n→ ${name}  (${root})`)
    for (const record of records) {
      if (dryRun) {
        console.log(`    [dry-run] PUT ${baseUrl}/v1/domains/${root}/records/${record.type}/${record.name}`)
        console.log(`             data=${record.data}  ttl=${record.ttl}`)
        continue
      }
      process.stdout.write(`  ${record.type.padEnd(5)} ${record.name.padEnd(12)} → ${record.data} ... `)
      try {
        await putRecord(root, record, apiKey, apiSecret, baseUrl)
        console.log('✓')
      } catch (err) {
        console.log('✗')
        console.error(`    Error: ${err.message}`)
      }
    }
  }

  console.log(dryRun ? '\n[DRY RUN complete]\n' : '\nDone. DNS propagation: 5–30 min typically.\n')
  if (!dryRun) console.log('Verify with: node scripts/godaddy-dns-read.mjs --domain <domain>')
}
