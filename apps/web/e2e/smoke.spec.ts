/**
 * Smoke Tests - Post-deployment health checks
 *
 * These are minimal, fast tests that verify critical paths are working
 * after deployment. Run against staging (full suite) and production (smoke only).
 *
 * Smoke tests should:
 * - Be fast (< 2 minutes total)
 * - Not create or modify data
 * - Check critical user paths
 * - Verify the app is "alive"
 */

import { test, expect } from '@playwright/test'

test.describe('Smoke Tests', () => {
  test('homepage returns 200 and renders', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page.locator('body')).toBeVisible()
  })

  test('homepage has valid title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/.+/)
  })

  test('auth redirect works for protected routes', async ({ page }) => {
    await page.goto('/dashboard')
    // Should redirect to login (Clerk hosted or custom)
    await expect(page).toHaveURL(/login|sign-in|accounts\.dev/)
  })

  test('login page loads', async ({ page }) => {
    const response = await page.goto('/login')
    expect(response?.status()).toBe(200)
  })

  test('404 page renders for unknown routes', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist-smoke-test')
    expect(response?.status()).toBe(404)
    await expect(page.locator('text=404')).toBeVisible()
  })

  test('static assets are served (favicon)', async ({ request }) => {
    const response = await request.get('/favicon.ico')
    // Favicon might be 200 or 204, just not 500
    expect(response.status()).toBeLessThan(500)
  })
})
