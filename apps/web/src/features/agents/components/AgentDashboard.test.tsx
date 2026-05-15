import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import React from 'react'

// ── Heavy dependency mocks ──────────────────────────────────────────────────

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('lucide-react', () => ({
  Plus: () => null,
  AlertCircle: () => null,
  RefreshCw: () => null,
}))

vi.mock('@forge/ui/src/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}))

vi.mock('@forge/ui/src/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

vi.mock('@forge/ui/src/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}))

vi.mock('@forge/ui/src/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => null,
}))

vi.mock('@/config', () => ({
  siteConfig: { name: 'TestApp', nameAccent: 'App', workspaceName: 'Test Workspace' },
}))

vi.mock('./MetricsGrid', () => ({ MetricsGrid: () => <div data-testid="metrics-grid" /> }))
vi.mock('./AgentTable', () => ({ AgentTable: () => <div data-testid="agent-table" /> }))
vi.mock('./UnresolvedIntents', () => ({ UnresolvedIntents: () => <div data-testid="intents" /> }))

// ── Controlled mocks for the two behaviours under test ──────────────────────

const mockUseUser = vi.fn()
vi.mock('@/hooks/use-user', () => ({
  useUser: () => mockUseUser(),
}))

vi.mock('../api/agent-types.api', () => ({
  fetchAgentTypes: vi.fn().mockResolvedValue([]),
}))

const mockLoadAll = vi.fn().mockResolvedValue(undefined)
vi.mock('../store/agent-list.store', () => ({
  useAgentListStore: () => ({
    agents: [],
    metrics: null,
    unresolvedIntents: [],
    recommendation: null,
    isLoading: false,
    error: null,
    page: 1,
    pageSize: 10,
    total: 0,
    search: '',
    statusFilter: null,
    agentTypeFilter: null,
    loadAll: mockLoadAll,
    removeAgent: vi.fn(),
    setPage: vi.fn(),
    setSearch: vi.fn(),
    setStatusFilter: vi.fn(),
    setAgentTypeFilter: vi.fn(),
  }),
}))

// ── Tests ───────────────────────────────────────────────────────────────────

import { AgentDashboard } from './AgentDashboard'

describe('AgentDashboard — auth-ready gate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does NOT call loadAll while auth is still loading', async () => {
    mockUseUser.mockReturnValue({ isLoading: true, isAuthenticated: false })

    render(<AgentDashboard />)

    // Give the effect time to potentially fire
    await waitFor(() => expect(mockLoadAll).not.toHaveBeenCalled(), { timeout: 200 })
  })

  it('calls loadAll when auth is ready even if user is not authenticated (provider handles redirect)', async () => {
    // isAuthenticated guard was removed — the provider keeps isLoading=true until
    // session is confirmed, so by the time authLoading flips to false, signOut()
    // has already been called for unauthenticated users (redirecting to /login).
    // loadAll() firing here is expected; the 401 from the API triggers redirect401().
    mockUseUser.mockReturnValue({ isLoading: false, isAuthenticated: false })

    render(<AgentDashboard />)

    await waitFor(() => expect(mockLoadAll).toHaveBeenCalledOnce())
  })

  it('calls loadAll once auth is ready and user is authenticated', async () => {
    mockUseUser.mockReturnValue({ isLoading: false, isAuthenticated: true })

    render(<AgentDashboard />)

    await waitFor(() => expect(mockLoadAll).toHaveBeenCalledOnce())
  })

  it('calls loadAll when auth transitions from loading to authenticated', async () => {
    // Phase 1: auth loading — loadAll must NOT fire
    mockUseUser.mockReturnValue({ isLoading: true, isAuthenticated: false })
    const { unmount } = render(<AgentDashboard />)
    expect(mockLoadAll).not.toHaveBeenCalled()
    unmount()

    // Phase 2: auth resolves — fresh mount with authenticated state
    // (React.memo blocks prop-identical rerenders with module-level mocks;
    //  unmount+remount correctly simulates the post-auth-ready lifecycle)
    mockUseUser.mockReturnValue({ isLoading: false, isAuthenticated: true })
    render(<AgentDashboard />)

    await waitFor(() => expect(mockLoadAll).toHaveBeenCalledOnce())
  })
})
