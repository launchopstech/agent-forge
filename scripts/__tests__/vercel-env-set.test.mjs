import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dir = dirname(fileURLToPath(import.meta.url))
const script = resolve(__dir, '../vercel-env-set.mjs')

function run(args) {
  try {
    const stdout = execFileSync(process.execPath, [script, ...args], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    return { code: 0, stdout, stderr: '' }
  } catch (err) {
    return {
      code: err.status ?? 1,
      stdout: err.stdout ?? '',
      stderr: err.stderr ?? '',
    }
  }
}

// ── --list ────────────────────────────────────────────────────────────────────

describe('--list', () => {
  it('prints all projects', () => {
    const { code, stdout } = run(['--list'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('ploutos-blue-stone'))
    assert.ok(stdout.includes('agent-forge-web'))
    assert.ok(stdout.includes('launchops'))
  })

  it('shows NEXT_PUBLIC_APP_URL per env', () => {
    const { code, stdout } = run(['--list'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('NEXT_PUBLIC_APP_URL=https://bluestoneconstruction.llc'))
    assert.ok(stdout.includes('NEXT_PUBLIC_APP_URL=https://dev.bluestoneconstruction.llc'))
  })

  it('shows shared vars', () => {
    const { code, stdout } = run(['--list'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('NEXT_PUBLIC_BRAND=blue-stone-construction'))
  })

  it('shows secrets list', () => {
    const { code, stdout } = run(['--list'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('NEXT_PUBLIC_PHONE'))
    assert.ok(stdout.includes('RESEND_API_KEY'))
  })
})

// ── --dry-run single env ──────────────────────────────────────────────────────

describe('--dry-run single env (production)', () => {
  it('exits 0', () => {
    const { code } = run(['--project', 'ploutos-blue-stone', '--env', 'production', '--dry-run'])
    assert.equal(code, 0)
  })

  it('prints [DRY RUN] header', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--env', 'production', '--dry-run'])
    assert.ok(stdout.includes('[DRY RUN]'))
  })

  it('sets NEXT_PUBLIC_APP_URL to production domain', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--env', 'production', '--dry-run'])
    assert.ok(stdout.includes('vercel env add NEXT_PUBLIC_APP_URL production'))
    assert.ok(stdout.includes('bluestoneconstruction.llc'))
  })

  it('sets NEXT_PUBLIC_APP_ENV to "production" for production env', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--env', 'production', '--dry-run'])
    assert.ok(stdout.includes('vercel env add NEXT_PUBLIC_APP_ENV production'))
    assert.ok(stdout.includes("'production'") && stdout.includes('NEXT_PUBLIC_APP_ENV'))
  })

  it('sets NEXT_PUBLIC_BRAND', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--env', 'production', '--dry-run'])
    assert.ok(stdout.includes('vercel env add NEXT_PUBLIC_BRAND'))
    assert.ok(stdout.includes('blue-stone-construction'))
  })

  it('notes missing secrets without failing', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--env', 'production', '--dry-run'])
    assert.ok(stdout.includes('NEXT_PUBLIC_PHONE'))
    assert.ok(stdout.includes('RESEND_API_KEY'))
  })

  it('prints [DRY RUN complete]', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--env', 'production', '--dry-run'])
    assert.ok(stdout.includes('[DRY RUN complete]'))
  })
})

// ── --dry-run preview env (NEXT_PUBLIC_APP_ENV mapping) ──────────────────────

describe('--dry-run preview env', () => {
  it('maps NEXT_PUBLIC_APP_ENV to "staging" for preview env', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--env', 'preview', '--dry-run'])
    assert.ok(stdout.includes("'staging'") && stdout.includes('NEXT_PUBLIC_APP_ENV'))
  })

  it('uses preview.bluestoneconstruction.llc domain', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--env', 'preview', '--dry-run'])
    assert.ok(stdout.includes('preview.bluestoneconstruction.llc'))
  })

  it('targets Vercel preview tier', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--env', 'preview', '--dry-run'])
    assert.ok(stdout.includes('vercel env add NEXT_PUBLIC_APP_URL preview'))
  })
})

