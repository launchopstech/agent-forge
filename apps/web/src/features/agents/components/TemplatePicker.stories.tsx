import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { TemplatePicker } from './TemplatePicker'

const sampleAgentTypes = [
  {
    id: 'type-1',
    slug: 'customer-support',
    name: 'Customer Support',
    emoji: '🎧',
    description: 'Handle customer inquiries',
    enabled: true,
    position: 0,
  },
  {
    id: 'type-2',
    slug: 'lead-qualifier',
    name: 'Lead Qualifier',
    emoji: '🎯',
    description: 'Qualify inbound leads',
    enabled: true,
    position: 1,
  },
  {
    id: 'type-3',
    slug: 'order-assistant',
    name: 'Order Assistant',
    emoji: '📦',
    description: 'Help with orders',
    enabled: true,
    position: 2,
  },
]

const sampleTemplates = [
  {
    id: 'customer-support',
    name: 'Support Concierge',
    emoji: '🎧',
    category: 'support',
    agentType: 'customer-support',
    description: 'Handles returns, order tracking, and common customer questions 24/7.',
    identity: {
      name: 'Aria',
      welcomeMessage: 'Hi! How can I help?',
      tone: 'friendly' as const,
      language: 'en',
    },
    behaviour: {
      systemPrompt: 'You are a helpful customer support agent.',
      responseStyle: 50,
      fallback: 'handoff' as const,
      tonePreset: 'friendly' as const,
      customToneInstructions: '',
      useEmojis: true,
      showSourceLinks: false,
      guidanceRules: [],
    },
    actions: ['Track order', 'Start return'],
    knowledge: ['faq-database', 'shipping-info'],
    channels: ['web', 'email'],
  },
  {
    id: 'lead-qualifier',
    name: 'Sales Qualifier',
    emoji: '🎯',
    category: 'sales',
    agentType: 'lead-qualifier',
    description: 'Qualifies inbound leads and books demo calls automatically.',
    identity: {
      name: 'Max',
      welcomeMessage: 'Tell me about your needs.',
      tone: 'professional' as const,
      language: 'en',
    },
    behaviour: {
      systemPrompt: 'You are a sales qualification agent.',
      responseStyle: 40,
      fallback: 'ticket' as const,
      tonePreset: 'neutral' as const,
      customToneInstructions: '',
      useEmojis: false,
      showSourceLinks: false,
      guidanceRules: [],
    },
    actions: ['Book demo', 'Send proposal'],
    knowledge: ['product-catalog'],
    channels: ['web'],
  },
  {
    id: 'blank',
    name: 'Start from scratch',
    emoji: '✨',
    category: 'custom',
    agentType: 'custom',
    description: 'Build your own agent from the ground up.',
    identity: { name: '', welcomeMessage: '', tone: 'professional' as const, language: 'en' },
    behaviour: {
      systemPrompt: '',
      responseStyle: 50,
      fallback: 'handoff' as const,
      tonePreset: 'neutral' as const,
      customToneInstructions: '',
      useEmojis: false,
      showSourceLinks: false,
      guidanceRules: [],
    },
    actions: [],
    knowledge: [],
    channels: [],
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

const meta: Meta<typeof TemplatePicker> = {
  title: 'Features/Agents/TemplatePicker',
  component: TemplatePicker,
  parameters: {
    layout: 'padded',
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="h-[700px] max-w-5xl">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TemplatePicker>

export const Default: Story = {
  beforeEach: () => {
    const mockFetch = fn((url: string) => {
      if (String(url).includes('/agent-types')) {
        return Promise.resolve(response(200, sampleAgentTypes))
      }
      return Promise.resolve(response(200, sampleTemplates))
    })
    globalThis.fetch = mockFetch as typeof fetch
    return () => {
      delete (globalThis as Record<string, unknown>).fetch
    }
  },
}

export const Loading: Story = {
  beforeEach: () => {
    const mockFetch = fn(() => new Promise(() => undefined))
    globalThis.fetch = mockFetch as typeof fetch
    return () => {
      delete (globalThis as Record<string, unknown>).fetch
    }
  },
}

export const Empty: Story = {
  beforeEach: () => {
    const mockFetch = fn((url: string) => {
      if (String(url).includes('/agent-types')) {
        return Promise.resolve(response(200, sampleAgentTypes))
      }
      return Promise.resolve(response(200, []))
    })
    globalThis.fetch = mockFetch as typeof fetch
    return () => {
      delete (globalThis as Record<string, unknown>).fetch
    }
  },
}
