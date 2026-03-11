import { test, expect } from '@playwright/test'
import { checkA11y } from './helpers/a11y'

test('unauthenticated /dashboard redirects to /login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
})

test('login page loads successfully', async ({ page }) => {
  const response = await page.goto('/login')
  expect(response?.status()).toBe(200)
  await page.waitForLoadState('load')
  // The auth layout renders a wrapper around the Clerk component
  await expect(page.locator('body')).toBeVisible()
  // Run a11y check excluding Clerk iframe and ThemeSwitcher region issues
  await checkA11y(page, { disableRules: ['region', 'frame-title', 'landmark-one-main'] })
})
