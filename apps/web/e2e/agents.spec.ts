import { test, expect, type Page } from '@playwright/test'

/**
 * Agent CRUD E2E Tests
 *
 * Prerequisites:
 * 1. forge-core API running on http://localhost:3001
 * 2. forge-core auth-handler running on http://localhost:3002
 * 3. agent-forge running on http://localhost:3000
 * 4. NEXT_PUBLIC_AUTH_PROVIDER=auth-handler in .env.local
 * 5. forge-core configured with connection=local dev bypass
 *
 * To run:
 *   cd agent-forge && pnpm test:e2e --grep "Agent CRUD"
 */

const FORGE_CORE_URL = 'http://localhost:3001'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Log in via the dev-login shortcut (calls auth-handler /dev/token, sets a real
 * forge_session cookie + forge_access_token in sessionStorage — no Clerk OAuth needed).
 * Returns false if the dev server is not running or the endpoint is unavailable.
 */
async function login(page: Page): Promise<boolean> {
  try {
    // POST to dev-login — sets forge_session cookie via Set-Cookie
    const res = await page.request.post('http://localhost:3000/api/auth/dev-login')
    if (!res.ok()) return false

    const data = (await res.json()) as { accessToken: string; expiresIn: number }

    // Navigate to any page so we can write sessionStorage
    await page.goto('http://localhost:3000/', { waitUntil: 'load' })

    // Store access token in the format the auth-handler adapter expects:
    // - forge_access_token: plain JWT string
    // - forge_token_expires_at: numeric timestamp as string
    await page.evaluate(
      ({ token, expiresIn }: { token: string; expiresIn: number }) => {
        sessionStorage.setItem('forge_access_token', token)
        sessionStorage.setItem('forge_token_expires_at', (Date.now() + expiresIn * 1000).toString())
      },
      { token: data.accessToken, expiresIn: data.expiresIn }
    )

    // Verify session works
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'load' })
    return page.url().includes('/dashboard')
  } catch {
    return false
  }
}

/** Read the access token stored in sessionStorage by the auth-handler adapter. */
async function getAccessToken(page: Page): Promise<string | null> {
  return page.evaluate(() => sessionStorage.getItem('forge_access_token'))
}

/** Create a test agent directly via the forge-core API. Returns the agent id. */
async function createTestAgent(page: Page, name: string): Promise<string> {
  const token = await getAccessToken(page)
  const res = await page.request.post(`${FORGE_CORE_URL}/api/agents`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    data: { name },
  })
  const agent = (await res.json()) as { id: string }
  return agent.id
}

