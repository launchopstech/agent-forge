import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { EmbedSection } from './EmbedSection'

const meta: Meta<typeof EmbedSection> = {
  title: 'Channels/EmbedSection',
  component: EmbedSection,
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof EmbedSection>

import type { Agent, AgentChannel } from '@/features/agents/types'
import type { WorkspaceChannel, ChannelType } from '../types'

const agents: Agent[] = [
  {
    id: 'agent_123',
    name: 'Support Agent',
    agentType: 'support',
    channels: ['Web' as AgentChannel],
    conversations: 0,
    resolution: null,
    csat: null,
    status: 'live',
    shareToken: 'share_123',
  },
]

const channel: WorkspaceChannel = {
  id: 'ch_website',
  orgId: 'org_123',
  channelType: 'website' as ChannelType,
  name: 'Website',
  config: {
    agentId: 'agent_123',
    brandColor: '#4f2edc',
    mode: 'floating',
    position: 'bottom-right',
    allowedDomains: ['example.com'],
  },
  webhookSecret: null,
  status: 'active',
  workspaceInstructions: null,
  createdAt: '2026-05-19T00:00:00.000Z',
  updatedAt: '2026-05-19T00:00:00.000Z',
}

export const Default: Story = {
  args: {
    channel,
    agents,
    onConfigSaved: () => alert('Config saved!'),
  },
}
