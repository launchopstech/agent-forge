---
name: i18n-add
description: Add a new translation key to all locale message files and verify parity. Use when the user says "add translation", "add i18n key", "add message key", or needs to add text that will appear in the UI.
argument-hint: '<namespace.key> <english-value>'
---

Add a new translation key to all locale files. Key and value from arguments: `$ARGUMENTS`

## Locale files location

`apps/web/src/messages/` — one JSON file per locale (e.g., `en.json`, `fr.json`)

## Steps

1. **Read `en.json`** to understand the structure and find the right namespace.

2. **Add the key to `en.json`** with the provided English value.
   - If namespace doesn't exist, create it as a new top-level object.
   - If namespace exists, add the key inside it.
   - Keep keys alphabetically sorted within their namespace (follow existing pattern).

3. **Add the same key to every other locale file** (e.g., `fr.json`).
   - Use the English value as a placeholder prefixed with `[TODO] ` if no translation is provided.
   - Never leave a key with an empty string value — the i18n test will fail.
   - Mirror the exact same key path as in `en.json`.

4. **Run the i18n guardrail test**:

   ```bash
   pnpm --filter=@forge/web exec vitest run src/i18n/i18n.test.ts
   ```

   This checks:
   - Key parity: all locales have identical keys to `en.json`
   - No empty values
   - Locale coverage matches files on disk

5. **Report** which files were updated and whether the test passed.

## Adding a new locale (special case)

If the user wants to add a new locale (not just a key):

1. Create `apps/web/src/messages/<locale>.json` — copy all keys from `en.json`, mark values as `[TODO]`
2. Add the locale to `routing.locales` in `packages/i18n/src/routing.ts`
3. Add to the `messageLoaders` map in `apps/web/src/i18n/request.ts`
4. Add to the `localeFiles` map in `apps/web/src/i18n/i18n.test.ts`
5. Run the i18n guardrail test to confirm all 3 checks pass
