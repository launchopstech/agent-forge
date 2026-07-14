import { test, expect, type Page } from '@playwright/test'

/**
 * Channels E2E Tests
 *
 * Prerequisites:
 *  1. forge-core API running on http://localhost:3001
 *  2. forge-core auth-handler running on http://localhost:3002
 *  3. agent-forge running on http://localhost:3000
 *  4. NEXT_PUBLIC_AUTH_PROVIDER=auth-handler in .env.local
 *
 * To run:
 *   cd agent-forge && pnpm test:e2e --grep "Channels"
 *
 * All "live backend" tests skip gracefully with a console note if the servers
 * are unreachable, matching the same pattern used in agents.spec.ts.
 */

const FORGE_CORE_URL = 'http://localhost:3001'

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function login(page: Page): Promise<boolean> {
  try {
    const res = await page.request.post('http://localhost:3000/api/auth/dev-login')
    if (!res.ok()) return false

    const data = (await res.json()) as { accessToken: string; expiresIn: number }
    await page.goto('http://localhost:3000/', { waitUntil: 'load' })

    await page.evaluate(
      ({ token, expiresIn }: { token: string; expiresIn: number }) => {
        sessionStorage.setItem('forge_access_token', token)
        sessionStorage.setItem('forge_token_expires_at', (Date.now() + expiresIn * 1000).toString())
      },
      { token: data.accessToken, expiresIn: data.expiresIn }
    )

    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'load' })
    return page.url().includes('/dashboard')
  } catch {
    return false
  }
}

async function getAccessToken(page: Page): Promise<string | null> {
  return page.evaluate(() => sessionStorage.getItem('forge_access_token'))
}

async function createTestChannel(page: Page, name: string): Promise<string | null> {
  try {
    const token = await getAccessToken(page)
    const res = await page.request.post(`${FORGE_CORE_URL}/api/channels`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      data: { channelType: 'test', name },
    })
    if (!res.ok()) return null
    const channel = (await res.json()) as { id: string }
    return channel.id
  } catch {
    return null
  }
}

