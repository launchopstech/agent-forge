# Dashboard Integration Spec

**Goal:** Integrate the Magic Patterns "Mindrithm" AI customer support dashboard design into AgentForge.
**Source:** Magic Patterns export (12 pages, full dashboard application)

---

## Overview

Add 12 dashboard pages to the existing `(dashboard)` route group, wired into the existing `AppSidebar` / `DashboardLayout` / `dashboardNavGroups` infrastructure. All patterns from existing phases must be followed: i18n, CSS variables, shadcn/ui components, Server/Client component rules, performance rules (React.memo, useCallback, dynamic imports).

---

## Design → Architecture Mapping

### Color tokens

All hardcoded design colors map to existing CSS variables:

| Design                  | CSS variable                |
| ----------------------- | --------------------------- |
| `bg-white`              | `bg-background` / `bg-card` |
| `border-gray-200`       | `border-border`             |
| `text-gray-900`         | `text-foreground`           |
| `text-gray-500/600`     | `text-muted-foreground`     |
| `bg-gray-50`            | `bg-muted/50`               |
| `bg-gray-100`           | `bg-muted`                  |
| `bg-purple-600`         | `bg-primary`                |
| `text-purple-600`       | `text-primary`              |
| `bg-purple-50`          | `bg-primary/10`             |
| `focus:ring-purple-500` | `focus:ring-ring`           |

### shadcn/ui replacements

| Design element | `@forge/ui` component                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| `<button>`     | `Button` from `@forge/ui/src/button`                                                                          |
| `<input>`      | `Input` from `@forge/ui/src/input`                                                                            |
| `<textarea>`   | `Textarea` from `@forge/ui/src/textarea`                                                                      |
| `<select>`     | `Select, SelectTrigger, SelectContent, SelectItem` from `@forge/ui/src/select`                                |
| `<table>`      | `Table, TableHeader, TableBody, TableRow, TableHead, TableCell` from `@forge/ui/src/table`                    |
| Modal overlays | `Dialog, DialogContent, DialogHeader, DialogTitle` from `@forge/ui/src/dialog`                                |
| Tab bars       | `Tabs, TabsList, TabsTrigger, TabsContent` from `@forge/ui/src/tabs`                                          |
| Status pills   | `Badge` from `@forge/ui/src/badge`                                                                            |
| Dropdown menus | `DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger` from `@forge/ui/src/dropdown-menu` |

Exception: Custom toggle switches (on/off) — keep as inline CSS div, no shadcn equivalent.

### Charts

`recharts` is in `pnpm-workspace.yaml` catalog. Per performance rules, **all recharts usage must be wrapped with `next/dynamic()`**. Affected: AnalyticsPage, KnowledgeGapsPage, Dashboard Sparklines.

### i18n

- Client Components: `const t = useTranslations('dashboard')`
- Server Components: `const t = await getTranslations('dashboard')`
- All keys in `packages/i18n/messages/en.json` under `dashboard` namespace
- Mirror keys in `fr.json` with `[TODO] ` prefix

### Gotchas

1. **Icons in nav config** — `packages/config` has no lucide-react dep. Keep icons at the app level: create `apps/web/src/config/nav-with-icons.ts` that wraps `dashboardNavGroups` with icon components, imported only in `AppSidebar`.
2. **recharts bundle** — must NOT appear in any shared chunk. Verify with `pnpm analyze` after build.
3. **Full-height pages** (flow-builder, chatbot-builder) — do NOT add `p-8` wrapper; layout is self-contained. Add `noLayoutWrapper: true` to stories.
4. **`'use client'` boundary on Dashboard page** — page is a Server Component; lead modal state lives in `DashboardClient.tsx` client wrapper.
5. **`Lead` type** — define once in `apps/web/src/types/leads.ts`, import in both `LeadCaptureModal` and `LeadsPage`.
6. **i18n guardrail** — after adding keys run `pnpm --filter=@forge/web exec vitest run src/i18n/i18n.test.ts`.

---

## Phase A — Nav & Type Updates

