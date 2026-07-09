import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createServer } from 'node:http'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)

// Import pure helpers directly
import {
  detectConflicts,
  expectedVercelRecords,
  formatTable,
} from '../godaddy-dns-read.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const script = resolve(__dir, '../godaddy-dns-read.mjs')

// ── Mock HTTP server ──────────────────────────────────────────────────────────

const SAMPLE_RECORDS = [
  { type: 'A',     name: '@',       data: '76.76.21.21',          ttl: 3600 },
  { type: 'CNAME', name: 'www',     data: 'cname.vercel-dns.com', ttl: 3600 },
  { type: 'CNAME', name: 'dev',     data: 'cname.vercel-dns.com', ttl: 3600 },
  { type: 'CNAME', name: 'staging', data: 'cname.vercel-dns.com', ttl: 3600 },
  { type: 'CNAME', name: 'preview', data: 'cname.vercel-dns.com', ttl: 3600 },
]

let server
let baseUrl

before(async () => {
  server = createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json')
    if (req.url.includes('/records')) {
      res.end(JSON.stringify(SAMPLE_RECORDS))
    } else if (req.url.startsWith('/v1/domains')) {
      // auth check endpoint — return minimal domain list
      res.end(JSON.stringify([{ domain: 'bluestoneconstruction.llc' }]))
    } else {
      res.statusCode = 404
      res.end(JSON.stringify({ message: 'not found' }))
    }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(() => new Promise(resolve => server.close(resolve)))

async function run(args, env = {}) {
  try {
    const { stdout } = await execFileAsync(process.execPath, [script, ...args], {
      encoding: 'utf8',
      env: { ...process.env, GODADDY_API_BASE_URL: baseUrl, SKIP_KEYCHAIN: '1', ...env },
    })
    return { code: 0, stdout, stderr: '' }
  } catch (err) {
    return { code: err.code ?? 1, stdout: err.stdout ?? '', stderr: err.stderr ?? '' }
  }
}

// ── Pure helper unit tests ────────────────────────────────────────────────────

describe('detectConflicts()', () => {
  it('returns empty array when no conflicts', () => {
    assert.deepEqual(detectConflicts(SAMPLE_RECORDS), [])
  })

  it('flags A + CNAME on same name', () => {
    const records = [
      { type: 'A',     name: 'www', data: '1.2.3.4' },
      { type: 'CNAME', name: 'www', data: 'cname.vercel-dns.com' },
    ]
    const conflicts = detectConflicts(records)
    assert.ok(conflicts.some(c => c.includes('www') && c.includes('A') && c.includes('CNAME')))
  })

  it('flags wrong A record IP', () => {
    const records = [{ type: 'A', name: '@', data: '1.2.3.4' }]
    const conflicts = detectConflicts(records)
    assert.ok(conflicts.some(c => c.includes('1.2.3.4')))
  })

  it('flags non-Vercel CNAME target', () => {
    const records = [{ type: 'CNAME', name: 'www', data: 'other-host.com' }]
    const conflicts = detectConflicts(records)
    assert.ok(conflicts.some(c => c.includes('other-host.com')))
  })
})

describe('expectedVercelRecords()', () => {
  it('includes A record for root domain', () => {
    const domains = { production: 'example.com', development: 'dev.example.com' }
    const records = expectedVercelRecords(domains)
    assert.ok(records.some(r => r.type === 'A' && r.name === '@'))
  })

  it('includes www CNAME when production domain present', () => {
    const domains = { production: 'example.com' }
    const records = expectedVercelRecords(domains)
    assert.ok(records.some(r => r.type === 'CNAME' && r.name === 'www'))
  })

  it('includes CNAME for each subdomain env', () => {
    const domains = { production: 'example.com', development: 'dev.example.com', staging: 'staging.example.com' }
    const records = expectedVercelRecords(domains)
    assert.ok(records.some(r => r.name === 'dev'))
    assert.ok(records.some(r => r.name === 'staging'))
  })
})

describe('formatTable()', () => {
  it('renders a header row', () => {
    const out = formatTable([{ type: 'A', name: '@', data: '76.76.21.21', ttl: 3600 }])
    assert.ok(out.includes('Type'))
    assert.ok(out.includes('Name'))
    assert.ok(out.includes('Value'))
  })

  it('returns "(no records)" for empty array', () => {
    assert.ok(formatTable([]).includes('no records'))
  })
})

// ── CLI integration tests ─────────────────────────────────────────────────────

describe('--list', () => {
  it('prints registered projects', async () => {
    const { code, stdout } = await run(['--list'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('ploutos-blue-stone'))
    assert.ok(stdout.includes('bluestoneconstruction.llc'))
  })
})

describe('--check', () => {
  it('exits 0 and prints ✓ when credentials are valid', async () => {
    const { code, stdout } = await run(
      ['--check', '--env', 'prod'],
      { GODADDY_API_KEY: 'test-key', GODADDY_API_SECRET: 'test-secret' }
    )
    assert.equal(code, 0)
    assert.ok(stdout.includes('✓'))
    assert.ok(stdout.includes('authenticated'))
  })

  it('exits 1 and prints ✗ when credentials are missing', async () => {
    const { code, stdout } = await run(
      ['--check', '--env', 'prod'],
      { GODADDY_API_KEY: '', GODADDY_API_SECRET: '' }
    )
    assert.equal(code, 1)
    assert.ok(stdout.includes('✗'))
  })

  it('checks both OTE and prod when no --env given', async () => {
    const { stdout } = await run(
      ['--check'],
      { GODADDY_API_KEY: 'k', GODADDY_API_SECRET: 's', GODADDY_OTE_API_KEY: 'k2', GODADDY_OTE_API_SECRET: 's2' }
    )
    assert.ok(stdout.includes('OTE'))
    assert.ok(stdout.includes('PROD'))
  })
})

describe('--env flag', () => {
  it('accepts --env prod (default)', async () => {
    const { code } = await run(['--domain', 'bluestoneconstruction.llc', '--dry-run', '--env', 'prod'])
    assert.equal(code, 0)
  })

  it('accepts --env ote', async () => {
    const { code } = await run(['--domain', 'bluestoneconstruction.llc', '--dry-run', '--env', 'ote'])
    assert.equal(code, 0)
  })

  it('exits 1 for unknown --env value', async () => {
    const { code, stderr } = await run(['--domain', 'bluestoneconstruction.llc', '--dry-run', '--env', 'staging'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('--env must be'))
  })
})

describe('--dry-run', () => {
  it('exits 0 and prints what it would fetch', async () => {
    const { code, stdout } = await run(['--domain', 'bluestoneconstruction.llc', '--dry-run'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('[DRY RUN]'))
    assert.ok(stdout.includes('/v1/domains/bluestoneconstruction.llc/records'))
  })

  it('shows expected Vercel records in dry-run', async () => {
    const { stdout } = await run(['--domain', 'bluestoneconstruction.llc', '--dry-run'])
    assert.ok(stdout.includes('76.76.21.21') || stdout.includes('Expected'))
  })
})

describe('missing --domain', () => {
  it('exits 1 with error', async () => {
    const { code, stderr } = await run([])
    assert.equal(code, 1)
    assert.ok(stderr.includes('Error'))
  })
})

describe('missing API keys', () => {
  it('exits 1 with helpful message', async () => {
    const { code, stderr } = await run(
      ['--domain', 'bluestoneconstruction.llc'],
      { GODADDY_API_KEY: '', GODADDY_API_SECRET: '' }
    )
    assert.equal(code, 1)
    assert.ok(stderr.includes('GODADDY_API_KEY'))
  })
})

describe('live fetch with mock server', () => {
  it('displays DNS records table', async () => {
    const { code, stdout } = await run(
      ['--domain', 'bluestoneconstruction.llc'],
      { GODADDY_API_KEY: 'test-key', GODADDY_API_SECRET: 'test-secret' }
    )
    assert.equal(code, 0)
    assert.ok(stdout.includes('76.76.21.21'))
    assert.ok(stdout.includes('cname.vercel-dns.com'))
    assert.ok(stdout.includes('CNAME'))
  })

  it('reports no conflicts when all records are correct', async () => {
    const { stdout } = await run(
      ['--domain', 'bluestoneconstruction.llc'],
      { GODADDY_API_KEY: 'test-key', GODADDY_API_SECRET: 'test-secret' }
    )
    assert.ok(stdout.includes('Conflicts: none'))
  })

  it('reports all expected records present', async () => {
    const { stdout } = await run(
      ['--domain', 'bluestoneconstruction.llc'],
      { GODADDY_API_KEY: 'test-key', GODADDY_API_SECRET: 'test-secret' }
    )
    assert.ok(stdout.includes('present ✓') || stdout.includes('All expected'))
  })
})
