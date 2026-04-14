'use client'

/**
 * Auth Handler provider — client component that wraps app in session context.
 * Fetches initial session server-side via Server Component wrapper (provider-server.tsx).
 */

import { useState, useEffect } from 'react'
import { AuthHandlerContext } from './context'
import type { AuthProviderComponent } from '../../contracts'
import type { AuthSession } from '../../types'

export const AuthHandlerProvider: AuthProviderComponent = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch initial session from server endpoint
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include', // Include cookies
        })

        if (response.ok) {
          const data = await response.json()
          setSession(data.session ?? null)
        } else {
          setSession(null)
        }
      } catch (err) {
        console.error('[auth-handler] Failed to fetch session:', err)
        setSession(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()
  }, [])

  return (
    <AuthHandlerContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthHandlerContext.Provider>
  )
}
