import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AuthHandlerContext } from '@forge/auth/src/adapters/auth-handler/context'
import { SessionWarningDialog } from './SessionWarningDialog'

// ── Controlled context decorator ─────────────────────────────────────────────
// SessionWarningDialog reads from AuthHandlerContext via useSessionStatus().
// We inject the context directly here rather than mounting a full provider.

type SessionStatus = 'loading' | 'active' | 'expiring' | 'expired'

function makeContextValue(status: SessionStatus, minutesRemaining: number | null) {
  const tokenExpiresAt = minutesRemaining !== null ? Date.now() + minutesRemaining * 60_000 : null

  return {
    session: null,
    isLoading: status === 'loading',
    sessionStatus: status,
    tokenExpiresAt,
    refreshSession: async () => {
      await new Promise((r) => setTimeout(r, 800))
      return true
    },
    signOut: async () => {
      await new Promise((r) => setTimeout(r, 400))
    },
  }
}

interface StoryProps {
  status: SessionStatus
  minutesRemaining: number | null
}

function SessionWarningDialogHarness({ status, minutesRemaining }: StoryProps) {
  return (
    <AuthHandlerContext.Provider value={makeContextValue(status, minutesRemaining)}>
      <SessionWarningDialog />
    </AuthHandlerContext.Provider>
  )
}

const meta = {
  title: 'Features/Auth/SessionWarningDialog',
  component: SessionWarningDialogHarness,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Modal warning shown when the session is about to expire (auth-handler adapter only). ' +
          'Renders nothing when status is "active" or "loading".',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['loading', 'active', 'expiring', 'expired'],
    },
    minutesRemaining: { control: 'number' },
  },
} satisfies Meta<typeof SessionWarningDialogHarness>

export default meta
type Story = StoryObj<typeof meta>

/** Dialog is hidden — user's session is healthy. */
export const Active: Story = {
  args: { status: 'active', minutesRemaining: 10 },
}

/** Dialog is open — session expiring in 2 minutes due to inactivity. */
export const Expiring: Story = {
  args: { status: 'expiring', minutesRemaining: 2 },
}

/** Edge case — less than 1 minute remaining. */
export const ExpiringImminent: Story = {
  args: { status: 'expiring', minutesRemaining: 0 },
}
