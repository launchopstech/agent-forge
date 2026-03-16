# Monorepo Refactor Spec

**Goal:** Convert single Next.js 16 app → pnpm + Turborepo monorepo.
**Pattern:** Internal packages (TypeScript source, no dist), transpiled by Next.js via `transpilePackages`.
**Namespace:** `@forge/*`
**Tooling:** Turborepo + pnpm workspaces v9

---

## Packages to Create

| Package    | Name                | Source files                                                                                    |
| ---------- | ------------------- | ----------------------------------------------------------------------------------------------- |
| tsconfig   | `@forge/tsconfig`   | base.json, react-library.json, nextjs.json                                                      |
| ui         | `@forge/ui`         | src/components/ui/ (47 files) + src/lib/utils.ts                                                |
| auth       | `@forge/auth`       | src/lib/auth/ (18 files) + src/lib/auth.ts                                                      |
| brand      | `@forge/brand`      | src/config/brands/, src/lib/brand-utils.ts, src/lib/tenant-context.tsx, src/hooks/use-tenant.ts |
| i18n       | `@forge/i18n`       | src/i18n/ (5 files) + src/messages/                                                             |
| api-client | `@forge/api-client` | src/lib/api-client.ts + test                                                                    |
| config     | `@forge/config`     | src/config/env.ts, site.ts, nav.ts, properties.ts, themes/, src/types/index.ts                  |

## App

| App | Name         | Contents                                                                               |
| --- | ------------ | -------------------------------------------------------------------------------------- |
| web | `@forge/web` | All current Next.js code (src/app, layout components, features, hooks, e2e, storybook) |

---

## Phase A — Scaffolding ✅

- [x] A1: Create `pnpm-workspace.yaml` with packages/apps globs + catalog
- [x] A2: Create `packages/tsconfig/` — package.json, base.json, react-library.json, nextjs.json
- [x] A3: Create root `package.json` with turbo scripts (dev, build, lint, typecheck, test, test:coverage, storybook:build, analyze, chromatic)
- [x] A4: Install turbo, create `turbo.json` with task pipeline
- [x] A5: Create skeleton `package.json` for each of the 6 packages (no src/ yet)
- [x] A6: Delete root `package-lock.json`, add to `.gitignore`
- [x] A7: `pnpm install` — verify workspace resolves

**Gate:** `pnpm install --frozen-lockfile` passes

---

## Phase B — Create `apps/web` ✅

- [x] B1: Create `apps/web/` directory
- [x] B2: Copy src/, public/, e2e/, .storybook/, all root config files into apps/web/
- [x] B3: Create `apps/web/package.json` — all current deps using `catalog:` versions + `@forge/* workspace:*`
- [x] B4: Update `apps/web/tsconfig.json` — extends `@forge/tsconfig/nextjs.json`, keep `@/` aliases
- [x] B5: Add `transpilePackages` to `apps/web/next.config.mjs` (critical — app fails at runtime without this)

**Gate:** `pnpm --filter=@forge/web build` + `pnpm --filter=@forge/web typecheck` pass

---

## Phase C — Extract Packages (in dependency order) ✅

After each step: `pnpm --filter=<pkg> typecheck` then `pnpm --filter=@forge/web typecheck`

### C1 — `@forge/config` ✅

- [x] Move: env.ts, site.ts, nav.ts, properties.ts, themes/, src/types/index.ts → packages/config/src/
- [x] Create packages/config/src/index.ts barrel
- [x] Update all `@/config/*` and `@/types/*` in apps/web → `@forge/config/*`
- [x] env.test.ts moves to packages/config/src/

### C2 — `@forge/brand` ✅

- [x] Move: src/config/brands/ → packages/brand/src/config/
- [x] Move: src/lib/brand-utils.ts, src/lib/tenant-context.tsx, src/hooks/use-tenant.ts → packages/brand/src/
- [x] Update internal cross-refs (BrandConfig from relative path)
- [x] Update apps/web: `@/config/brands`, `@/lib/brand-utils`, `@/lib/tenant-context`, `@/hooks/use-tenant` → `@forge/brand/*`
- [x] Update .storybook/preview.tsx imports
- [x] Create packages/brand/vitest.config.mts
- [x] `pnpm --filter=@forge/brand test:coverage`

### C3 — `@forge/api-client` ✅

- [x] Move: src/lib/api-client.ts + api-client.test.ts → packages/api-client/src/
- [x] Create packages/api-client/src/index.ts barrel
- [x] Update apps/web: `@/lib/api-client` → `@forge/api-client`
- [x] Create packages/api-client/vitest.config.mts
- [x] `pnpm --filter=@forge/api-client test:coverage`

### C4 — `@forge/i18n` ✅

- [x] Move: src/i18n/{routing,request,navigation,actions,i18n.test}.ts → packages/i18n/src/
- [x] Move: src/messages/ → packages/i18n/messages/
- [x] Create thin wrapper: apps/web/src/i18n/request.ts → `export { default } from '@forge/i18n/request'`
- [x] Update i18n.test.ts messagesDir path (verify `join(__dirname, '../messages')` still valid)
- [x] Update apps/web: `@/i18n/*`, `@/messages/*` → `@forge/i18n/*`
- [x] Create packages/i18n/vitest.config.mts
- [x] `pnpm --filter=@forge/i18n test`

