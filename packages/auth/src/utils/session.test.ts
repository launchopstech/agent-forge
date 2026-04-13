import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { AuthSession } from '@forge/auth/src/contracts'
import { encodeSession, decodeSession, isExpired, sessionFromClaims } from './session'

describe('Session utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-13T12:00:00Z'))
  })

  describe('encodeSession()', () => {
    it('encodes session with default expiry (8 hours)', () => {
      const session: AuthSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
        },
      }

      const encoded = encodeSession(session)

      expect(encoded).toHaveProperty('user')
      expect(encoded).toHaveProperty('expiresAt')
      expect(encoded.user).toEqual(session.user)

      // Should expire in 8 hours (28800 seconds = 8 * 60 * 60)
      const expectedExpiry = Date.now() + 8 * 60 * 60 * 1000
      expect(encoded.expiresAt).toBe(expectedExpiry)
    })

    it('encodes session with custom expiry', () => {
      const session: AuthSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      }
      const customExpiry = Date.now() + 3600000 // 1 hour

      const encoded = encodeSession(session, customExpiry)

      expect(encoded.expiresAt).toBe(customExpiry)
    })

    it('preserves all user properties', () => {
      const session: AuthSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
      }

      const encoded = encodeSession(session)

      expect(encoded.user).toEqual(session.user)
      expect(encoded.user.avatarUrl).toBe('https://example.com/avatar.jpg')
    })
  })

  describe('decodeSession()', () => {
    it('decodes valid session data', () => {
      const sessionData = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          avatarUrl: null,
        },
        expiresAt: Date.now() + 3600000,
      }

      const decoded = decodeSession(sessionData)

      expect(decoded).toEqual({
        user: sessionData.user,
      })
    })

    it('decodes even if session is expired (expiry check is separate)', () => {
      const sessionData = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: null,
          avatarUrl: null,
        },
        expiresAt: Date.now() - 1000, // Expired 1 second ago
      }

      const decoded = decodeSession(sessionData)

      // decodeSession doesn't validate expiry - it just extracts the user
      expect(decoded).toEqual({
        user: sessionData.user,
      })

      // Use isExpired() for expiry check
      expect(isExpired(sessionData)).toBe(true)
    })

    it('preserves null values for optional fields', () => {
      const sessionData = {
        user: {
          id: 'user-123',
          email: null,
          name: null,
          avatarUrl: null,
        },
        expiresAt: Date.now() + 3600000,
      }

      const decoded = decodeSession(sessionData)

      expect(decoded.user.email).toBeNull()
      expect(decoded.user.name).toBeNull()
      expect(decoded.user.avatarUrl).toBeNull()
    })
  })

  describe('isExpired()', () => {
    it('returns false for future expiry', () => {
      const sessionData = {
        user: { id: '123', email: 'test@example.com', name: null, avatarUrl: null },
        expiresAt: Date.now() + 3600000, // 1 hour in future
      }

      expect(isExpired(sessionData)).toBe(false)
    })

    it('returns true for past expiry', () => {
      const sessionData = {
        user: { id: '123', email: 'test@example.com', name: null, avatarUrl: null },
        expiresAt: Date.now() - 1000, // 1 second ago
      }

      expect(isExpired(sessionData)).toBe(true)
    })

    it('returns true for exactly now (boundary case)', () => {
      const now = Date.now()
      const sessionData = {
        user: { id: '123', email: 'test@example.com', name: null, avatarUrl: null },
        expiresAt: now,
      }

      expect(isExpired(sessionData)).toBe(true)
    })
  })

  describe('sessionFromClaims()', () => {
    it('creates session from standard OIDC claims', () => {
      const claims = {
        sub: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
      }

      const sessionData = sessionFromClaims(claims)

      expect(sessionData.user).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: 'https://example.com/avatar.jpg',
      })
      expect(sessionData).toHaveProperty('expiresAt')
      expect(sessionData.expiresAt).toBeGreaterThan(Date.now())
    })

    it('handles missing optional fields (returns null)', () => {
      const claims = {
        sub: 'user-123',
        email: 'test@example.com',
      }

      const sessionData = sessionFromClaims(claims)

      expect(sessionData.user).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: null,
        avatarUrl: null,
      })
    })

    it('maps picture to avatarUrl', () => {
      const claims = {
        sub: 'user-123',
        email: 'test@example.com',
        picture: 'https://example.com/photo.png',
      }

      const sessionData = sessionFromClaims(claims)

      expect(sessionData.user.avatarUrl).toBe('https://example.com/photo.png')
    })

    it('prefers avatar_url over picture', () => {
      const claims = {
        sub: 'user-123',
        email: 'test@example.com',
        avatar_url: 'https://example.com/avatar.png',
        picture: 'https://example.com/picture.png',
      }

      const sessionData = sessionFromClaims(claims)

      expect(sessionData.user.avatarUrl).toBe('https://example.com/avatar.png')
    })

    it('handles claims with extra properties', () => {
      const claims = {
        sub: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        iss: 'https://auth.example.com',
        aud: 'client-id',
        exp: 1234567890,
        iat: 1234567800,
      }

      const sessionData = sessionFromClaims(claims)

      // Should only extract the relevant user fields
      expect(sessionData.user).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: null,
      })
    })

    it('handles missing email (returns null)', () => {
      const claims = {
        sub: 'user-123',
        name: 'Test User',
      }

      const sessionData = sessionFromClaims(claims)

      expect(sessionData.user.email).toBeNull()
    })

    it('sets custom expiry when provided', () => {
      const claims = {
        sub: 'user-123',
        email: 'test@example.com',
      }
      const customExpiry = Date.now() + 1800000 // 30 minutes

      const sessionData = sessionFromClaims(claims, customExpiry)

      expect(sessionData.expiresAt).toBe(customExpiry)
    })
  })
})
