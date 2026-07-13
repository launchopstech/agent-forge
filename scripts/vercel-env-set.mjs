#!/usr/bin/env node
/**
 * vercel-env-set.mjs
 *
 * Sets Vercel environment variables for projects across environments.
 * Reads project config from scripts/domains.json (envVars + secrets + domains).
 *
 * Usage:
 *   node scripts/vercel-env-set.mjs --project ploutos-blue-stone --env production
 *   node scripts/vercel-env-set.mjs --project ploutos-blue-stone --all-envs
 *   node scripts/vercel-env-set.mjs --env production --all-projects
 *   node scripts/vercel-env-set.mjs --project ploutos-blue-stone --all-envs --dry-run
 *   node scripts/vercel-env-set.mjs --list
 *   node scripts/vercel-env-set.mjs --project ploutos-blue-stone --all-envs \
 *     --secret NEXT_PUBLIC_PHONE="+1 555 000 0000" \
 *     --secret RESEND_API_KEY=re_abc123
 *
 * Prerequisites: Vercel CLI installed and authenticated (`vercel whoami`)
 */

import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dir = dirname(fileURLToPath(import.meta.url))
const registryPath = resolve(__dir, 'domains.json')
const registry = JSON.parse(readFileSync(registryPath, 'utf8'))

// Map script env names → Vercel environment tiers
const VERCEL_ENV = {
  development: 'development',
  preview: 'preview',
  qa: 'preview',
  staging: 'preview',
  production: 'production',
}

// ── Arg parsing ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const get = (flag) => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : null
}
const has = (flag) => args.includes(flag)

const projectArg = get('--project')
const envArg = get('--env')
const allEnvs = has('--all-envs')
const allProjects = has('--all-projects')
const dryRun = has('--dry-run')
const list = has('--list')
const secrets = parseSecrets(args)

function parseSecrets(argv) {
  const result = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--secret' && argv[i + 1]) {
      const eq = argv[i + 1].indexOf('=')
      if (eq !== -1) {
        const key = argv[i + 1].slice(0, eq)
        const val = argv[i + 1].slice(eq + 1)
        result[key] = val
      }
      i++
    }
  }
  return result
}

// ── List mode ─────────────────────────────────────────────────────────────────

if (list) {
  console.log('\nRegistered projects and env vars:\n')
  for (const [project, config] of Object.entries(registry.projects)) {
    console.log(`  ${project}  (${config.dir})`)
    for (const [env, domain] of Object.entries(config.domains)) {
      console.log(`    ${env.padEnd(12)} NEXT_PUBLIC_APP_URL=https://${domain}`)
    }
    const ev = config.envVars ?? {}
    for (const [key, val] of Object.entries(ev)) {
      if (typeof val === 'string') {
        console.log(`    ${'(all)'.padEnd(12)} ${key}=${val}`)
      }
    }
    if (config.secrets?.length) {
      console.log(`    ${'(secrets)'.padEnd(12)} ${config.secrets.join(', ')}`)
    }
  }
  console.log()
  process.exit(0)
}

// ── Validation ────────────────────────────────────────────────────────────────

if (!projectArg && !allProjects) {
  console.error('Error: provide --project <name> or --all-projects')
  process.exit(1)
}
if (!envArg && !allEnvs && !allProjects) {
  console.error('Error: provide --env <env> or --all-envs')
  process.exit(1)
}
if (projectArg && !registry.projects[projectArg]) {
  console.error(`Error: unknown project "${projectArg}". Run --list to see options.`)
  process.exit(1)
}
if (envArg && !VERCEL_ENV[envArg]) {
  console.error(
    `Error: unknown env "${envArg}". Valid values: ${Object.keys(VERCEL_ENV).join(', ')}`
  )
  process.exit(1)
}

// ── Build work list ───────────────────────────────────────────────────────────

const projectNames = allProjects ? Object.keys(registry.projects) : [projectArg]

const work = []
for (const name of projectNames) {
  const config = registry.projects[name]
  const envs = allEnvs || allProjects ? Object.keys(config.domains) : [envArg]

  for (const env of envs) {
    const domain = config.domains[env]
    if (!domain) {
      console.warn(`  Warning: no domain configured for ${name}/${env}, skipping`)
      continue
    }
    work.push({ name, config, env, domain })
  }
}

if (work.length === 0) {
  console.log('Nothing to do.')
  process.exit(0)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const rootDir = resolve(__dir, '..')

function run(cmd, cwd) {
  if (dryRun) {
    console.log(`    [dry-run] ${cmd}`)
    return ''
  }
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
  } catch (err) {
    const msg = err.stderr?.toString().trim() || err.message
    if (msg.includes('already exists') || msg.includes('already added')) {
      console.log(`    (already set — skipping)`)
      return ''
    }
    throw new Error(msg)
  }
}

function setVar(key, value, vercelEnvTier, projectDir) {
  const escaped = value.replace(/'/g, "'\\''")
  run(`vercel env add ${key} ${vercelEnvTier} --value '${escaped}' --yes`, projectDir)
}

// ── Execute ───────────────────────────────────────────────────────────────────

if (dryRun) console.log('\n[DRY RUN] No changes will be made.\n')

for (const { name, config, env, domain } of work) {
  const projectDir = resolve(rootDir, config.dir)
  const vercelEnv = VERCEL_ENV[env]
  const appUrl = `https://${domain}`
  const ev = config.envVars ?? {}

  console.log(`\n→ ${name} / ${env}  →  ${appUrl}`)

  // 1. NEXT_PUBLIC_APP_URL — always derived from domain
  console.log(`  Setting NEXT_PUBLIC_APP_URL...`)
  setVar('NEXT_PUBLIC_APP_URL', appUrl, vercelEnv, projectDir)

  // 2. NEXT_PUBLIC_APP_ENV — per-env value
  const appEnvMap = ev.NEXT_PUBLIC_APP_ENV
  if (appEnvMap && typeof appEnvMap === 'object') {
    const appEnvVal = appEnvMap[env]
    if (appEnvVal) {
      console.log(`  Setting NEXT_PUBLIC_APP_ENV=${appEnvVal}...`)
      setVar('NEXT_PUBLIC_APP_ENV', appEnvVal, vercelEnv, projectDir)
    }
  }

  // 3. Shared string envVars (skip NEXT_PUBLIC_APP_ENV, handled above)
  for (const [key, val] of Object.entries(ev)) {
    if (key === 'NEXT_PUBLIC_APP_ENV') continue
    if (typeof val !== 'string') continue
    console.log(`  Setting ${key}=${val}...`)
    setVar(key, val, vercelEnv, projectDir)
  }

  // 4. Secrets from --secret flags
  for (const secretKey of config.secrets ?? []) {
    const secretVal = secrets[secretKey]
    if (secretVal !== undefined) {
      console.log(`  Setting ${secretKey}=[secret]...`)
      setVar(secretKey, secretVal, vercelEnv, projectDir)
    } else {
      console.log(`  Skipping ${secretKey} — pass --secret ${secretKey}=<value> to set`)
    }
  }
}

console.log(dryRun ? '\n[DRY RUN complete]\n' : '\nDone. Redeploy to pick up new env vars.\n')
