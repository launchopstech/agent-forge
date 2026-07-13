/**
 * Auth Helper for Playwright E2E Tests
 *
 * Provides utilities for setting up and tearing down auth state in tests.
 */

import type { Page, BrowserContext } from '@playwright/test'

export interface AuthState {
  sessionCookie: string
  refreshCookie: string
  accessToken: string
  expiresAt: number
}

/**
 * Sets up a complete authenticated state including cookies and sessionStorage.
 * Use this to skip the OAuth flow in tests that need authenticated state.
 */
export async function setupAuthState(
  page: Page,
  options: {
    userId?: string
    email?: string
    name?: string
    accessTokenTTL?: number
  } = {}
) {
  const {
    userId = 'test-user-123',
    email = 'test@example.com',
    name = 'Test User',
    accessTokenTTL = 3600000, // 1 hour
  } = options

  // Create session cookie
  await page.context().addCookies([
    {
      name: 'forge_session',
      value: createMockSessionCookie({ userId, email, name }),
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
    {
      name: 'forge_refresh',
      value: createMockRefreshToken(userId),
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ])

  // Set access token in sessionStorage — must match the format expected by
  // packages/auth/src/adapters/auth-handler/client.ts getAccessToken():
  //   forge_access_token     = plain JWT string
  //   forge_token_expires_at = numeric timestamp as string
  await page.evaluate(
    ({ token, ttl }) => {
      sessionStorage.setItem('forge_access_token', token)
      sessionStorage.setItem('forge_token_expires_at', (Date.now() + ttl).toString())
    },
    { token: createMockAccessToken(userId), ttl: accessTokenTTL }
  )
}

/**
 * Clears all auth-related state (cookies and storage).
 */
export async function clearAuthState(page: Page) {
  await page.context().clearCookies()
  await page.evaluate(() => {
    sessionStorage.clear()
    localStorage.clear()
  })
}

/**
 * Checks if the page is currently authenticated.
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const cookies = await page.context().cookies()
  const hasSessionCookie = cookies.some((c) => c.name === 'forge_session')

  const hasAccessToken = await page.evaluate(() => {
    return sessionStorage.getItem('forge_access_token') !== null
  })

  return hasSessionCookie || hasAccessToken
}

/**
 * Gets the current session cookies.
 */
export async function getSessionCookies(page: Page) {
  const cookies = await page.context().cookies()
  return {
    session: cookies.find((c) => c.name === 'forge_session'),
    refresh: cookies.find((c) => c.name === 'forge_refresh'),
  }
}

/**
 * Gets the access token from sessionStorage.
 */
export async function getAccessToken(page: Page): Promise<string | null> {
  return await page.evaluate(() => sessionStorage.getItem('forge_access_token'))
}

/**
 * Waits for auth-handler redirect (used in OAuth flow tests).
 */
export async function waitForAuthHandlerRedirect(page: Page, timeout = 5000) {
  await page.waitForURL(/localhost:3002\/auth\/authorize/, { timeout })
}

/**
 * Saves current authentication state to a file.
 * Use this after a successful manual login to create a reusable auth state.
 *
 * @example
 * // After manually logging in via browser:
 * await saveAuthState(page.context(), 'e2e/auth-state.json')
 */
export async function saveAuthState(context: BrowserContext, path: string) {
  await context.storageState({ path })
}

/**
 * Triggers logout and verifies state is cleared.
 */
export async function logout(page: Page) {
  const response = await page.request.post('/api/auth/logout')

  if (!response.ok()) {
    throw new Error(`Logout failed: ${response.status()}`)
  }

  // Clear client-side storage
  await page.evaluate(() => {
    sessionStorage.clear()
  })
}

// Mock token generators (for testing without real auth-handler)
// In production, these would be real JWT tokens from auth-handler

function createMockSessionCookie(user: { userId: string; email: string; name?: string }): string {
  // This would be a sealed AES-GCM encrypted cookie in production
  // For tests, we use a simple encoded string
  const sessionData = {
    user: {
      id: user.userId,
      email: user.email,
      name: user.name || null,
      avatarUrl: null,
    },
    expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
  }
  return Buffer.from(JSON.stringify(sessionData)).toString('base64')
}

function createMockRefreshToken(userId: string): string {
  return `refresh_${userId}_${Date.now()}`
}

function createMockAccessToken(userId: string): string {
  // In production, this would be a JWT from auth-handler
  return `mock_access_token_${userId}_${Date.now()}`
}

/**
 * Creates a setup for tests that need authenticated state.
 * Call this in a beforeEach or test.use() block.
 */
export function withAuth(options?: Parameters<typeof setupAuthState>[1]) {
  return async ({ page }: { page: Page }) => {
    await setupAuthState(page, options)
  }
}
