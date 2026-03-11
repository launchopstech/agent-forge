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
 * Clerk SignIn flow (multi-step):
 *   1. Enter email → Click "Continue"
 *   2. Enter password → Click "Sign In"
 */

'use strict'

module.exports = async (browser, context) => {
  const email = process.env.LIGHTHOUSE_TEST_EMAIL
  const password = process.env.LIGHTHOUSE_TEST_PASSWORD

  if (!email || !password) {
    console.warn('[lighthouse-auth] Skipping auth — credentials not set')
    return
  }

  console.log('[lighthouse-auth] Starting authentication for:', context.url)
  console.log(
    '[lighthouse-auth] Email provided:',
    email ? `${email.substring(0, 3)}***` : 'MISSING'
  )
  console.log('[lighthouse-auth] Password provided:', password ? 'YES (hidden)' : 'MISSING')

  const page = await browser.newPage()

  try {
    // Navigate to login page - use domcontentloaded instead of networkidle0
    // because Clerk has long-running websocket connections
    await page.goto('http://localhost:3000/login', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    })

    console.log('[lighthouse-auth] Current URL:', page.url())

    // Check if already authenticated (redirected away from login)
    if (!page.url().includes('login') && !page.url().includes('sign-in')) {
      console.log('[lighthouse-auth] ✅ Already authenticated')
      await page.close()
      return
    }

    // Wait for Clerk form to render
    console.log('[lighthouse-auth] Waiting for Clerk form...')

    // Step 1: Enter email
    const emailInput = await page.waitForSelector('input[name="identifier"]', {
      visible: true,
      timeout: 20000,
    })
    console.log('[lighthouse-auth] Step 1: Entering email')
    await emailInput.type(email, { delay: 50 })

    // Click Continue button
    const continueBtn = await page.waitForSelector('button.cl-formButtonPrimary', {
      visible: true,
      timeout: 10000,
    })
    await continueBtn.click()
    console.log('[lighthouse-auth] Step 1: Clicked Continue')

    // Step 2: Wait for password field (appears after email step)
    await page.waitForSelector('input[name="password"]', { visible: true, timeout: 20000 })
    await new Promise((r) => setTimeout(r, 500))
    console.log('[lighthouse-auth] Step 2: Entering password')
    await page.type('input[name="password"]', password, { delay: 50 })

    // Click Sign In button
    const signInBtn = await page.waitForSelector('button.cl-formButtonPrimary', {
      visible: true,
      timeout: 10000,
    })
    await signInBtn.click()
    console.log('[lighthouse-auth] Step 2: Clicked Sign In')

    // Wait for successful authentication - should redirect to dashboard or home
    await page.waitForFunction(
      () => {
        const path = window.location.pathname
        return path.includes('dashboard') || path === '/'
      },
      { timeout: 30000, polling: 500 }
    )

    console.log('[lighthouse-auth] ✅ Signed in successfully, URL:', page.url())
    await page.close()
  } catch (error) {
    console.error('[lighthouse-auth] ❌ Authentication failed:', error.message)
    try {
      console.log('[lighthouse-auth] Debug - Current URL:', page.url())
      const inputs = await page.$$eval('input', (els) =>
        els.map((e) => ({ name: e.name, type: e.type, id: e.id }))
      )
      console.log('[lighthouse-auth] Debug - Inputs:', JSON.stringify(inputs))

      // Check for Clerk error messages
      const errorText = await page
        .$$eval('.cl-formFieldErrorText, [data-localization-key*="error"], .cl-alert', (els) =>
          els.map((e) => e.textContent?.trim()).filter(Boolean)
        )
        .catch(() => [])
      if (errorText.length > 0) {
        console.log('[lighthouse-auth] Debug - Clerk errors:', errorText)
      }

      // Show page text for context
      const pageText = await page
        .evaluate(() => document.body.innerText.substring(0, 800))
        .catch(() => '')
      console.log('[lighthouse-auth] Debug - Page text:', pageText)
    } catch {
      // Ignore
    }
    await page.close()
    throw error
  }
}
