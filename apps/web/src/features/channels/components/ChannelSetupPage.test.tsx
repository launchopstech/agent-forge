import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { fetchAgents } from '@/features/agents/api/agents.api'
import { fetchChannel } from '../api/channels.api'
import type { WorkspaceChannel } from '../types'
import { ChannelSetupPage } from './ChannelSetupPage'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <span data-testid="icon-back" />,
  Code2: () => <span data-testid="icon-code" />,
  Settings: () => <span data-testid="icon-settings" />,
  Zap: () => <span data-testid="icon-zap" />,
}))

vi.mock('@forge/ui/src/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}))

vi.mock('../api/channels.api', () => ({
  fetchChannel: vi.fn(),
}))

vi.mock('@/features/agents/api/agents.api', () => ({
  fetchAgents: vi.fn(),
}))

vi.mock('./RoutingRulesEditor', () => ({
  RoutingRulesEditor: () => <div data-testid="routing-editor" />,
}))

vi.mock('./TestConsole', () => ({
  TestConsole: () => <div data-testid="test-console" />,
}))

vi.mock('./EmbedSection', () => ({
  EmbedSection: () => <div data-testid="embed-section" />,
}))

function makeChannel(overrides: Partial<WorkspaceChannel> = {}): WorkspaceChannel {
  return {
    id: 'ch_1',
    orgId: 'org_123',
    channelType: 'test',
    name: 'Support Channel',
    config: {},
    webhookSecret: null,
    status: 'active',
    workspaceInstructions: null,
    createdAt: '2026-05-19T00:00:00.000Z',
    updatedAt: '2026-05-19T00:00:00.000Z',
    ...overrides,
  }
}

describe('ChannelSetupPage tabs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetchAgents).mockResolvedValue({ data: [], page: 1, pageSize: 100, total: 0 })
  })

  it('opens the embed panel by default for website channels', async () => {
    vi.mocked(fetchChannel).mockResolvedValue(makeChannel({ channelType: 'website' }))

    render(<ChannelSetupPage channelId="ch_1" />)

    await waitFor(() => expect(screen.getByText('Support Channel')).toBeInTheDocument())
    expect(screen.getByRole('button', { name: /embed/i })).toBeInTheDocument()
    expect(screen.getByTestId('embed-section')).toBeInTheDocument()
    expect(screen.queryByTestId('routing-editor')).not.toBeInTheDocument()
  })

  it('hides the embed tab for non-website channels', async () => {
    vi.mocked(fetchChannel).mockResolvedValue(makeChannel({ channelType: 'test' }))

    render(<ChannelSetupPage channelId="ch_1" />)

    await waitFor(() => expect(screen.getByText('Support Channel')).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: /embed/i })).not.toBeInTheDocument()
  })
})
