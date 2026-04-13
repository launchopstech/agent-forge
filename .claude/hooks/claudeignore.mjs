#!/usr/bin/env node
/**
 * PreToolUse hook — blocks Read/Glob/Grep on paths matching .claudeignore patterns.
 * Self-contained: no external dependencies.
 * Exit 2 = block the tool call with an error message (Claude sees the stderr output).
 */

import { existsSync, readFileSync } from 'fs'
import { join, relative, resolve, dirname } from 'path'

/**
 * Walk up from startDir looking for .claudeignore files.
 * Returns them ordered from root → closest (so closer files override outer ones).
 */
function findIgnoreFiles(startDir) {
  const files = []
  let dir = resolve(startDir)
  const root = resolve('/')
  while (true) {
    const candidate = join(dir, '.claudeignore')
    if (existsSync(candidate)) files.unshift(candidate)
    if (dir === root) break
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return files
}

/**
 * Parse a .claudeignore / .gitignore-style file into pattern strings.
 * Strips blank lines and comments.
 */
function parsePatterns(filePath) {
  return readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
}

/**
 * Minimal gitignore-style match — handles the common cases:
 *   node_modules/   → any path segment named "node_modules"
 *   *.tsbuildinfo   → any file whose name matches the glob
 *   .next/          → any path segment ".next"
 *   pnpm-lock.yaml  → exact filename
 *   /dist/          → directory at repo root only
 */
function matchesPattern(relPath, pattern) {
  // Normalise separators
  relPath = relPath.replace(/\\/g, '/')

  // Strip trailing slash from pattern (marks it as dir-only, but we match either way)
  const pat = pattern.replace(/\/$/, '')

  // If pattern starts with /, anchor to repo root
  if (pat.startsWith('/')) {
    const anchored = pat.slice(1)
    return relPath === anchored || relPath.startsWith(anchored + '/')
  }

  // Glob: * matches within a single segment, ** matches across segments
  // Convert to regex
  const escaped = pat
    .replace(/[.+^${}()|[\]\\]/g, '\\$&') // escape regex specials except * and ?
    .replace(/\*\*/g, '\x00')              // placeholder for **
    .replace(/\*/g, '[^/]*')               // * → match within segment
    .replace(/\?/g, '[^/]')               // ? → single char
    .replace(/\x00/g, '.*')               // ** → match across segments

  const re = new RegExp(`(^|/)${escaped}(/|$)`)
  return re.test(relPath)
}

function shouldIgnore(relPath, patterns) {
  for (const pattern of patterns) {
    if (matchesPattern(relPath, pattern)) return pattern
  }
  return null
}

// ── Main ──────────────────────────────────────────────────────────────────────

const cwd = process.cwd()

// Load all patterns
const ignoreFiles = findIgnoreFiles(cwd)
const patterns = ignoreFiles.flatMap(parsePatterns)

if (patterns.length === 0) process.exit(0)

// Read tool input from stdin
const chunks = []
for await (const chunk of process.stdin) chunks.push(chunk)

let toolInput
try {
  toolInput = JSON.parse(Buffer.concat(chunks).toString())
} catch {
  process.exit(0) // malformed input — let Claude handle it
}

// Extract the file path from whichever field the tool uses
const rawPath =
  toolInput?.tool_input?.file_path ||
  toolInput?.tool_input?.path ||
  toolInput?.tool_input?.pattern || // Glob tool
  ''

if (!rawPath) process.exit(0)

// Resolve and make relative to cwd
const absPath = resolve(rawPath)
const relPath = relative(cwd, absPath)

// If the path escapes the project root, don't block it
if (relPath.startsWith('..')) process.exit(0)

const matched = shouldIgnore(relPath, patterns)
if (matched) {
  process.stderr.write(`claudeignore: skipping ${relPath} (matches pattern "${matched}")\n`)
  process.exit(2)
}

process.exit(0)
