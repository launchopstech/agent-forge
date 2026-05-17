import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ConversationPanel } from './ConversationPanel'

const meta: Meta<typeof ConversationPanel> = {
  title: 'Features/Agents/ConversationPanel',
  component: ConversationPanel,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
  args: {
    agentId: 'agent_preview',
  },
}

export default meta
type Story = StoryObj<typeof ConversationPanel>

export const Empty: Story = {
  name: 'No conversations',
  loaders: [
    async () => {
      const api = await import('../api/conversations.api')
      Object.assign(api, {
        fetchConversations: fn().mockResolvedValue([]),
        createConversation: fn(),
        deleteConversation: fn(),
        fetchConversation: fn(),
        sendMessage: fn(),
      })
      return {}
    },
  ],
}

export const WithConversations: Story = {
  name: 'Existing conversations',
  loaders: [
    async () => {
      const api = await import('../api/conversations.api')
      Object.assign(api, {
        fetchConversations: fn().mockResolvedValue([
          {
            id: 'conv_1',
            agentId: 'agent_preview',
            title: 'How do I reset my password?',
            status: 'open',
            createdAt: '2025-01-15T10:00:00Z',
            updatedAt: '2025-01-15T10:05:00Z',
          },
          {
            id: 'conv_2',
            agentId: 'agent_preview',
            title: 'Billing question about my subscription',
            status: 'open',
            createdAt: '2025-01-14T09:00:00Z',
            updatedAt: '2025-01-14T09:10:00Z',
          },
        ]),
        fetchConversation: fn().mockResolvedValue({
          id: 'conv_1',
          agentId: 'agent_preview',
          title: 'How do I reset my password?',
          status: 'open',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:05:00Z',
          messages: [
            {
              id: 'msg_1',
              role: 'user',
              content: 'How do I reset my password?',
              createdAt: '2025-01-15T10:00:00Z',
            },
            {
              id: 'msg_2',
              role: 'assistant',
              content: 'To reset your password, go to Settings → Security → Change Password.',
              createdAt: '2025-01-15T10:00:05Z',
            },
          ],
        }),
        createConversation: fn(),
        deleteConversation: fn().mockResolvedValue(undefined),
        sendMessage: fn(),
      })
      return {}
    },
  ],
}

export const Loading: Story = {
  name: 'Loading state',
  loaders: [
    async () => {
      const api = await import('../api/conversations.api')
      Object.assign(api, {
        fetchConversations: fn().mockReturnValue(new Promise(() => {})),
        createConversation: fn(),
        deleteConversation: fn(),
        fetchConversation: fn(),
        sendMessage: fn(),
      })
      return {}
    },
  ],
}
