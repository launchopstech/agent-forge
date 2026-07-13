/**
 * Admin Theme Editor E2E Tests
 *
 * Routes:
 *   /admin/theme           — Agency admin: can edit any client brand (dropdown)
 *   /dashboard/theme       — Client admin: can edit only their own brand instance
 *
 * Note: Tests requiring authenticated sessions (tenant/agency roles) are
 * skipped in CI unless auth test credentials are provided via environment
 * variables. The route-protection tests use unauthenticated state only.
 */
import { test, expect } from '@playwright/test'

test.describe('Admin Theme — route protection', () => {
  test('unauthenticated user is redirected away from /admin/theme', async ({ page }) => {
    await page.goto('/admin/theme')
    // Clerk middleware should redirect unauthenticated users to sign-in
    await expect(page).toHaveURL(/login|sign-in|accounts\.dev/)
  })

  test('unauthenticated user is redirected away from /dashboard/theme', async ({ page }) => {
    await page.goto('/dashboard/theme')
    await expect(page).toHaveURL(/login|sign-in|accounts\.dev/)
  })
})

test.describe('Admin Theme — client admin (requires auth)', () => {
  test.skip(
    !process.env.TEST_TENANT_EMAIL || !process.env.TEST_TENANT_PASSWORD,
    'Skipped: TEST_TENANT_EMAIL / TEST_TENANT_PASSWORD not set'
  )

  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('load')
    await page.fill('input[name="identifier"], input[type="email"]', process.env.TEST_TENANT_EMAIL!)
    await page.fill('input[type="password"]', process.env.TEST_TENANT_PASSWORD!)
    await page.click('button[type="submit"]')
    await page.waitForURL(/dashboard/)
  })

  test('client admin can navigate to /dashboard/theme', async ({ page }) => {
    await page.goto('/dashboard/theme')
    await page.waitForLoadState('load')
    await expect(page.getByRole('heading', { name: /theme editor/i })).toBeVisible()
  })

  test('client admin can change a color and save', async ({ page }) => {
    await page.goto('/dashboard/theme')
    await page.waitForLoadState('load')

    // Find the --primary OKLCH text input and update it
    const oklchInput = page.locator('#oklch-primary')
    await oklchInput.fill('oklch(0.5 0.2 300)')

    // Click save
    await page.getByRole('button', { name: /save/i }).click()

    // Toast confirmation
    await expect(page.getByText(/theme saved/i)).toBeVisible()

    // Reload and verify localStorage
    await page.reload()
    await page.waitForLoadState('load')
    const stored = await page.evaluate(() => localStorage.getItem('forge_theme_default'))
    expect(stored).not.toBeNull()
  })

  test('client admin is redirected away from /admin/theme (agency-only)', async ({ page }) => {
    await page.goto('/admin/theme')
    await page.waitForURL(/dashboard/)
    await expect(page).toHaveURL(/\/dashboard/)
  })
})

test.describe('Admin Theme — agency admin (requires auth)', () => {
  test.skip(
    !process.env.TEST_AGENCY_EMAIL || !process.env.TEST_AGENCY_PASSWORD,
    'Skipped: TEST_AGENCY_EMAIL / TEST_AGENCY_PASSWORD not set'
  )

  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('load')
    await page.fill('input[name="identifier"], input[type="email"]', process.env.TEST_AGENCY_EMAIL!)
    await page.fill('input[type="password"]', process.env.TEST_AGENCY_PASSWORD!)
    await page.click('button[type="submit"]')
    await page.waitForURL(/dashboard/)
  })

  test('agency admin can access /admin/theme with brand dropdown', async ({ page }) => {
    await page.goto('/admin/theme')
    await page.waitForLoadState('load')
    await expect(page.getByRole('heading', { name: /theme editor/i })).toBeVisible()
    await expect(page.locator('#brand-selector')).toBeVisible()
  })

  test('agency admin can switch brands and save', async ({ page }) => {
    await page.goto('/admin/theme')
    await page.waitForLoadState('load')

    await page.selectOption('#brand-selector', 'client-a')

    const oklchInput = page.locator('#oklch-primary')
    await oklchInput.fill('oklch(0.6 0.2 220)')
    await page.getByRole('button', { name: /save/i }).click()
    await expect(page.getByText(/theme saved/i)).toBeVisible()
  })
})
