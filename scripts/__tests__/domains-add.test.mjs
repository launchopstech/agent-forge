import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, readFileSync, rmSync, mkdtempSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

import { buildProjectEntry } from '../domains-add.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const script = resolve(__dir, '../domains-add.mjs')
const realRegistry = resolve(__dir, '../domains.json')

// ── Temp registry helpers ─────────────────────────────────────────────────────

let tmpDir
let tmpRegistry

before(() => {
  tmpDir = mkdtempSync(resolve(tmpdir(), 'domains-add-test-'))
  tmpRegistry = resolve(tmpDir, 'domains.json')
  // Start with a copy of the real registry
  writeFileSync(tmpRegistry, readFileSync(realRegistry, 'utf8'))
})

after(() => {
  rmSync(tmpDir, { recursive: true, force: true })
})

function freshRegistry() {
  // Reset to real registry before each write test
  writeFileSync(tmpRegistry, readFileSync(realRegistry, 'utf8'))
}

function run(args, env = {}) {
  try {
    const stdout = execFileSync(process.execPath, [script, ...args], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, DOMAINS_FILE: tmpRegistry, ...env },
    })
    return { code: 0, stdout, stderr: '' }
  } catch (err) {
    return { code: err.status ?? 1, stdout: err.stdout ?? '', stderr: err.stderr ?? '' }
  }
}

// ── Pure unit tests ───────────────────────────────────────────────────────────

describe('buildProjectEntry()', () => {
  it('returns correct 4-env domain structure', () => {
    const entry = buildProjectEntry('acme', 'apps/acme', 'acme.com', 'acme')
    assert.equal(entry.domains.production,  'acme.com')
    assert.equal(entry.domains.development, 'dev.acme.com')
    assert.equal(entry.domains.preview,     'preview.acme.com')
    assert.equal(entry.domains.staging,     'staging.acme.com')
  })

  it('sets NEXT_PUBLIC_BRAND from brand arg', () => {
    const entry = buildProjectEntry('acme', 'apps/acme', 'acme.com', 'acme-brand')
    assert.equal(entry.envVars['NEXT_PUBLIC_BRAND'], 'acme-brand')
  })

  it('sets correct per-env NEXT_PUBLIC_APP_ENV mapping', () => {
    const entry = buildProjectEntry('acme', 'apps/acme', 'acme.com', 'acme')
    const envMap = entry.envVars['NEXT_PUBLIC_APP_ENV']
    assert.equal(envMap.development, 'development')
    assert.equal(envMap.preview,     'staging')
    assert.equal(envMap.staging,     'staging')
    assert.equal(envMap.production,  'production')
  })

  it('includes default secrets list', () => {
    const entry = buildProjectEntry('acme', 'apps/acme', 'acme.com', 'acme')
    assert.ok(entry.secrets.includes('NEXT_PUBLIC_PHONE'))
    assert.ok(entry.secrets.includes('RESEND_API_KEY'))
  })

  it('stores the dir as given', () => {
    const entry = buildProjectEntry('acme', 'apps/ploutos/clients/acme', 'acme.com', 'acme')
    assert.equal(entry.dir, 'apps/ploutos/clients/acme')
  })

  it('works with non-.com TLDs (.llc, .io)', () => {
    const entry = buildProjectEntry('bs', 'apps/bs', 'bluestoneconstruction.llc', 'blue-stone')
    assert.equal(entry.domains.production,  'bluestoneconstruction.llc')
    assert.equal(entry.domains.development, 'dev.bluestoneconstruction.llc')
  })
})

// ── CLI: --list ───────────────────────────────────────────────────────────────

