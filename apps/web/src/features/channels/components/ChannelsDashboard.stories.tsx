import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ChannelsDashboard } from './ChannelsDashboard'

/**
 * ChannelsDashboard Stories
 *
 * These stories use module-level mock injection via Storybook's loader/decorator
 * pattern — no MSW required. Each story overrides the `channels.api` module
 * values via `parameters.moduleNameMapper` where supported, or by wrapping
 * with a loader that patches the module cache.
 *
 * For local Storybook runs the API functions are patched via the `loaders`
 * array (Storybook 7+). The component itself is self-contained and needs no
 * router context for these visual tests.
 */

// Because ChannelsDashboard calls fetchChannels / fetchChannelCatalog on mount
// we stub them out via Storybook's `beforeEach` / loaders rather than
// importing and patching at module level (which would affect all stories).

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

// ── Meta ────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ChannelsDashboard> = {
  title: 'Features/Channels/ChannelsDashboard',
  component: ChannelsDashboard,
  parameters: {
    layout: 'fullscreen',
    // Mock next/navigation so the component doesn't throw in Storybook
    nextjs: {
      appDirectory: true,
    },
  },
}

export default meta
type Story = StoryObj<typeof ChannelsDashboard>

// ── Empty ────────────────────────────────────────────────────────────────────

export const Empty: Story = {
  name: 'Empty state',
  loaders: [
    async () => {
      // Dynamically patch the module exports before the story renders
      const api = await import('../api/channels.api')
      Object.assign(api, {
        fetchChannels: fn().mockResolvedValue([]),
        fetchChannelCatalog: fn().mockResolvedValue(MOCK_CATALOG),
        createChannel: fn(),
        deleteChannel: fn(),
      })
      return {}
    },
  ],
}

// ── WithChannels ─────────────────────────────────────────────────────────────

export const WithChannels: Story = {
  name: 'With channels',
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        fetchChannels: fn().mockResolvedValue(MOCK_CHANNELS),
        fetchChannelCatalog: fn().mockResolvedValue(MOCK_CATALOG),
        createChannel: fn(),
        deleteChannel: fn().mockResolvedValue(undefined),
      })
      return {}
    },
  ],
}

// ── Loading ──────────────────────────────────────────────────────────────────

export const Loading: Story = {
  name: 'Loading state',
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        // Never resolves — keeps the component in the loading skeleton state
        fetchChannels: fn().mockReturnValue(new Promise(() => {})),
        fetchChannelCatalog: fn().mockResolvedValue(MOCK_CATALOG),
        createChannel: fn(),
        deleteChannel: fn(),
      })
      return {}
    },
  ],
}

// ── Error ────────────────────────────────────────────────────────────────────

export const FetchError: Story = {
  name: 'Error state',
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        fetchChannels: fn().mockRejectedValue(new Error('503 Service Unavailable')),
        fetchChannelCatalog: fn().mockResolvedValue(MOCK_CATALOG),
        createChannel: fn(),
        deleteChannel: fn(),
      })
      return {}
    },
  ],
}

// ── CreateModalOpen ──────────────────────────────────────────────────────────
// Shows the dashboard with the "pick channel type" modal already open
// (We can't easily pre-open local state from Storybook without internal
//  access, so we just show the ready state with a note.)

export const ReadyToConnect: Story = {
  name: 'Ready (catalog loaded, no channels)',
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        fetchChannels: fn().mockResolvedValue([]),
        fetchChannelCatalog: fn().mockResolvedValue(MOCK_CATALOG),
        createChannel: fn().mockResolvedValue(makeChannel('ch_new', 'New Bot', 'test')),
        deleteChannel: fn(),
      })
      return {}
    },
  ],
}
