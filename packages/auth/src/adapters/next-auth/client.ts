'use client'

// STUB — NextAuth client hook is not yet implemented.
//
// TODO: To implement this adapter:
// 1. Import { useSession } from 'next-auth/react'
// 2. Map session.user → UseUserReturn:
//    - status === 'loading'       → isLoading: true
//    - status === 'authenticated' → isAuthenticated: true, user: { ... }
//    - session.user.id requires adding id to session callback in your NextAuth config
// 3. Remove the throw below and replace with real hook logic.

import { NotImplementedError } from '../../contracts'
import type { AuthClientAdapter } from '../../contracts'
import type { UseUserReturn } from '../../types'

export const _typeCheck: AuthClientAdapter = { useUser, getAccessToken }
void _typeCheck

export function useUser(): UseUserReturn {
  throw new NotImplementedError('next-auth', 'useUser')
}

export async function getAccessToken(): Promise<string | null> {
  throw new NotImplementedError('next-auth', 'getAccessToken')
}
