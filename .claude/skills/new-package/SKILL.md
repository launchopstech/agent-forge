---
name: new-package
description: Scaffold a new internal package in the monorepo with correct package.json, tsconfig, and Turborepo wiring. Use when the user says "add package", "new package", "create package", or "add monorepo package".
argument-hint: '<package-name> [description]'
---

Scaffold a new internal package in this pnpm + Turborepo monorepo. Package name: `$ARGUMENTS`

## Package naming convention

Internal packages use the `@forge/` scope. If the user gives a bare name like `utils`, the package name is `@forge/utils` and the directory is `packages/utils/`.

## Files to create

### `packages/<name>/package.json`

```json
{
  "name": "@forge/<name>",
  "version": "0.0.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint src/"
  },
  "devDependencies": {
    "typescript": "5.7.3"
  }
}
```

### `packages/<name>/tsconfig.json`

Read `packages/ui/tsconfig.json` first to copy the exact extends path and settings.

### `packages/<name>/src/index.ts`

```ts
// Public exports for @forge/<name>
export {}
```

## Wiring

1. **`pnpm-workspace.yaml`** — already includes `packages/*` glob, no change needed unless the directory is outside `packages/`.

2. **`turbo.json`** — verify that `typecheck` and `lint` pipeline tasks are defined. If not, add them.

3. **Consuming in `apps/web`** — if the user wants `apps/web` to use this package:
   - Add `"@forge/<name>": "workspace:*"` to `apps/web/package.json` dependencies
   - Add path alias to `apps/web/tsconfig.json` if needed
   - Run `pnpm install` to link the workspace package

## After creating files

```bash
pnpm install
pnpm typecheck
```

Confirm the new package typechecks cleanly and the workspace link resolves.
