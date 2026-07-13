'use client'

// Auth Handler client adapter implementation.

import { useContext, useEffect, useState } from 'react'
import { AuthHandlerContext } from './context'
import type { AuthClientAdapter } from '../../contracts'
import type { UseUserReturn } from '../../types'

export const _typeCheck: AuthClientAdapter = { useUser, getAccessToken }
void _typeCheck

/**
 * Returns the current session lifecycle status and actions.
 * Auth-handler specific — only works inside AuthHandlerProvider.
 */
export function useSessionStatus() {
  const context = useContext(AuthHandlerContext)

  if (!context) {
    throw new Error('useSessionStatus must be used within AuthHandlerProvider')
  }

  // Compute minutesRemaining in an effect + interval so Date.now() is never
  // called during render (React purity rule: components must be idempotent).
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null)

  useEffect(() => {
    const compute = () => {
      if (!context.tokenExpiresAt) {
        setMinutesRemaining(null)
        return
      }
      setMinutesRemaining(Math.max(0, Math.floor((context.tokenExpiresAt - Date.now()) / 60_000)))
    }
    compute()
    const id = setInterval(compute, 60_000)
    return () => clearInterval(id)
  }, [context.tokenExpiresAt])

  return {
    status: context.sessionStatus,
    minutesRemaining,
    stayLoggedIn: context.refreshSession,
    signOut: context.signOut,
  }
}

/**
 * Hook to access current user session state.
 * Reads from React Context provided by AuthHandlerProvider.
 */
export function useUser(): UseUserReturn {
  const context = useContext(AuthHandlerContext)

  if (!context) {
    throw new Error('useUser must be used within AuthHandlerProvider')
  }

  return {
    user: context.session?.user ?? null,
    isLoading: context.isLoading,
    isAuthenticated: !!context.session,
  }
}

/**
 * Gets the access token from sessionStorage.
 * If token is expired or missing, triggers a refresh.
 *
 * @returns Access token string or null if not authenticated
 */
// ── Safe sessionStorage helpers (iOS Safari Private Mode guard) ─────────────
// sessionStorage.getItem/setItem throws SecurityError in iOS Safari Private mode.
function safeSessionGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}
function safeSessionSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value)
  } catch {
    /* unavailable */
  }
}
function safeSessionRemove(key: string): void {
  try {
    sessionStorage.removeItem(key)
  } catch {
    /* unavailable */
  }
}

export async function getAccessToken(): Promise<string | null> {
  // Check if we have a token in sessionStorage
  const token = safeSessionGet('forge_access_token')
  const expiresAtStr = safeSessionGet('forge_token_expires_at')

  if (!token || !expiresAtStr) {
    // No token stored, try to refresh
    return refreshAccessToken()
  }

  const expiresAt = parseInt(expiresAtStr, 10)
  const now = Date.now()

  // Check if token is expired or expiring soon (within 5 minutes)
  if (now >= expiresAt - 5 * 60 * 1000) {
    // Token expired or expiring soon, refresh it
    return refreshAccessToken()
  }

  return token
}

// Singleton promise — concurrent callers wait for the same in-flight refresh
// instead of each firing a separate POST /api/auth/refresh.
let _refreshInFlight: Promise<string | null> | null = null

/**
 * Refreshes the access token by calling the refresh endpoint.
 * Updates sessionStorage with new token.
 * Deduplicates concurrent calls so only one network request is made.
 */
async function refreshAccessToken(): Promise<string | null> {
  if (_refreshInFlight) return _refreshInFlight

  _refreshInFlight = (async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        safeSessionRemove('forge_access_token')
        safeSessionRemove('forge_token_expires_at')
        return null
      }

      const data = await response.json()

      if (data.accessToken) {
        safeSessionSet('forge_access_token', data.accessToken)
        const expiresAt = Date.now() + data.expiresIn * 1000
        safeSessionSet('forge_token_expires_at', expiresAt.toString())
        return data.accessToken as string
      }

      return null
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[auth-handler] Failed to refresh token:', err)
      safeSessionRemove('forge_access_token')
      safeSessionRemove('forge_token_expires_at')
      return null
    } finally {
      _refreshInFlight = null
    }
  })()

  return _refreshInFlight
}
