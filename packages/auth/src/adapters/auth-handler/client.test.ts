import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

/**
 * Unit tests for getAccessToken() in the auth-handler client adapter.
 *
 * Uses vi.resetModules() + dynamic import per test to reset the module-level
 * `_refreshInFlight` singleton between tests.
 * sessionStorage and fetch are stubbed via vi.stubGlobal (not available in Node).
 */

const storage: Record<string, string> = {}
const sessionStorageMock = {
  getItem: (key: string) => storage[key] ?? null,
  setItem: (key: string, value: string) => {
    storage[key] = value
  },
  removeItem: (key: string) => {
    delete storage[key]
  },
  clear: () => {
    Object.keys(storage).forEach((k) => delete storage[k])
  },
}

function makeFetch(accessToken: string, expiresIn = 3600) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ accessToken, expiresIn }),
  })
}

describe('getAccessToken()', () => {
  let getAccessToken: () => Promise<string | null>

  beforeEach(async () => {
    // Reset module so _refreshInFlight is null at the start of each test
    vi.resetModules()
    // Clear storage
    Object.keys(storage).forEach((k) => delete storage[k])
    // Polyfill browser globals
    vi.stubGlobal('sessionStorage', sessionStorageMock)
    vi.stubGlobal('fetch', vi.fn())
    // Fresh import
    const mod = await import('./client')
    getAccessToken = mod.getAccessToken
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns cached token when valid and not expiring soon', async () => {
    storage['forge_access_token'] = 'cached-token'
    storage['forge_token_expires_at'] = (Date.now() + 10 * 60 * 1000).toString() // 10 min

    const token = await getAccessToken()

    expect(token).toBe('cached-token')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('refreshes when no token is stored', async () => {
    vi.stubGlobal('fetch', makeFetch('fresh-token'))

    const token = await getAccessToken()

    expect(token).toBe('fresh-token')
    expect(fetch).toHaveBeenCalledOnce()
    expect(storage['forge_access_token']).toBe('fresh-token')
  })

  it('refreshes when token expires within 5 minutes', async () => {
    storage['forge_access_token'] = 'expiring-token'
    storage['forge_token_expires_at'] = (Date.now() + 4 * 60 * 1000).toString() // 4 min — inside threshold
    vi.stubGlobal('fetch', makeFetch('renewed-token'))

    const token = await getAccessToken()

    expect(token).toBe('renewed-token')
    expect(fetch).toHaveBeenCalledOnce()
  })

  it('does NOT refresh when token expires beyond 5 minutes', async () => {
    storage['forge_access_token'] = 'still-fresh-token'
    storage['forge_token_expires_at'] = (Date.now() + 6 * 60 * 1000).toString() // 6 min — outside threshold
    vi.stubGlobal('fetch', vi.fn())

    const token = await getAccessToken()

    expect(token).toBe('still-fresh-token')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('deduplicates concurrent refresh calls — only one fetch fires', async () => {
    // Manually controlled promise so we can start all three calls before resolving
    let resolveRefresh!: (v: unknown) => void
    const pendingRefresh = new Promise((r) => {
      resolveRefresh = r
    })
    const mockFetch = vi.fn().mockReturnValue(pendingRefresh)
    vi.stubGlobal('fetch', mockFetch)

    // All three start with empty storage — all enter the refresh path
    const p1 = getAccessToken()
    const p2 = getAccessToken()
    const p3 = getAccessToken()

    // Resolve after all three have started
    resolveRefresh({
      ok: true,
      json: () => Promise.resolve({ accessToken: 'deduped-token', expiresIn: 3600 }),
    })

    const [t1, t2, t3] = await Promise.all([p1, p2, p3])

    expect(mockFetch).toHaveBeenCalledOnce() // single network call
    expect(t1).toBe('deduped-token')
    expect(t2).toBe('deduped-token')
    expect(t3).toBe('deduped-token')
  })

  it('returns null and clears storage when refresh endpoint fails', async () => {
    storage['forge_access_token'] = 'stale-token'
    storage['forge_token_expires_at'] = '0' // already expired
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    const token = await getAccessToken()

    expect(token).toBeNull()
    expect(storage['forge_access_token']).toBeUndefined()
    expect(storage['forge_token_expires_at']).toBeUndefined()
  })

  it('returns null and clears storage when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const token = await getAccessToken()

    expect(token).toBeNull()
    expect(storage['forge_access_token']).toBeUndefined()
  })

  it('allows a new refresh after a previous one settles', async () => {
    // First refresh
    vi.stubGlobal('fetch', makeFetch('first-token'))
    await getAccessToken()
    expect(fetch).toHaveBeenCalledOnce()

    // Expire the stored token
    storage['forge_token_expires_at'] = '0'

    // Second refresh — _refreshInFlight was cleared by finally{}, so a new fetch fires
    vi.stubGlobal('fetch', makeFetch('second-token'))
    const token = await getAccessToken()

    expect(token).toBe('second-token')
    expect(fetch).toHaveBeenCalledOnce() // new mock, called once
  })
})