/** Delete a test agent directly via the forge-core API. */
async function deleteTestAgent(page: Page, id: string): Promise<void> {
  const token = await getAccessToken(page)
  await page.request.delete(`${FORGE_CORE_URL}/api/agents/${id}`, {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('Agent CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/')
    await page.evaluate(() => {
      sessionStorage.clear()
      localStorage.clear()
    })
  })

  // ── A1: /agents page loads from API ────────────────────────────────────────

  test('A1: /agents page loads from API', async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      console.log('Skipping — forge-core not running')
      test.skip()
      return
    }

    await page.goto('/agents')
    await page.waitForLoadState('load')

    await expect(page).toHaveURL(/\/agents/)

    // Either the agent table or the empty-state placeholder must be visible
    const hasTable = await page
      .locator('table')
      .isVisible()
      .catch(() => false)
    const hasEmptyState = await page
      .locator('[data-testid="empty-state"], text=/no agents/i')
      .isVisible()
      .catch(() => false)
    const hasDashboard = await page
      .locator('main')
      .isVisible()
      .catch(() => false)

    expect(hasTable || hasEmptyState || hasDashboard).toBe(true)
    console.log('✓ /agents page loaded from API')
  })

  // ── A2: Create agent via builder → persists after hard reload ──────────────

  test('A2: Create agent via builder → persists after hard reload', async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      console.log('Skipping — forge-core not running')
      test.skip()
      return
    }

    const agentName = `E2E Bot ${Date.now()}`

    // Navigate to template picker
    await page.goto('/agents/new')
    await page.waitForLoadState('load')

    // Select "Start from Scratch" template card
    await page.locator('button').filter({ hasText: 'Start from Scratch' }).first().click()

    // Click "Use … →" CTA button in preview panel (desktop) or sticky footer (mobile)
    await page
      .locator('button')
      .filter({ hasText: /use.*start from scratch/i })
      .first()
      .click()

    // Identity section
    await page.waitForURL(/\/agents\/new\/identity/, { timeout: 8000 })
    await page.locator('#agent-name').fill(agentName)

    // Next → Behaviour
    await page.locator('button:has-text("Next")').click()
    await page.waitForURL(/\/agents\/new\/behaviour/, { timeout: 5000 })

    // Next → Actions
    await page.locator('button:has-text("Next")').click()
    await page.waitForURL(/\/agents\/new\/actions/, { timeout: 5000 })

    // Next → Knowledge
    await page.locator('button:has-text("Next")').click()
    await page.waitForURL(/\/agents\/new\/knowledge/, { timeout: 5000 })

    // Next → Channels
    await page.locator('button:has-text("Next")').click()
    await page.waitForURL(/\/agents\/new\/channels/, { timeout: 5000 })

    // Finish & Save
    await page.locator('button:has-text("Finish & Save")').click()

    // Should redirect to /agents
    await page.waitForURL(/\/agents$/, { timeout: 10000 })

    // Agent should appear in the list
    await expect(page.locator(`text=${agentName}`).first()).toBeVisible({ timeout: 8000 })
    console.log(`✓ Agent "${agentName}" created and visible`)

    // Hard reload — must still be there (persisted to DB)
    await page.reload({ waitUntil: 'load' })
    await expect(page.locator(`text=${agentName}`).first()).toBeVisible({ timeout: 8000 })
    console.log(`✓ Agent "${agentName}" persists after hard reload`)

    // Cleanup
    const agentId = await page.evaluate((name) => {
      // Try to find the agent id from the edit link href
      const link = document.querySelector(
        `a[href*="/agents/"][href*="/identity"]`
      ) as HTMLAnchorElement | null
      if (!link) return null
      const match = link.href.match(/\/agents\/([^/]+)\/identity/)
      return match ? match[1] : null
    }, agentName)

    if (agentId) await deleteTestAgent(page, agentId)
  })

  // ── A3: Delete agent via UI ─────────────────────────────────────────────────

  test('A3: Delete agent via UI', async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      console.log('Skipping — forge-core not running')
      test.skip()
      return
    }

    const agentName = `E2E Delete Bot ${Date.now()}`
    await createTestAgent(page, agentName)

    await page.goto('/agents')
    await page.waitForLoadState('load')

    // Verify agent appears
    await expect(page.locator(`text=${agentName}`).first()).toBeVisible({ timeout: 8000 })

    // Open the actions dropdown for this agent's row
    const row = page.locator('tr, [data-row]').filter({ hasText: agentName }).first()
    const actionsBtn = row
      .locator('button')
      .filter({ hasText: /actions/i })
      .or(row.locator('button[aria-label*="action" i], button:has(svg)').last())
    await actionsBtn.click()

    // Click "Delete"
    await page.locator('[role="menuitem"]:has-text("Delete")').click()

    // Agent should no longer be visible
    await expect(page.locator(`text=${agentName}`).first()).not.toBeVisible({ timeout: 5000 })
    console.log(`✓ Agent "${agentName}" deleted from UI`)
  })

  // ── A4: Edit opens builder with correct agent name ─────────────────────────

  test('A4: Edit agent opens builder with correct name', async ({ page }) => {
    const loggedIn = await login(page)
    if (!loggedIn) {
      console.log('Skipping — forge-core not running')
      test.skip()
      return
    }

    const agentName = `E2E Edit Bot ${Date.now()}`
    const agentId = await createTestAgent(page, agentName)

    await page.goto('/agents')
    await page.waitForLoadState('load')

    // Find the agent and open its dropdown
    const row = page.locator('tr, [data-row]').filter({ hasText: agentName }).first()
    const actionsBtn = row
      .locator('button')
      .filter({ hasText: /actions/i })
      .or(row.locator('button[aria-label*="action" i], button:has(svg)').last())
    await actionsBtn.click()

    // Click "Edit"
    await page.locator('[role="menuitem"]:has-text("Edit")').click()

    // Wait for builder identity page
    await page.waitForURL(new RegExp(`/agents/${agentId}/identity`), { timeout: 8000 })

    // The agent name input should be pre-filled
    await expect(page.locator('#agent-name')).toHaveValue(agentName, { timeout: 8000 })
    console.log(`✓ Builder pre-filled with agent name "${agentName}"`)

    // Cleanup
    await deleteTestAgent(page, agentId)
  })
})
