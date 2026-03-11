/* eslint-disable no-console */
/**
 * LHCI Puppeteer auth script.
 * Runs before each Lighthouse audit to authenticate via Clerk's SignIn UI,
 * so LHCI can audit protected routes like /dashboard.
 *
 * Required env vars (set in GitHub Secrets):
 *   LIGHTHOUSE_TEST_EMAIL     — Clerk test user email
 *   LIGHTHOUSE_TEST_PASSWORD  — Clerk test user password
 *
 * To create a test user:
 *   Go to Clerk Dashboard → Users → Create user, or use the Clerk API.
 *   Use a dedicated CI-only account, not a personal one.
 */

'use strict'

/**
 * @param {import('puppeteer').Browser} browser
 * @param {{url: string}} context
 */
module.exports = async (browser, context) => {
  const email = process.env.LIGHTHOUSE_TEST_EMAIL
  const password = process.env.LIGHTHOUSE_TEST_PASSWORD

  if (!email || !password) {
    console.warn('[lighthouse-auth] Skipping auth — LIGHTHOUSE_TEST_EMAIL/PASSWORD not set')
    return
  }

  console.log('[lighthouse-auth] Starting authentication for:', context.url)

  // Create a new page from the browser instance
  const page = await browser.newPage()

  try {
    // Navigate to sign-in page (not signup)
    await page.goto('http://localhost:3000/sign-in', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    console.log('[lighthouse-auth] Navigated to sign-in page, URL:', page.url())

    // Clerk SignIn uses 'identifier' for email, SignUp uses 'emailAddress'
    // Try SignIn selector first, fall back to SignUp selector
    const emailSelector = await Promise.race([
      page
        .waitForSelector('input[name="identifier"]', { visible: true, timeout: 10000 })
        .then(() => 'input[name="identifier"]'),
      page
        .waitForSelector('input[name="emailAddress"]', { visible: true, timeout: 10000 })
        .then(() => 'input[name="emailAddress"]'),
    ])

    console.log('[lighthouse-auth] Found email input:', emailSelector)

    // Enter email
    await page.type(emailSelector, email, { delay: 50 })

    // Check if password field is already visible (single-step form) or needs continue button (multi-step)
    const passwordVisible = await page
      .$('input[name="password"]:not([type="hidden"])')
      .then((el) => el !== null)

    if (!passwordVisible) {
      console.log('[lighthouse-auth] Multi-step form detected, clicking continue')
      // Multi-step: click continue button
      const continueBtn = await page.waitForSelector('button.cl-formButtonPrimary', {
        visible: true,
        timeout: 5000,
      })
      await continueBtn.click()
      // Wait for password field to appear
      await page.waitForSelector('input[name="password"]', { visible: true, timeout: 20000 })
      await new Promise((r) => setTimeout(r, 500))
    }

    console.log('[lighthouse-auth] Found password field')

    // Enter password
    await page.type('input[name="password"]', password, { delay: 50 })

    // Click submit button
    const submitBtn = await page.waitForSelector('button.cl-formButtonPrimary', {
      visible: true,
      timeout: 5000,
    })
    await submitBtn.click()

    console.log('[lighthouse-auth] Submitted credentials, waiting for redirect')

    // Clerk uses client-side (SPA) navigation after auth — waitForNavigation won't fire.
    // Poll window.location.pathname instead; works for both HTTP and SPA routing.
    await page.waitForFunction(
      () =>
        !window.location.pathname.includes('sign-in') &&
        !window.location.pathname.includes('login'),
      { timeout: 30000, polling: 500 }
    )

    console.log('[lighthouse-auth] ✅ Signed in successfully, URL:', page.url())

    // Close the page (cookies persist in the browser context)
    await page.close()
  } catch (error) {
    console.error('[lighthouse-auth] ❌ Authentication failed:', error.message)
    await page.close()
    throw error
  }
}