- [ ] A1: Add `badge?: number` and `icon?: React.ComponentType<{ className?: string }>` to `NavItem` in `packages/config/src/types.ts`
- [ ] A2: Replace `dashboardNavGroups` in `packages/config/src/nav.ts` with full 12-page + 3-group structure (Overview, Conversations, Leads, Flow Builder, Chatbot Builder | Knowledge: Knowledge Base, AI Actions | Platform: Integrations, Developer, Analytics, Knowledge Gaps)
- [ ] A3: Create `apps/web/src/config/nav-with-icons.ts` — wraps nav groups with lucide-react icon components
- [ ] A4: Update `apps/web/src/components/layout/AppSidebar.tsx` — render `item.icon` and `item.badge`
- [ ] A5: Add new keys to `sidebar` namespace in `packages/i18n/messages/en.json`: `conversations`, `leads`, `flowBuilder`, `chatbotBuilder`, `knowledge`, `knowledgeBase`, `aiActions`, `platform`, `developer`, `knowledgeGaps`
- [ ] A6: Mirror new keys in `packages/i18n/messages/fr.json` with `[TODO]` prefix
- [ ] A7: Run i18n guardrail test — `pnpm --filter=@forge/web exec vitest run src/i18n/i18n.test.ts`

**Gate:** `pnpm typecheck && pnpm lint` — zero errors/warnings

---

## Phase B — Dashboard Page

- [ ] B1: Create `apps/web/src/types/leads.ts` — export `Lead` interface
- [ ] B2: Create `apps/web/src/components/dashboard/DonutChart.tsx` — pure SVG arc chart, no recharts, no `'use client'`
- [ ] B3: Create `apps/web/src/components/dashboard/Sparkline.tsx` — `'use client'`, recharts `LineChart`, exported for lazy loading only
- [ ] B4: Create `apps/web/src/components/dashboard/StatsRow.tsx` — `'use client'`, `React.memo`, 4 stat cards, dynamic import for Sparkline
- [ ] B5: Create `apps/web/src/components/dashboard/ConversationsTable.tsx` — `'use client'`, `React.memo`, uses `@forge/ui/src/table` + `@forge/ui/src/badge`
- [ ] B6: Create `apps/web/src/components/dashboard/KnowledgeHealth.tsx` — `'use client'`, `React.memo`, reuses DonutChart
- [ ] B7: Create `apps/web/src/components/dashboard/QuickActions.tsx` — `'use client'`, `React.memo`, uses `useRouter` for navigation
- [ ] B8: Create `apps/web/src/components/LeadCaptureModal.tsx` — `'use client'`, uses `Dialog`, `Input`, `Textarea`, `Button` from `@forge/ui`
- [ ] B9: Create `apps/web/src/components/dashboard/DashboardClient.tsx` — `'use client'` wrapper managing `isLeadModalOpen` state, renders all dashboard sub-components
- [ ] B10: Replace `apps/web/src/app/(dashboard)/dashboard/page.tsx` — Server Component, imports DashboardClient
- [ ] B11: Add `dashboard` i18n namespace to `packages/i18n/messages/en.json` with keys for stats, table headers, quick actions, lead modal
- [ ] B12: Mirror dashboard keys in `fr.json`

**Gate:** `pnpm dev` → `/dashboard` → all widgets render, lead modal opens/closes

---

## Phase C — Conversations & Leads Pages

- [ ] C1: Create `apps/web/src/app/(dashboard)/conversations/page.tsx` — `'use client'`, two-panel layout (380px list | flex-1 chat), uses `Input`, `DropdownMenu`, `Dialog`, `Badge`
- [ ] C2: Add conversation action modal using `Dialog` from `@forge/ui/src/dialog`
- [ ] C3: Add hand-off dropdown using `DropdownMenu` from `@forge/ui/src/dropdown-menu`
- [ ] C4: Create `apps/web/src/app/(dashboard)/leads/page.tsx` — `'use client'`, uses `@forge/ui/src/table`, CSV export via browser Blob API
- [ ] C5: Add `dashboard.conversations.*` and `dashboard.leads.*` i18n keys to en.json + fr.json

**Gate:** `pnpm typecheck` — no errors; navigate to `/dashboard/conversations` and `/dashboard/leads`

---

## Phase D — Builder Pages

- [ ] D1: Create `apps/web/src/app/(dashboard)/flow-builder/page.tsx` — `'use client'`, full-height canvas with dark background, dot-grid, SVG connections, absolutely-positioned nodes, inspector panel, zoom controls
- [ ] D2: Create `apps/web/src/app/(dashboard)/chatbot-builder/page.tsx` — `'use client'`, full-height 60/40 split, config panel + test chat panel
- [ ] D3: Add `dashboard.flowBuilder.*` and `dashboard.chatbotBuilder.*` i18n keys
- [ ] D4: Create Storybook stories for both builder pages with `parameters: { layout: 'fullscreen', noLayoutWrapper: true }`

**Gate:** `pnpm storybook:build` — no story errors; pages render full-height without padding issues

---

## Phase E — Knowledge & Platform Pages

