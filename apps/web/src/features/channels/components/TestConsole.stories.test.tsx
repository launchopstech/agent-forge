import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { fn } from '@storybook/test'

vi.mock('@forge/ui/src/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    'aria-label': ariaLabel,
    size,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    'aria-label'?: string
    size?: string
  }) => (
    <button onClick={onClick} disabled={disabled} aria-label={ariaLabel} data-size={size}>
      {children}
    </button>
  ),
}))

vi.mock('@forge/ui/src/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

vi.mock('lucide-react', () => ({
  Send: () => <span>Send</span>,
  Trash2: () => <span>Trash</span>,
  Bot: () => <span>Bot</span>,
  User: () => <span>User</span>,
}))

vi.mock('../api/channels.api', () => ({
  triggerTest: vi.fn(),
}))

import { TestConsole } from './TestConsole'

describe('TestConsole play stories (direct render)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('WithConversation: shows assistant replies after two messages', async () => {
    const mock = fn()
      .mockResolvedValueOnce({
        ok: true,
        reply: 'Hello! How can I assist you today?',
        conversationId: 'conv_001',
      })
      .mockResolvedValueOnce({
        ok: true,
        reply: 'Sure, I can help with that.',
        conversationId: 'conv_001',
      })

    render(<TestConsole channelId="ch_preview" channelName="Preview Bot" triggerTest={mock} />)

    const input = screen.getByPlaceholderText(/type a message/i)
    await userEvent.type(input, 'Hello there')
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(screen.getByText(/hello! how can I assist/i)).toBeInTheDocument())

    await userEvent.type(input, 'Can you help me?')
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(screen.getByText(/sure, I can help/i)).toBeInTheDocument())
  })

  it('RoutingRuleError: shows no routing rule error', async () => {
    const mock = fn().mockResolvedValue({
      ok: false,
      reason: 'No routing rule matched this sender ID',
    })

    render(<TestConsole channelId="ch_preview" channelName="Preview Bot" triggerTest={mock} />)

    const input = screen.getByPlaceholderText(/type a message/i)
    await userEvent.type(input, 'test')
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(screen.getByText(/no routing rule/i)).toBeInTheDocument())
  })

  it('NetworkError: shows request failed error', async () => {
    const mock = fn().mockRejectedValue(new Error('Failed to fetch'))

    render(<TestConsole channelId="ch_preview" channelName="Preview Bot" triggerTest={mock} />)

    const input = screen.getByPlaceholderText(/type a message/i)
    await userEvent.type(input, 'crash')
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(screen.getByText(/request failed/i)).toBeInTheDocument())
  })
})
