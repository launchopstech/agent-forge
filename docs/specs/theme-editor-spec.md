# Theme Editor — Spec

**Feature:** Visual theme editor for live CSS variable customisation
**Surfaces:** Storybook addon panel + `/admin/theme` (tenant) + `/admin/theme/[brandKey]` (agency)
**Stack:** `culori` (color conversion), Storybook channel API, localStorage adapter → CMS-ready

---

## Principles

1. **Shared UI, multiple surfaces** — `ThemeEditor` component lives in `packages/ui`; no surface-specific logic inside it
2. **Adapter pattern for persistence** — `ThemeStore` interface with localStorage now; swap for Sanity/API without touching the editor
3. **Tenant isolation** — tenant admin can only edit their own brand; agency admin can edit any brand
4. **OKLCH throughout** — all stored values are OKLCH strings; hex is only a UI convenience for the color picker
5. **Zero hardcoded copy** — all labels via i18n (`adminTheme.*` namespace)
6. **Every component gets a Story, every utility gets a test** — no exceptions

---

## Phase 1 — Shared ThemeEditor component

### 1.1 Color utilities

- [x] Install `culori` in `packages/ui`: `pnpm --filter @forge/ui add culori`
- [x] Create `packages/ui/src/theme-editor/color-utils.ts`:
  - `oklchToHex(oklchStr: string): string` — parse OKLCH, return `#rrggbb`
  - `hexToOklch(hex: string): string` — return `oklch(L C H)` rounded to 3 dp
  - Both functions handle invalid input gracefully (return input unchanged)
- [x] Write `packages/ui/src/theme-editor/color-utils.test.ts`:
  - `oklchToHex` roundtrip (hex → oklch → hex ≈ original within tolerance)
  - `hexToOklch` produces valid OKLCH string
  - Invalid/empty input returns input unchanged (no throw)

### 1.2 Theme constants