- [ ] E1: Create `apps/web/src/app/(dashboard)/knowledge-base/page.tsx` — `'use client'`, grid/list toggle, sources grid with coverage bars, add source `Dialog`
- [ ] E2: Create `apps/web/src/app/(dashboard)/ai-actions/page.tsx` — `'use client'`, `Tabs` for Actions / Pending Approvals / Execution Logs
- [ ] E3: Create `apps/web/src/app/(dashboard)/integrations/page.tsx` — `'use client'`, search + category filter, connected + available integration grids
- [ ] E4: Create `apps/web/src/app/(dashboard)/analytics/_charts/VolumeChart.tsx` — recharts AreaChart (lazy loaded)
- [ ] E5: Create `apps/web/src/app/(dashboard)/analytics/_charts/ChannelPieChart.tsx` — recharts PieChart (lazy loaded)
- [ ] E6: Create `apps/web/src/app/(dashboard)/analytics/_charts/TopicsBarChart.tsx` — recharts BarChart (lazy loaded)
- [ ] E7: Create `apps/web/src/app/(dashboard)/analytics/_charts/SentimentPieChart.tsx` — recharts PieChart (lazy loaded)
- [ ] E8: Create `apps/web/src/app/(dashboard)/analytics/page.tsx` — `'use client'`, time range toggle, all 4 charts loaded via `next/dynamic()`
- [ ] E9: Create `apps/web/src/app/(dashboard)/knowledge-gaps/page.tsx` — `'use client'`, frequency bar chart via `next/dynamic()`, gap cards with AI analysis + sample queries
- [ ] E10: Create `apps/web/src/app/(dashboard)/developer/page.tsx` — `'use client'`, code snippet tabs (curl/node/python), copy to clipboard, webhooks, endpoints list
- [ ] E11: Create `apps/web/src/app/(dashboard)/settings/page.tsx` — `'use client'`, 9-section left nav, Profile / Workspace / Team / Language / Notifications / Security / Billing / API Keys / Appearance panels
- [ ] E12: Add all remaining i18n keys (`knowledgeBase`, `aiActions`, `integrations`, `analytics`, `knowledgeGaps`, `developer`, `settings`) to en.json + fr.json

**Gate:** All 12 sidebar nav items navigate without 404

---

## Phase F — Gate Checks & Cleanup

- [ ] F1: `pnpm typecheck` — zero TS errors across all packages
- [ ] F2: `pnpm lint` — zero errors, zero warnings (no hardcoded strings in JSX)
- [ ] F3: `pnpm build` — production build succeeds
- [ ] F4: `pnpm test:coverage` — coverage ≥ 80% (add new view-only pages to `coverage.exclude` in `vitest.config.mts` if needed)
- [ ] F5: `pnpm storybook:build` — all stories compile
- [ ] F6: `pnpm analyze` — recharts does NOT appear in main shared chunk; per-route budgets ≤ 150kb
- [ ] F7: Run i18n guardrail test — `pnpm --filter=@forge/web exec vitest run src/i18n/i18n.test.ts` — all locale files have identical keys

---

## File Index

### Modified files

| File                                              | Change                                            |
| ------------------------------------------------- | ------------------------------------------------- |
| `packages/config/src/types.ts`                    | Add `badge?`, `icon?` to NavItem                  |
| `packages/config/src/nav.ts`                      | Replace dashboardNavGroups with 12-page structure |
| `packages/i18n/messages/en.json`                  | Add sidebar + dashboard namespaces                |
| `packages/i18n/messages/fr.json`                  | Mirror all new keys with `[TODO]`                 |
| `apps/web/src/components/layout/AppSidebar.tsx`   | Render icon + badge                               |
| `apps/web/src/app/(dashboard)/dashboard/page.tsx` | Replace with new design                           |

### New files

```
apps/web/src/
  types/leads.ts
  config/nav-with-icons.ts
  components/
    LeadCaptureModal.tsx
    dashboard/
      DashboardClient.tsx
      StatsRow.tsx
      ConversationsTable.tsx
      KnowledgeHealth.tsx
      QuickActions.tsx
      DonutChart.tsx
      Sparkline.tsx
  app/(dashboard)/
    conversations/page.tsx
    leads/page.tsx
    flow-builder/page.tsx
    chatbot-builder/page.tsx
    knowledge-base/page.tsx
    ai-actions/page.tsx
    integrations/page.tsx
    analytics/
      page.tsx
      _charts/VolumeChart.tsx
      _charts/ChannelPieChart.tsx
      _charts/TopicsBarChart.tsx
      _charts/SentimentPieChart.tsx
    knowledge-gaps/page.tsx
    developer/page.tsx
    settings/page.tsx
```
