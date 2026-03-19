import { describe, it, expect } from 'vitest'
import { oklchToHex, hexToOklch } from './color-utils'

describe('oklchToHex', () => {
  it('converts a valid OKLCH string to hex', () => {
    const result = oklchToHex('oklch(0.35 0.15 280)')
    expect(result).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('converts white oklch to #ffffff', () => {
    const result = oklchToHex('oklch(1 0 0)')
    expect(result.toLowerCase()).toBe('#ffffff')
  })

  it('converts black oklch to #000000', () => {
    const result = oklchToHex('oklch(0 0 0)')
    expect(result.toLowerCase()).toBe('#000000')
  })

  it('returns input unchanged for invalid color string', () => {
    const invalid = 'not-a-color'
    expect(oklchToHex(invalid)).toBe(invalid)
  })

  it('returns input unchanged for empty string', () => {
    expect(oklchToHex('')).toBe('')
  })

  it('does not throw for malformed OKLCH', () => {
    expect(() => oklchToHex('oklch(abc def ghi)')).not.toThrow()
  })
})

describe('hexToOklch', () => {
  it('converts a hex color to a valid OKLCH string', () => {
    const result = hexToOklch('#ff0000')
    expect(result).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/)
  })

  it('produces values rounded to 3 decimal places', () => {
    const result = hexToOklch('#336699')
    // Each number should have at most 3 decimal places
    const numbers = result.replace('oklch(', '').replace(')', '').split(' ')
    numbers.forEach((n) => {
      const parts = n.split('.')
      const decimals = parts.length > 1 ? (parts[1]?.length ?? 0) : 0
      expect(decimals).toBeLessThanOrEqual(3)
    })
  })

  it('returns input unchanged for invalid hex', () => {
    const invalid = 'not-a-hex'
    expect(hexToOklch(invalid)).toBe(invalid)
  })

  it('returns input unchanged for empty string', () => {
    expect(hexToOklch('')).toBe('')
  })

  it('does not throw for malformed input', () => {
    expect(() => hexToOklch('#gggggg')).not.toThrow()
  })
})

describe('roundtrip', () => {
  it('hex → oklch → hex is approximately equal (within tolerance)', () => {
    const original = '#4d7abc'
    const oklch = hexToOklch(original)
    const backToHex = oklchToHex(oklch)
    // Convert both to RGB numbers and compare channel by channel (±2 tolerance for rounding)
    const hexToRgb = (h: string) => {
      const clean = h.replace('#', '')
      return [
        parseInt(clean.slice(0, 2), 16),
        parseInt(clean.slice(2, 4), 16),
        parseInt(clean.slice(4, 6), 16),
      ] as const
    }
    const orig = hexToRgb(original)
    const back = hexToRgb(backToHex)
    orig.forEach((channel, i) => {
      const backChannel = back[i] ?? 0
      expect(Math.abs(channel - backChannel)).toBeLessThanOrEqual(2)
    })
  })
})
