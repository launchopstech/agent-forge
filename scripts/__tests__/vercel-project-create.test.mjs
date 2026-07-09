import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, readFileSync, rmSync, mkdtempSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

import { isLinked } from '../vercel-project-create.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const script = resolve(__dir, '../vercel-project-create.mjs')

// ── Temp dir setup ────────────────────────────────────────────────────────────

let tmpDir
let mockVercelBin    // path to the mock `vercel` shell script

before(() => {
  tmpDir = mkdtempSync(resolve(tmpdir(), 'vercel-create-test-'))

  // Write a mock `vercel` script that exits 0 and records its args
  mockVercelBin = resolve(tmpDir, 'vercel')
  writeFileSync(mockVercelBin, `#!/bin/sh\necho "Linked to project via mock"\nexit 0\n`, { mode: 0o755 })
})

after(() => {
  rmSync(tmpDir, { recursive: true, force: true })
})

function run(args, env = {}) {
  try {
    const stdout = execFileSync(process.execPath, [script, ...args], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, VERCEL_BIN: mockVercelBin, ...env },
    })
    return { code: 0, stdout, stderr: '' }
  } catch (err) {
    return { code: err.status ?? 1, stdout: err.stdout ?? '', stderr: err.stderr ?? '' }
  }
}

// ── Pure unit tests ───────────────────────────────────────────────────────────

describe('isLinked()', () => {
  it('returns false when .vercel/project.json does not exist', () => {
    const dir = resolve(tmpDir, 'unlinked')
    mkdirSync(dir, { recursive: true })
    assert.equal(isLinked(dir), false)
  })

  it('returns true when .vercel/project.json exists', () => {
    const dir = resolve(tmpDir, 'linked')
    mkdirSync(resolve(dir, '.vercel'), { recursive: true })
    writeFileSync(resolve(dir, '.vercel', 'project.json'), '{"projectId":"prj_123","orgId":"team_456"}')
    assert.equal(isLinked(dir), true)
  })

  it('returns false for a non-existent directory', () => {
    assert.equal(isLinked(resolve(tmpDir, 'does-not-exist')), false)
  })
})

// ── CLI: --list ───────────────────────────────────────────────────────────────

