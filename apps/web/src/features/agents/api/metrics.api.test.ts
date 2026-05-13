import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ApiError } from '@forge/api-client'

vi.mock('@forge/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    status: number
    data?: unknown
    constructor(status: number, message: string, data?: unknown) {
      super(message)
      this.name = 'ApiError'
      this.status = status
      this.data = data
    }
  },
}))

vi.mock('@forge/auth/client-registry', () => ({
  getAccessToken: vi.fn().mockResolvedValue('test-token'),
}))

import { apiClient } from '@forge/api-client'
import { EMPTY_DASHBOARD_METRICS, fetchMetrics, fetchUnresolvedIntents } from './metrics.api'

const MOCK_METRICS = {
  totalAgents: 3,
  activeAgents: 2,
  totalMessages: 5,
  period: 'all-time' as const,
}

beforeEach(() => {
  vi.clearAllMocks()
  Object.defineProperty(window, 'location', {
    value: { href: '' },
    writable: true,
  })
})

describe('metrics.api', () => {
  describe('fetchMetrics', () => {
    it('calls GET /api/metrics with bearer token support', async () => {
      vi.mocked(apiClient.get).mockResolvedValue(MOCK_METRICS)

      await expect(fetchMetrics()).resolves.toEqual(MOCK_METRICS)
      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/metrics',
        expect.objectContaining({ getToken: expect.any(Function), cache: 'no-store' })
      )
    })

    it('redirects to login and returns empty metrics on 401', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new ApiError(401, 'Unauthorized'))

      await expect(fetchMetrics()).resolves.toEqual(EMPTY_DASHBOARD_METRICS)
      expect(window.location.href).toBe('/login')
    })

    it('throws non-auth errors', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'))

      await expect(fetchMetrics()).rejects.toThrow('Network error')
    })
  })

  describe('fetchUnresolvedIntents', () => {
    it('returns intents array and recommendation', async () => {
      const { intents, recommendation } = await fetchUnresolvedIntents()
      expect(Array.isArray(intents)).toBe(true)
      expect(intents.length).toBeGreaterThan(0)
      expect(recommendation).not.toBeNull()
    })

    it('each intent has label, percentage, and severity', async () => {
      const { intents } = await fetchUnresolvedIntents()
      for (const intent of intents) {
        expect(intent).toHaveProperty('label')
        expect(intent.percentage).toBeGreaterThanOrEqual(0)
        expect(['high', 'medium', 'low']).toContain(intent.severity)
      }
    })
  })
})
