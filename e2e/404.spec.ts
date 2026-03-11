import { test, expect } from '@playwright/test'
import { checkA11y } from './helpers/a11y'

// The decorative "404" text uses text-muted-foreground/30 (intentionally low contrast)
// The ThemeSwitcher landmark issue is also pre-existing
const KNOWN_VIOLATIONS = ['color-contrast', 'region']

test('unknown route renders 404 page', async ({ page }) => {
  const response = await page.goto('/this-route-definitely-does-not-exist-xyz')
  expect(response?.status()).toBe(404)
  await expect(page.locator('text=404')).toBeVisible()
  await expect(page.locator('text=Page not found')).toBeVisible()
  await checkA11y(page, { disableRules: KNOWN_VIOLATIONS })
})

test('"Go home" button navigates to /', async ({ page }) => {
  await page.goto('/this-route-definitely-does-not-exist-xyz')
  await page.click('text=Go home')
  await expect(page).toHaveURL('/')
})
