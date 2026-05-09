import { describe, it, expect } from 'vitest'
import { matchResponse } from './chat-responses'

describe('chat-responses', () => {
  describe('matchResponse', () => {
    it('returns greeting for "hello"', () => {
      const result = matchResponse('hello there')
      expect(result.content).toContain('Hello')
      expect(result.confidence).toBeGreaterThanOrEqual(90)
    })

    it('returns refund response for "refund"', () => {
      const result = matchResponse('I need a refund please')
      expect(result.content).toContain('refund')
      expect(result.confidence).toBeGreaterThanOrEqual(90)
    })

    it('returns pricing response for "pricing"', () => {
      const result = matchResponse('What are your pricing plans?')
      expect(result.content).toContain('plan')
      expect(result.confidence).toBeGreaterThanOrEqual(90)
    })

    it('returns help response for "problem"', () => {
      const result = matchResponse('I have a problem')
      expect(result.content).toContain('help')
      expect(result.confidence).toBeGreaterThanOrEqual(90)
    })

    it('returns order response for "shipping"', () => {
      const result = matchResponse('Where is my shipping?')
      expect(result.content).toContain('order')
      expect(result.confidence).toBeGreaterThanOrEqual(90)
    })

    it('returns default for unrecognised input', () => {
      const result = matchResponse('xyzzy foobar baz')
      expect(result.confidence).toBeLessThan(70)
      expect(result.content).toContain('learning')
    })

    it('picks best matching rule on multiple keywords', () => {
      const result = matchResponse('I need help with a refund and return')
      // "refund" and "return" both match refund rule (2 keywords)
      expect(result.content).toContain('refund')
    })

    it('is case insensitive', () => {
      const result = matchResponse('HELLO')
      expect(result.content).toContain('Hello')
    })
  })
})
