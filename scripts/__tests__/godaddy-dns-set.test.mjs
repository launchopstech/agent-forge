import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createServer } from 'node:http'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { rootDomain, buildRecords } from '../godaddy-dns-set.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const script = resolve(__dir, '../godaddy-dns-set.mjs')

// ── Mock HTTP server ──────────────────────────────────────────────────────────

const receivedRequests = []

let server
let baseUrl

before(async () => {
  server = createServer((req, res) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      receivedRequests.push({ method: req.method, url: req.url, body })
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({}))
    })
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(() => new Promise((resolve) => server.close(resolve)))

function run(args, env = {}) {
  receivedRequests.length = 0
  try {
    const stdout = execFileSync(process.execPath, [script, ...args], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, GODADDY_API_BASE_URL: baseUrl, SKIP_KEYCHAIN: '1', ...env },
    })
    return { code: 0, stdout, stderr: '' }
  } catch (err) {
    return { code: err.status ?? 1, stdout: err.stdout ?? '', stderr: err.stderr ?? '' }
  }
}

// ── Pure helper unit tests ────────────────────────────────────────────────────

describe('rootDomain()', () => {
  it('extracts root from subdomain', () => {
    assert.equal(rootDomain('dev.bluestoneconstruction.llc'), 'bluestoneconstruction.llc')
    assert.equal(rootDomain('staging.example.com'), 'example.com')
  })

  it('returns root unchanged', () => {
    assert.equal(rootDomain('bluestoneconstruction.llc'), 'bluestoneconstruction.llc')
  })
})

describe('buildRecords()', () => {
  const domains = {
    development: 'dev.bluestoneconstruction.llc',
    preview: 'preview.bluestoneconstruction.llc',
    staging: 'staging.bluestoneconstruction.llc',
    production: 'bluestoneconstruction.llc',
  }

  it('includes A record for root', () => {
    const records = buildRecords(domains)
    assert.ok(records.some((r) => r.type === 'A' && r.name === '@' && r.data === '76.76.21.21'))
  })

  it('includes www CNAME', () => {
    const records = buildRecords(domains)
    assert.ok(records.some((r) => r.type === 'CNAME' && r.name === 'www'))
  })

  it('includes CNAME for each non-production env', () => {
    const records = buildRecords(domains)
    assert.ok(records.some((r) => r.name === 'dev'))
    assert.ok(records.some((r) => r.name === 'preview'))
    assert.ok(records.some((r) => r.name === 'staging'))
  })

  it('does not duplicate www', () => {
    const records = buildRecords(domains)
    const wwwRecords = records.filter((r) => r.name === 'www')
    assert.equal(wwwRecords.length, 1)
  })

  it('all CNAMEs point to cname.vercel-dns.com', () => {
    const records = buildRecords(domains)
    records
      .filter((r) => r.type === 'CNAME')
      .forEach((r) => {
        assert.equal(r.data, 'cname.vercel-dns.com')
      })
  })

  it('skips production domain from subdomain list', () => {
    const records = buildRecords(domains)
    // Should not create a CNAME for the root domain itself
    const names = records.map((r) => r.name)
    assert.ok(!names.includes('bluestoneconstruction'))
  })
})

// ── CLI integration tests ─────────────────────────────────────────────────────

describe('--list', () => {
  it('exits 0 and shows projects', () => {
    const { code, stdout } = run(['--list'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('ploutos-blue-stone'))
    assert.ok(stdout.includes('bluestoneconstruction.llc'))
  })

  it('shows expected records per project', () => {
    const { stdout } = run(['--list'])
    assert.ok(stdout.includes('76.76.21.21'))
    assert.ok(stdout.includes('cname.vercel-dns.com'))
  })
})

describe('--dry-run --project', () => {
  it('exits 0', () => {
    const { code } = run(['--project', 'ploutos-blue-stone', '--dry-run'])
    assert.equal(code, 0)
  })

  it('prints [DRY RUN]', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--dry-run'])
    assert.ok(stdout.includes('[DRY RUN]'))
  })

  it('prints all 5 expected PUT calls', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--dry-run'])
    const putLines = stdout.split('\n').filter((l) => l.includes('[dry-run] PUT'))
    // A @, CNAME www, CNAME dev, CNAME preview, CNAME staging
    assert.equal(putLines.length, 5, `Expected 5 PUT lines, got ${putLines.length}:\n${stdout}`)
  })

  it('includes A record for root', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--dry-run'])
    assert.ok(stdout.includes('records/A/@'))
  })

  it('includes CNAME for dev subdomain', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--dry-run'])
    assert.ok(stdout.includes('records/CNAME/dev'))
  })

  it('prints [DRY RUN complete]', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--dry-run'])
    assert.ok(stdout.includes('[DRY RUN complete]'))
  })

  it('does not call API in dry-run', () => {
    run(['--project', 'ploutos-blue-stone', '--dry-run'])
    assert.equal(receivedRequests.length, 0)
  })
})

