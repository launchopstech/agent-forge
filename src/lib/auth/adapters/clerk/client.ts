'use client'

// ONLY file allowed to import from @clerk/nextjs (client hooks)
import { useUser as useClerkUser } from '@clerk/nextjs'
import type { AuthClientAdapter } from '../../contracts'
import type { UseUserReturn } from '../../types'

export const _typeCheck: AuthClientAdapter = { useUser }
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
