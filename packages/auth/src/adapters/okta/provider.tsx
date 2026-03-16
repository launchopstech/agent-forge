'use client'

// STUB — Okta Security provider is not yet implemented.
//
// TODO: To implement this adapter:
// 1. Install: pnpm add @okta/okta-react @okta/okta-auth-js
// 2. Create an OktaAuth instance with your OKTA_DOMAIN and OKTA_CLIENT_ID
// 3. Replace the throw below with:
//    import { Security } from '@okta/okta-react'
//    return <Security oktaAuth={oktaAuth} restoreOriginalUri={...}>{children}</Security>

import { NotImplementedError } from '../../contracts'
import type { AuthProviderComponent } from '../../contracts'

export const _typeCheck: AuthProviderComponent = OktaAuthProvider
void _typeCheck

export function OktaAuthProvider({ children }: { children: React.ReactNode }) {
  throw new NotImplementedError('okta', 'OktaAuthProvider')
  return <>{children}</> // unreachable — keeps TypeScript happy
}
