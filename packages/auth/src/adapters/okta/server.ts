// STUB — Okta server adapter is not yet implemented.
//
// TODO: To implement this adapter:
// 1. Install: pnpm add @okta/okta-auth-js @okta/jwt-verifier
// 2. Configure with env vars: OKTA_DOMAIN, OKTA_CLIENT_ID, OKTA_CLIENT_SECRET
// 3. getSession(): Verify the JWT from the request cookie/header using
//    OktaJwtVerifier.verifyIdToken(), then map claims to AuthSession:
//    - sub → id
//    - email → email
//    - name → name
//    - picture → avatarUrl
// 4. requireAuth(): call getSession(), redirect if null
// 5. Set NEXT_PUBLIC_AUTH_PROVIDER=okta in .env.local
// 6. Update src/app/(auth)/login and /signup pages to use Okta redirect flow

import { redirect } from 'next/navigation'
import { NotImplementedError } from '../../contracts'
import type { AuthServerAdapter } from '../../contracts'
import type { AuthSession } from '../../types'

export const _typeCheck: AuthServerAdapter = { getSession, requireAuth }
void _typeCheck

export async function getSession(): Promise<AuthSession | null> {
  throw new NotImplementedError('okta', 'getSession')
}

export async function requireAuth(redirectTo = '/login'): Promise<AuthSession> {
  void redirectTo
  throw new NotImplementedError('okta', 'requireAuth')
  redirect(redirectTo) // unreachable — keeps TypeScript happy
}
