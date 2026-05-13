import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BuilderNav } from './BuilderNav'
import { useAgentBuilderStore } from '../store/agent-builder.store'
import type { AgentStatus } from '../types'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  toast: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('@/hooks/use-toast', () => ({
  toast: (...args: unknown[]) => mocks.toast(...args),
}))

vi.mock('@/config', () => ({
  siteConfig: { url: 'https://app.example.com' },
}))

vi.mock('@forge/ui/src/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const publishAgent = vi.fn()
const pauseAgent = vi.fn()
const resumeAgent = vi.fn()

function arrange(status: AgentStatus | null, options: { isSaving?: boolean } = {}) {
  useAgentBuilderStore.getState().resetDraft()
  publishAgent.mockResolvedValue(undefined)
  pauseAgent.mockResolvedValue(undefined)
  resumeAgent.mockResolvedValue(undefined)
  useAgentBuilderStore.setState({
    agentId: status ? 'agent-123' : null,
    agentStatus: status,
    agentShareToken: status === 'live' ? 'share-token-123' : null,
    activeSection: 'identity',
    completedSections: [],
    isSaving: options.isSaving ?? false,
    publishAgent,
    pauseAgent,
    resumeAgent,
  })
}

describe('BuilderNav publish flow controls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('publishes draft agents', async () => {
    arrange('draft')
    render(<BuilderNav agentId="agent-123" />)

    await userEvent.click(screen.getAllByRole('button', { name: /publish/i })[0]!)

    expect(publishAgent).toHaveBeenCalledOnce()
    await waitFor(() => expect(mocks.toast).toHaveBeenCalledWith({ title: 'publishSuccess' }))
  })

  it('pauses live agents and shows the copyable share URL', async () => {
    arrange('live')
    render(<BuilderNav agentId="agent-123" />)

    expect(
      screen.getAllByText('https://app.example.com/chat/agent-123?token=share-token-123')
    ).toHaveLength(1)

    await userEvent.click(screen.getAllByRole('button', { name: /pause/i })[0]!)
    expect(pauseAgent).toHaveBeenCalledOnce()
    await waitFor(() => expect(mocks.toast).toHaveBeenCalledWith({ title: 'pauseSuccess' }))

    await userEvent.click(screen.getAllByLabelText('copyShareLink')[0]!)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'https://app.example.com/chat/agent-123?token=share-token-123'
    )
  })

  it('does not show the share URL for live agents missing a share token', () => {
    arrange('live')
    useAgentBuilderStore.setState({ agentShareToken: null })
    render(<BuilderNav agentId="agent-123" />)

    expect(screen.queryByLabelText('copyShareLink')).not.toBeInTheDocument()
    expect(
      screen.queryByText(/https:\/\/app\.example\.com\/chat\/agent-123/)
    ).not.toBeInTheDocument()
  })

  it('resumes paused agents', async () => {
    arrange('paused')
    render(<BuilderNav agentId="agent-123" />)

    await userEvent.click(screen.getAllByRole('button', { name: /resume/i })[0]!)

    expect(resumeAgent).toHaveBeenCalledOnce()
    await waitFor(() => expect(mocks.toast).toHaveBeenCalledWith({ title: 'resumeSuccess' }))
  })

  it('disables status controls while saving', () => {
    arrange('draft', { isSaving: true })
    render(<BuilderNav agentId="agent-123" />)

    const buttons = screen.getAllByRole('button', { name: /saving/i })
    expect(buttons).toHaveLength(2)
    expect(buttons.every((button) => button.hasAttribute('disabled'))).toBe(true)
  })

  it('does not render status controls for unsaved agents', () => {
    arrange(null)
    render(<BuilderNav agentId="new" />)

    expect(screen.queryByRole('button', { name: /publish/i })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('copyShareLink')).not.toBeInTheDocument()
  })
})