- [x] Create `packages/ui/src/theme-editor/constants.ts`:
  - `THEME_GROUPS` — array of `{ label, vars: string[] }` covering all vars from `tokens.css`
    - Core: `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--ring`
    - Surfaces: `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--muted`, `--muted-foreground`, `--border`, `--input`
    - Interactive: `--secondary`, `--secondary-foreground`, `--accent`, `--accent-foreground`, `--destructive`
    - Shape: `--radius`
    - Sidebar: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`
    - Charts: `--chart-1` through `--chart-5`
  - `DEFAULT_LIGHT_VARS: Record<string, string>` — full `:root` block from `tokens.css`
  - `DEFAULT_DARK_VARS: Record<string, string>` — full `.dark` block from `tokens.css`

### 1.3 ThemeEditor component

- [x] Create `packages/ui/src/theme-editor/ThemeEditor.tsx`:

  ```ts
  type ThemeEditorProps = {
    lightVars: Record<string, string>
    darkVars: Record<string, string>
    mode: 'light' | 'dark'
    readOnly?: boolean
    onChange: (vars: Record<string, string>, mode: 'light' | 'dark') => void
    onReset: () => void
    onExport: () => void // copies full CSS to clipboard
    onSave?: () => void // omit = no Save button
  }
  ```

  - Renders `THEME_GROUPS` in shadcn `<Collapsible>` sections
  - Color vars: swatch div + `<input type="color">` (hex via `oklchToHex`) + text `<input>` for raw OKLCH
    - Hex picker change → `hexToOklch` → `onChange`
    - Text input change → direct OKLCH value → `onChange`
  - `--radius` var: `<input type="range" min="0" max="2" step="0.125">` + text display
  - Toolbar row: light/dark toggle, Reset button, Export CSS button, Save button (only if `onSave`)
  - `readOnly` prop disables all inputs
  - `'use client'` — event handlers required

- [x] Create `packages/ui/src/theme-editor/index.ts` — barrel export
- [x] Write `packages/ui/src/theme-editor/ThemeEditor.test.tsx`:
  - Renders all group section headers
  - `onChange` fires with updated vars when hex picker changes
  - `onReset` called when Reset clicked
  - `onExport` called when Export CSS clicked; mock `navigator.clipboard.writeText`
  - Save button absent when `onSave` is undefined; present when provided
  - All inputs are disabled when `readOnly={true}`
- [x] Write `packages/ui/src/theme-editor/ThemeEditor.stories.tsx`:
  - `Default` — light mode, all groups, no Save button
  - `DarkMode` — dark mode initial state
  - `ReadOnly` — readOnly prop, all inputs disabled
  - `WithSave` — onSave provided, Save button visible

### Phase 1 Gate Check

```bash
pnpm --filter @forge/ui typecheck
pnpm --filter @forge/ui lint
pnpm test:coverage   # color-utils and ThemeEditor covered ≥ 80%
pnpm exec storybook build   # ThemeEditor stories compile
```

---

## Phase 2 — Persistence adapter

### 2.1 ThemeStore interface

- [x] Create `packages/brand/src/persistence/types.ts`:
  ```ts
  export interface ThemeStore {
    load(
      brandKey: string
    ): Promise<{ light: Record<string, string>; dark: Record<string, string> } | null>
    save(
      brandKey: string,
      theme: { light: Record<string, string>; dark: Record<string, string> }
    ): Promise<void>
    reset(brandKey: string): Promise<void>
  }
  ```

### 2.2 LocalStorage implementation

- [x] Create `packages/brand/src/persistence/local-storage.ts`:
  - Key: `forge_theme_{brandKey}`
  - `load` returns `null` if key absent or JSON parse fails (silent)
  - `save` serializes full `{ light, dark }` object
  - `reset` removes the key
- [x] Write `packages/brand/src/persistence/local-storage.test.ts`:
  - `load` returns null when empty
  - `save` + `load` roundtrip preserves all vars
  - `reset` removes the stored value
  - Saving brand A does not affect brand B (key isolation)

### 2.3 Active adapter export

- [x] Create `packages/brand/src/persistence/index.ts`:
  ```ts
  // SWAP POINT: replace with SanityThemeStore / ApiThemeStore when CMS is ready
  export const themeStore: ThemeStore = new LocalStorageThemeStore()
  ```
- [x] Update `packages/brand/src/index.ts` to re-export `ThemeStore` and `themeStore`

### Phase 2 Gate Check

```bash
pnpm --filter @forge/brand typecheck
pnpm test:coverage   # LocalStorageThemeStore covered ≥ 80%
```

---

## Phase 3 — Storybook addon panel

### 3.1 Manager registration

- [x] Create `apps/web/.storybook/manager.ts`:

  ```ts
  import { addons, types } from '@storybook/manager-api'
  import React from 'react'
  import { ThemeEditorPanel } from './addons/ThemeEditorPanel'

  addons.register('forge/theme-editor', () => {
    addons.add('forge/theme-editor/panel', {
      type: types.PANEL,
      title: '🎨 Theme',
      render: ({ active }) => React.createElement(ThemeEditorPanel, { active: active ?? false }),
    })
  })
  ```

### 3.2 Panel component

- [x] Create `apps/web/.storybook/addons/ThemeEditorPanel.tsx`:
  - `useGlobals()` → reads `brand` key and `theme` (light/dark) from toolbar
  - On mount: loads saved vars for active brand from localStorage
  - On `ThemeEditor.onChange`: `emit('FORGE_THEME_UPDATE', { vars, mode })` + write to localStorage
  - `onSave` is undefined (changes apply instantly, no save step in Storybook)
  - `onReset`: resets to `DEFAULT_LIGHT_VARS`/`DEFAULT_DARK_VARS` + emits update
  - `onExport`: copies CSS to clipboard

### 3.3 Canvas channel listener

- [x] Update `apps/web/.storybook/preview.tsx` — add decorator:
  ```tsx
  ;(Story) => {
    useChannel({
      FORGE_THEME_UPDATE: ({
        vars,
        mode,
      }: {
        vars: Record<string, string>
        mode: 'light' | 'dark'
      }) => {
        const selector = mode === 'dark' ? '.dark' : ':root'
        const css = `${selector} {\n${Object.entries(vars)
          .map(([k, v]) => `  ${k}: ${v};`)
          .join('\n')}\n}`
        let el = document.getElementById('storybook-theme-override')
        if (!el) {
          el = document.createElement('style')
          el.id = 'storybook-theme-override'
          document.head.appendChild(el)
        }
        el.textContent = css
      },
    })
    return <Story />
  }
  ```

### Phase 3 Gate Check

```bash
pnpm exec storybook build   # panel compiles, no errors
# Manual: open Storybook → any story → 🎨 Theme tab → change primary color → canvas updates live
# Manual: reload Storybook → color persists
```

---

## Phase 4 — App admin pages

### 4.1 i18n keys

- [x] Add to `packages/i18n/messages/en.json` under `"adminTheme"`:
  ```json
  {
    "title": "Theme Editor",
    "save": "Save theme",
    "reset": "Reset to defaults",
    "export": "Export CSS",
    "saved": "Theme saved",
    "brandSelector": "Editing brand"
  }
  ```
- [x] Mirror exact same keys in `fr.json`
- [x] Add `"adminTheme": "Theme Editor"` to the `"nav"` namespace in `en.json` and `fr.json`
- [x] Run `pnpm test run src/i18n/i18n.test.ts` — parity passes

### 4.2 Tenant admin page

- [x] Create `apps/web/src/app/(dashboard)/admin/theme/page.tsx`:
  - `'use client'`
  - `useTenant()` → `brand.key`
  - On mount: `themeStore.load(brand.key)` → initialise state (fallback to `DEFAULT_LIGHT_VARS`/`DEFAULT_DARK_VARS`)
  - `ThemeEditor.onChange` → `document.documentElement.style.setProperty(k, v)` for each var (live preview)
  - `ThemeEditor.onSave` → `themeStore.save(brand.key, { light, dark })` → `toast(t('adminTheme.saved'))`
  - `ThemeEditor.onReset` → reset state + clear stored vars + re-apply defaults to DOM
  - `ThemeEditor.onExport` → clipboard

### 4.3 Agency admin page

- [x] Create `apps/web/src/app/(dashboard)/admin/theme/[brandKey]/page.tsx`:
  - `'use client'`
  - Authorization: `auth()` → check `forge_role: agency` claim; if absent → `redirect('/dashboard')`
  - Brand selector `<Select>` at top — options from `Object.keys(brandRegistry)` — defaults to `params.brandKey`
  - Switching brand selector → load that brand's saved theme
  - Otherwise same as tenant page but saves to the selected `brandKey`

### 4.4 Nav wiring

- [x] Add to `packages/config/src/nav.ts` (dashboard nav group):
  ```ts
  { href: '/admin/theme', labelKey: 'adminTheme', icon: Paintbrush }
  ```

### Phase 4 Gate Check

```bash
pnpm typecheck
pnpm lint
pnpm build   # /admin/theme and /admin/theme/[brandKey] build without error
pnpm dev     # manual: /admin/theme → change color → live preview → save → reload → persists
```

---

## Phase 5 — E2E & A11y

### 5.1 E2E tests

- [x] Create `apps/web/e2e/admin-theme.spec.ts`:

  ```ts
  test('tenant admin can edit and save theme', ...)
  // navigate /admin/theme, change --primary, click Save, reload, assert localStorage has value

  test('non-agency user is redirected from /admin/theme/[brandKey]', ...)
  // login as tenant user, navigate /admin/theme/client-a, assert redirected to /dashboard

  test('agency admin can edit a specific brand theme', ...)
  // login as agency user, navigate /admin/theme/client-a, change color, save
  ```

### 5.2 A11y

- [x] Add `/admin/theme` to the routes checked in `apps/web/e2e/helpers/a11y.ts`
- [x] All `<input type="color">` and `<input type="text">` in `ThemeEditor` must have associated `<label>` (use `htmlFor` + `id` on each input, generated from var name)
- [x] All `<input type="range">` must have `aria-label` with the var name

### Phase 5 Gate Check

```bash
pnpm test:e2e   # admin-theme.spec.ts all pass
```

---

## Full Gate Check (run before every commit / PR)

```bash
pnpm typecheck                        # zero TS errors
pnpm lint                             # zero errors, zero warnings
pnpm format:check                     # zero prettier violations
pnpm build                            # production build succeeds
pnpm test:coverage                    # ≥ 80% lines/branches, ≥ 60% functions — new files in scope
pnpm exec storybook build             # ThemeEditor stories compile, addon panel present
pnpm test:e2e                         # admin-theme.spec.ts passes
pnpm test run src/i18n/i18n.test.ts  # key parity + no empty values
```

---

## Future: CMS swap

When a CMS is chosen:

1. Implement `SanityThemeStore` (or `ApiThemeStore`) satisfying `ThemeStore` in `packages/brand/src/persistence/`
2. Swap the export in `packages/brand/src/persistence/index.ts`
3. No changes needed in `ThemeEditor`, Storybook panel, or admin pages
