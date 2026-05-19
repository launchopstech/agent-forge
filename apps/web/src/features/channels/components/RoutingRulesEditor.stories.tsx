import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { RoutingRulesEditor } from './RoutingRulesEditor'

const MOCK_AGENTS = [
  { id: 'agent_1', name: 'Support Bot' },
  { id: 'agent_2', name: 'Finance Bot' },
  { id: 'agent_3', name: 'Sales Bot' },
]

const meta: Meta<typeof RoutingRulesEditor> = {
  title: 'Features/Channels/RoutingRulesEditor',
  component: RoutingRulesEditor,
  parameters: {
    layout: 'padded',
    nextjs: { appDirectory: true },
  },
  args: {
    channelId: 'ch_preview',
    agents: MOCK_AGENTS,
  },
}

export default meta
type Story = StoryObj<typeof RoutingRulesEditor>

export const Empty: Story = {
  name: 'No rules',
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        fetchRoutingRules: fn().mockResolvedValue([]),
        createRoutingRule: fn(),
        deleteRoutingRule: fn(),
      })
      return {}
    },
  ],
}

export const WithRules: Story = {
  name: 'Existing rules',
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        fetchRoutingRules: fn().mockResolvedValue([
          {
            id: 'rule_1',
            workspaceChannelId: 'ch_preview',
            agentId: 'agent_1',
            priority: 1,
            condition: { type: 'always' },
            createdAt: '2025-01-15T10:00:00Z',
            updatedAt: '2025-01-15T10:00:00Z',
          },
          {
            id: 'rule_2',
            workspaceChannelId: 'ch_preview',
            agentId: 'agent_2',
            priority: 0,
            condition: { type: 'keyword', value: ['billing', 'invoice'] },
            createdAt: '2025-01-15T10:00:00Z',
            updatedAt: '2025-01-15T10:00:00Z',
          },
        ]),
        createRoutingRule: fn(),
        deleteRoutingRule: fn().mockResolvedValue(undefined),
      })
      return {}
    },
  ],
}

export const Loading: Story = {
  name: 'Loading state',
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        fetchRoutingRules: fn().mockReturnValue(new Promise(() => {})),
        createRoutingRule: fn(),
        deleteRoutingRule: fn(),
      })
      return {}
    },
  ],
}
