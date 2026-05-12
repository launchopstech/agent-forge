import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ApiError } from '@forge/api-client'

vi.mock('@forge/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
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
import {
  fetchAgents,
  fetchAgent,
  createAgent,
  updateAgent,
  deleteAgent,
  updateAgentStatus,
  publishAgent,
  pauseAgent,
  resumeAgent,
} from './agents.api'
import type { Agent } from '../types'

const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Customer Bot',
    channels: [],
    conversations: 100,
    resolution: 80,
    csat: 4.5,
    status: 'live',
  },
  {
    id: '2',
    name: 'Sales Bot',
    channels: [],
    conversations: 50,
    resolution: 70,
    csat: 4.0,
    status: 'draft',
  },
  {
    id: '3',
    name: 'Support Bot',
    channels: [],
    conversations: 30,
    resolution: 60,
    csat: 3.5,
    status: 'draft',
  },
  {
    id: '4',
    name: 'HR Bot',
    channels: [],
    conversations: 20,
    resolution: 55,
    csat: 3.0,
    status: 'paused',
  },
]

beforeEach(() => {
  vi.clearAllMocks()
  // Reset location mock
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '' },
  })
})

describe('fetchAgents', () => {
  it('calls GET /api/agents', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_AGENTS)
    await fetchAgents()
    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/agents',
      expect.objectContaining({ getToken: expect.any(Function) })
    )
  })

  it('returns paginated response shape', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_AGENTS)
    const result = await fetchAgents()
    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('total')
    expect(result).toHaveProperty('page')
    expect(result).toHaveProperty('pageSize')
  })

  it('paginates correctly', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_AGENTS)
    const page1 = await fetchAgents({ page: 1, pageSize: 2 })
    const page2 = await fetchAgents({ page: 2, pageSize: 2 })
    expect(page1.data).toHaveLength(2)
    expect(page2.data).toHaveLength(2)
    expect(page1.data[0]?.id).not.toBe(page2.data[0]?.id)
  })

  it('filters by status client-side', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_AGENTS)
    const result = await fetchAgents({ status: 'draft' })
    expect(result.data.every((a) => a.status === 'draft')).toBe(true)
    expect(result.total).toBe(2)
  })

  it('filters by search client-side', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_AGENTS)
    const result = await fetchAgents({ search: 'customer' })
    expect(result.data).toHaveLength(1)
    expect(result.data[0]?.name).toBe('Customer Bot')
  })

  it('returns empty data for non-matching search', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_AGENTS)
    const result = await fetchAgents({ search: 'zzz-no-match-zzz' })
    expect(result.data).toHaveLength(0)
    expect(result.total).toBe(0)
  })

  it('redirects to /login on 401', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new ApiError(401, 'Unauthorized'))
    await fetchAgents()
    expect(window.location.href).toBe('/login')
  })
})

describe('fetchAgent', () => {
  it('calls GET /api/agents/:id', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_AGENTS[0])
    await fetchAgent('1')
    expect(apiClient.get).toHaveBeenCalledWith('/api/agents/1', expect.any(Object))
  })

  it('returns agent on success', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_AGENTS[0])
    const agent = await fetchAgent('1')
    expect(agent?.id).toBe('1')
  })

  it('returns null on 404', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new ApiError(404, 'Not Found'))
    const agent = await fetchAgent('nonexistent')
    expect(agent).toBeNull()
  })

  it('redirects to /login on 401', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new ApiError(401, 'Unauthorized'))
    await fetchAgent('1')
    expect(window.location.href).toBe('/login')
  })

  it('rethrows non-ApiError errors', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'))
    await expect(fetchAgent('1')).rejects.toThrow('Network error')
  })
})

describe('createAgent', () => {
  it('calls POST /api/agents', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(MOCK_AGENTS[0])
    const data = { name: 'New Bot' }
    await createAgent(data)
    expect(apiClient.post).toHaveBeenCalledWith('/api/agents', data, expect.any(Object))
  })

  it('returns the created agent', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(MOCK_AGENTS[0])
    const data = { name: 'New Bot' }
    const agent = await createAgent(data)
    expect(agent.id).toBe('1')
  })

  it('redirects to /login on 401', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new ApiError(401, 'Unauthorized'))
    const data = { name: 'New Bot' }
    await createAgent(data)
    expect(window.location.href).toBe('/login')
  })
})

describe('updateAgent', () => {
  it('calls PATCH /api/agents/:id', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ ...MOCK_AGENTS[0], name: 'Renamed' })
    await updateAgent('1', { name: 'Renamed' })
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/api/agents/1',
      { name: 'Renamed' },
      expect.any(Object)
    )
  })

  it('returns updated agent', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ ...MOCK_AGENTS[0], name: 'Renamed' })
    const agent = await updateAgent('1', { name: 'Renamed' })
    expect(agent.name).toBe('Renamed')
  })

  it('redirects to /login on 401', async () => {
    vi.mocked(apiClient.patch).mockRejectedValue(new ApiError(401, 'Unauthorized'))
    await updateAgent('1', { name: 'X' })
    expect(window.location.href).toBe('/login')
  })
})

describe('deleteAgent', () => {
  it('calls DELETE /api/agents/:id', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined)
    await deleteAgent('1')
    expect(apiClient.delete).toHaveBeenCalledWith('/api/agents/1', expect.any(Object))
  })

  it('resolves without error on success', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined)
    await expect(deleteAgent('1')).resolves.toBeUndefined()
  })

  it('redirects to /login on 401', async () => {
    vi.mocked(apiClient.delete).mockRejectedValue(new ApiError(401, 'Unauthorized'))
    await deleteAgent('1')
    expect(window.location.href).toBe('/login')
  })
})

describe('updateAgentStatus', () => {
  it('calls PATCH /api/agents/:id/status with the requested status', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ ...MOCK_AGENTS[0], status: 'paused' })
    await updateAgentStatus('1', 'paused')
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/api/agents/1/status',
      { status: 'paused' },
      expect.any(Object)
    )
  })

  it('returns the updated agent', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ ...MOCK_AGENTS[0], status: 'paused' })
    const agent = await updateAgentStatus('1', 'paused')
    expect(agent.status).toBe('paused')
  })

  it('redirects to /login on 401', async () => {
    vi.mocked(apiClient.patch).mockRejectedValue(new ApiError(401, 'Unauthorized'))
    await updateAgentStatus('1', 'live')
    expect(window.location.href).toBe('/login')
  })
})

describe('status convenience helpers', () => {
  it('publishAgent sets status to live', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ ...MOCK_AGENTS[1], status: 'live' })
    await publishAgent('2')
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/api/agents/2/status',
      { status: 'live' },
      expect.any(Object)
    )
  })

  it('pauseAgent sets status to paused', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ ...MOCK_AGENTS[0], status: 'paused' })
    await pauseAgent('1')
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/api/agents/1/status',
      { status: 'paused' },
      expect.any(Object)
    )
  })

  it('resumeAgent sets status to live', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({ ...MOCK_AGENTS[3], status: 'live' })
    await resumeAgent('4')
    expect(apiClient.patch).toHaveBeenCalledWith(
      '/api/agents/4/status',
      { status: 'live' },
      expect.any(Object)
    )
  })
})
