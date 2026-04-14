'use client'

// ONLY file allowed to import from @clerk/nextjs (client hooks)
import { useUser as useClerkUser, useAuth } from '@clerk/nextjs'
import type { AuthClientAdapter } from '../../contracts'
import type { UseUserReturn } from '../../types'

export const _typeCheck: AuthClientAdapter = { useUser, getAccessToken }
void _typeCheck

export function useUser(): UseUserReturn {
  const { user, isLoaded } = useClerkUser()

  return {
    user: user
      ? {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress ?? null,
          name: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
          avatarUrl: user.imageUrl ?? null,
        }
      : null,
    isLoading: !isLoaded,
    isAuthenticated: !!user,
  }
}

export async function getAccessToken(): Promise<string | null> {
  // Clerk uses useAuth hook to get token, but this needs to be called from within a component
  // For now, return null - Clerk handles auth via cookies
  // TODO: Implement proper token management if needed for API calls
  return null
}
