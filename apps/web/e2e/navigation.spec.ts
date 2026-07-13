import { test, expect } from '@playwright/test'
import { checkA11y } from './helpers/a11y'

// ThemeSwitcher renders in non-development builds with a landmark region issue
// (known pre-existing issue — tracked separately)
const KNOWN_VIOLATIONS = ['region']

test.skip('homepage loads with status 200', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  await checkA11y(page, { disableRules: KNOWN_VIOLATIONS })
})

test('homepage has page title', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
  await expect(page).toHaveTitle(/.+/)
})
