import type { Meta, StoryObj } from '@storybook/react'
import { fn, userEvent, within } from '@storybook/test'
import { TestChatPanel } from './TestChatPanel'
import { useAgentBuilderStore } from '../store/agent-builder.store'
import type { TestMessage } from '../types'

const SAMPLE_MESSAGES: TestMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello, what is your name?',
    timestamp: new Date('2024-01-01T10:00:00'),
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Hi! I am Aria, your support agent. How can I help you today?',
    timestamp: new Date('2024-01-01T10:00:02'),
  },
]

const meta: Meta<typeof TestChatPanel> = {
  title: 'Features/Agents/TestChatPanel',
  component: TestChatPanel,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story, ctx) => {
      useAgentBuilderStore.setState({
        agentId: (ctx.parameters.agentId as string | null) ?? null,
        testMessages: (ctx.parameters.testMessages as TestMessage[]) ?? [],
        draftAgent: {
          templateId: null,
          identity: {
            name: (ctx.parameters.agentName as string) ?? '',
            welcomeMessage: '',
            tone: 'professional',
            language: 'en-US',
          },
          behaviour: {
            systemPrompt: '',
            responseStyle: 50,
            fallback: 'handoff',
            tonePreset: 'neutral',
            customToneInstructions: '',
            useEmojis: true,
            showSourceLinks: true,
            guidanceRules: [],
          },
          actions: [],
          knowledge: [],
          channels: [],
        },
      })
      return (
        <div style={{ height: '600px', width: '380px', border: '1px solid var(--border)' }}>
          <Story />
        </div>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof TestChatPanel>

/** No agentId — Submit button is disabled with tooltip "Save agent first" */
export const NoAgent: Story = {
  parameters: {
    agentId: null,
    testMessages: [],
  },
}

/** Agent saved — Submit button enabled, blank chat ready for testing */
export const ReadyToChat: Story = {
  parameters: {
    agentId: 'agent-abc123',
    agentName: 'Aria',
    testMessages: [],
  },
}

/** Pre-populated conversation — shows markdown rendering via MessageResponse */
export const WithMessages: Story = {
  parameters: {
    agentId: 'agent-abc123',
    agentName: 'Aria',
    testMessages: [
      ...SAMPLE_MESSAGES,
      {
        id: '3',
        role: 'user' as const,
        content: 'Can you explain how you work?',
        timestamp: new Date('2024-01-01T10:00:10'),
      },
      {
        id: '4',
        role: 'assistant' as const,
        content:
          "Sure! Here's a quick overview:\n\n- I use **LangGraph** to orchestrate responses\n- My knowledge comes from your configured sources\n- I follow the tone and rules you set in the builder\n\nWant me to show you an example?",
        timestamp: new Date('2024-01-01T10:00:12'),
      },
    ],
  },
}

/**
 * Stream in progress — user message sent, assistant is streaming a response.
 * Uses a never-resolving fetch mock to hold the component in isTyping state.
 */
export const StreamingInProgress: Story = {
  parameters: {
    agentId: 'agent-abc123',
    agentName: 'Aria',
    testMessages: [],
  },
  beforeEach: () => {
    // Never resolves — holds the component in isTyping=true state
    const mockFetch = fn().mockReturnValue(new Promise<never>(() => {}))
    globalThis.fetch = mockFetch
    return () => {
      delete (globalThis as Record<string, unknown>).fetch
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await userEvent.type(input, 'Tell me about your capabilities')
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }))
  },
}

/**
 * Error state — fetch returns 500, error toast appears.
 * The partial (empty) assistant message is preserved in the chat.
 */
export const ErrorState: Story = {
  parameters: {
    agentId: 'agent-abc123',
    agentName: 'Aria',
    testMessages: SAMPLE_MESSAGES,
  },
  beforeEach: () => {
    const mockFetch = fn().mockResolvedValue({
      ok: false,
      status: 500,
      body: null,
    })
    globalThis.fetch = mockFetch
    return () => {
      delete (globalThis as Record<string, unknown>).fetch
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await userEvent.type(input, 'What went wrong?')
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }))
  },
}
