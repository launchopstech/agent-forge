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
    agentType: 'support',
    channels: [],
    conversations: 100,
    resolution: 80,
    csat: 4.5,
    status: 'live',
    shareToken: 'share-token-1',
  },
  {
    id: '2',
    name: 'Sales Bot',
    agentType: 'sales',
    channels: [],
    conversations: 50,
    resolution: 70,
    csat: 4.0,
    status: 'draft',
  },
  {
    id: '3',
    name: 'Support Bot',
    agentType: 'support',
    channels: [],
    conversations: 30,
    resolution: 60,
    csat: 3.5,
    status: 'draft',
  },
  {
    id: '4',
    name: 'HR Bot',
    agentType: 'onboarding',
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
      expect.objectContaining({ getToken: expect.any(Function), cache: 'no-store' })
    )
  })

  it('passes filters as API query params', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_AGENTS)

    await fetchAgents({ search: 'support', status: 'draft', agentType: 'support' })

    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/agents?search=support&status=draft&agentType=support',
      expect.objectContaining({ getToken: expect.any(Function), cache: 'no-store' })
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

  it('paginates the returned agent rows', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_AGENTS)
    const result = await fetchAgents({ page: 1, pageSize: 3, agentType: 'support' })
    expect(result.data).toHaveLength(3)
    expect(result.total).toBe(4)
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
    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/agents/1',
      expect.objectContaining({ getToken: expect.any(Function), cache: 'no-store' })
    )
  })

  it('returns agent on success', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_AGENTS[0])
    const agent = await fetchAgent('1')
    expect(agent?.id).toBe('1')
  })

  it('maps shareToken from the API row', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_AGENTS[0])
    const agent = await fetchAgent('1')
    expect(agent?.shareToken).toBe('share-token-1')
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
    vi.mocked(apiClient.patch).mockResolvedValue({
      ...MOCK_AGENTS[0],
      status: 'paused',
      shareToken: 'share-token-1',
    })
    const agent = await updateAgentStatus('1', 'paused')
    expect(agent.status).toBe('paused')
    expect(agent.shareToken).toBe('share-token-1')
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