### C5 — `@forge/auth` ✅

- [x] Move: entire src/lib/auth/ → packages/auth/src/; src/lib/auth.ts → packages/auth/src/auth.ts
- [x] Update internal: `@/config/properties` → `@forge/config/properties`
- [x] Update apps/web: all `@/lib/auth*` imports → `@forge/auth/*`
- [x] Update apps/web/src/hooks/use-user.ts → imports from `@forge/auth`
- [x] Update apps/web/src/proxy.ts → `@forge/auth` middleware
- [x] Verify Edge/Node boundary: middleware-registry.ts must NOT import server-registry.ts
- [x] `pnpm --filter=@forge/auth typecheck`

### C6 — `@forge/ui` ✅

- [x] Move: src/components/ui/ → packages/ui/src/; src/lib/utils.ts → packages/ui/src/utils.ts
- [x] Update all `@/lib/utils` inside UI components → relative `'./utils'`
- [x] use-mobile.ts kept in packages/ui/src/ (sidebar.tsx depends on it); apps/web/src/hooks/use-mobile.ts re-exports from `@forge/ui/src/use-mobile`
- [x] apps/web/src/lib/utils.ts → `export { cn } from '@forge/ui/src/utils'`
- [x] Update components.json to point to packages/ui/
- [x] Create packages/ui/vitest.config.mts
- [x] `pnpm --filter=@forge/ui test:coverage`

---

## Phase D — Clean Root ✅

- [x] Delete from apps/web/src/ all files now canonical in packages/:
  - src/lib/auth/, auth.ts, brand-utils.ts, tenant-context.tsx, api-client.ts
  - src/config/brands/, env.ts, nav.ts, site.ts, properties.ts, themes/, src/types/index.ts
  - src/i18n/, src/messages/
  - src/hooks/use-tenant.ts
  - src/components/ui/
- [x] Delete from repo root: next.config.mjs, tsconfig.json, vitest.config.mts, postcss.config.mjs, playwright.config.ts, .storybook/, e2e/, src/
- [x] `turbo build` from root

**Gate:** All 6 gate checks pass via turbo from root:
`pnpm typecheck && pnpm lint && pnpm build && pnpm test:coverage && pnpm storybook:build && pnpm analyze`

---

## Phase E — Storybook ✅

- [x] Update apps/web/.storybook/main.ts: extend stories glob to `../../../packages/ui/src/**/*.stories.@(ts|tsx)`
- [x] Update apps/web/.storybook/main.ts viteFinal: add `@forge/*` aliases pointing to packages/\*/src
- [x] Update apps/web/.storybook/preview.tsx: all imports to `@forge/brand/*`, `@forge/i18n/messages/*`
- [x] Update apps/web/components.json: ui path → packages/ui/src

**Gate:** `pnpm storybook:build` passes from root

---

## Phase F — CI/CD ✅

- [x] Update shared-checks.yml: add Turbo local cache step after pnpm install in each job
- [x] Update shared-checks.yml Chromatic step: `pnpm --filter=@forge/web exec chromatic --exit-zero-on-changes --build-script-name=storybook:build`
- [x] Update ESLint root config: `files: ['**/src/**/*.tsx']` for i18next rule; extend ignores
- [x] Verify all GitHub Actions workflows pass on a feature branch

---

## Adding a New Client App (Agency Model)

```
apps/client-x/
  package.json          # name: @forge/client-x, deps: @forge/* workspace:*
  next.config.mjs       # transpilePackages: same list as apps/web
  tsconfig.json         # extends @forge/tsconfig/nextjs.json
  src/app/              # client-x specific routes
  public/
```

1. Add `packages/brand/src/config/client-x.ts`
2. Register in `packages/brand/src/config/index.ts` brandRegistry + BrandKey union
3. Set `NEXT_PUBLIC_BRAND=client-x` in client-x Vercel environment
4. Create `.github/workflows/ci-client-x.yml` calling shared-checks.yml

---

## Gotchas (read before each phase)

1. **`transpilePackages` mandatory** — without it packages fail at runtime
2. **next-intl plugin path** — use thin wrapper at apps/web/src/i18n/request.ts
3. **Storybook Vite aliases manual** — vite-tsconfig-paths does not auto-resolve `@forge/*`
4. **Catalog + frozen-lockfile** — regenerate pnpm-lock.yaml locally before CI
5. **package-lock.json** — delete from root, add to .gitignore
6. **Auth Edge/Node boundary** — middleware-registry must never import server-registry
7. **`isolatedModules: true`** — type-only re-exports must use `export type {}`
8. **Turbo outputs** — always exclude `.next/cache/**`
9. **use-mobile duplication** — kept in `packages/ui/src/` (sidebar.tsx depends on it); `apps/web/src/hooks/use-mobile.ts` re-exports from `@forge/ui/src/use-mobile` instead of duplicating
