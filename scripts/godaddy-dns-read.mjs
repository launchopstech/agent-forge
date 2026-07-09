#!/usr/bin/env node
/**
 * godaddy-dns-read.mjs
 *
 * Reads current DNS records from GoDaddy API and reports status vs expected Vercel config.
 *
 * Usage:
 *   node scripts/godaddy-dns-read.mjs --domain bluestoneconstruction.llc
 *   node scripts/godaddy-dns-read.mjs --domain bluestoneconstruction.llc --env ote
 *   node scripts/godaddy-dns-read.mjs --domain bluestoneconstruction.llc --type CNAME
 *   node scripts/godaddy-dns-read.mjs --list
 *   node scripts/godaddy-dns-read.mjs --domain bluestoneconstruction.llc --dry-run
 *   node scripts/godaddy-dns-read.mjs --check              # verify both OTE + prod keys
 *   node scripts/godaddy-dns-read.mjs --check --env ote    # verify OTE only
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

// ── Pure helpers (exported for testing) ──────────────────────────────────────

export function detectConflicts(records) {
  const conflicts = []
  const byName = {}
  for (const r of records) {
    ;(byName[r.name] ??= []).push(r.type)
  }
  for (const [name, types] of Object.entries(byName)) {
    if (types.includes('A') && types.includes('CNAME')) {
      conflicts.push(`${name}: has both A and CNAME records (will break DNS)`)
    }
  }
  for (const r of records) {
    if (r.type === 'A' && r.name === '@' && r.data !== VERCEL_A_IP) {
      conflicts.push(`@: A record points to ${r.data} (expected ${VERCEL_A_IP})`)
    }
    if (r.type === 'CNAME' && r.data && !r.data.includes('vercel')) {
      conflicts.push(`${r.name}: CNAME points to ${r.data} (expected ${VERCEL_CNAME})`)
    }
  }
  return conflicts
}

export function expectedVercelRecords(domains) {
  const records = []
  const production = domains.production
  if (production) {
    records.push({ type: 'A',     name: '@',   expected: VERCEL_A_IP  })
    records.push({ type: 'CNAME', name: 'www', expected: VERCEL_CNAME })
  }
  for (const [env, domain] of Object.entries(domains)) {
    if (env === 'production') continue
    const parts = domain.split('.')
    const subdomain = parts.slice(0, -2).join('.')
    if (subdomain) {
      records.push({ type: 'CNAME', name: subdomain, expected: VERCEL_CNAME })
    }
  }
  return records
}

export function formatTable(records) {
  if (records.length === 0) return '  (no records)\n'
  const rows = records.map(r => ({
    Type: r.type,
    Name: r.name,
    Value: r.data ?? r.expected ?? '',
    TTL: String(r.ttl ?? ''),
  }))
  const cols = ['Type', 'Name', 'Value', 'TTL']
  const widths = cols.map(c => Math.max(c.length, ...rows.map(r => r[c].length)))
  const sep    = '| ' + widths.map(w => '-'.repeat(w)).join(' | ') + ' |'
  const header = '| ' + cols.map((c, i) => c.padEnd(widths[i])).join(' | ') + ' |'
  const lines  = [header, sep, ...rows.map(r =>
    '| ' + cols.map((c, i) => r[c].padEnd(widths[i])).join(' | ') + ' |'
  )]
  return lines.join('\n') + '\n'
}

// ── API ───────────────────────────────────────────────────────────────────────

export async function fetchRecords(domain, type, apiKey, apiSecret, baseUrl) {
  const path = type
    ? `/v1/domains/${domain}/records/${type}`
    : `/v1/domains/${domain}/records`
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `sso-key ${apiKey}:${apiSecret}` },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GoDaddy API ${res.status}: ${body}`)
  }
  return res.json()
}

export async function checkAuth(apiKey, apiSecret, baseUrl) {
  const res = await fetch(`${baseUrl}/v1/domains?limit=1`, {
    headers: { Authorization: `sso-key ${apiKey}:${apiSecret}` },
  })
  if (res.status === 401 || res.status === 403) {
    throw new Error(`Authentication failed (${res.status}) — check your API key and secret`)
  }
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GoDaddy API ${res.status}: ${body}`)
  }
  return true
}

// ── CLI ───────────────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const get  = f => { const i = args.indexOf(f); return i !== -1 ? args[i + 1] : null }
  const has  = f => args.includes(f)

  const domainArg = get('--domain')
  const typeArg   = get('--type')
  const envArg    = get('--env') ?? 'prod'
  const dryRun    = has('--dry-run')
  const list      = has('--list')
  const check     = has('--check')

  if (!['ote', 'prod'].includes(envArg)) {
    console.error(`Error: --env must be "ote" or "prod" (got "${envArg}")`)
    process.exit(1)
  }

  if (check) {
    const envsToCheck = envArg === 'prod' && !get('--env') ? ['ote', 'prod'] : [envArg]
    let allOk = true
    for (const env of envsToCheck) {
      process.stdout.write(`Checking ${env.toUpperCase()} credentials ... `)
      const creds = loadCredentials(env, { allowMissing: true })
      if (!creds.apiKey || !creds.apiSecret) {
        console.log('✗  (no credentials found)')
        allOk = false
        continue
      }
      try {
        await checkAuth(creds.apiKey, creds.apiSecret, creds.baseUrl)
        console.log('✓  authenticated')
      } catch (err) {
        console.log(`✗  ${err.message}`)
        allOk = false
      }
    }
    process.exit(allOk ? 0 : 1)
  }

  if (list) {
    console.log('\nDomains in registry:\n')
    for (const [project, cfg] of Object.entries(registry.projects)) {
      const prod = cfg.domains.production ?? Object.values(cfg.domains)[0]
      console.log(`  ${project.padEnd(24)} ${prod}`)
    }
    console.log()
    process.exit(0)
  }

  if (!domainArg) {
    console.error('Error: provide --domain <domain> or --list')
    process.exit(1)
  }

  const project = Object.values(registry.projects)
    .find(p => Object.values(p.domains).some(d => {
      const parts = d.split('.')
      return parts.slice(-2).join('.') === domainArg || d === domainArg
    }))

  const { apiKey, apiSecret, baseUrl } = dryRun
    ? { apiKey: null, apiSecret: null, baseUrl: process.env.GODADDY_API_BASE_URL ?? `https://api.${envArg === 'ote' ? 'ote-' : ''}godaddy.com` }
    : loadCredentials(envArg)

  if (dryRun) {
    console.log(`\n[DRY RUN] Would fetch: GET ${baseUrl}/v1/domains/${domainArg}/records${typeArg ? '/' + typeArg : ''}\n`)
    if (project) {
      const expected = expectedVercelRecords(project.domains)
      console.log('Expected Vercel records:')
      console.log(formatTable(expected.map(r => ({ ...r, data: r.expected, ttl: 3600 }))))
    }
    process.exit(0)
  }

  const envLabel = envArg === 'ote' ? ' [OTE sandbox]' : ' [Production]'
  console.log(`\nDNS Records — ${domainArg}${envLabel}\n`)

  try {
    const records = await fetchRecords(domainArg, typeArg, apiKey, apiSecret, baseUrl)
    console.log(formatTable(records))

    const conflicts = detectConflicts(records)
    if (conflicts.length > 0) {
      console.log('⚠ Conflicts:')
      conflicts.forEach(c => console.log(`  ${c}`))
      console.log()
    } else {
      console.log('Conflicts: none\n')
    }

    if (project) {
      const expected  = expectedVercelRecords(project.domains)
      const existingKeys = new Set(records.map(r => `${r.type}:${r.name}`))
      const missing   = expected.filter(r => !existingKeys.has(`${r.type}:${r.name}`))
      if (missing.length > 0) {
        console.log('Missing Vercel records:')
        missing.forEach(r => console.log(`  ${r.type.padEnd(5)} ${r.name}`))
        console.log(`\n  Run: node scripts/godaddy-dns-set.mjs --domain ${domainArg} --env ${envArg}`)
      } else {
        console.log('All expected Vercel records are present ✓')
      }
    }
    console.log()
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}
