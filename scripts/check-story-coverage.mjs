/**
 * check-story-coverage.mjs
 *
 * Ensures every component file passed as an argument has a sibling *.stories.tsx.
 * Run directly or via lint-staged — lint-staged passes staged filenames as argv.
 *
 * Exit codes:
 *   0 — all checked files have stories
 *   1 — one or more files are missing a story
 *
 * Usage:
 *   node scripts/check-story-coverage.mjs <file> [<file> ...]
 *   node scripts/check-story-coverage.mjs packages/ui/src/button.tsx
 */

import { existsSync } from 'fs'
import { basename, dirname, join } from 'path'

// Filenames excluded from story coverage requirement.
// - index files (barrel exports, not components)
// - test/story files themselves
// - files whose name starts with lowercase (hooks, utils, context, etc.)
// - infrastructure wrappers: *Loader, *Provider, *Context — thin wrappers with no UI of their own
const EXCLUDED_PATTERNS = [
  /^index\.(tsx?|jsx?)$/,
  /\.stories\.(tsx?|jsx?)$/,
  /\.test\.(tsx?|jsx?)$/,
  /\.d\.ts$/,
  /Loader\.(tsx?|jsx?)$/,
  /Provider\.(tsx?|jsx?)$/,
  /Context\.(tsx?|jsx?)$/,
]

function isExcluded(filename) {
  if (EXCLUDED_PATTERNS.some((re) => re.test(filename))) return true
  // Lowercase-first = hook, util, type file — not a component
  if (/^[a-z]/.test(filename)) return true
  return false
}

const args = process.argv.slice(2)

if (args.length === 0) {
  console.log('check-story-coverage: no files passed, nothing to check.')
  process.exit(0)
}

let failed = false

for (const filePath of args) {
  const filename = basename(filePath)

  if (isExcluded(filename)) continue

  const dir = dirname(filePath)
  const base = filename.replace(/\.(tsx?|jsx?)$/, '')
  const storyFile = join(dir, `${base}.stories.tsx`)

  if (!existsSync(storyFile)) {
    console.error(
      `✗ Missing story: ${filePath}\n` +
        `  Expected: ${storyFile}\n` +
        `  Every component in packages/ui/src/ and apps/web/src/features/*/components/ requires a *.stories.tsx`
    )
    failed = true
  }
}

if (failed) {
  console.error(
    '\nAdd the missing story file(s) and stage them, or use the /new-component skill to scaffold both at once.'
  )
  process.exit(1)
}
