import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PublicChatWidget } from './PublicChatWidget'
import { streamPublicChat } from '@/features/agents/api/chat.api'

vi.mock('@/features/agents/api/chat.api', () => ({
  streamPublicChat: vi.fn(),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, string>) => {
    if (key === 'verifiedShareLink') return 'Verified share link'
    if (key === 'emptyState') return `Chat with ${values?.agentName}`
    if (key === 'inputPlaceholder') return `Message ${values?.agentName}`
    return key
  },
}))

async function* streamChunks(chunks: string[]) {
  for (const chunk of chunks) {
    yield chunk
  }
}

describe('PublicChatWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the welcome message as the first assistant message', () => {
    render(
      <PublicChatWidget
        agentId="agent-1"
        agentName="Public Bot"
        welcomeMessage="Hello from Public Bot"
        shareToken="share-token"
      />
    )

    expect(screen.getByText('Public Bot')).toBeInTheDocument()
    expect(screen.getByText('Hello from Public Bot')).toBeInTheDocument()
  })

  it('streams a public chat response with the share token', async () => {
    vi.mocked(streamPublicChat).mockReturnValue(streamChunks(['Hello ', 'there']))
    const user = userEvent.setup()

    render(
      <PublicChatWidget
        agentId="agent-1"
        agentName="Public Bot"
        welcomeMessage="Welcome"
        shareToken="share-token"
      />
    )

    await user.type(screen.getByPlaceholderText('Message Public Bot'), 'Hi')
    await user.click(screen.getByLabelText('Submit'))

    await waitFor(() => expect(screen.getByText('Hello there')).toBeInTheDocument())
    expect(streamPublicChat).toHaveBeenCalledWith(
      'agent-1',
      [
        { role: 'assistant', content: 'Welcome' },
        { role: 'user', content: 'Hi' },
      ],
      'share-token',
      expect.any(AbortSignal)
    )
  })

  it('shows an inline error when the stream request fails', async () => {
    vi.mocked(streamPublicChat).mockImplementation(async function* () {
      throw new Error('Chat error: 404')
    })
    const user = userEvent.setup()

    render(
      <PublicChatWidget
        agentId="agent-1"
        agentName="Public Bot"
        welcomeMessage={null}
        shareToken="bad-token"
      />
    )

    await user.type(screen.getByPlaceholderText('Message Public Bot'), 'Hi')
    await user.click(screen.getByLabelText('Submit'))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Chat error: 404'))
  })
})
