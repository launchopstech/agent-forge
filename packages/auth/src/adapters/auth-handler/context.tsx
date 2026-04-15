'use client'

/**
 * React Context for auth-handler session state.
 * Provides session, token lifecycle status, and session actions to client components.
 */

import { createContext } from 'react'
import type { AuthSession } from '../../types'

/** Lifecycle state of the current session. */
export type SessionStatus = 'loading' | 'active' | 'expiring' | 'expired'

export interface AuthHandlerContextValue {
  session: AuthSession | null
  isLoading: boolean
  /** Current session lifecycle phase. */
  sessionStatus: SessionStatus
  /** ms-epoch expiry of the access token read from sessionStorage. null while loading. */
  tokenExpiresAt: number | null
  /**
   * Silently refresh the access token.
   * Resolves true when a new token is stored, false when refresh fails (user will be signed out).
   */
  refreshSession: () => Promise<boolean>
  /** Clear session state, call the logout endpoint, and redirect to /login. */
  signOut: () => Promise<void>
}

export const AuthHandlerContext = createContext<AuthHandlerContextValue | null>(null)
