/**
 * Session encoding/decoding utilities for auth-handler sessions.
 * Sessions are stored in httpOnly cookies (sealed with AES-256-GCM).
 *
 * Session shape matches AuthSession from ../../types:
 * { user: { id, email, name, avatarUrl }, tenantId, expiresAt }
 */

import type { AuthSession } from '../types'

/**
 * Session data structure stored in sealed cookies.
 * Includes expiry timestamp for server-side validation.
 */
export interface SessionData {
  user: {
    id: string
    email: string | null
    name: string | null
    avatarUrl: string | null
  }
  expiresAt: number // Unix timestamp (milliseconds)
}

/**
 * Encodes an AuthSession into SessionData with expiry timestamp.
 *
 * @param session - AuthSession object from auth flow
 * @param expiresAt - Unix timestamp when session expires (default: 8 hours from now)
 * @returns SessionData ready to be sealed into a cookie
 */
export function encodeSession(session: AuthSession, expiresAt?: number): SessionData {
  return {
    user: session.user,
    expiresAt: expiresAt ?? Date.now() + 8 * 60 * 60 * 1000, // 8 hours default
  }
}

/**
 * Decodes SessionData from a sealed cookie back to AuthSession.
 * Does NOT check expiry — use isExpired() separately.
 *
 * @param sessionData - Decoded SessionData from unsealCookie
 * @returns AuthSession object (without expiry timestamp)
 */
export function decodeSession(sessionData: SessionData): AuthSession {
  return {
    user: sessionData.user,
  }
}

/**
 * Checks if a session has expired based on current time.
 *
 * @param sessionData - SessionData with expiresAt timestamp
 * @returns true if expired, false otherwise
 */
export function isExpired(sessionData: SessionData): boolean {
  return Date.now() >= sessionData.expiresAt
}

/**
 * Creates a SessionData object from ID token claims.
 * Maps OIDC standard claims to AuthSession shape.
 *
 * @param claims - JWT claims from id_token (decoded, not verified)
 * @param expiresAt - Optional custom expiry (default: 8 hours from now)
 * @returns SessionData ready to be sealed
 */
export function sessionFromClaims(
  claims: {
    sub: string
    email?: string
    name?: string
    avatar_url?: string
    picture?: string
  },
  expiresAt?: number
): SessionData {
  return {
    user: {
      id: claims.sub,
      email: claims.email ?? null,
      name: claims.name ?? null,
      avatarUrl: claims.avatar_url ?? claims.picture ?? null,
    },
    expiresAt: expiresAt ?? Date.now() + 8 * 60 * 60 * 1000,
  }
}
