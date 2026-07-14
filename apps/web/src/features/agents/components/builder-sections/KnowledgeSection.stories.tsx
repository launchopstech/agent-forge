import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { KnowledgeSection } from './KnowledgeSection'
import { useAgentBuilderStore } from '../../store/agent-builder.store'

const sampleKnowledge = [
  {
    id: 'knowledge-1',
    type: 'qa',
    title: 'FAQ Database',
    question: 'What is your return policy?',
    answer: '30-day returns on all items.',
    content: null,
    sourceUrl: null,
    knowledgeSourceOptionId: 'source-faq',
    position: 0,
  },
  {
    id: 'knowledge-2',
    type: 'document',
    title: 'Shipping',
    question: null,
    answer: null,
    content: 'We ship internationally to 40+ countries.',
    sourceUrl: null,
    knowledgeSourceOptionId: 'source-shipping',
    position: 1,
  },
]

const sampleSources = [
  {
    id: 'source-faq',
    slug: 'faq-database',
    name: 'FAQ Database',
    emoji: '❓',
    description: 'Frequently asked questions and answers',
    category: 'support',
    uiSchema: { setupMode: 'qa' },
    enabled: true,
    position: 0,
  },
  {
    id: 'source-shipping',
    slug: 'shipping-info',
    name: 'Shipping Info',
    emoji: '🚚',
    description: 'Delivery times and carriers',
    category: 'ecommerce',
    uiSchema: { setupMode: 'document' },
    enabled: true,
    position: 1,
  },
  {
    id: 'source-catalog',
    slug: 'product-catalog',
    name: 'Product Catalog',
    emoji: '🛍️',
    description: 'Product catalog information and inventory details',
    category: 'ecommerce',
    uiSchema: { setupMode: 'integration', integrationProvider: 'shopify' },
    enabled: true,
    position: 2,
  },
]

function response(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    text: () => Promise.resolve(JSON.stringify(body)),
    json: () => Promise.resolve(body),
  } as Response
}

const meta: Meta<typeof KnowledgeSection> = {
  title: 'Features/Agents/BuilderSections/KnowledgeSection',
  component: KnowledgeSection,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story, ctx) => {
      useAgentBuilderStore.getState().resetDraft()
      const agentId =
        'agentId' in ctx.parameters ? (ctx.parameters.agentId as string | null) : 'agent-story'
      const draftKnowledge = (ctx.parameters.draftKnowledge as string[] | undefined) ?? []
      useAgentBuilderStore.setState((state) => ({
        agentId,
        draftAgent: {
          ...state.draftAgent,
          agentType: (ctx.parameters.agentType as string | undefined) ?? 'support',
          identity: { ...state.draftAgent.identity, name: 'Story Agent' },
          channels: ['web'],
          knowledge: draftKnowledge,
        },
      }))
      return (
        <div className="max-w-3xl">
          <Story />
        </div>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof KnowledgeSection>

export const SavedWithKnowledge: Story = {
  parameters: {
    agentId: 'agent-story',
  },
  beforeEach: () => {
    const mockFetch = fn((url: string, init?: RequestInit) => {
      if (init?.method === 'GET' || !init?.method) {
        if (url.includes('/knowledge-source-options')) {
          return Promise.resolve(response(200, sampleSources))
        }
        if (url.includes('/knowledge-sources')) {
          return Promise.resolve(response(200, sampleSources))
        }
        return Promise.resolve(response(200, sampleKnowledge))
      }
      if (init?.method === 'DELETE') return Promise.resolve(response(200, null))
      if (init?.method === 'PUT' && url.includes('/knowledge-sources')) {
        return Promise.resolve(response(200, sampleSources))
      }
      return Promise.resolve(response(200, sampleKnowledge[0]))
    })
    globalThis.fetch = mockFetch as typeof fetch
    return () => {
      delete (globalThis as Record<string, unknown>).fetch
    }
  },
}

export const UnsavedAgent: Story = {
  parameters: {
    agentId: null,
    draftKnowledge: ['faq-database', 'shipping-info'],
  },
  beforeEach: () => {
    const mockFetch = fn((url: string, init?: RequestInit) => {
      if (init?.method === 'POST' && url.includes('/knowledge')) {
        return Promise.resolve(response(200, sampleKnowledge[0]))
      }
      if (init?.method === 'POST' && url.includes('/api/agents')) {
        return Promise.resolve(
          response(200, {
            id: 'agent-created-from-story',
            name: 'Story Agent',
            status: 'draft',
            agentType: 'support',
            uiConfig: { channels: ['web'] },
            shareToken: null,
          })
        )
      }
      if (url.includes('/knowledge-source-options')) {
        return Promise.resolve(response(200, sampleSources))
      }
      return Promise.resolve(response(200, []))
    })
    globalThis.fetch = mockFetch as typeof fetch
    return () => {
      delete (globalThis as Record<string, unknown>).fetch
    }
  },
}

export const Loading: Story = {
  parameters: {
    agentId: 'agent-story',
  },
  beforeEach: () => {
    const mockFetch = fn(() => new Promise<never>(() => {}))
    globalThis.fetch = mockFetch as typeof fetch
    return () => {
      delete (globalThis as Record<string, unknown>).fetch
    }
  },
}

export const ErrorState: Story = {
  parameters: {
    agentId: 'agent-story',
  },
  beforeEach: () => {
    const mockFetch = fn(() => Promise.resolve(response(500, { message: 'Failed' })))
    globalThis.fetch = mockFetch as typeof fetch
    return () => {
      delete (globalThis as Record<string, unknown>).fetch
    }
  },
}
