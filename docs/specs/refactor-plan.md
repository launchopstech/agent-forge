Plan: i18n Fix + Codebase Cleanup (Phase 1 of 2)

Context

After the mono-repo refactor, i18n is broken and duplicate/dead  
 files need removal. Storybook UI stories are a separate follow-up  
 task.

Issues:

1.  [locale]/layout.tsx double-wraps with NextIntlClientProvider
    (root layout already provides it)
2.  localePrefix: 'as-needed' generates /fr/\* middleware redirects
    but no pages exist there → 404
3.  LocaleSwitcher only in dashboard topbar — marketing and auth
    pages have no way to switch locale
4.  Duplicate wrapper files in apps/web/src/i18n/ re-export from
    @forge/i18n but add no value
5.  Dead [locale]/layout.tsx logic can be simplified

---

Fix 1 — i18n Architecture (cookie-based, no URL prefix)

A. packages/i18n/src/routing.ts
Change localePrefix: 'as-needed' → localePrefix: 'never'.
Stops next-intl middleware generating dead /fr/\* redirects.

B. apps/web/src/app/[locale]/layout.tsx
Remove the NextIntlClientProvider re-wrap. Root layout handles it.
Keep locale validation + generateStaticParams (future SEO value).
export default async function LocaleLayout({ children, params }) {
const { locale } = await params
if (!hasLocale(routing.locales, locale)) notFound()
return <>{children}</> // no provider wrapper
}

C. apps/web/src/components/layout/Navbar.tsx
Add LocaleSwitcher to the right side of the Navbar (next to CTA
buttons).
LocaleSwitcher already exists at
apps/web/src/components/LocaleSwitcher.tsx.

D. apps/web/src/components/layout/AuthLayout.tsx
Add LocaleSwitcher to the top-right corner so users can switch
locale before login.

---

Fix 2 — Cleanup Duplicate/Dead Files

Duplicate i18n wrapper files — apps/web/src/i18n/ contains 4 files
that are pure re-exports of @forge/i18n/\* with no added logic:

- apps/web/src/i18n/routing.ts → re-exports @forge/i18n/routing
- apps/web/src/i18n/navigation.ts → re-exports
  @forge/i18n/navigation
- apps/web/src/i18n/actions.ts → re-exports @forge/i18n/actions
- apps/web/src/i18n/request.ts → re-exports @forge/i18n/request
- apps/web/src/i18n/i18n.test.ts → intentionally empty (comment
  only)

Action: Check all import sites in apps/web/src/ — if they all
import from @forge/i18n/_ directly (via tsconfig paths), delete
the wrapper files. If any file still imports from @/i18n/_, update
those imports first then delete.

Exception: next.config.mjs references './src/i18n/request.ts' —
this must point to the real request.ts in @forge/i18n. After
removing the wrapper, update next.config.mjs to point directly to
the package source:
const withNextIntl =
createNextIntlPlugin('../../packages/i18n/src/request.ts')
OR keep a thin src/i18n/request.ts stub that just re-exports
(required because createNextIntlPlugin needs a path in the app —
not a package import). Only delete the other 3 wrappers (routing,
navigation, actions); keep request.ts for next.config.mjs
compatibility.

Other dead files to audit:

- apps/web/src/i18n/i18n.test.ts — empty file (just a comment),
  delete it
- Verify no stale apps/web/src/components/ui/ folder left from
  pre-monorepo (shadcn components moved to packages/ui)
- Verify no duplicate LocaleSwitcher exists in old location

---

Fix 3 — Gate Check Pass

After all changes, run in order:
pnpm typecheck # zero TS errors
pnpm lint # zero errors/warnings
pnpm build # production build must succeed
pnpm test:coverage # all tests pass, 80%+ coverage
pnpm storybook:build # all stories compile

---

Critical Files

┌────────────────────────────────────────┬────────────────────┐
│ File │ Change │
├────────────────────────────────────────┼────────────────────┤
│ packages/i18n/src/routing.ts │ localePrefix: │
│ │ 'never' │
├────────────────────────────────────────┼────────────────────┤
│ │ Remove NextIntlCli │
│ apps/web/src/app/[locale]/layout.tsx │ entProvider │
│ │ wrapper │
├────────────────────────────────────────┼────────────────────┤
│ apps/web/src/components/layout/Navbar. │ Add LocaleSwitcher │
│ tsx │ import + render │
├────────────────────────────────────────┼────────────────────┤
│ apps/web/src/components/layout/AuthLay │ Add LocaleSwitcher │
│ out.tsx │ import + render │
├────────────────────────────────────────┼────────────────────┤
│ apps/web/src/i18n/routing.ts │ DELETE (pure │
│ │ re-export, unused) │
├────────────────────────────────────────┼────────────────────┤
│ apps/web/src/i18n/navigation.ts │ DELETE (pure │
│ │ re-export, unused) │
├────────────────────────────────────────┼────────────────────┤
│ apps/web/src/i18n/actions.ts │ DELETE (pure │
│ │ re-export, unused) │
├────────────────────────────────────────┼────────────────────┤
│ apps/web/src/i18n/i18n.test.ts │ DELETE (empty │
│ │ file) │
├────────────────────────────────────────┼────────────────────┤
│ apps/web/src/i18n/request.ts │ KEEP (required by │
│ │ next.config.mjs) │
├────────────────────────────────────────┼────────────────────┤
│ apps/web/next.config.mjs │ No change needed │
│ │ (request.ts kept) │
└────────────────────────────────────────┴────────────────────┘

Existing utilities to reuse:

- LocaleSwitcher at apps/web/src/components/LocaleSwitcher.tsx
- All imports use @forge/i18n/\* tsconfig paths directly

---

Verification

1.  pnpm dev → / → Navbar shows locale switcher → switch FR →
    marketing text changes to French
2.  /login → AuthLayout shows locale switcher top-right
3.  /dashboard → existing LocaleSwitcher in topbar still works
4.  All 5 gate checks green
5.  No files left in apps/web/src/i18n/ except request.ts
    ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
