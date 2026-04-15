import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

// ── Heavy dependency mocks ──────────────────────────────────────────────────

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (params) return `${key}:${JSON.stringify(params)}`
    return key
  },
}))

vi.mock('@forge/ui/src/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open?: boolean }) =>
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
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="dialog-description">{children}</p>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-footer">{children}</div>
  ),
}))

vi.mock('@forge/ui/src/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
  }: {
    children: React.ReactNode
    onClick?: () => void
    variant?: string
  }) => (
    <button data-variant={variant} onClick={onClick}>
      {children}
    </button>
  ),
}))

// ── Controlled mock for useSessionStatus ─────────────────────────────────────

const mockStayLoggedIn = vi.fn()
const mockSignOut = vi.fn()
const mockUseSessionStatus = vi.fn()

vi.mock('@forge/auth/src/adapters/auth-handler/client', () => ({
  useSessionStatus: () => mockUseSessionStatus(),
}))

// ── Tests ────────────────────────────────────────────────────────────────────

import { SessionWarningDialog } from './SessionWarningDialog'

describe('SessionWarningDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStayLoggedIn.mockResolvedValue(true)
    mockSignOut.mockResolvedValue(undefined)
  })

  it('renders nothing when status is "active"', () => {
    mockUseSessionStatus.mockReturnValue({
      status: 'active',
      minutesRemaining: 10,
      stayLoggedIn: mockStayLoggedIn,
      signOut: mockSignOut,
    })

    render(<SessionWarningDialog />)

    expect(screen.queryByTestId('dialog')).toBeNull()
  })

  it('renders nothing when status is "loading"', () => {
    mockUseSessionStatus.mockReturnValue({
      status: 'loading',
      minutesRemaining: null,
      stayLoggedIn: mockStayLoggedIn,
      signOut: mockSignOut,
    })

    render(<SessionWarningDialog />)

    expect(screen.queryByTestId('dialog')).toBeNull()
  })

  it('shows dialog when status is "expiring"', () => {
    mockUseSessionStatus.mockReturnValue({
      status: 'expiring',
      minutesRemaining: 2,
      stayLoggedIn: mockStayLoggedIn,
      signOut: mockSignOut,
    })

    render(<SessionWarningDialog />)

    expect(screen.getByTestId('dialog')).toBeDefined()
    expect(screen.getByTestId('dialog-title').textContent).toBe('title')
    expect(screen.getByTestId('dialog-description').textContent).toContain('description')
  })

  it('"Stay logged in" calls stayLoggedIn and does NOT call signOut on success', async () => {
    mockUseSessionStatus.mockReturnValue({
      status: 'expiring',
      minutesRemaining: 2,
      stayLoggedIn: mockStayLoggedIn,
      signOut: mockSignOut,
    })
    mockStayLoggedIn.mockResolvedValue(true)

    render(<SessionWarningDialog />)

    fireEvent.click(screen.getByText('stayLoggedIn'))

    await waitFor(() => expect(mockStayLoggedIn).toHaveBeenCalledOnce())
    expect(mockSignOut).not.toHaveBeenCalled()
  })

  it('"Stay logged in" calls signOut when refresh fails', async () => {
    mockUseSessionStatus.mockReturnValue({
      status: 'expiring',
      minutesRemaining: 2,
      stayLoggedIn: mockStayLoggedIn,
      signOut: mockSignOut,
    })
    mockStayLoggedIn.mockResolvedValue(false)

    render(<SessionWarningDialog />)

    fireEvent.click(screen.getByText('stayLoggedIn'))

    await waitFor(() => expect(mockStayLoggedIn).toHaveBeenCalledOnce())
    await waitFor(() => expect(mockSignOut).toHaveBeenCalledOnce())
  })

  it('"Log out" button calls signOut immediately', async () => {
    mockUseSessionStatus.mockReturnValue({
      status: 'expiring',
      minutesRemaining: 1,
      stayLoggedIn: mockStayLoggedIn,
      signOut: mockSignOut,
    })

    render(<SessionWarningDialog />)

    fireEvent.click(screen.getByText('logOut'))

    await waitFor(() => expect(mockSignOut).toHaveBeenCalledOnce())
    expect(mockStayLoggedIn).not.toHaveBeenCalled()
  })
})
