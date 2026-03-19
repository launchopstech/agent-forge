import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('env config', () => {
  const ORIGINAL_ENV = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('parses valid environment variables without throwing', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://example.com'
    process.env.NEXT_PUBLIC_APP_ENV = 'production'

    const { env } = await import('./env')
    expect(env.NEXT_PUBLIC_APP_URL).toBe('https://example.com')
    expect(env.NEXT_PUBLIC_APP_ENV).toBe('production')
  })

  it('throws a descriptive error when NEXT_PUBLIC_APP_URL is missing', async () => {
    delete process.env.NEXT_PUBLIC_APP_URL
    process.env.NEXT_PUBLIC_APP_ENV = 'development'

    await expect(import('./env')).rejects.toThrow('NEXT_PUBLIC_APP_URL')
  })

  it('throws a descriptive error when NEXT_PUBLIC_APP_URL is not a valid URL', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'not-a-url'
    process.env.NEXT_PUBLIC_APP_ENV = 'development'

    await expect(import('./env')).rejects.toThrow('NEXT_PUBLIC_APP_URL')
  })

  it('throws a descriptive error when NEXT_PUBLIC_APP_ENV has an invalid value', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://example.com'
    process.env.NEXT_PUBLIC_APP_ENV = 'invalid-env'

    await expect(import('./env')).rejects.toThrow('NEXT_PUBLIC_APP_ENV')
  })
})
