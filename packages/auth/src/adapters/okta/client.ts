'use client'

// STUB — Okta client hook is not yet implemented.
//
// TODO: To implement this adapter:
// 1. Install: pnpm add @okta/okta-react
// 2. Import { useOktaAuth } from '@okta/okta-react'
// 3. Map authState → UseUserReturn:
//    - authState.isAuthenticated → isAuthenticated
//    - authState === null        → isLoading: true
//    - authState.idToken.claims  → user: { id: sub, email, name, avatarUrl: picture }

import { NotImplementedError } from '../../contracts'
import type { AuthClientAdapter } from '../../contracts'
import type { UseUserReturn } from '../../types'

export const _typeCheck: AuthClientAdapter = { useUser, getAccessToken }
void _typeCheck

export function useUser(): UseUserReturn {
  throw new NotImplementedError('okta', 'useUser')
}

export async function getAccessToken(): Promise<string | null> {
  throw new NotImplementedError('okta', 'getAccessToken')
}
