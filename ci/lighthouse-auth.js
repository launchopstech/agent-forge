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
    // Navigate to login page
    await page.goto('http://localhost:3000/login', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    console.log('[lighthouse-auth] Navigated to login page')

    // Wait for Clerk's SignIn form to render
    await page.waitForSelector('input[name="identifier"]', { visible: true, timeout: 20000 })
    console.log('[lighthouse-auth] Found email input')

    // Enter email
    await page.type('input[name="identifier"]', email, { delay: 50 })

    // Wait for and click the continue button (Clerk uses various button selectors)
    const continueBtn = await page.waitForSelector(
      'button.cl-formButtonPrimary, button[data-localization-key="formButtonPrimary"], form button[type="submit"]',
      { visible: true, timeout: 5000 }
    )
    await continueBtn.click()

    console.log('[lighthouse-auth] Entered email, waiting for password field')

    // visible: true ensures the field is interactable, not just present in DOM
    await page.waitForSelector('input[name="password"]', { visible: true, timeout: 20000 })

    // Brief pause — Clerk's transition animation may still be running when the field appears
    await new Promise((r) => setTimeout(r, 500))

    console.log('[lighthouse-auth] Found password field')

    // Enter password
    await page.type('input[name="password"]', password, { delay: 50 })

    // Wait for and click the sign in button
    const signInBtn = await page.waitForSelector(
      'button.cl-formButtonPrimary, button[data-localization-key="formButtonPrimary"], form button[type="submit"]',
      { visible: true, timeout: 5000 }
    )
    await signInBtn.click()

    console.log('[lighthouse-auth] Submitted credentials, waiting for redirect')

    // Clerk uses client-side (SPA) navigation after auth — waitForNavigation won't fire.
    // Poll window.location.pathname instead; works for both HTTP and SPA routing.
    await page.waitForFunction(() => !window.location.pathname.startsWith('/login'), {
      timeout: 30000,
      polling: 500,
    })

    console.log('[lighthouse-auth] ✅ Signed in successfully, URL:', page.url())

    // Close the page (cookies persist in the browser context)
    await page.close()
  } catch (error) {
    console.error('[lighthouse-auth] ❌ Authentication failed:', error.message)
    await page.close()
    throw error
  }
}
