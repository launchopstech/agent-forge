import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import React from 'react'

// ── Dependency mocks ────────────────────────────────────────────────────────

const pushMock = vi.hoisted(() => vi.fn())

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('lucide-react', () => ({
  Plus: () => <span data-testid="icon-plus">+</span>,
  Radio: () => <span data-testid="icon-radio">📡</span>,
  ExternalLink: () => <span data-testid="icon-external">↗</span>,
  Code2: () => <span data-testid="icon-code">&lt;/&gt;</span>,
  Trash2: () => <span data-testid="icon-trash">🗑</span>,
  AlertCircle: () => <span data-testid="icon-alert">⚠</span>,
}))

vi.mock('@forge/ui/src/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    className?: string
  }) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}))

vi.mock('@forge/ui/src/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="badge">{children}</span>
  ),
}))

vi.mock('@forge/ui/src/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}))

vi.mock('@forge/ui/src/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-footer">{children}</div>
  ),
}))

vi.mock('@forge/ui/src/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

vi.mock('@forge/ui/src/label', () => ({
  Label: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
}))

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}))

// ── API mocks ───────────────────────────────────────────────────────────────

vi.mock('../api/channels.api', () => ({
  fetchChannels: vi.fn(),
  fetchChannelCatalog: vi.fn(),
  createChannel: vi.fn(),
  deleteChannel: vi.fn(),
}))

import {
  fetchChannels,
  fetchChannelCatalog,
  createChannel,
  deleteChannel,
} from '../api/channels.api'
import { toast } from '@/hooks/use-toast'
import { ChannelsDashboard } from './ChannelsDashboard'
import type { WorkspaceChannel, ChannelCatalogItem } from '../types'

// ── Fixtures ────────────────────────────────────────────────────────────────

function makeChannel(overrides: Partial<WorkspaceChannel> = {}): WorkspaceChannel {
  return {
    id: 'ch_1',
    orgId: 'org_test',
    channelType: 'test',
    name: 'Dev Test',
    status: 'active',
    config: {},
    webhookSecret: null,
    workspaceInstructions: null,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    ...overrides,
  }
}

const testCatalogItem: ChannelCatalogItem = {
  type: 'test',
  name: 'Test',
  iconSlug: 'test',
  capabilities: ['chat'],
  configSchema: {},
  setupInstructions: 'No config needed.',
}