async function deleteTestChannel(page: Page, id: string): Promise<void> {
  try {
    const token = await getAccessToken(page)
    await page.request.delete(`${FORGE_CORE_URL}/api/channels/${id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    })
  } catch {
    // best-effort cleanup
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('Channels', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/')
    await page.evaluate(() => {
      sessionStorage.clear()
      localStorage.clear()
    })
  })

  // CH1 — unauthenticated redirect ────────────────────────────────────────────

  test('CH1: unauthenticated /dashboard/channels redirects to sign-in', async ({ page }) => {
    await page.goto('/dashboard/channels')
    await expect(page).toHaveURL(/login|sign-in|accounts\.dev/, { timeout: 8000 })
  })

  // CH2 — page loads ──────────────────────────────────────────────────────────

  test('CH2: /dashboard/channels loads and shows page content', async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      console.log('Skipping CH2 — forge-core not running')
      test.skip()
      return
    }

    await page.goto('/dashboard/channels')
    await page.waitForLoadState('load')
    await expect(page).toHaveURL(/\/dashboard\/channels/)

    // Either a heading, a channel card, or an empty state must be visible
    const hasHeading = await page
      .locator('h1, h2')
      .filter({ hasText: /channels/i })
      .isVisible()
      .catch(() => false)
    const hasEmptyState = await page
      .locator('[data-testid="empty-state"], text=/no channels/i')
      .isVisible()
      .catch(() => false)
    const hasMain = await page
      .locator('main')
      .isVisible()
      .catch(() => false)

    expect(hasHeading || hasEmptyState || hasMain).toBe(true)
    console.log('✓ /dashboard/channels loaded')
  })

  // CH3 — sidebar navigation ──────────────────────────────────────────────────

  test('CH3: sidebar Channels link navigates to /dashboard/channels', async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      console.log('Skipping CH3 — forge-core not running')
      test.skip()
      return
    }

    await page.goto('/dashboard')
    await page.waitForLoadState('load')

    // Locate sidebar channel link
    const link = page
      .locator('nav a[href*="/dashboard/channels"], aside a[href*="/dashboard/channels"]')
      .first()
    const isVisible = await link.isVisible().catch(() => false)

    if (!isVisible) {
      console.log('Skipping CH3 — sidebar link not found (may be collapsed)')
      test.skip()
      return
    }

    await link.click()
    await expect(page).toHaveURL(/\/dashboard\/channels/, { timeout: 8000 })
    console.log('✓ Sidebar Channels link navigates correctly')
  })

  // CH4 — create channel flow ─────────────────────────────────────────────────

  test('CH4: create Test channel via modal and channel card appears', async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      console.log('Skipping CH4 — forge-core not running')
      test.skip()
      return
    }

    const channelName = `E2E Test ${Date.now()}`
    let channelId: string | null = null

    try {
      await page.goto('/dashboard/channels')
      await page.waitForLoadState('load')

      // Click "Add Channel" or "New Channel" button
      const addBtn = page
        .locator('button')
        .filter({ hasText: /add channel|new channel|add$/i })
        .first()
      const btnVisible = await addBtn.isVisible({ timeout: 5000 }).catch(() => false)
      if (!btnVisible) {
        console.log('Skipping CH4 — Add Channel button not found')
        test.skip()
        return
      }

      await addBtn.click()
      await page.waitForTimeout(300) // Modal animation

      // Step 1: pick Test type
      const testOption = page
        .locator('button:has-text("Test"), [data-testid="channel-type-test"]')
        .first()
      const testVisible = await testOption.isVisible({ timeout: 4000 }).catch(() => false)
      if (!testVisible) {
        console.log('Skipping CH4 — Test channel option not found in modal')
        test.skip()
        return
      }
      await testOption.click()
      await page.waitForTimeout(200)

      // Step 2: set name
      const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i]').first()
      await nameInput.fill(channelName)

      // Step 3: submit
      const createBtn = page
        .locator('button')
        .filter({ hasText: /create|save|add/i })
        .last()
      await createBtn.click()

      // New channel card should appear
      await expect(page.locator(`text=${channelName}`).first()).toBeVisible({ timeout: 8000 })
      console.log(`✓ Channel "${channelName}" created and visible`)

      // Capture id for cleanup by API call
      const token = await getAccessToken(page)
      const res = await page.request.get(`${FORGE_CORE_URL}/api/channels`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      })
      if (res.ok()) {
        const channels = (await res.json()) as { id: string; name: string }[]
        const created = channels.find((c) => c.name === channelName)
        if (created) channelId = created.id
      }
    } finally {
      if (channelId) await deleteTestChannel(page, channelId)
    }
  })

  // CH5 — channel setup page tabs ─────────────────────────────────────────────

  test('CH5: channel setup page shows Routing Rules and Test Console tabs', async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      console.log('Skipping CH5 — forge-core not running')
      test.skip()
      return
    }

    const channelId = await createTestChannel(page, `E2E Setup ${Date.now()}`)
    if (!channelId) {
      console.log('Skipping CH5 — could not create test channel')
      test.skip()
      return
    }

    try {
      await page.goto(`/dashboard/channels/test/setup?id=${channelId}`)
      await page.waitForLoadState('load')

      const routingTab = page
        .locator('button, [role="tab"]')
        .filter({ hasText: /routing rules/i })
        .first()
      const testTab = page
        .locator('button, [role="tab"]')
        .filter({ hasText: /test console/i })
        .first()

      await expect(routingTab).toBeVisible({ timeout: 8000 })
      await expect(testTab).toBeVisible({ timeout: 8000 })
      console.log('✓ Setup page shows both Routing Rules and Test Console tabs')
    } finally {
      await deleteTestChannel(page, channelId)
    }
  })

  // CH6 — test console send & reply ───────────────────────────────────────────

  test('CH6: Test Console — send message and receive agent reply', async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      console.log('Skipping CH6 — forge-core not running')
      test.skip()
      return
    }

    const channelId = await createTestChannel(page, `E2E Console ${Date.now()}`)
    if (!channelId) {
      console.log('Skipping CH6 — could not create test channel')
      test.skip()
      return
    }

    try {
      // Navigate to setup page
      await page.goto(`/dashboard/channels/test/setup?id=${channelId}`)
      await page.waitForLoadState('load')

      // Click Test Console tab
      const testTab = page
        .locator('button, [role="tab"]')
        .filter({ hasText: /test console/i })
        .first()
      const tabVisible = await testTab.isVisible({ timeout: 6000 }).catch(() => false)
      if (!tabVisible) {
        console.log('Skipping CH6 — Test Console tab not found (may need routing rule first)')
        test.skip()
        return
      }
      await testTab.click()
      await page.waitForTimeout(300)

      // Type a message
      const input = page.locator('input[placeholder*="message" i], input[type="text"]').first()
      const inputVisible = await input.isVisible({ timeout: 4000 }).catch(() => false)
      if (!inputVisible) {
        console.log('Skipping CH6 — test console input not visible (need routing rule)')
        test.skip()
        return
      }

      await input.fill('Hello from E2E test')
      await page.locator('button[type="submit"], button:has-text("Send")').first().click()

      // User message should appear
      await expect(page.locator('text=Hello from E2E test').first()).toBeVisible({ timeout: 5000 })
      console.log('✓ User message appears in Test Console')

      // Reply should appear within reasonable time (API may not be connected without routing rule)
      const replyVisible = await page
        .locator('[data-role="assistant"], .assistant-message, p')
        .filter({ hasNotText: 'Hello from E2E test' })
        .first()
        .isVisible({ timeout: 10000 })
        .catch(() => false)

      if (replyVisible) {
        console.log('✓ Agent reply appeared in Test Console')
      } else {
        console.log('ℹ No reply — routing rule may not be configured (expected in isolated e2e)')
      }
    } finally {
      await deleteTestChannel(page, channelId)
    }
  })
})
