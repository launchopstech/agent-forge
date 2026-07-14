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
    createRoutingRule: fn(),
    deleteRoutingRule: fn(),
  },
}

export default meta
type Story = StoryObj<typeof RoutingRulesEditor>

export const Empty: Story = {
  name: 'No rules',
  args: {
    fetchRoutingRules: fn().mockResolvedValue([]),
  },
}

export const WithRules: Story = {
  name: 'Existing rules',
  args: {
    fetchRoutingRules: fn().mockResolvedValue([
      {
        id: 'rule_1',
        workspaceChannelId: 'ch_preview',
        orgId: 'org_preview',
        agentId: 'agent_1',
        priority: 1,
        conditionType: 'always',
        conditionValue: {},
        agentInstructions: null,
        createdAt: '2025-01-15T10:00:00Z',
      },
      {
        id: 'rule_2',
        workspaceChannelId: 'ch_preview',
        orgId: 'org_preview',
        agentId: 'agent_2',
        priority: 0,
        conditionType: 'keyword',
        conditionValue: { keywords: ['billing', 'invoice'] },
        agentInstructions: null,
        createdAt: '2025-01-15T10:00:00Z',
      },
    ]),
    deleteRoutingRule: fn().mockResolvedValue(undefined),
  },
}

export const Loading: Story = {
  name: 'Loading state',
  args: {
    fetchRoutingRules: fn().mockReturnValue(new Promise(() => {})),
  },
}
