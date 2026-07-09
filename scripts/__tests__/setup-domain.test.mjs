import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dir = dirname(fileURLToPath(import.meta.url))
const script = resolve(__dir, '../setup-domain.mjs')

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

// ── dnsInstructions unit tests ────────────────────────────────────────────────

// Import the exported helper directly
const { dnsInstructions } = await import(script)

describe('dnsInstructions()', () => {
  it('root domain uses A record', () => {
    const out = dnsInstructions('bluestoneconstruction.llc')
    assert.ok(out.includes('A'), 'should mention A record')
    assert.ok(out.includes('76.76.21.21'), 'should include Vercel IP')
    assert.ok(!out.includes('CNAME'), 'should not use CNAME for root')
  })

  it('subdomain uses CNAME record', () => {
    const out = dnsInstructions('dev.bluestoneconstruction.llc')
    assert.ok(out.includes('CNAME'), 'should use CNAME for subdomain')
    assert.ok(out.includes('cname.vercel-dns.com'), 'should target vercel DNS')
    assert.ok(!out.includes('76.76.21.21'), 'should not include IP for subdomain')
  })

  it('subdomain name appears in output', () => {
    const out = dnsInstructions('staging.example.com')
    assert.ok(out.includes('staging'), 'subdomain name should be in output')
  })

  it('includes dig verify command', () => {
    const out = dnsInstructions('bluestoneconstruction.llc')
    assert.ok(out.includes('dig bluestoneconstruction.llc'))
  })
})

// ── CLI integration tests ─────────────────────────────────────────────────────

describe('--list', () => {
  it('prints registered projects', () => {
    const { code, stdout } = run(['--list'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('ploutos-blue-stone'))
    assert.ok(stdout.includes('agent-forge-web'))
    assert.ok(stdout.includes('launchops'))
  })

  it('prints domain entries', () => {
    const { code, stdout } = run(['--list'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('bluestoneconstruction.llc'))
    assert.ok(stdout.includes('mindrithm.app'))
    assert.ok(stdout.includes('launchops.ai'))
  })
})

describe('--dry-run', () => {
  it('exits 0 and prints commands without executing', () => {
    const { code, stdout } = run([
      '--project',
      'ploutos-blue-stone',
      '--env',
      'production',
      '--dry-run',
    ])
    assert.equal(code, 0)
    assert.ok(stdout.includes('[DRY RUN]'))
    assert.ok(stdout.includes('vercel domains add bluestoneconstruction.llc'))
    assert.ok(stdout.includes('NEXT_PUBLIC_APP_URL'))
  })

  it('processes all envs with --all-envs', () => {
    const { code, stdout } = run(['--project', 'ploutos-blue-stone', '--all-envs', '--dry-run'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('development'), 'should include development env')
    assert.ok(stdout.includes('production'), 'should include production env')
    assert.ok(stdout.includes('staging'), 'should include staging env')
    assert.ok(stdout.includes('preview'), 'should include preview env')
  })

  it('prints GoDaddy DNS instructions', () => {
    const { code, stdout } = run([
      '--project',
      'ploutos-blue-stone',
      '--env',
      'production',
      '--dry-run',
    ])
    assert.equal(code, 0)
    assert.ok(stdout.includes('GoDaddy DNS'))
  })

  it('prints [DRY RUN complete]', () => {
    const { code, stdout } = run([
      '--project',
      'ploutos-blue-stone',
      '--env',
      'production',
      '--dry-run',
    ])
    assert.equal(code, 0)
    assert.ok(stdout.includes('[DRY RUN complete]'))
  })
})

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
    const { code, stderr } = run(['--project', 'ploutos-blue-stone', '--env', 'invalid'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('unknown env'))
  })
})