const websiteCatalogItem: ChannelCatalogItem = {
  type: 'website',
  name: 'Website Widget',
  iconSlug: 'globe',
  capabilities: ['send', 'receive'],
  configSchema: {},
  setupInstructions: 'Add the embed snippet to your website.',
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('ChannelsDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetchChannelCatalog).mockResolvedValue([testCatalogItem, websiteCatalogItem])
  })

  // CD1 ─ Loading state ────────────────────────────────────────────────────────
  it('CD1: shows skeleton cards while loading', () => {
    // Never resolves during this test
    vi.mocked(fetchChannels).mockReturnValue(new Promise(() => {}))

    render(<ChannelsDashboard />)

    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThanOrEqual(1)
  })

  // CD2 ─ Empty state ──────────────────────────────────────────────────────────
  it('CD2: shows empty state when there are no channels', async () => {
    vi.mocked(fetchChannels).mockResolvedValue([])

    render(<ChannelsDashboard />)

    await waitFor(() => expect(screen.getByText(/no channels connected yet/i)).toBeInTheDocument())
  })

  // CD3 ─ Channel cards rendered ───────────────────────────────────────────────
  it('CD3: renders a channel card for each channel returned', async () => {
    const channels = [
      makeChannel({ id: 'ch_1', name: 'Alpha' }),
      makeChannel({ id: 'ch_2', name: 'Beta' }),
    ]
    vi.mocked(fetchChannels).mockResolvedValue(channels)

    render(<ChannelsDashboard />)

    await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument())
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('shows an Embed action for website channels', async () => {
    vi.mocked(fetchChannels).mockResolvedValue([
      makeChannel({ id: 'ch_site', channelType: 'website', name: 'Website Support' }),
    ])

    render(<ChannelsDashboard />)

    await waitFor(() => expect(screen.getByText('Website Support')).toBeInTheDocument())
    const embedLink = screen.getByRole('link', { name: /embed/i })
    expect(embedLink).toHaveAttribute('href', '/dashboard/channels/website/setup?id=ch_site')
    expect(screen.queryByRole('link', { name: /open/i })).not.toBeInTheDocument()
  })

  // CD4 ─ Status badge ─────────────────────────────────────────────────────────
  it('CD4: displays the channel status on each card', async () => {
    vi.mocked(fetchChannels).mockResolvedValue([
      makeChannel({ status: 'active' }),
      makeChannel({ id: 'ch_2', status: 'paused' }),
    ])

    render(<ChannelsDashboard />)

    await waitFor(() => expect(screen.getByText('active')).toBeInTheDocument())
    expect(screen.getByText('paused')).toBeInTheDocument()
  })

  // CD5 ─ Delete channel ───────────────────────────────────────────────────────
  it('CD5: removes channel card after delete is confirmed', async () => {
    vi.mocked(fetchChannels).mockResolvedValue([makeChannel({ name: 'ToDelete' })])
    vi.mocked(deleteChannel).mockResolvedValue()

    render(<ChannelsDashboard />)

    await waitFor(() => expect(screen.getByText('ToDelete')).toBeInTheDocument())

    const deleteBtn = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteBtn)

    await waitFor(() => expect(screen.queryByText('ToDelete')).not.toBeInTheDocument())
    expect(deleteChannel).toHaveBeenCalledWith('ch_1')
  })

  // CD6 ─ Error state ──────────────────────────────────────────────────────────
  it('CD6: shows error message when fetch fails', async () => {
    vi.mocked(fetchChannels).mockRejectedValue(new Error('Network error'))

    render(<ChannelsDashboard />)

    await waitFor(() => expect(screen.getByText(/failed to load channels/i)).toBeInTheDocument())
  })

  // CD7 ─ Opens add channel modal ──────────────────────────────────────────────
  it('CD7: opens the create modal when Connect Channel is clicked', async () => {
    vi.mocked(fetchChannels).mockResolvedValue([])

    render(<ChannelsDashboard />)

    await waitFor(() => expect(screen.getByText(/no channels connected yet/i)).toBeInTheDocument())

    // The Connect Channel button in the header
    const connectBtn = screen.getAllByText(/connect channel/i)[0]
    fireEvent.click(connectBtn!)

    await waitFor(() => expect(screen.getByTestId('dialog')).toBeInTheDocument())
    expect(screen.getByText(/choose a channel type/i)).toBeInTheDocument()
  })

  // CD8 ─ Successful channel creation ─────────────────────────────────────────
  it('CD8: new channel card appears after creation in modal', async () => {
    vi.mocked(fetchChannels).mockResolvedValue([])
    const newChannel = makeChannel({ id: 'ch_new', name: 'My Test' })
    vi.mocked(createChannel).mockResolvedValue(newChannel)

    render(<ChannelsDashboard />)

    await waitFor(() => expect(screen.getByText(/no channels connected yet/i)).toBeInTheDocument())

    // Open modal
    fireEvent.click(screen.getAllByText(/connect channel/i)[0]!)
    await waitFor(() => expect(screen.getByTestId('dialog')).toBeInTheDocument())

    // Pick Test type
    fireEvent.click(screen.getByText('Test'))

    // Confirm creation
    await waitFor(() => expect(screen.getByText(/create channel/i)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/create channel/i))

    await waitFor(() => expect(screen.getByText('My Test')).toBeInTheDocument())
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringContaining('created') })
    )
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('routes directly to embed setup after creating a website channel', async () => {
    vi.mocked(fetchChannels).mockResolvedValue([])
    const newChannel = makeChannel({
      id: 'ch_site',
      channelType: 'website',
      name: 'My Website Widget',
    })
    vi.mocked(createChannel).mockResolvedValue(newChannel)

    render(<ChannelsDashboard />)

    await waitFor(() => expect(screen.getByText(/no channels connected yet/i)).toBeInTheDocument())

    fireEvent.click(screen.getAllByText(/connect channel/i)[0]!)
    await waitFor(() => expect(screen.getByTestId('dialog')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Website Widget'))
    await waitFor(() =>
      expect(screen.getByText(/configure the embed snippet/i)).toBeInTheDocument()
    )

    fireEvent.click(screen.getByText(/create channel/i))

    await waitFor(() =>
      expect(pushMock).toHaveBeenCalledWith('/dashboard/channels/website/setup?id=ch_site')
    )
    expect(createChannel).toHaveBeenCalledWith({
      channelType: 'website',
      name: 'My Website Widget',
    })
    expect(screen.queryByText('My Website Widget')).not.toBeInTheDocument()
  })
})
