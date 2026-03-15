// STUB — NextAuth server adapter is not yet implemented.
//
// TODO: To implement this adapter:
// 1. Install: pnpm add next-auth
// 2. Create src/lib/auth/adapters/next-auth/auth-config.ts with your NextAuth config
//    (providers, callbacks, adapter, session strategy)
// 3. getSession(): import { auth } from './auth-config' (NextAuth v5)
//    or import { getServerSession } from 'next-auth'; getServerSession(authOptions) (v4)
// 4. Map session.user → AuthSession: user.id requires a session callback in your config
// 5. requireAuth(): call getSession(), redirect if null
// 6. Set NEXT_PUBLIC_AUTH_PROVIDER=next-auth in .env.local
// 7. Update src/app/(auth)/login and /signup pages to use NextAuth signIn()

import { redirect } from 'next/navigation'
import { NotImplementedError } from '../../contracts'
import type { AuthServerAdapter } from '../../contracts'
import type { AuthSession } from '../../types'

export const _typeCheck: AuthServerAdapter = { getSession, requireAuth }
void _typeCheck

export async function getSession(): Promise<AuthSession | null> {
  throw new NotImplementedError('next-auth', 'getSession')
}

export async function requireAuth(redirectTo = '/login'): Promise<AuthSession> {
  void redirectTo
  throw new NotImplementedError('next-auth', 'requireAuth')
  redirect(redirectTo) // unreachable — keeps TypeScript happy
}