describe('--list', () => {
  it('exits 0 and shows registered projects', () => {
    const { code, stdout } = run(['--list'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('ploutos-blue-stone'))
    assert.ok(stdout.includes('bluestoneconstruction.llc'))
  })

  it('shows all three projects', () => {
    const { stdout } = run(['--list'])
    assert.ok(stdout.includes('agent-forge-web'))
    assert.ok(stdout.includes('launchops'))
  })
})

// ── CLI: --dry-run ────────────────────────────────────────────────────────────

describe('--dry-run', () => {
  it('exits 0 and prints [DRY RUN]', () => {
    const { code, stdout } = run(['--dry-run', '--alias', 'test-co', '--dir', 'apps/test', '--domain', 'test.com', '--brand', 'test'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('[DRY RUN]'))
  })

  it('prints the entry JSON without writing to file', () => {
    freshRegistry()
    const { stdout } = run(['--dry-run', '--alias', 'test-co', '--dir', 'apps/test', '--domain', 'test.com', '--brand', 'test'])
    assert.ok(stdout.includes('test-co'))
    assert.ok(stdout.includes('dev.test.com'))
    // File should be unchanged
    const after = JSON.parse(readFileSync(tmpRegistry, 'utf8'))
    assert.ok(!after.projects['test-co'])
  })
})

// ── CLI: successful write ─────────────────────────────────────────────────────

describe('adding a new project', () => {
  it('exits 0 and writes to domains.json', () => {
    freshRegistry()
    const { code } = run(['--alias', 'new-client', '--dir', 'apps/new', '--domain', 'newclient.com', '--brand', 'new'])
    assert.equal(code, 0)
    const updated = JSON.parse(readFileSync(tmpRegistry, 'utf8'))
    assert.ok(updated.projects['new-client'])
  })

  it('written entry has correct domain structure', () => {
    freshRegistry()
    run(['--alias', 'acme-co', '--dir', 'apps/acme', '--domain', 'acme.io', '--brand', 'acme'])
    const updated = JSON.parse(readFileSync(tmpRegistry, 'utf8'))
    const entry = updated.projects['acme-co']
    assert.equal(entry.domains.production,  'acme.io')
    assert.equal(entry.domains.development, 'dev.acme.io')
    assert.equal(entry.domains.staging,     'staging.acme.io')
  })

  it('default brand is alias when --brand omitted', () => {
    freshRegistry()
    run(['--alias', 'no-brand', '--dir', 'apps/nb', '--domain', 'nobrand.com'])
    const updated = JSON.parse(readFileSync(tmpRegistry, 'utf8'))
    assert.equal(updated.projects['no-brand'].envVars['NEXT_PUBLIC_BRAND'], 'no-brand')
  })

  it('does not modify existing projects', () => {
    freshRegistry()
    run(['--alias', 'extra-co', '--dir', 'apps/extra', '--domain', 'extra.com', '--brand', 'extra'])
    const updated = JSON.parse(readFileSync(tmpRegistry, 'utf8'))
    assert.ok(updated.projects['ploutos-blue-stone'])
    assert.equal(updated.projects['ploutos-blue-stone'].domains.production, 'bluestoneconstruction.llc')
  })
})

// ── CLI: validation errors ────────────────────────────────────────────────────

describe('validation errors', () => {
  it('exits 1 when --alias is missing', () => {
    const { code, stderr } = run(['--dir', 'apps/x', '--domain', 'x.com'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('--alias'))
  })

  it('exits 1 when --dir is missing', () => {
    const { code, stderr } = run(['--alias', 'x', '--domain', 'x.com'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('--dir'))
  })

  it('exits 1 when --domain is missing', () => {
    const { code, stderr } = run(['--alias', 'x', '--dir', 'apps/x'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('--domain'))
  })

  it('exits 1 when --domain includes https://', () => {
    const { code, stderr } = run(['--alias', 'x', '--dir', 'apps/x', '--domain', 'https://x.com'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('bare domain'))
  })

  it('exits 1 when --domain starts with a dot', () => {
    const { code, stderr } = run(['--alias', 'x', '--dir', 'apps/x', '--domain', '.x.com'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('dot'))
  })

  it('exits 1 when alias already exists (idempotency guard)', () => {
    const { code, stderr } = run(['--alias', 'ploutos-blue-stone', '--dir', 'apps/x', '--domain', 'x.com'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('already exists'))
  })
})
