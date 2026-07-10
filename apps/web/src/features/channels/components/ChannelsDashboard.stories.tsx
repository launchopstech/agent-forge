import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ChannelsDashboard } from './ChannelsDashboard'

type WorkspaceChannel = {
  id: string
  orgId: string
  channelType: string
  name: string
  status: 'active' | 'paused' | 'error'
  config: Record<string, unknown>
  webhookSecret: string | null
  workspaceInstructions: string | null
  createdAt: string
  updatedAt: string
}

type ChannelCatalogItem = {
  type: string
  name: string
  iconSlug: string
  capabilities: string[]
  configSchema: Record<string, unknown>
  setupInstructions: string
}

const MOCK_CATALOG: ChannelCatalogItem[] = [
  {
    type: 'test',
    name: 'Test',
    iconSlug: 'test',
    capabilities: ['chat'],
    configSchema: {},
    setupInstructions: 'No configuration needed. Messages are sent via the Test Console.',
  },
  {
    type: 'slack',
    name: 'Slack',
    iconSlug: 'slack',
    capabilities: ['chat', 'files'],
    configSchema: {},
    setupInstructions: 'Configure OAuth credentials in the settings below.',
  },
  {
    type: 'telegram',
    name: 'Telegram',
    iconSlug: 'telegram',
    capabilities: ['chat'],
    configSchema: {},
    setupInstructions: 'Provide your Telegram bot token.',
  },
]

function makeChannel(
  id: string,
  name: string,
  channelType: string,
  status: WorkspaceChannel['status'] = 'active'
): WorkspaceChannel {
  return {
    id,
    orgId: 'org_preview',
    channelType,
    name,
    status,
    config: {},
    webhookSecret: null,
    workspaceInstructions: null,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  }
}

const MOCK_CHANNELS: WorkspaceChannel[] = [
  makeChannel('ch_1', 'Support Bot', 'test', 'active'),
  makeChannel('ch_2', 'Sales Slack', 'slack', 'paused'),
  makeChannel('ch_3', 'Telegram Bot', 'telegram', 'error'),
]

const meta: Meta<typeof ChannelsDashboard> = {
  title: 'Features/Channels/ChannelsDashboard',
  component: ChannelsDashboard,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
  args: {
    createChannel: fn(),
    deleteChannel: fn(),
  },
}

export default meta
type Story = StoryObj<typeof ChannelsDashboard>

export const Empty: Story = {
  name: 'Empty state',
  args: {
    fetchChannels: fn().mockResolvedValue([]),
    fetchChannelCatalog: fn().mockResolvedValue(MOCK_CATALOG),
  },
}

export const WithChannels: Story = {
  name: 'With channels',
  args: {
    fetchChannels: fn().mockResolvedValue(MOCK_CHANNELS),
    fetchChannelCatalog: fn().mockResolvedValue(MOCK_CATALOG),
  },
}

export const Loading: Story = {
  name: 'Loading state',
  args: {
    fetchChannels: fn().mockReturnValue(new Promise(() => {})),
    fetchChannelCatalog: fn().mockResolvedValue(MOCK_CATALOG),
  },
}

export const FetchError: Story = {
  name: 'Error state',
  args: {
    fetchChannels: fn().mockRejectedValue(new Error('503 Service Unavailable')),
    fetchChannelCatalog: fn().mockResolvedValue(MOCK_CATALOG),
  },
}

export const ReadyToConnect: Story = {
  name: 'Ready (catalog loaded, no channels)',
  args: {
    fetchChannels: fn().mockResolvedValue([]),
    fetchChannelCatalog: fn().mockResolvedValue(MOCK_CATALOG),
    createChannel: fn().mockResolvedValue(makeChannel('ch_new', 'New Bot', 'test')),
  },
}
