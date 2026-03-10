'use client'

// STUB — NextAuth SessionProvider is not yet implemented.
//
// TODO: To implement this adapter:
// 1. Import { SessionProvider } from 'next-auth/react'
// 2. Replace the throw below with: return <SessionProvider>{children}</SessionProvider>
// 3. For NextAuth v5 App Router, SessionProvider may need a `session` prop
//    passed from the root layout via the server-side auth() call.

import { NotImplementedError } from '../../contracts'
import type { AuthProviderComponent } from '../../contracts'

export const _typeCheck: AuthProviderComponent = NextAuthProvider
void _typeCheck

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  throw new NotImplementedError('next-auth', 'NextAuthProvider')
  return <>{children}</> // unreachable — keeps TypeScript happy
}
