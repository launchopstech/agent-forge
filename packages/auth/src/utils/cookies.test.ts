import { describe, it, expect } from 'vitest'
import { sealCookie, unsealCookie } from './cookies'

const TEST_SECRET = 'test-secret-key-minimum-32-characters-long-for-aes-256'

describe('Cookie sealing utilities', () => {
  describe('sealCookie() and unsealCookie()', () => {
    it('seals and unseals a simple object', async () => {
      const data = { userId: '123', email: 'test@example.com' }
      const sealed = await sealCookie(data, TEST_SECRET)
      const unsealed = await unsealCookie<typeof data>(sealed, TEST_SECRET)

      expect(unsealed).toEqual(data)
    })

    it('seals and unseals complex nested objects', async () => {
      const data = {
        user: {
          id: '123',
          profile: { name: 'Test User', roles: ['admin', 'user'] },
        },
        session: { createdAt: Date.now(), expiresAt: Date.now() + 3600000 },
      }
      const sealed = await sealCookie(data, TEST_SECRET)
      const unsealed = await unsealCookie<typeof data>(sealed, TEST_SECRET)

      expect(unsealed).toEqual(data)
    })

    it('preserves data types (numbers, booleans, nulls)', async () => {
      const data = {
        count: 42,
        active: true,
        deleted: false,
        metadata: null,
        score: 3.14,
      }
      const sealed = await sealCookie(data, TEST_SECRET)
      const unsealed = await unsealCookie<typeof data>(sealed, TEST_SECRET)

      expect(unsealed).toEqual(data)
      expect(typeof unsealed?.count).toBe('number')
      expect(typeof unsealed?.active).toBe('boolean')
      expect(unsealed?.metadata).toBeNull()
    })

    it('throws for tampered sealed data', async () => {
      const data = { userId: '123' }
      const sealed = await sealCookie(data, TEST_SECRET)

      // Tamper with the sealed string
      const tampered = sealed.slice(0, -5) + 'XXXXX'

      await expect(unsealCookie(tampered, TEST_SECRET)).rejects.toThrow()
    })

    it('throws for wrong secret', async () => {
      const data = { userId: '123' }
      const sealed = await sealCookie(data, TEST_SECRET)

      await expect(
        unsealCookie(sealed, 'wrong-secret-key-different-from-original')
      ).rejects.toThrow('Failed to unseal cookie')
    })

    it('throws for invalid format (missing parts)', async () => {
      const invalidSealed = 'invalid.format'

      await expect(unsealCookie(invalidSealed, TEST_SECRET)).rejects.toThrow(
        'Invalid sealed cookie format'
      )
    })

    it('throws for malformed base64url', async () => {
      const invalidSealed = 'not-base64!@#$%^&*().invalid!@#$%^&*().garbage!@#$%^&*()'

      // Should throw when trying to decode invalid base64url
      await expect(unsealCookie(invalidSealed, TEST_SECRET)).rejects.toThrow()
    })

    it('generates unique sealed strings for the same data', async () => {
      const data = { userId: '123' }
      const sealed1 = await sealCookie(data, TEST_SECRET)
      const sealed2 = await sealCookie(data, TEST_SECRET)

      // Different nonces should produce different sealed strings
      expect(sealed1).not.toBe(sealed2)

      // But both should unseal to the same data
      const unsealed1 = await unsealCookie<typeof data>(sealed1, TEST_SECRET)
      const unsealed2 = await unsealCookie<typeof data>(sealed2, TEST_SECRET)
      expect(unsealed1).toEqual(data)
      expect(unsealed2).toEqual(data)
    })

    it('sealed format contains three base64url parts separated by dots', async () => {
      const data = { test: 'value' }
      const sealed = await sealCookie(data, TEST_SECRET)

      const parts = sealed.split('.')
      expect(parts).toHaveLength(3)

      // Each part should be base64url (no + / or = characters)
      parts.forEach((part) => {
        expect(part).toMatch(/^[A-Za-z0-9_-]+$/)
      })
    })

    it('handles empty objects', async () => {
      const data = {}
      const sealed = await sealCookie(data, TEST_SECRET)
      const unsealed = await unsealCookie<typeof data>(sealed, TEST_SECRET)

      expect(unsealed).toEqual(data)
    })

    it('handles arrays', async () => {
      const data = { items: ['a', 'b', 'c'], numbers: [1, 2, 3] }
      const sealed = await sealCookie(data, TEST_SECRET)
      const unsealed = await unsealCookie<typeof data>(sealed, TEST_SECRET)

      expect(unsealed).toEqual(data)
      expect(Array.isArray(unsealed?.items)).toBe(true)
    })

    it('handles Unicode characters', async () => {
      const data = { emoji: '🔐', chinese: '你好', arabic: 'مرحبا' }
      const sealed = await sealCookie(data, TEST_SECRET)
      const unsealed = await unsealCookie<typeof data>(sealed, TEST_SECRET)

      expect(unsealed).toEqual(data)
    })
  })
})
