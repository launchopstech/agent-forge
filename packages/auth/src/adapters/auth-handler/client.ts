'use client'

// Auth Handler client adapter implementation.

import { useContext } from 'react'
import { AuthHandlerContext } from './context'
import type { AuthClientAdapter } from '../../contracts'
import type { UseUserReturn } from '../../types'

export const _typeCheck: AuthClientAdapter = { useUser, getAccessToken }
void _typeCheck

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
export async function getAccessToken(): Promise<string | null> {
  // Check if we have a token in sessionStorage
  const token = sessionStorage.getItem('forge_access_token')
  const expiresAtStr = sessionStorage.getItem('forge_token_expires_at')

  if (!token || !expiresAtStr) {
    // No token stored, try to refresh
    return refreshAccessToken()
  }

  const expiresAt = parseInt(expiresAtStr, 10)
  const now = Date.now()

  // Check if token is expired or expiring soon (within 1 minute)
  if (now >= expiresAt - 60 * 1000) {
    // Token expired or expiring soon, refresh it
    return refreshAccessToken()
  }

  return token
}

/**
 * Refreshes the access token by calling the refresh endpoint.
 * Updates sessionStorage with new token.
 */
async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Include cookies
    })

    if (!response.ok) {
      // Refresh failed - clear stored token and return null
      sessionStorage.removeItem('forge_access_token')
      sessionStorage.removeItem('forge_token_expires_at')
      return null
    }

    const data = await response.json()

    if (data.accessToken) {
      // Store new token
      sessionStorage.setItem('forge_access_token', data.accessToken)
      const expiresAt = Date.now() + data.expiresIn * 1000
      sessionStorage.setItem('forge_token_expires_at', expiresAt.toString())
      return data.accessToken
    }

    return null
  } catch (err) {
    console.error('[auth-handler] Failed to refresh token:', err)
    sessionStorage.removeItem('forge_access_token')
    sessionStorage.removeItem('forge_token_expires_at')
    return null
  }
}
