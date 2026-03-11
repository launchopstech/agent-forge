import { type Page, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

interface CheckA11yOptions {
  /** axe rule IDs to exclude from the analysis */
  disableRules?: string[]
}

export async function checkA11y(page: Page, options: CheckA11yOptions = {}) {
  let builder = new AxeBuilder({ page })
  if (options.disableRules?.length) {
    builder = builder.disableRules(options.disableRules)
  }
  const results = await builder.analyze()
  expect(results.violations).toEqual([])
}
