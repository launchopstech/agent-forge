---
name: new-component
description: Scaffold a new UI component with story and test files in the correct monorepo package. Use when the user says "add component", "create component", "new component", or "scaffold component".
argument-hint: '<ComponentName> [package: ui|ai-ui] [with-test]'
---

Scaffold a new component in this monorepo. The component name is: `$ARGUMENTS`

## Package selection

- **`packages/ui/src/`** — generic shadcn-style primitives (buttons, inputs, cards). No app-specific imports. Use `pnpm dlx shadcn@latest add <component>` if adding a shadcn component.
- **`packages/ai-ui/src/`** — AI-specific components (toolbar, panel, canvas, ReactFlow nodes). Usually needs `@xyflow/react`.
- **`apps/web/src/components/`** — app-specific components that import from `@/config`, `@forge/brand`, `@forge/i18n`.

If the user didn't specify, ask which package before proceeding.

## Files to create

### 1. Component file — `<package>/src/<component-name>.tsx`

Rules:

- Default export a named component function
- No `'use client'` unless the component uses state, effects, or browser APIs
- Use `cn()` from `@/lib/utils` (or relative `../lib/utils`) for className composition
- No hardcoded user-visible strings — use props or translation keys
- No app-specific imports in `packages/ui/` or `packages/ai-ui/`
- Follow existing component patterns — read 1-2 existing components first

### 2. Story file — `<package>/src/<component-name>.stories.tsx`

Rules:

- `title: 'Category/ComponentName'` (AI/_ for ai-ui, UI/_ for ui)
- `parameters: { layout: 'fullscreen', noLayoutWrapper: true }` for full-viewport components
- `parameters: { layout: 'centered' }` for small isolated components
- If using ReactFlow: wrap render in `<div style={{ width: '100vw', height: '100vh' }}>`
- Export `Default` story always; export `Dark` story with `parameters: { themes: { themeOverride: 'dark' } }`
- Import React explicitly: `import React from 'react'`

### 3. Test file — `<package>/src/<component-name>.test.tsx` (if requested or if component is in `src/lib/` or `src/hooks/`)

Rules:

- Use Vitest + `@testing-library/react`
- Test render, key interactions, edge cases
- Coverage must not drop below thresholds (lines/statements/branches 80%, functions 60%)

## After creating files

1. Run `pnpm typecheck` to verify no TS errors
2. Run `pnpm lint` to verify no lint errors
3. Remind the user to run `pnpm storybook` to visually verify the story
