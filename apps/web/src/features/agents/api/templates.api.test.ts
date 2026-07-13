import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@forge/api-client'
import type { AgentTemplate } from '../types'

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
import { fetchTemplate, fetchTemplates } from './templates.api'

const MOCK_TEMPLATE: AgentTemplate = {
  id: 'customer-support',
  name: 'Customer Support',
  emoji: '💬',
  category: 'support',
  agentType: 'support',
  description: 'FAQ, order tracking, and escalation',
  identity: {
    name: 'Support Assistant',
    welcomeMessage: 'Hi! How can I help?',
    tone: 'professional',
    language: 'en-US',
  },
  behaviour: {
    systemPrompt: 'You are helpful.',
    responseStyle: 30,
    fallback: 'handoff',
    tonePreset: 'friendly',
    customToneInstructions: '',
    useEmojis: true,
    showSourceLinks: true,
    guidanceRules: [],
  },
  actions: ['Create Ticket'],
  knowledge: ['faq-database'],
  knowledgeSourceSlugs: ['faq-database'],
  knowledgeSources: [
    {
      id: 'source-1',
      slug: 'faq-database',
      name: 'FAQ Database',
      emoji: '❓',
      description: 'Frequently asked questions and answers',
      category: 'support',
      uiSchema: { setupMode: 'qa' },
      enabled: true,
      position: 0,
    },
  ],
  channels: ['web'],
}

beforeEach(() => {
  vi.clearAllMocks()
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '' },
  })
})

describe('templates.api', () => {
  it('fetches templates with auth and no-store cache', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([MOCK_TEMPLATE])

    await expect(fetchTemplates()).resolves.toEqual([MOCK_TEMPLATE])

    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/agent-templates',
      expect.objectContaining({ getToken: expect.any(Function), cache: 'no-store' })
    )
  })

  it('passes category filters as query params', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([MOCK_TEMPLATE])

    await fetchTemplates('support')

    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/agent-templates?category=support',
      expect.any(Object)
    )
  })

  it('fetches a template by id', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(MOCK_TEMPLATE)

    await expect(fetchTemplate('customer-support')).resolves.toEqual(MOCK_TEMPLATE)

    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/agent-templates/customer-support',
      expect.objectContaining({ getToken: expect.any(Function), cache: 'no-store' })
    )
  })

  it('returns null for unknown templates', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new ApiError(404, 'Not Found'))

    await expect(fetchTemplate('does-not-exist')).resolves.toBeNull()
  })

  it('redirects to /login on 401', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new ApiError(401, 'Unauthorized'))

    await expect(fetchTemplates()).resolves.toEqual([])

    expect(window.location.href).toBe('/login')
  })
})
