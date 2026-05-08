# Changelog

All notable changes to AgentForge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0.0] - 2026-05-08

### Added

- **Auth-handler adapter** — custom OAuth 2.0 / PKCE authorization flow independent of Clerk, supporting credential login (email/password), OAuth kickoff, token refresh, and session management
- **Agent CRUD E2E tests** — Playwright test suite (A1–A4) covering create, list, edit, and delete agent flows via the Agent Builder; all 29 runnable tests passing
- **Session lifecycle management** — proactive token refresh, session expiry warning dialog (`SessionWarningDialog`), and drift guard to prevent stale sessions
- **Launchops marketing app** — new `apps/launchops` Next.js app with Hero, Pricing, Services, Work portfolio, Contact form, and Manifesto components
- **DataTable component** — flexible, mobile-responsive data table in `@forge/ui` with sorting and pagination
- **Guidance rules** — per-agent guidance rule CRUD (create, edit, delete) with `GuidanceRuleDialog` and `GuidanceRulesList` components; `TonePresetSelector` for behaviour presets
- **Agent behaviour refactor** — split `BehaviourSection` into `BasicSettings`, `AdvancedSection`, and tone preset selector; added guidance rules to agent builder store
- **PKCE utilities** — `generateCodeVerifier`, `generateCodeChallenge`, `generateState` in `@forge/auth`
- **AES-256-GCM cookie sealing** — `sealCookie` / `unsealCookie` in `@forge/auth` for tamper-proof session and flow-state cookies
- **Session encoding** — `sessionFromClaims`, `encodeSession`, `decodeSession` in `@forge/auth`
- **AG-UI protocol spec** — documentation for agent-to-UI streaming protocol (`docs/specs/ag-ui-protocol-spec.md`)
- **CI/CD pipelines** — `ci-development.yml` and `ci-qa.yml` refactored to pull-request triggers; new `deploy-development.yml` and `deploy-qa.yml` workflows
- **ARCHITECTURE.md** — comprehensive architecture documentation (`docs/ARCHITECTURE.md`)

### Changed

- **Auth routes** — `/api/auth/login`, `/api/auth/credentials`, `/api/auth/callback`, `/api/auth/logout`, `/api/auth/refresh`, `/api/auth/session` implemented using the auth-handler adapter
- **Agent API** — `agents.api.ts` and `metrics.api.ts` updated to use `@forge/api-client` with Bearer token auth
- **AgentDashboard** — auth-ready gate prevents API calls before token is available; unit tests added
- **AgentTable** — enhanced with mobile support, status badges, and pagination via `AgentTablePagination`
- **i18n messages** — English and French translations updated for new auth/agent features

### Fixed

- **Open redirect** — `returnTo` query parameter now sanitized in `/api/auth/login` and `/api/auth/credentials` to reject protocol-relative URLs and absolute URLs
- **CSRF logout** — removed GET handler from `/api/auth/logout`; POST-only prevents forced logout via `<img src>` or prefetch
- **Dead code** — removed unused `const session = encodeSession(...)` variable in `callback/route.ts`
- **E2E auth helper** — `setupAuthState()` now writes `forge_access_token` as plain JWT string + `forge_token_expires_at` as separate key, matching the production `getAccessToken()` format
- **Hydration mismatch** — `UserButton` replaced with `UserButtonClient` in dashboard layout

### Security

- Open redirect prevention in auth flow `returnTo` parameter
- CSRF logout prevention via POST-only logout endpoint

---

## [0.1.0] - 2024-01-XX

### Added

- Initial project setup
- Next.js 16 with App Router
- TypeScript strict mode configuration
- Tailwind CSS v4 token-based design system
- Environment variable validation with Zod
- ESLint + Prettier configuration
- Husky + lint-staged + commitlint
- Dark mode support with next-themes
- 9 UI primitives (Button, Card, Badge, Avatar, Dialog, Input, Label, Dropdown, Separator)
- 8 composite components (Navbar, Footer, AppSidebar, Topbar, etc.)
- Storybook 8.6 with 100% component coverage
- 3 layout systems (Auth, Dashboard, Marketing)
- Config-driven navigation system
- White-label ready architecture (no hardcoded branding)
- Project documentation structure

---

[0.1.0.0]: https://github.com/launchopstech/agent-forge/releases/tag/v0.1.0.0
