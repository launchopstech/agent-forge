import { test, expect } from '@playwright/test'

test.describe('Marketing landing page', () => {
  test('renders ownership-led copy and signup CTA', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: 'AI agents your business actually owns.' })
    ).toBeVisible()
    await expect(page.getByText('Launch a customer support agent in minutes')).toBeVisible()
    await expect(page.getByRole('heading', { name: /You need control/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /owned agent in three steps/i })).toBeVisible()
    await expect(page.getByRole('navigation').getByText('mindrithm')).toBeVisible()
    await expect(
      page.getByRole('navigation').getByRole('img', { name: 'MindRithm' })
    ).toHaveAttribute('src', /\/brands\/mindrithm\/logo-icon\.svg/)

    const signupLinks = page.getByRole('link', { name: /get started free/i })
    await expect(signupLinks.first()).toHaveAttribute('href', '/signup')
    await expect(
      page.getByRole('navigation').getByRole('link', { name: /log in/i })
    ).toHaveAttribute('href', '/login')
    await expect(
      page.getByRole('navigation').getByRole('link', { name: /ownership/i })
    ).toHaveAttribute('href', '#ownership')
    await expect(page.locator('#ownership')).toBeVisible()
    await expect(page.locator('footer').getByRole('link', { name: /ownership/i })).toHaveAttribute(
      'href',
      '#ownership'
    )
  })

  test('renders the demo CTA only when demo env is configured', async ({ page }) => {
    await page.goto('/')

    const demoAgentId = process.env.NEXT_PUBLIC_DEMO_AGENT_ID?.trim()
    const demoShareToken = process.env.NEXT_PUBLIC_DEMO_SHARE_TOKEN?.trim()
    const demoLinks = page.getByRole('link', { name: /see demo|open demo/i })

    if (demoAgentId && demoShareToken) {
      await expect(demoLinks.first()).toHaveAttribute(
        'href',
        `/chat/${encodeURIComponent(demoAgentId)}?token=${encodeURIComponent(demoShareToken)}`
      )
      return
    }

    await expect(demoLinks).toHaveCount(0)
  })

  test('footer app links resolve', async ({ page, request }) => {
    await page.goto('/')

    const appLinks = await page
      .locator('footer a[href^="/"]')
      .evaluateAll((links) =>
        Array.from(new Set(links.map((link) => link.getAttribute('href')).filter(Boolean)))
      )

    for (const href of appLinks) {
      const response = await request.get(href as string)
      expect(response.status(), `${href} should resolve`).toBeLessThan(400)
    }
  })

  test('mobile layout keeps hero and CTAs readable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: 'AI agents your business actually owns.' })
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /get started free/i }).first()).toBeVisible()
  })
})
