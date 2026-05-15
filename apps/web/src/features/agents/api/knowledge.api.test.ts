import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@forge/api-client'

vi.mock('@forge/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
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
  createKnowledgeItem,
  deleteKnowledgeItem,
  fetchAgentKnowledgeSources,
  fetchAgentTypeKnowledgeSources,
  fetchKnowledgeItems,
  fetchKnowledgeSourceOptions,
  updateAgentKnowledgeSources,
  updateAgentTypeKnowledgeSources,
  updateKnowledgeItem,
  type KnowledgeItem,
} from './knowledge.api'

const MOCK_ITEMS: KnowledgeItem[] = [
  {
    id: 'knowledge-1',
    type: 'qa',
    title: null,
    question: 'What is your return policy?',
    answer: '30-day returns',
    content: null,
    sourceUrl: null,
    knowledgeSourceOptionId: 'source-1',
    position: 0,
  },
]

const MOCK_SOURCES = [
  {
    id: 'source-1',
    slug: 'faq-database',
    name: 'FAQ Database',
    emoji: '❓',
    description: 'Frequently asked questions and answers',
    category: 'support',
    uiSchema: { setupMode: 'qa' as const },
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

describe('knowledge.api', () => {
  it('fetches knowledge items with auth and no-store cache', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_ITEMS)

    await expect(fetchKnowledgeItems('agent-1')).resolves.toEqual(MOCK_ITEMS)

    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/agents/agent-1/knowledge',
      expect.objectContaining({ getToken: expect.any(Function), cache: 'no-store' })
    )
  })

  it('creates a knowledge item', async () => {
    vi.mocked(apiClient.post).mockResolvedValue(MOCK_ITEMS[0])
    const payload = {
      type: 'qa' as const,
      title: null,
      question: 'Q',
      answer: 'A',
      content: null,
      sourceUrl: null,
      knowledgeSourceOptionId: 'source-1',
      position: 0,
    }

    await expect(createKnowledgeItem('agent-1', payload)).resolves.toEqual(MOCK_ITEMS[0])

    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/agents/agent-1/knowledge',
      payload,
      expect.objectContaining({ getToken: expect.any(Function) })
    )
  })

  it('updates a knowledge item with PUT', async () => {
    vi.mocked(apiClient.put).mockResolvedValue({ ...MOCK_ITEMS[0], answer: 'Updated' })

    await updateKnowledgeItem('agent-1', 'knowledge-1', { answer: 'Updated' })

    expect(apiClient.put).toHaveBeenCalledWith(
      '/api/agents/agent-1/knowledge/knowledge-1',
      { answer: 'Updated' },
      expect.objectContaining({ getToken: expect.any(Function) })
    )
  })

  it('deletes a knowledge item', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined)

    await expect(deleteKnowledgeItem('agent-1', 'knowledge-1')).resolves.toBeUndefined()

    expect(apiClient.delete).toHaveBeenCalledWith(
      '/api/agents/agent-1/knowledge/knowledge-1',
      expect.objectContaining({ getToken: expect.any(Function) })
    )
  })

  it('fetches knowledge source options', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_SOURCES)

    await expect(fetchKnowledgeSourceOptions()).resolves.toEqual(MOCK_SOURCES)

    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/knowledge-source-options',
      expect.objectContaining({ getToken: expect.any(Function), cache: 'no-store' })
    )
  })

  it('fetches knowledge source options for an agent type', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_SOURCES)

    await expect(fetchKnowledgeSourceOptions('support')).resolves.toEqual(MOCK_SOURCES)

    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/knowledge-source-options?agentType=support',
      expect.objectContaining({ getToken: expect.any(Function), cache: 'no-store' })
    )
  })

  it('fetches configured knowledge sources for an agent type', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_SOURCES)

    await expect(fetchAgentTypeKnowledgeSources('support')).resolves.toEqual(MOCK_SOURCES)

    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/agent-types/support/knowledge-sources',
      expect.objectContaining({ getToken: expect.any(Function), cache: 'no-store' })
    )
  })

  it('updates configured knowledge sources for an agent type', async () => {
    vi.mocked(apiClient.put).mockResolvedValue(MOCK_SOURCES)

    await expect(updateAgentTypeKnowledgeSources('support', ['faq-database'])).resolves.toEqual(
      MOCK_SOURCES
    )

    expect(apiClient.put).toHaveBeenCalledWith(
      '/api/agent-types/support/knowledge-sources',
      { sourceSlugs: ['faq-database'] },
      expect.objectContaining({ getToken: expect.any(Function) })
    )
  })

  it('fetches selected knowledge sources for an agent', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_SOURCES)

    await expect(fetchAgentKnowledgeSources('agent-1')).resolves.toEqual(MOCK_SOURCES)

    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/agents/agent-1/knowledge-sources',
      expect.objectContaining({ getToken: expect.any(Function), cache: 'no-store' })
    )
  })

  it('updates selected knowledge sources for an agent', async () => {
    vi.mocked(apiClient.put).mockResolvedValue(MOCK_SOURCES)

    await expect(updateAgentKnowledgeSources('agent-1', ['faq-database'])).resolves.toEqual(
      MOCK_SOURCES
    )

    expect(apiClient.put).toHaveBeenCalledWith(
      '/api/agents/agent-1/knowledge-sources',
      { sourceSlugs: ['faq-database'] },
      expect.objectContaining({ getToken: expect.any(Function) })
    )
  })

  it('redirects to /login on 401 reads', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new ApiError(401, 'Unauthorized'))

    await expect(fetchKnowledgeItems('agent-1')).resolves.toEqual([])

    expect(window.location.href).toBe('/login')
  })

  it('redirects to /login on 401 mutations', async () => {
    vi.mocked(apiClient.delete).mockRejectedValue(new ApiError(401, 'Unauthorized'))

    await deleteKnowledgeItem('agent-1', 'knowledge-1')

    expect(window.location.href).toBe('/login')
  })
})
