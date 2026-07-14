#!/usr/bin/env node
/**
 * setup-domain.mjs
 *
 * Configures custom domains for Vercel projects across environments.
 * Reads project→domain mappings from scripts/domains.json.
 *
 * Usage:
 *   node scripts/setup-domain.mjs --project ploutos-blue-stone --env preview
 *   node scripts/setup-domain.mjs --project ploutos-blue-stone --all-envs
 *   node scripts/setup-domain.mjs --env preview --all-projects
 *   node scripts/setup-domain.mjs --project ploutos-blue-stone --env preview --dry-run
 *   node scripts/setup-domain.mjs --list
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
  development: 'preview',
  preview: 'preview',
  staging: 'preview',
  production: 'production',
}

// ── Pure helpers (exported for testing) ──────────────────────────────────────

export function dnsInstructions(domain) {
  const parts = domain.split('.')
  // root domain has exactly 2 parts (e.g. example.com)
  const isRoot = parts.length === 2
  const rootDomain = parts.slice(-2).join('.')
  const subdomain = parts.slice(0, -2).join('.')

  const lines = [`\n  GoDaddy DNS for ${rootDomain}:`]

  if (isRoot) {
    lines.push(`  ┌──────────────────────────────────────────────────────┐`)
    lines.push(`  │ Type │ Name │ Value         │ TTL    │`)
    lines.push(`  │ A    │ @    │ 76.76.21.21   │ 1 Hour │`)
    lines.push(`  └──────────────────────────────────────────────────────┘`)
  } else {
    lines.push(`  ┌──────────────────────────────────────────────────────────────┐`)
    lines.push(`  │ Type  │ Name${subdomain.padEnd(10)} │ Value                  │ TTL    │`)
    lines.push(`  │ CNAME │ ${subdomain.padEnd(14)} │ cname.vercel-dns.com   │ 1 Hour │`)
    lines.push(`  └──────────────────────────────────────────────────────────────┘`)
  }

  lines.push(`\n  Verify: dig ${domain}`)
  lines.push(`  SSL:    Vercel provisions automatically after DNS propagates.\n`)
  return lines.join('\n')
}

// ── CLI (only runs when executed directly) ────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
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

  // ── List mode ───────────────────────────────────────────────────────────────

  if (list) {
    console.log('\nRegistered projects and domains:\n')
    for (const [project, config] of Object.entries(registry.projects)) {
      console.log(`  ${project}  (${config.dir})`)
      for (const [env, domain] of Object.entries(config.domains)) {
        console.log(`    ${env.padEnd(12)} https://${domain}`)
      }
    }
    console.log()
    process.exit(0)
  }

  // ── Validation ──────────────────────────────────────────────────────────────

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

  // ── Build work list ─────────────────────────────────────────────────────────

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

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const rootDir = resolve(__dir, '..')

  function run(cmd, cwd) {
    if (dryRun) {
      console.log(`    [dry-run] ${cmd}`)
      return ''
    }
    try {
      return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
    } catch (err) {
      const stdout = err.stdout?.toString().trim() ?? ''
      const stderr = err.stderr?.toString().trim() ?? ''
      const combined = stdout + '\n' + stderr
      // Already exists — not a fatal error
      if (
        combined.includes('already exists') ||
        combined.includes('already added') ||
        combined.includes('already assigned') ||
        combined.includes('already in use')
      ) {
        console.log(`    (already linked — skipping)`)
        return ''
      }
      // Vercel requires a branch for preview env vars when branch-specific ones exist
      if (combined.includes('git_branch_required')) {
        console.log(
          `    ⚠ Vercel requires a branch for preview env — set manually in dashboard if needed`
        )
        return ''
      }
      throw new Error(stderr || stdout || err.message)
    }
  }

  // ── Execute ─────────────────────────────────────────────────────────────────

  if (dryRun) console.log('\n[DRY RUN] No changes will be made.\n')

  const vercelToken = process.env.VERCEL_TOKEN ?? null

  for (const { name, config, env, domain } of work) {
    const projectDir = resolve(rootDir, config.dir)
    const vercelEnv = VERCEL_ENV[env]
    const appUrl = `https://${domain}`
    const gitBranch = config.gitBranches?.[env] ?? null

    console.log(`\n→ ${name} / ${env}  →  ${appUrl}`)

    // 1. Add domain to Vercel project
    console.log(`  1. Adding domain to Vercel project...`)
    run(`vercel domains add ${domain}`, projectDir)

    // 2. Pin domain to its git branch via Vercel API (if configured)
    if (gitBranch) {
      process.stdout.write(`  2. Setting git branch: ${gitBranch} ...`)
      if (dryRun) {
        console.log(
          `\n    [dry-run] PATCH /v9/projects/.../domains/${domain}  gitBranch=${gitBranch}`
        )
      } else if (vercelToken) {
        const { projectId, orgId } = JSON.parse(
          readFileSync(resolve(projectDir, '.vercel/project.json'), 'utf8')
        )
        const payload = JSON.stringify({ gitBranch })
        const result = execSync(
          `curl -s -X PATCH "https://api.vercel.com/v9/projects/${projectId}/domains/${domain}?teamId=${orgId}" ` +
            `-H "Authorization: Bearer ${vercelToken}" ` +
            `-H "Content-Type: application/json" ` +
            `-d '${payload}'`,
          { encoding: 'utf8' }
        )
        const parsed = JSON.parse(result)
        if (parsed.gitBranch === gitBranch) {
          console.log(' ✓')
        } else {
          console.log(` ✗  ${parsed.error?.message ?? result}`)
        }
      } else {
        console.log('\n    ⚠ VERCEL_TOKEN not set — set git branch manually in Vercel dashboard')
      }
    }

    // 3. Set NEXT_PUBLIC_APP_URL for the environment
    const envStep = gitBranch ? 3 : 2
    console.log(`  ${envStep}. Setting NEXT_PUBLIC_APP_URL=${appUrl} [${vercelEnv}]...`)
    const envAddCmd = gitBranch
      ? `vercel env add NEXT_PUBLIC_APP_URL preview ${gitBranch} --value '${appUrl}' --yes`
      : `vercel env add NEXT_PUBLIC_APP_URL ${vercelEnv} --value '${appUrl}' --yes`
    try {
      run(envAddCmd, projectDir)
    } catch (err) {
      if (err.message.includes('already exists') || err.message.includes('already added')) {
        console.log(`    (already set — skipping)`)
      } else {
        throw err
      }
    }

    // 4. Print GoDaddy DNS instructions
    console.log(`  ${envStep + 1}. DNS to add in GoDaddy:`)
    console.log(dnsInstructions(domain))
  }

  console.log(dryRun ? '[DRY RUN complete]\n' : 'Done. Check Vercel dashboard for domain status.\n')
}