// ── --dry-run development env ─────────────────────────────────────────────────

describe('--dry-run development env', () => {
  it('uses dev.bluestoneconstruction.llc', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--env', 'development', '--dry-run'])
    assert.ok(stdout.includes('dev.bluestoneconstruction.llc'))
  })

  it('targets Vercel development tier', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--env', 'development', '--dry-run'])
    assert.ok(stdout.includes('vercel env add NEXT_PUBLIC_APP_URL development'))
  })

  it('sets NEXT_PUBLIC_APP_ENV to "development"', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--env', 'development', '--dry-run'])
    assert.ok(stdout.includes("'development'") && stdout.includes('NEXT_PUBLIC_APP_ENV'))
  })
})

// ── --all-envs ────────────────────────────────────────────────────────────────

describe('--dry-run --all-envs', () => {
  it('emits a block for each configured env', () => {
    const { code, stdout } = run(['--project', 'ploutos-blue-stone', '--all-envs', '--dry-run'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('/ development'))
    assert.ok(stdout.includes('/ preview'))
    assert.ok(stdout.includes('/ staging'))
    assert.ok(stdout.includes('/ production'))
  })

  it('NEXT_PUBLIC_BRAND appears in every block', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--all-envs', '--dry-run'])
    const matches = stdout.match(/vercel env add NEXT_PUBLIC_BRAND/g) ?? []
    assert.equal(matches.length, 4, 'NEXT_PUBLIC_BRAND should be set once per env (4 envs)')
  })
})

// ── --secret flag ─────────────────────────────────────────────────────────────

describe('--secret flag', () => {
  it('includes secret in dry-run output when provided', () => {
    const { stdout } = run([
      '--project',
      'ploutos-blue-stone',
      '--env',
      'production',
      '--dry-run',
      '--secret',
      'RESEND_API_KEY=re_test123',
    ])
    assert.ok(stdout.includes('vercel env add RESEND_API_KEY'))
  })

  it('includes phone secret when provided', () => {
    const { stdout } = run([
      '--project',
      'ploutos-blue-stone',
      '--env',
      'production',
      '--dry-run',
      '--secret',
      'NEXT_PUBLIC_PHONE=+15550001234',
    ])
    assert.ok(stdout.includes('vercel env add NEXT_PUBLIC_PHONE'))
  })

  it('still runs when secrets are omitted (just skips them)', () => {
    const { code, stdout } = run([
      '--project',
      'ploutos-blue-stone',
      '--env',
      'production',
      '--dry-run',
    ])
    assert.equal(code, 0)
    assert.ok(stdout.includes('Skipping RESEND_API_KEY'))
    assert.ok(stdout.includes('Skipping NEXT_PUBLIC_PHONE'))
  })
})

// ── validation errors ─────────────────────────────────────────────────────────

describe('validation errors', () => {
  it('exits 1 when --project is missing', () => {
    const { code, stderr } = run(['--env', 'production'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('Error'))
  })

  it('exits 1 when --env is missing', () => {
    const { code, stderr } = run(['--project', 'ploutos-blue-stone'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('Error'))
  })

  it('exits 1 for unknown project', () => {
    const { code, stderr } = run(['--project', 'does-not-exist', '--env', 'production'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('unknown project'))
  })

  it('exits 1 for unknown env', () => {
    const { code, stderr } = run(['--project', 'ploutos-blue-stone', '--env', 'bogus'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('unknown env'))
  })
})

// ── project with no secrets ───────────────────────────────────────────────────

describe('project with no secrets (agent-forge-web)', () => {
  it('runs cleanly without --secret flags', () => {
    const { code } = run(['--project', 'agent-forge-web', '--env', 'production', '--dry-run'])
    assert.equal(code, 0)
  })

  it('sets NEXT_PUBLIC_BRAND=default', () => {
    const { stdout } = run(['--project', 'agent-forge-web', '--env', 'production', '--dry-run'])
    assert.ok(stdout.includes('default'))
  })
})
