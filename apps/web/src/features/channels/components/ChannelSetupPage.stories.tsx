import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ChannelSetupPage } from './ChannelSetupPage'

const meta: Meta<typeof ChannelSetupPage> = {
  title: 'Features/Channels/ChannelSetupPage',
  component: ChannelSetupPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
  args: {
    channelId: 'ch_preview',
  },
}

export default meta
type Story = StoryObj<typeof ChannelSetupPage>

export const Loading: Story = {
  name: 'Loading state',
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        fetchChannel: fn().mockReturnValue(new Promise(() => {})),
      })
      const agentsApi = await import('@/features/agents/api/agents.api')
      Object.assign(agentsApi, {
        fetchAgents: fn().mockReturnValue(new Promise(() => {})),
      })
      return {}
    },
  ],
}

export const WithTestChannel: Story = {
  name: 'Test channel',
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        fetchChannel: fn().mockResolvedValue({
          id: 'ch_preview',
          orgId: 'org_preview',
          channelType: 'test',
          name: 'Dev Test',
          status: 'active',
          config: {},
          webhookSecret: null,
          workspaceInstructions: null,
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z',
        }),
        fetchRoutingRules: fn().mockResolvedValue([]),
        createRoutingRule: fn(),
        deleteRoutingRule: fn(),
      })
      const agentsApi = await import('@/features/agents/api/agents.api')
      Object.assign(agentsApi, {
        fetchAgents: fn().mockResolvedValue({ data: [], total: 0, page: 1, pageSize: 100 }),
      })
      return {}
    },
  ],
}
