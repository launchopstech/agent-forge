import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
    expect(cn('foo', true && 'bar', 'baz')).toBe('foo bar baz')
  })

  it('resolves Tailwind conflicts (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })

  it('handles object syntax', () => {
    expect(cn({ active: true, disabled: false })).toBe('active')
  })
})
