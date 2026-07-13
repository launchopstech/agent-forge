import { test, expect } from '@playwright/test'

test('dark mode applies .dark class to html element', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'dark')
  })

  await page.goto('/')
  await page.waitForLoadState('load')
  // next-themes applies the class via a blocking script in <head>
  // Wait for it to appear if hydration is slightly deferred
  await expect(page.locator('html')).toHaveAttribute('class', /dark/, { timeout: 5000 })
})

test('dark mode persists across page reload', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'dark')
  })

  await page.goto('/')
  await page.waitForLoadState('load')
  await expect(page.locator('html')).toHaveAttribute('class', /dark/, { timeout: 5000 })

  await page.reload({ waitUntil: 'load' })
  await expect(page.locator('html')).toHaveAttribute('class', /dark/, { timeout: 5000 })
})

test('light mode does not apply .dark class', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'light')
  })

  await page.goto('/')
  await page.waitForLoadState('load')

  // Either no class attribute, or class attribute without 'dark'
  const htmlClasses = await page.locator('html').getAttribute('class')
  expect(htmlClasses ?? '').not.toContain('dark')
})
