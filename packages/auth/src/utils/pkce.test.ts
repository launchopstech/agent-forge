import { describe, it, expect } from 'vitest'
import { generateCodeVerifier, generateCodeChallenge, generateState } from './pkce'

describe('PKCE utilities', () => {
  describe('generateCodeVerifier()', () => {
    it('generates a 43-character base64url string', () => {
      const verifier = generateCodeVerifier()
      expect(verifier).toHaveLength(43)
      expect(verifier).toMatch(/^[A-Za-z0-9_-]{43}$/)
    })

    it('generates unique verifiers on multiple calls', () => {
      const verifier1 = generateCodeVerifier()
      const verifier2 = generateCodeVerifier()
      const verifier3 = generateCodeVerifier()

      expect(verifier1).not.toBe(verifier2)
      expect(verifier2).not.toBe(verifier3)
      expect(verifier1).not.toBe(verifier3)
    })

    it('generates only URL-safe characters (no + or /)', () => {
      // Generate multiple verifiers to increase confidence
      for (let i = 0; i < 10; i++) {
        const verifier = generateCodeVerifier()
        expect(verifier).not.toContain('+')
        expect(verifier).not.toContain('/')
        expect(verifier).not.toContain('=')
      }
    })
  })

  describe('generateCodeChallenge()', () => {
    it('generates a base64url SHA-256 hash of the verifier', async () => {
      const verifier = generateCodeVerifier()
      const challenge = await generateCodeChallenge(verifier)

      expect(challenge).toMatch(/^[A-Za-z0-9_-]{43}$/)
      expect(challenge).toHaveLength(43)
    })

    it('generates the same challenge for the same verifier', async () => {
      const verifier = generateCodeVerifier()
      const challenge1 = await generateCodeChallenge(verifier)
      const challenge2 = await generateCodeChallenge(verifier)

      expect(challenge1).toBe(challenge2)
    })

    it('generates different challenges for different verifiers', async () => {
      const verifier1 = generateCodeVerifier()
      const verifier2 = generateCodeVerifier()
      const challenge1 = await generateCodeChallenge(verifier1)
      const challenge2 = await generateCodeChallenge(verifier2)

      expect(challenge1).not.toBe(challenge2)
    })

    it('produces valid S256 challenge (RFC 7636 test vector)', async () => {
      // RFC 7636 Appendix B test vector
      const testVerifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'
      const expectedChallenge = 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM'

      const challenge = await generateCodeChallenge(testVerifier)
      expect(challenge).toBe(expectedChallenge)
    })

    it('generates only URL-safe characters', async () => {
      for (let i = 0; i < 10; i++) {
        const verifier = generateCodeVerifier()
        const challenge = await generateCodeChallenge(verifier)
        expect(challenge).not.toContain('+')
        expect(challenge).not.toContain('/')
        expect(challenge).not.toContain('=')
      }
    })
  })

  describe('generateState()', () => {
    it('generates a 43-character base64url string', () => {
      const state = generateState()
      expect(state).toHaveLength(43)
      expect(state).toMatch(/^[A-Za-z0-9_-]{43}$/)
    })

    it('generates unique states on multiple calls', () => {
      const state1 = generateState()
      const state2 = generateState()
      const state3 = generateState()

      expect(state1).not.toBe(state2)
      expect(state2).not.toBe(state3)
      expect(state1).not.toBe(state3)
    })

    it('generates only URL-safe characters', () => {
      for (let i = 0; i < 10; i++) {
        const state = generateState()
        expect(state).not.toContain('+')
        expect(state).not.toContain('/')
        expect(state).not.toContain('=')
      }
    })
  })
})
