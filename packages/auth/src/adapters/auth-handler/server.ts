// Server-only module. Never import 'use client' files here.
// Auth Handler server adapter implementation.

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { unsealCookie } from '../../utils/cookies'
import { decodeSession, isExpired } from '../../utils/session'
import type { SessionData } from '../../utils/session'
import type { AuthServerAdapter } from '../../contracts'
import type { AuthSession } from '../../types'

export const _typeCheck: AuthServerAdapter = { getSession, requireAuth }
void _typeCheck

/**
 * Retrieves the current authenticated session from the encrypted session cookie.
 * Returns null if no session exists, cookie is invalid, or session is expired.
 */
export async function getSession(): Promise<AuthSession | null> {
  const sessionSecret = process.env.AUTH_HANDLER_SESSION_SECRET

  if (!sessionSecret) {
    console.error('[auth-handler] AUTH_HANDLER_SESSION_SECRET not configured')
    return null
  }

  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('forge_session')

    if (!sessionCookie?.value) {
      return null
    }

    // Unseal and validate session
    const sessionData = await unsealCookie<SessionData>(sessionCookie.value, sessionSecret)

    // Check expiry
    if (isExpired(sessionData)) {
      return null
    }

    // Decode to AuthSession
    return decodeSession(sessionData)
  } catch (err) {
    console.error('[auth-handler] Failed to get session:', err)
    return null
  }
}

/**
 * Requires authentication, redirecting to login if no valid session exists.
 * Use in Server Components and route handlers to protect pages.
 *
 * @param redirectTo - URL to redirect to if not authenticated (default: /login)
 * @returns AuthSession if authenticated
 * @throws Redirects to login page if not authenticated
 */
export async function requireAuth(redirectTo = '/login'): Promise<AuthSession> {
  const session = await getSession()

  if (!session) {
    redirect(redirectTo)
  }

  return session
}
