#!/usr/bin/env node
/**
 * vercel-deploy-hooks.mjs
 *
 * Creates Vercel deploy hooks and adds them as GitHub secrets for a registered project.
 * Reads config from scripts/domains.json (gitBranches map → environments).
 *
 * Usage:
 *   node scripts/vercel-deploy-hooks.mjs --project ploutos-agency
 *   node scripts/vercel-deploy-hooks.mjs --project ploutos-agency --dry-run
 *   node scripts/vercel-deploy-hooks.mjs --list
 *
 * Prerequisites:
 *   - Vercel CLI authenticated (vercel whoami)
 *   - GitHub CLI authenticated (gh auth status)
 *   - Project already linked (.vercel/project.json exists) — run vercel-project-create.mjs first
 *   - Project connected to GitHub repo — run: vercel git connect --project <name> --yes
 */

import { execFileSync, execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dir = dirname(fileURLToPath(import.meta.url))
const registryPath = process.env.DOMAINS_FILE ?? resolve(__dir, 'domains.json')
const registry = JSON.parse(readFileSync(registryPath, 'utf8'))

const GITHUB_REPO = 'launchopstech/agent-forge'
const VERCEL_SCOPE = 'launch-ops'

// GitHub environment names for each logical env
const GITHUB_ENV = {
  development: 'development',
  qa: 'qa',
  staging: 'staging',
  production: 'Production',
}

// ── Pure helpers (exported for testing) ──────────────────────────────────────

/** Secret name for a project (e.g. ploutos-agency → VERCEL_DEPLOY_HOOK_PLOUTOS_AGENCY) */
export function secretName(projectName) {
  return `VERCEL_DEPLOY_HOOK_${projectName.toUpperCase().replace(/-/g, '_')}`
}

/** Parse hook URL from vercel deploy-hooks create JSON output */
export function parseHookUrl(stdout) {
  try {
    const json = JSON.parse(stdout)
    return json?.hook?.url ?? null
  } catch {
    return null
  }
}

// ── CLI ───────────────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const VERCEL_BIN = process.env.VERCEL_BIN ?? 'vercel'
  const GH_BIN = process.env.GH_BIN ?? 'gh'

  const args = process.argv.slice(2)
  const get = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i + 1] : null }
  const has = (f) => args.includes(f)

  const projectArg = get('--project')
  const dryRun = has('--dry-run')
  const list = has('--list')

  if (list) {
    console.log('\nRegistered projects and their gitBranches:\n')
    for (const [name, cfg] of Object.entries(registry.projects)) {
      const branches = cfg.gitBranches ?? {}
      if (Object.keys(branches).length === 0) {
        console.log(`  ${name.padEnd(30)} (no gitBranches configured)`)
      } else {
        console.log(`  ${name}`)
        for (const [env, branch] of Object.entries(branches)) {
          console.log(`    ${env.padEnd(14)} branch: ${branch}`)
        }
      }
    }
    console.log()
    process.exit(0)
  }

  if (!projectArg) {
    console.error('Error: --project <name> is required (or use --list)')
    process.exit(1)
  }

  const cfg = registry.projects[projectArg]
  if (!cfg) {
    console.error(`Error: unknown project "${projectArg}". Run --list to see options.`)
    process.exit(1)
  }

  const gitBranches = cfg.gitBranches
  if (!gitBranches || Object.keys(gitBranches).length === 0) {
    console.error(`Error: no gitBranches configured for "${projectArg}" in domains.json`)
    console.error('  Add a "gitBranches" map: { "development": "develop", "qa": "qa", ... }')
    process.exit(1)
  }

  // Also handle production branch (always main)
  const allEnvs = { ...gitBranches, production: 'main' }
  const secret = secretName(projectArg)

  console.log(`\nProject: ${projectArg}`)
  console.log(`Secret:  ${secret}`)
  console.log(`Repo:    ${GITHUB_REPO}`)
  console.log()

  const rootDir = resolve(__dir, '..')

  function run(bin, cmdArgs, opts = {}) {
    if (dryRun) {
      console.log(`  [dry-run] ${bin} ${cmdArgs.join(' ')}`)
      return '{"hook":{"url":"https://api.vercel.com/v1/integrations/deploy/prj_DRY/DRY_RUN"}}'
    }
    try {
      return execFileSync(bin, cmdArgs, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: rootDir,
        ...opts,
      }).trim()
    } catch (err) {
      const msg = (err.stderr || err.message || '').trim()
      throw new Error(msg)
    }
  }

  if (dryRun) console.log('[DRY RUN] No changes will be made.\n')

  let allOk = true
  for (const [env, branch] of Object.entries(allEnvs)) {
    const hookName = `${projectArg}-${env}`
    const githubEnv = GITHUB_ENV[env] ?? env

    console.log(`→ ${env}  (branch: ${branch}, GitHub env: ${githubEnv})`)

    // 1. Create the deploy hook
    let hookUrl
    try {
      const stdout = run(VERCEL_BIN, [
        'deploy-hooks', 'create', hookName,
        '--ref', branch,
        '--scope', VERCEL_SCOPE,
        '--project', projectArg,
      ])
      hookUrl = parseHookUrl(stdout)
      if (!hookUrl) throw new Error(`Could not parse hook URL from output:\n${stdout}`)
      console.log(`  ✓ Hook created: ${hookUrl}`)
    } catch (err) {
      const msg = err.message ?? ''
      if (msg.includes('already exists')) {
        console.log(`  ⚠ Hook "${hookName}" already exists — skipping creation`)
        console.log(`  ⚠ Set ${secret} in GitHub env "${githubEnv}" manually if missing`)
        allOk = false
        continue
      }
      console.error(`  ✗ Failed to create hook: ${msg}`)
      allOk = false
      continue
    }

    // 2. Set GitHub secret
    try {
      run(GH_BIN, [
        'secret', 'set', secret,
        '--body', hookUrl,
        '--env', githubEnv,
        '--repo', GITHUB_REPO,
      ])
      console.log(`  ✓ GitHub secret ${secret} set in env "${githubEnv}"`)
    } catch (err) {
      console.error(`  ✗ Failed to set GitHub secret: ${err.message}`)
      allOk = false
    }
  }

  console.log()
  if (allOk) {
    console.log('✓ All deploy hooks created and GitHub secrets set.')
    console.log('\nNext step: commit .vercel/project.json, then push to develop.')
  } else {
    console.log('⚠ Some steps failed — review output above.')
  }
  console.log()
}
