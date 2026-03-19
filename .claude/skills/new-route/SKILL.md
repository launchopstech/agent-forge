---
name: new-route
description: Scaffold a new Next.js App Router page with correct route group, layout wiring, and i18n. Use when the user says "add route", "new page", "create page", or "add /path".
argument-hint: '<path> [group: marketing|dashboard|auth]'
---

Scaffold a new Next.js App Router route. Path and group from arguments: `$ARGUMENTS`

## Route group selection

| Group         | Path prefix               | Layout                             | Auth      |
| ------------- | ------------------------- | ---------------------------------- | --------- |
| `(marketing)` | `/`                       | MarketingLayout (Navbar + Footer)  | Public    |
| `(dashboard)` | `/dashboard/...`          | DashboardLayout (Sidebar + Topbar) | Protected |
| `(auth)`      | `/login`, `/signup`, etc. | AuthLayout (centered card)         | Public    |

File location: `apps/web/src/app/[locale]/(group)/path/page.tsx`

## Files to create

### 1. Page file — `apps/web/src/app/[locale]/(group)/<path>/page.tsx`

Rules:

- Server Component by default — no `'use client'` unless state/effects required
- Use `getTranslations('namespace')` from `next-intl/server` for all user-visible text
- No hardcoded strings — all text from `t('key')` calls
- Import layout components via `@/components/layout/` if needed
- For dashboard routes: data fetching goes here; pass data down as props
- Export `generateMetadata` if the page needs custom title/description

Template:

```tsx
import { getTranslations } from 'next-intl/server'

export default async function PageName() {
  const t = await getTranslations('namespace')
  return (
    <main>
      <h1>{t('title')}</h1>
    </main>
  )
}
```

### 2. Translation keys — `apps/web/src/messages/en.json` + `fr.json`

- Add a new namespace for this page
- Mirror identical keys in ALL locale files
- No empty string values

### 3. Nav wiring (if the route should appear in navigation)

- Add to `apps/web/src/config/nav.ts` with `href`, `label`, and `labelKey` fields
- `labelKey` must exist in the `sidebar` namespace in all message files

## After creating files

1. Run `pnpm typecheck` — zero errors
2. Run `pnpm lint` — zero errors/warnings (i18next/no-literal-string catches hardcoded strings)
3. Run `pnpm test run src/i18n/i18n.test.ts` — verifies key parity across locales