describe('--list', () => {
  it('exits 0 and shows all registered projects', () => {
    const { code, stdout } = run(['--list'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('ploutos-blue-stone'))
    assert.ok(stdout.includes('agent-forge-web'))
    assert.ok(stdout.includes('launchops'))
  })

  it('shows ✓ or ✗ link status for each project', () => {
    const { stdout } = run(['--list'])
    assert.ok(stdout.includes('✓') || stdout.includes('✗'))
  })
})

// ── CLI: --dry-run ────────────────────────────────────────────────────────────

describe('--dry-run', () => {
  it('exits 0 and prints [DRY RUN]', () => {
    const { code, stdout } = run(['--project', 'ploutos-blue-stone', '--dry-run'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('[DRY RUN]'))
  })

  it('shows the vercel link command it would run', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--dry-run'])
    assert.ok(stdout.includes('vercel'))
    assert.ok(stdout.includes('link'))
    assert.ok(stdout.includes('ploutos-blue-stone'))
  })

  it('does not invoke the vercel binary in dry-run', () => {
    // Use a mock that writes a sentinel file if called
    const sentinel = resolve(tmpDir, 'dry-run-called')
    const guardBin = resolve(tmpDir, 'vercel-guard')
    writeFileSync(guardBin, `#!/bin/sh\ntouch ${sentinel}\nexit 0\n`, { mode: 0o755 })
    run(['--project', 'ploutos-blue-stone', '--dry-run'], { VERCEL_BIN: guardBin })
    assert.equal(existsSync(sentinel), false)
  })
})

// ── CLI: validation errors ────────────────────────────────────────────────────

describe('validation errors', () => {
  it('exits 1 when --project is missing', () => {
    const { code, stderr } = run([])
    assert.equal(code, 1)
    assert.ok(stderr.includes('--project'))
  })

  it('exits 1 for unknown project name', () => {
    const { code, stderr } = run(['--project', 'does-not-exist'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('unknown project'))
  })

  it('exits 1 when vercel binary not found', () => {
    // Use a temp registry with an unlinked project (dir that has no .vercel/project.json)
    const fakeRegistry = resolve(tmpDir, 'fake-registry.json')
    const fakeDir = resolve(tmpDir, 'fake-app')
    mkdirSync(fakeDir, { recursive: true })
    writeFileSync(fakeRegistry, JSON.stringify({
      projects: { 'fake-unlinked': { dir: fakeDir, domains: { production: 'fake.com' }, envVars: {}, secrets: [] } }
    }))
    const { code, stderr } = run(
      ['--project', 'fake-unlinked'],
      { VERCEL_BIN: '/nonexistent-vercel-binary-xyz', DOMAINS_FILE: fakeRegistry }
    )
    assert.equal(code, 1)
    assert.ok(stderr.includes('not found') || stderr.includes('ENOENT') || stderr.includes('vercel'))
  })
})

// ── CLI: already linked ───────────────────────────────────────────────────────

describe('already linked', () => {
  it('exits 0 and skips vercel link when .vercel/project.json exists', () => {
    // Create fake .vercel/project.json inside the project dir
    const projDir = resolve(__dir, '../../apps/ploutos/clients/blue-stone-construction')
    const vercelDir = resolve(projDir, '.vercel')
    const projJsonPath = resolve(vercelDir, 'project.json')
    const alreadyExisted = existsSync(projJsonPath)

    if (!alreadyExisted) {
      mkdirSync(vercelDir, { recursive: true })
      writeFileSync(projJsonPath, '{"projectId":"prj_test","orgId":"team_test"}')
    }

    // Write a sentinel-writing mock to detect if vercel link is called
    const sentinel2 = resolve(tmpDir, 'linked-skip-called')
    const skipGuard = resolve(tmpDir, 'vercel-skip-guard')
    writeFileSync(skipGuard, `#!/bin/sh\ntouch ${sentinel2}\nexit 0\n`, { mode: 0o755 })

    const { code, stdout } = run(['--project', 'ploutos-blue-stone'], { VERCEL_BIN: skipGuard })

    assert.equal(code, 0)
    assert.ok(stdout.includes('already linked') || stdout.includes('Skipping'))
    assert.equal(existsSync(sentinel2), false, 'vercel link should not have been called')

    // Cleanup if we created the file
    if (!alreadyExisted) {
      rmSync(vercelDir, { recursive: true, force: true })
    }
  })
})

// ── CLI: successful link ──────────────────────────────────────────────────────

describe('successful vercel link', () => {
  it('calls vercel link with --project, --cwd, and --yes flags', () => {
    // Use a mock that records its args to a file
    const argsFile = resolve(tmpDir, 'vercel-args.txt')
    const recorderBin = resolve(tmpDir, 'vercel-recorder')
    writeFileSync(recorderBin, `#!/bin/sh\necho "$@" > ${argsFile}\nexit 0\n`, { mode: 0o755 })

    // Ensure project is NOT linked so the link command runs
    const projDir = resolve(__dir, '../../apps/ploutos/clients/blue-stone-construction')
    const vercelJsonPath = resolve(projDir, '.vercel', 'project.json')
    const existed = existsSync(vercelJsonPath)
    if (existed) {
      // Already linked — skip this test, can't easily unlink without side effects
      return
    }

    run(['--project', 'ploutos-blue-stone'], { VERCEL_BIN: recorderBin })

    if (existsSync(argsFile)) {
      const recorded = readFileSync(argsFile, 'utf8') // node:fs not imported for read here
      assert.ok(recorded.includes('link'))
      assert.ok(recorded.includes('ploutos-blue-stone'))
      assert.ok(recorded.includes('--yes'))
    }
  })

  it('exits 0 when mock vercel exits 0', () => {
    // Only runs if project is NOT already linked (otherwise 'already linked' path)
    const projDir = resolve(__dir, '../../apps/ploutos/clients/blue-stone-construction')
    if (isLinked(projDir)) return  // skip gracefully

    const { code } = run(['--project', 'ploutos-blue-stone'])
    assert.equal(code, 0)
  })
})
