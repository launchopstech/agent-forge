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
  args: {
    fetchChannel: fn().mockReturnValue(new Promise(() => {})),
    fetchAgents: fn().mockReturnValue(new Promise(() => {})),
  },
}

export const WithTestChannel: Story = {
  name: 'Test channel',
  args: {
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
    fetchAgents: fn().mockResolvedValue({ data: [], total: 0, page: 1, pageSize: 100 }),
  },
}
