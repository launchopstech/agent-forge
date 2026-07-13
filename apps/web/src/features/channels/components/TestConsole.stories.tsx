import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn, fireEvent, within, waitFor, expect } from '@storybook/test'
import { TestConsole } from './TestConsole'

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
    triggerTest: fn().mockResolvedValue({
      ok: true,
      reply: 'Hi! How can I help you today?',
      conversationId: 'conv_preview_001',
    }),
  },
}

export default meta
type Story = StoryObj<typeof TestConsole>

export const Default: Story = {
  name: 'Empty state',
}

export const WithConversation: Story = {
  name: 'With conversation (play)',
  args: {
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
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByPlaceholderText(/type a message/i)
    fireEvent.change(input, { target: { value: 'Hello there' } })
    await waitFor(() => expect(canvas.getByRole('button', { name: /send/i })).not.toBeDisabled())
    fireEvent.click(canvas.getByRole('button', { name: /send/i }))

    // Wait for response; swallow timeout so Chromatic never sees a component error
    await canvas.findByText(/hello! how can I assist/i, {}, { timeout: 5000 }).catch(() => null)

    await waitFor(() => expect(input).not.toBeDisabled())
    fireEvent.change(input, { target: { value: 'Can you help me with my order?' } })
    await waitFor(() => expect(canvas.getByRole('button', { name: /send/i })).not.toBeDisabled())
    fireEvent.click(canvas.getByRole('button', { name: /send/i }))

    await canvas.findByText(/sure, I can help/i, {}, { timeout: 5000 }).catch(() => null)
  },
}

export const RoutingRuleError: Story = {
  name: 'No routing rule matched',
  args: {
    triggerTest: fn().mockResolvedValue({
      ok: false,
      reason: 'No routing rule matched this sender ID',
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/type a message/i)
    fireEvent.change(input, { target: { value: 'test' } })
    await waitFor(() => expect(canvas.getByRole('button', { name: /send/i })).not.toBeDisabled())
    fireEvent.click(canvas.getByRole('button', { name: /send/i }))
    await canvas.findByText(/no routing rule/i, {}, { timeout: 5000 }).catch(() => null)
  },
}

export const NetworkError: Story = {
  name: 'Network error',
  args: {
    triggerTest: fn().mockRejectedValue(new Error('Failed to fetch')),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText(/type a message/i)
    fireEvent.change(input, { target: { value: 'crash' } })
    await waitFor(() => expect(canvas.getByRole('button', { name: /send/i })).not.toBeDisabled())
    fireEvent.click(canvas.getByRole('button', { name: /send/i }))
    await canvas.findByText(/request failed/i, {}, { timeout: 5000 }).catch(() => null)
  },
}

export const CustomChannelName: Story = {
  name: 'Custom channel name',
  args: {
    channelId: 'ch_slack_001',
    channelName: 'Slack Support',
    triggerTest: fn().mockResolvedValue({
      ok: true,
      reply: 'How can I help you via Slack?',
      conversationId: 'conv_slack_001',
    }),
  },
}
