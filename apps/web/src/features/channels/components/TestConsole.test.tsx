import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import React from 'react'

// ── Dependency mocks ────────────────────────────────────────────────────────

vi.mock('lucide-react', () => ({
  Send: () => <span data-testid="icon-send">▶</span>,
  Trash2: () => <span data-testid="icon-trash">🗑</span>,
  Bot: () => <span data-testid="icon-bot">🤖</span>,
  User: () => <span data-testid="icon-user">👤</span>,
}))

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
  Input: ({
    value,
    onChange,
    onKeyDown,
    placeholder,
    disabled,
    className,
  }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      data-testid="console-input"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  ),
}))

// ── API mock ────────────────────────────────────────────────────────────────

vi.mock('../api/channels.api', () => ({
  triggerTest: vi.fn(),
}))

import { triggerTest } from '../api/channels.api'
import { TestConsole } from './TestConsole'

// ── Tests ────────────────────────────────────────────────────────────────────

describe('TestConsole', () => {
  const CHANNEL_ID = 'ch_test_123'
  const CHANNEL_NAME = 'Dev Bot'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // TC1 ─ Renders channel name ─────────────────────────────────────────────────
  it('TC1: renders the channel name in the header', () => {
    render(<TestConsole channelId={CHANNEL_ID} channelName={CHANNEL_NAME} />)
    expect(screen.getByText(/Dev Bot/)).toBeInTheDocument()
  })

  // TC2 ─ User message appears immediately ────────────────────────────────────
  it('TC2: user message appears in the chat immediately on send', async () => {
    vi.mocked(triggerTest).mockResolvedValue({
      ok: true,
      reply: 'Hello from the bot',
      conversationId: 'conv_abc',
    })

    render(<TestConsole channelId={CHANNEL_ID} />)

    const input = screen.getByTestId('console-input')
    fireEvent.change(input, { target: { value: 'Hi there' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    // User message should appear before API resolves
    expect(screen.getByText('Hi there')).toBeInTheDocument()
  })

  // TC3 ─ Assistant reply appears ─────────────────────────────────────────────
  it('TC3: assistant reply appears after triggerTest resolves', async () => {
    vi.mocked(triggerTest).mockResolvedValue({
      ok: true,
      reply: 'Hello from the bot',
      conversationId: 'conv_abc',
    })

    render(<TestConsole channelId={CHANNEL_ID} />)

    fireEvent.change(screen.getByTestId('console-input'), { target: { value: 'test msg' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(screen.getByText('Hello from the bot')).toBeInTheDocument())
    expect(triggerTest).toHaveBeenCalledWith(CHANNEL_ID, {
      text: 'test msg',
      fromId: expect.any(String),
    })
  })

  // TC4 ─ ok:false shows inline error ─────────────────────────────────────────
  it('TC4: shows error message when triggerTest returns ok:false', async () => {
    vi.mocked(triggerTest).mockResolvedValue({
      ok: false,
      reason: 'No routing rule matched',
    })

    render(<TestConsole channelId={CHANNEL_ID} />)

    fireEvent.change(screen.getByTestId('console-input'), { target: { value: 'hello' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(screen.getByText(/no routing rule matched/i)).toBeInTheDocument())
  })

  // TC5 ─ Network error shows fallback error ───────────────────────────────────
  it('TC5: shows fallback error when triggerTest throws', async () => {
    vi.mocked(triggerTest).mockRejectedValue(new Error('Network error'))

    render(<TestConsole channelId={CHANNEL_ID} />)

    fireEvent.change(screen.getByTestId('console-input'), { target: { value: 'fail me' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(screen.getByText(/request failed/i)).toBeInTheDocument())
  })

  // TC6 ─ Clear button empties messages ────────────────────────────────────────
  it('TC6: Clear button removes all messages from the view', async () => {
    vi.mocked(triggerTest).mockResolvedValue({ ok: true, reply: 'OK', conversationId: 'c1' })

    render(<TestConsole channelId={CHANNEL_ID} />)

    // Send a message first
    fireEvent.change(screen.getByTestId('console-input'), { target: { value: 'hi' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => expect(screen.getByText('OK')).toBeInTheDocument())

    // Clear
    fireEvent.click(screen.getByText(/clear/i))

    expect(screen.queryByText('hi')).not.toBeInTheDocument()
    expect(screen.queryByText('OK')).not.toBeInTheDocument()
    // Empty state should reappear
    expect(screen.getByText(/send a message to test/i)).toBeInTheDocument()
  })

  // TC7 ─ Input disabled while sending ─────────────────────────────────────────
  it('TC7: input and send button are disabled while a request is in flight', async () => {
    let resolve: (v: { ok: boolean; reply: string; conversationId: string }) => void
    vi.mocked(triggerTest).mockReturnValue(
      new Promise((res) => {
        resolve = res as typeof resolve
      })
    )

    render(<TestConsole channelId={CHANNEL_ID} />)

    fireEvent.change(screen.getByTestId('console-input'), { target: { value: 'sending…' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    // Both input and button should be disabled during loading
    await waitFor(() => {
      expect(screen.getByTestId('console-input')).toBeDisabled()
      expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
    })

    // Cleanup — resolve the promise so the test can teardown cleanly
    resolve!({ ok: true, reply: 'done', conversationId: 'c1' })
  })

  // TC8 ─ Enter key submits ─────────────────────────────────────────────────────
  it('TC8: pressing Enter submits the message', async () => {
    vi.mocked(triggerTest).mockResolvedValue({ ok: true, reply: 'entered', conversationId: 'c2' })

    render(<TestConsole channelId={CHANNEL_ID} />)

    const input = screen.getByTestId('console-input')
    fireEvent.change(input, { target: { value: 'enter msg' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 })

    await waitFor(() => expect(screen.getByText('entered')).toBeInTheDocument())
    expect(triggerTest).toHaveBeenCalledOnce()
  })

  // TC9 ─ Conversation ID shown after first reply ───────────────────────────────
  it('TC9: shows abbreviated conversation ID after first successful reply', async () => {
    vi.mocked(triggerTest).mockResolvedValue({
      ok: true,
      reply: 'sup',
      conversationId: 'conv_abcdef12345',
    })

    render(<TestConsole channelId={CHANNEL_ID} />)

    fireEvent.change(screen.getByTestId('console-input'), { target: { value: 'hey' } })
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(screen.getByText(/conv:/i)).toBeInTheDocument())
  })
})