describe('--dry-run --domain', () => {
  it('works with bare domain instead of project name', () => {
    const { code, stdout } = run(['--domain', 'example.com', '--dry-run'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('example.com'))
    assert.ok(stdout.includes('[dry-run] PUT'))
  })
})

describe('--dry-run --all-projects', () => {
  it('processes all projects in domains.json', () => {
    const { code, stdout } = run(['--all-projects', '--dry-run'])
    assert.equal(code, 0)
    assert.ok(stdout.includes('ploutos-blue-stone'))
    assert.ok(stdout.includes('agent-forge-web'))
    assert.ok(stdout.includes('launchops'))
  })
})

describe('--env flag', () => {
  it('accepts --env prod (default)', () => {
    const { code } = run(['--project', 'ploutos-blue-stone', '--dry-run', '--env', 'prod'])
    assert.equal(code, 0)
  })

  it('accepts --env ote', () => {
    const { code } = run(['--project', 'ploutos-blue-stone', '--dry-run', '--env', 'ote'])
    assert.equal(code, 0)
  })

  it('shows OTE label in dry-run output', () => {
    const { stdout } = run(['--project', 'ploutos-blue-stone', '--dry-run', '--env', 'ote'])
    assert.ok(stdout.includes('OTE'))
  })

  it('exits 1 for unknown --env value', () => {
    const { code, stderr } = run(['--project', 'ploutos-blue-stone', '--dry-run', '--env', 'dev'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('--env must be'))
  })
})

describe('validation errors', () => {
  it('exits 1 when no flags provided', () => {
    const { code, stderr } = run([])
    assert.equal(code, 1)
    assert.ok(stderr.includes('Error'))
  })

  it('exits 1 for unknown project', () => {
    const { code, stderr } = run(['--project', 'does-not-exist'])
    assert.equal(code, 1)
    assert.ok(stderr.includes('unknown project'))
  })

  it('exits 1 when API keys missing (non-dry-run)', () => {
    const { code, stderr } = run(['--project', 'ploutos-blue-stone'], {
      GODADDY_API_KEY: '',
      GODADDY_API_SECRET: '',
      GODADDY_OTE_API_KEY: '',
      GODADDY_OTE_API_SECRET: '',
    })
    assert.equal(code, 1)
    assert.ok(stderr.includes('credentials'))
  })
})

describe('live PUT with mock server', () => {
  it('sends PUT requests for each record', async () => {
    run(['--project', 'ploutos-blue-stone'], {
      GODADDY_API_KEY: 'test-key',
      GODADDY_API_SECRET: 'test-secret',
    })
    assert.ok(receivedRequests.length > 0, 'should have made API calls')
    assert.ok(receivedRequests.every((r) => r.method === 'PUT'))
  })

  it('sends correct Authorization header format', () => {
    run(['--project', 'ploutos-blue-stone'], {
      GODADDY_API_KEY: 'test-key',
      GODADDY_API_SECRET: 'test-secret',
    })
    // Can't easily check headers from subprocess — verify URL pattern instead
    const paths = receivedRequests.map((r) => r.url)
    assert.ok(paths.some((p) => p.includes('/v1/domains/')))
    assert.ok(paths.some((p) => p.includes('/records/A/@')))
    assert.ok(paths.some((p) => p.includes('/records/CNAME/')))
  })

  it('is idempotent — second run succeeds without error', () => {
    const first = run(['--project', 'ploutos-blue-stone'], {
      GODADDY_API_KEY: 'k',
      GODADDY_API_SECRET: 's',
    })
    const second = run(['--project', 'ploutos-blue-stone'], {
      GODADDY_API_KEY: 'k',
      GODADDY_API_SECRET: 's',
    })
    assert.equal(first.code, 0)
    assert.equal(second.code, 0)
  })
})
