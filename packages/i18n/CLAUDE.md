# @forge/i18n

next-intl setup for the monorepo.

## Rules

- No hardcoded user-visible strings in JSX — ESLint `i18next/no-literal-string` enforces this
- **Server Components**: `const t = await getTranslations('namespace')` from `next-intl/server`
- **Client Components**: `const t = useTranslations('namespace')` from `next-intl`
- New keys go in `apps/web/src/messages/en.json` first, then mirror in all locale files
- Nav items: add `labelKey` in `src/config/nav.ts` matching a key in the `sidebar` namespace
- Run `pnpm test run src/i18n/i18n.test.ts` after any message file change (guards key parity and empty values)
- Use the `/i18n-add` skill to add new translation keys safely across all locales
