#!/usr/bin/env node
/**
 * vercel-project-create.mjs
 *
 * Creates (or re-links) a Vercel project for a registered project.
 * Reads the project directory from scripts/domains.json, then runs:
 *   vercel link --project <alias> --cwd <dir> --yes
 *
 * Vercel CLI creates the project if it doesn't exist yet, or links to an existing one.
 * The result is a .vercel/project.json inside the app directory, which is required by
 * setup-domain.mjs and vercel-env-set.mjs.
 *
 * Usage:
 *   node scripts/vercel-project-create.mjs --project ploutos-blue-stone
 *   node scripts/vercel-project-create.mjs --project ploutos-blue-stone --dry-run
 *   node scripts/vercel-project-create.mjs --list
 *
 * Prerequisites: Vercel CLI installed and authenticated (vercel login)
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const __dir = dirname(fileURLToPath(import.meta.url))

// ── Pure helpers (exported for testing) ──────────────────────────────────────

/** Returns true if the app directory is already linked to a Vercel project. */
export function isLinked(dir) {
  return existsSync(resolve(dir, '.vercel', 'project.json'))
}

// ── CLI ───────────────────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // DOMAINS_FILE lets tests inject a temp registry with unlinked test projects
  const registryPath = process.env.DOMAINS_FILE ?? resolve(__dir, 'domains.json')
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'))

  // VERCEL_BIN lets tests inject a mock binary
  const VERCEL_BIN = process.env.VERCEL_BIN ?? 'vercel'

  const args = process.argv.slice(2)
  const get = (f) => {
    const i = args.indexOf(f)
    return i !== -1 ? args[i + 1] : null
  }
  const has = (f) => args.includes(f)

  const projectArg = get('--project')
  const dryRun = has('--dry-run')
  const list = has('--list')

  if (list) {
    console.log('\nVercel project link status:\n')
    for (const [name, cfg] of Object.entries(registry.projects)) {
      const absDir = resolve(__dir, '..', cfg.dir)
      const linked = isLinked(absDir)
      console.log(`  ${linked ? '✓' : '✗'} ${name.padEnd(28)} ${cfg.dir}`)
    }
    console.log()
    process.exit(0)
  }

  if (!projectArg) {
    console.error('Error: --project <name> is required')
    console.error('  Run --list to see registered projects.')
    process.exit(1)
  }

  const cfg = registry.projects[projectArg]
  if (!cfg) {
    console.error(`Error: unknown project "${projectArg}". Run --list to see registered projects.`)
    process.exit(1)
  }

  const absDir = resolve(__dir, '..', cfg.dir)

  if (!dryRun && isLinked(absDir)) {
    console.log(
      `✓ "${projectArg}" is already linked (${absDir}/.vercel/project.json exists). Skipping.`
    )
    console.log(`\nAlready ready for:`)
    console.log(`  node scripts/setup-domain.mjs --project ${projectArg} --all-envs`)
    console.log(`  node scripts/vercel-env-set.mjs --project ${projectArg} --all-envs`)
    process.exit(0)
  }

  const cmd = [VERCEL_BIN, 'link', '--project', projectArg, '--cwd', absDir, '--yes']

  if (dryRun) {
    console.log(`\n[DRY RUN] Would run:\n  ${cmd.join(' ')}\n`)
    process.exit(0)
  }

  const repoRoot = resolve(__dir, '..')

  try {
    const out = execFileSync(cmd[0], cmd.slice(1), {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    if (out.trim()) console.log(out.trim())
    console.log(`✓ "${projectArg}" linked successfully.`)
  } catch (err) {
    const msg = (err.stderr || err.message || '').trim()
    if (msg.includes('not logged in') || msg.includes('login')) {
      console.error('Error: Vercel CLI not authenticated. Run: vercel login')
    } else if (err.code === 'ENOENT') {
      console.error(`Error: Vercel CLI not found ("${VERCEL_BIN}"). Install with: npm i -g vercel`)
    } else {
      console.error(`Error: vercel link failed:\n${msg}`)
    }
    process.exit(1)
  }

  // Set rootDirectory and framework on the Vercel project.
  // vercel link --yes does not set these server-side; without them Vercel
  // builds from the repo root and uses the wrong framework preset.
  const projectJson = JSON.parse(readFileSync(resolve(absDir, '.vercel', 'project.json'), 'utf8'))
  const projectId = projectJson.projectId
  const rootDirectory = relative(repoRoot, absDir)

  try {
    execFileSync(
      VERCEL_BIN,
      [
        'api',
        `/v9/projects/${projectId}`,
        '-X',
        'PATCH',
        '-F',
        `rootDirectory=${rootDirectory}`,
        '-F',
        'framework=nextjs',
      ],
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    )
    console.log(`✓ Vercel project rootDirectory set to "${rootDirectory}" (framework: nextjs).`)
  } catch (err) {
    const msg = (err.stderr || err.message || '').trim()
    console.error(`⚠ Could not set rootDirectory via Vercel API: ${msg}`)
    console.error(
      `  Fix manually: Vercel dashboard → ${projectArg} → Settings → General → Root Directory → "${rootDirectory}"`
    )
  }

  console.log(`\nNext steps:`)
  console.log(`  node scripts/godaddy-dns-set.mjs  --project ${projectArg}`)
  console.log(`  node scripts/setup-domain.mjs     --project ${projectArg} --all-envs`)
  console.log(`  node scripts/vercel-env-set.mjs   --project ${projectArg} --all-envs`)
}
