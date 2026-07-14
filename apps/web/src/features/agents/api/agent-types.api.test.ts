import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@forge/api-client'

vi.mock('@forge/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    status: number
    constructor(status: number, message: string) {
      super(message)
      this.name = 'ApiError'
      this.status = status
    }
  },
}))

vi.mock('@forge/auth/client-registry', () => ({
  getAccessToken: vi.fn().mockResolvedValue('test-token'),
}))

import { apiClient } from '@forge/api-client'
import { fetchAgentTypes } from './agent-types.api'

const MOCK_TYPES = [
  {
    id: 'type-1',
    slug: 'support',
    name: 'Customer Service',
    emoji: '💬',
    description: 'Support workflows',
    enabled: true,
    position: 0,
  },
]

beforeEach(() => {
  vi.clearAllMocks()
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '' },
  })
})

describe('agent-types.api', () => {
  it('fetches agent types with auth and no-store cache', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_TYPES)

    await expect(fetchAgentTypes()).resolves.toEqual(MOCK_TYPES)

    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/agent-types',
      expect.objectContaining({ getToken: expect.any(Function), cache: 'no-store' })
    )
  })

  it('redirects to /login on 401 reads', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new ApiError(401, 'Unauthorized'))

    await expect(fetchAgentTypes()).resolves.toEqual([])

    expect(window.location.href).toBe('/login')
  })
})
