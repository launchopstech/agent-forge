import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn, userEvent, within, expect } from '@storybook/test'
import { TestConsole } from './TestConsole'

/**
 * TestConsole Stories
 *
 * The `triggerTest` API function is patched via the `loaders` array before
 * each story renders, so no MSW setup is required.
 */

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof TestConsole> = {
  title: 'Features/Channels/TestConsole',
  component: TestConsole,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    channelId: { control: 'text' },
    channelName: { control: 'text' },
  },
  args: {
    channelId: 'ch_preview',
    channelName: 'Preview Bot',
  },
}

export default meta
type Story = StoryObj<typeof TestConsole>

// ── Default (empty) ───────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Empty state',
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        triggerTest: fn().mockResolvedValue({
          ok: true,
          reply: 'Hi! How can I help you today?',
          conversationId: 'conv_preview_001',
        }),
      })
      return {}
    },
  ],
}

// ── WithConversation (play function) ─────────────────────────────────────────

export const WithConversation: Story = {
  name: 'With conversation (play)',
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        triggerTest: fn()
          .mockResolvedValueOnce({
            ok: true,
            reply: 'Hello! How can I assist you today?',
            conversationId: 'conv_preview_001',
          })
          .mockResolvedValueOnce({
            ok: true,
            reply: 'Sure, I can help with that. Let me check the details.',
            conversationId: 'conv_preview_001',
          }),
      })
      return {}
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // First message
    const input = canvas.getByPlaceholderText(/type a message/i)
    await userEvent.type(input, 'Hello there')
    await userEvent.click(canvas.getByRole('button', { name: /send/i }))

    // Wait for assistant reply
    await expect(canvas.findByText(/hello! how can I assist/i)).resolves.toBeTruthy()

    // Second message
    await userEvent.type(input, 'Can you help me with my order?')
    await userEvent.click(canvas.getByRole('button', { name: /send/i }))

    await expect(canvas.findByText(/sure, I can help/i)).resolves.toBeTruthy()
  },
}

// ── RoutingRuleError ──────────────────────────────────────────────────────────

export const RoutingRuleError: Story = {
  name: 'No routing rule matched',
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        triggerTest: fn().mockResolvedValue({
          ok: false,
          reason: 'No routing rule matched this sender ID',
        }),
      })
      return {}
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/type a message/i)
    await userEvent.type(input, 'test')
    await userEvent.click(canvas.getByRole('button', { name: /send/i }))
    await expect(canvas.findByText(/no routing rule/i)).resolves.toBeTruthy()
  },
}

// ── NetworkError ─────────────────────────────────────────────────────────────

export const NetworkError: Story = {
  name: 'Network error',
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        triggerTest: fn().mockRejectedValue(new Error('Failed to fetch')),
      })
      return {}
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/type a message/i)
    await userEvent.type(input, 'crash')
    await userEvent.click(canvas.getByRole('button', { name: /send/i }))
    await expect(canvas.findByText(/request failed/i)).resolves.toBeTruthy()
  },
}

// ── CustomChannelName ─────────────────────────────────────────────────────────

export const CustomChannelName: Story = {
  name: 'Custom channel name',
  args: {
    channelId: 'ch_slack_001',
    channelName: 'Slack Support',
  },
  loaders: [
    async () => {
      const api = await import('../api/channels.api')
      Object.assign(api, {
        triggerTest: fn().mockResolvedValue({
          ok: true,
          reply: 'How can I help you via Slack?',
          conversationId: 'conv_slack_001',
        }),
      })
      return {}
    },
  ],
}
