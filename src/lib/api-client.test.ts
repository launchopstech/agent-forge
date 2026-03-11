import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient, ApiError } from './api-client'

function makeFetchResponse(status: number, body: unknown) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response)
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('apiClient.get()', () => {
  it('returns parsed JSON on 2xx', async () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(makeFetchResponse(200, { id: 1 })))
    const data = await apiClient.get<{ id: number }>('/api/test')
    expect(data).toEqual({ id: 1 })
  })

  it('throws ApiError on non-2xx response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockReturnValue(makeFetchResponse(404, { message: 'not found' }))
    )
    await expect(apiClient.get('/api/missing')).rejects.toMatchObject({ status: 404 })
  })
})

describe('apiClient.post()', () => {
  it('sends Content-Type: application/json and serialized body', async () => {
    const mockFetch = vi.fn().mockReturnValue(makeFetchResponse(201, { created: true }))
    vi.stubGlobal('fetch', mockFetch)

    await apiClient.post('/api/items', { name: 'test' })

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json')
    expect(init.body).toBe(JSON.stringify({ name: 'test' }))
  })
})

describe('apiClient.put()', () => {
  it('sends PUT with Content-Type: application/json', async () => {
    const mockFetch = vi.fn().mockReturnValue(makeFetchResponse(200, { updated: true }))
    vi.stubGlobal('fetch', mockFetch)

    await apiClient.put('/api/items/1', { name: 'updated' })

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(init.method).toBe('PUT')
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })
})

describe('apiClient.patch()', () => {
  it('sends PATCH with Content-Type: application/json', async () => {
    const mockFetch = vi.fn().mockReturnValue(makeFetchResponse(200, { patched: true }))
    vi.stubGlobal('fetch', mockFetch)

    await apiClient.patch('/api/items/1', { name: 'patched' })

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(init.method).toBe('PATCH')
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })
})

describe('apiClient.delete()', () => {
  it('sends DELETE request', async () => {
    const mockFetch = vi.fn().mockReturnValue(makeFetchResponse(204, null))
    vi.stubGlobal('fetch', mockFetch)

    await apiClient.delete('/api/items/1')

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(init.method).toBe('DELETE')
  })
})

describe('apiClient with getToken', () => {
  it('injects Authorization header when token is returned', async () => {
    const mockFetch = vi.fn().mockReturnValue(makeFetchResponse(200, {}))
    vi.stubGlobal('fetch', mockFetch)

    await apiClient.get('/api/secure', { getToken: async () => 'my-token' })

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer my-token')
  })

  it('omits Authorization header when getToken returns null', async () => {
    const mockFetch = vi.fn().mockReturnValue(makeFetchResponse(200, {}))
    vi.stubGlobal('fetch', mockFetch)

    await apiClient.get('/api/public', { getToken: async () => null })

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect((init.headers as Record<string, string>)['Authorization']).toBeUndefined()
  })
})

describe('ApiError', () => {
  it('has status, data, and name properties', () => {
    const err = new ApiError(422, 'Unprocessable', { field: 'required' })
    expect(err.status).toBe(422)
    expect(err.data).toEqual({ field: 'required' })
    expect(err.name).toBe('ApiError')
    expect(err).toBeInstanceOf(Error)
  })
})

describe('network errors', () => {
  it('re-throws network errors as-is', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(apiClient.get('/api/test')).rejects.toThrow('Failed to fetch')
  })
})
