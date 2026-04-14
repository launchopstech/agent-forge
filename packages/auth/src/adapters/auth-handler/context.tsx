'use client'

/**
 * React Context for auth-handler session state.
 * Provides session to client components via useUser() hook.
 */

import { createContext } from 'react'
import type { AuthSession } from '../../types'

export interface AuthHandlerContextValue {
  session: AuthSession | null
  isLoading: boolean
}

export const AuthHandlerContext = createContext<AuthHandlerContextValue | null>(null)
