// Server-only module. Never import 'use client' files here.
// This file must remain importable from Server Components and Edge Runtime.
import * as clerkAdapter from './adapters/clerk/server'
import * as nextAuthAdapter from './adapters/next-auth/server'
import * as oktaAdapter from './adapters/okta/server'
import { activeAuthProvider } from '@/config/properties'
import type { AuthServerAdapter } from './contracts'
import type { AuthSession } from './types'

function resolve(): AuthServerAdapter {
  const p = activeAuthProvider
  switch (p) {
    case 'clerk':
      return clerkAdapter
    case 'next-auth':
      return nextAuthAdapter
    case 'okta':
      return oktaAdapter
    default:
      throw new Error(
        `[auth] Unknown NEXT_PUBLIC_AUTH_PROVIDER: "${p}". Valid: clerk | next-auth | okta`
      )
  }
}

// Resolved once at module load — zero overhead on hot path
const adapter = resolve()

export async function getSession(): Promise<AuthSession | null> {
  return adapter.getSession()
}

export async function requireAuth(redirectTo = '/login'): Promise<AuthSession> {
  return adapter.requireAuth(redirectTo)
}

export type { AuthSession, AuthUser } from './types'
