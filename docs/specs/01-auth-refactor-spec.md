# Auth System Refactor Spec

**Priority:** 01  
**Goal:** Fix UX bugs, remove architectural violations, add mobile-first responsive login UI, cover all auth scenarios with Storybook and E2E tests, and lay the foundation for the agency multi-tenant model.  
**Prerequisite:** Spec 00 (`00-auth-handler-login-spec.md`) — auth-handler OAuth flow fully implemented.

---

## Overview

The auth-handler OAuth flow established in Spec 00 works end-to-end but has accumulated technical debt and gaps that must be resolved before the system can be treated as production-ready or extended for the agency model.

The problems fall into six categories:

1. **UX bugs** — profile icon disappears intermittently; logout redirects back to dashboard because the auth-handler browser session is never cleared
2. **Architectural violations** — raw HTML templates in `OidcProviderService`; Clerk Backend API calls coupled directly into the OIDC orchestration service; magic strings scattered across multiple files
3. **Responsive design** — the auth-handler login form is not mobile-first; the agent-forge auth pages have no responsive Tailwind audit
4. **Missing Storybook stories** — `UserMenu`, login error states, and the callback page have no visual stories
5. **Insufficient test coverage** — E2E tests cover only basic redirect; logout, session expiry, callback errors, and the full login flow are untested
6. **Agency model missing** — `AuthSession` has no tenant context; no per-client/per-org config extension point exists

Success criteria:

- Profile icon is always visible while session is loading and when session is confirmed
- Logout destroys both the agent-forge app session and the auth-handler browser session; navigating to `/dashboard` after logout redirects to `/login`
- Auth-handler login form renders correctly at 375 px viewport with no horizontal scroll and touch-friendly tap targets
- `UserMenu`, error-state login page, and callback loading page all have Storybook stories that compile
- E2E suite covers: unauthenticated access, full login, logout, and invalid callback state
- `AuthSession` carries `orgId`; `AuthHandlerConfigService` has an extension point for per-tenant client config

---

## Design → Architecture Mapping

### Bug fixes

- `AuthHandlerProvider` — replace fire-and-forget `useEffect` fetch with a state machine that distinguishes `initializing`, `authenticated`, and `unauthenticated`; never flips to `null` mid-flight
- `UserMenu` — render the loading skeleton during `initializing`; render `null` only when state is definitively `unauthenticated`
- Logout — `POST /api/auth/logout` must call `${AUTH_HANDLER_ISSUER}/logout` with `return_to=${NEXT_PUBLIC_APP_URL}/login` before clearing app cookies; treat upstream failure as non-fatal

### forge-core separation of concerns

- HTML templates belong in a dedicated `LoginTemplateService`, not in `OidcProviderService`
- Clerk credential verification belongs in a `CredentialVerifierService` that implements `ICredentialVerifier`; `OidcProviderService` calls the interface, not Clerk directly
- All cookie names, TTL values, and constant scopes live in `auth-handler.constants.ts`

### agent-forge code deduplication

- Magic sessionStorage key strings extracted to `packages/auth/src/constants.ts`
- JWT payload base64 decode extracted to `packages/auth/src/utils/jwt.ts`
- Cookie unsealing unified across Node runtime (`server.ts`) and Edge runtime (`middleware.ts`) using the Web Crypto API already used by `utils/cookies.ts`

### Responsive login UI

- Auth-handler HTML form: mobile-first CSS, full-width card, `min-height: 44px` tap targets, `100dvh` background, `box-sizing: border-box`, `max-width` only kicks in at wider viewports
- Agent-forge Tailwind auth pages: `w-full px-4 sm:max-w-[440px] sm:px-0 mx-auto`, no fixed pixel widths

### Storybook

- `UserMenu` stories mock `AuthHandlerContext` via a decorator to exercise all status states
- Login page stories use query param `?error=...` to trigger the error card without a real OAuth kickoff
- Callback page story shows the loading state

### Agency model

- `orgId: string | null` added to `AuthUser` in `packages/auth/src/types.ts` and threaded through `SessionData`, `sessionFromClaims()`, `encodeSession()`, `decodeSession()`
- `AuthHandlerConfigService` gains a `registerClient()` method so startup hooks or future tenant-loaders can add clients at runtime

---

## Phase A — UX Bug Fixes

- [ ] A1: Refactor `AuthHandlerProvider` to track an explicit `status: 'initializing' | 'authenticated' | 'unauthenticated'` state instead of boolean `isLoading` + nullable `session`
- [ ] A2: Update `AuthHandlerContextValue` in `context.tsx` to export the new status type alongside `session`
- [ ] A3: Update `client.ts` `useUser()` to derive `isLoading` from `status === 'initializing'` and `isAuthenticated` from `status === 'authenticated'`
- [ ] A4: Update `UserMenu` — render skeleton when `status === 'initializing'`, render menu when `status === 'authenticated'`, render `null` only when `status === 'unauthenticated'`
- [ ] A5: Remove the disabled Profile and Settings `DropdownMenuItem` entries from `UserMenu`
- [ ] A6: Add SSO logout call in `POST /api/auth/logout` — fetch `${AUTH_HANDLER_ISSUER}/logout` before clearing app cookies; treat upstream failure as non-fatal (still clear app cookies and redirect)
- [ ] A7: Confirm `clearAuthCookies()` covers all three cookies (`forge_session`, `forge_refresh`, `forge_oauth_flow`) with correct `path` and `maxAge: 0`

**Gate:** Profile icon never disappears while session loads. After logout, navigating to `/dashboard` redirects to `/login`.

---

## Phase B — forge-core Separation of Concerns

- [ ] B1: Create `apps/auth-handler/src/auth-handler.constants.ts` — export `FLOW_COOKIE`, `SESSION_COOKIE`, `AUTH_CODE_TTL_SECONDS`, `FLOW_COOKIE_TTL_SECONDS`, `SESSION_TTL_SECONDS`, `STANDARD_SCOPES`
- [ ] B2: Replace all hardcoded magic values in `oidc-provider.service.ts`, `auth-handler.controller.ts`, and `cookies.ts` with imports from `auth-handler.constants.ts`
- [ ] B3: Create `apps/auth-handler/src/login-template.service.ts` — exports `getLoginHtml(clientName: string, errorMessage?: string): string` and `getConsentHtml(clientName: string, userEmail: string, scopes: string[]): string`
- [ ] B4: Remove `getLoginPage()` and `getConsentPage()` methods from `OidcProviderService`; update `auth-handler.controller.ts` to call `LoginTemplateService` directly (controller renders, service orchestrates)
- [ ] B5: Define `ICredentialVerifier` interface in `apps/auth-handler/src/credential-verifier.interface.ts` with `verifyCredentials(email: string, password: string): Promise<VerifiedUser | null>` where `VerifiedUser = { id: string; email: string; name: string | null; avatarUrl: string | null; orgId: string | null }`
- [ ] B6: Create `apps/auth-handler/src/clerk-credential-verifier.service.ts` implementing `ICredentialVerifier` — move all Clerk Backend API fetch calls out of `handleLocalLogin()` here
- [ ] B7: Update `handleLocalLogin()` in `OidcProviderService` to call `credentialVerifier.verifyCredentials()`; throw `UnauthorizedException` when result is `null`
- [ ] B8: Register `LoginTemplateService` and `ClerkCredentialVerifierService` in `auth-handler.module.ts`; inject into `OidcProviderService` and `AuthHandlerController` via constructor

**Gate:** `OidcProviderService` contains no HTML strings and no Clerk-specific imports. All constants defined once.

---

## Phase C — agent-forge Code Deduplication

- [ ] C1: Create `packages/auth/src/constants.ts` — export `SESSION_STORAGE_KEYS = { ACCESS_TOKEN: 'forge_access_token', TOKEN_EXPIRES_AT: 'forge_token_expires_at' } as const`
- [ ] C2: Replace all string literals `'forge_access_token'` and `'forge_token_expires_at'` in `UserMenu.tsx`, `callback/page.tsx`, and `adapters/auth-handler/client.ts` with imports from `constants.ts`
- [ ] C3: Create `packages/auth/src/utils/jwt.ts` — export `decodeJwtPayload<T = Record<string, unknown>>(token: string): T` using `atob` / Web Crypto (Edge-compatible); throw on malformed token
- [ ] C4: Replace the inline JWT base64 decode block in `apps/web/src/app/api/auth/callback/route.ts` with a call to `decodeJwtPayload()`
- [ ] C5: Add unit tests in `packages/auth/src/utils/jwt.test.ts` — valid JWT payload, invalid format, non-JSON payload
- [ ] C6: Confirm `packages/auth/src/utils/cookies.ts` uses only Web Crypto `SubtleCrypto` (no Node `require('crypto')`); add `/* @edge-runtime-compatible */` JSDoc tag
- [ ] C7: Remove the duplicate `unsealCookieEdge()` and `base64urlDecode()` implementations from `packages/auth/src/adapters/auth-handler/middleware.ts` — import `unsealCookie` from `../../utils/cookies` instead
- [ ] C8: Run `pnpm typecheck` and `pnpm build` to confirm no regressions

**Gate:** Zero duplicate implementations of cookie unsealing or JWT decoding. Zero magic string literals for sessionStorage keys.

---

## Phase D — Responsive Mobile-First Login UI

- [ ] D1: In `LoginTemplateService.getLoginHtml()`, rewrite embedded CSS to be mobile-first:
  - `body`: `min-height: 100dvh`, `flex`, `align-items: center`, `justify-content: center`, `padding: 1rem`, `box-sizing: border-box`
  - `.card`: `width: 100%`, `max-width: 440px`, `margin: 0 auto`, `padding: clamp(1.5rem, 5vw, 2.5rem)`, `box-sizing: border-box`
  - All `<input>` elements: `min-height: 44px` (WCAG 2.5.5 touch target), `width: 100%`, `box-sizing: border-box`
  - `<button[type=submit]>`: `min-height: 48px`, `width: 100%`
  - `.error`: full-width, `margin-bottom: 1rem`, WCAG AA contrast (red-700 on white)
  - No fixed `px` widths on any layout element
  - Confirm `<meta name="viewport" content="width=device-width, initial-scale=1">` present in `<head>`
- [ ] D2: In `apps/web/src/app/(auth)/login/[[...rest]]/page.tsx` — use `w-full px-4 sm:max-w-[440px] sm:px-0 mx-auto` on the Card container; center spinner with `flex justify-center`
- [ ] D3: Apply same responsive Tailwind pattern to `signup/page.tsx` and `forgot-password/page.tsx`
- [ ] D4: Verify at 375 px and 768 px viewports that no content overflows and all interactive elements are reachable

**Gate:** Auth-handler login form and agent-forge auth pages render correctly at 375 px with no horizontal scroll and all tap targets ≥ 44 px.

---

## Phase E — Storybook

- [ ] E1: Create `apps/web/src/components/auth/UserMenu.stories.tsx` with four stories:
  - `Loading` — mock context `status: 'initializing'`; shows skeleton
  - `WithAvatar` — mock context `status: 'authenticated'`, user with `avatarUrl`; shows avatar image
  - `WithInitials` — mock context `status: 'authenticated'`, no `avatarUrl`; shows initials fallback
  - `LoggedOut` — mock context `status: 'unauthenticated'`; renders nothing (documents intent)
- [ ] E2: Create `apps/web/src/app/(auth)/login/[[...rest]]/login.stories.tsx` with two stories:
  - `Redirecting` — no search params; shows the spinner/redirecting card
  - `WithError` — `?error=session_expired` mocked via story args or decorator; shows error alert and Try Again button
- [ ] E3: Create `apps/web/src/app/callback/callback.stories.tsx` with one story:
  - `Loading` — the processing spinner state before token exchange completes
- [ ] E4: Run `pnpm storybook:build` and confirm all new stories compile without error

**Gate:** All three new story files compile in Storybook build. Visual states cover loading, authenticated, error, and empty.

---

## Phase F — E2E Test Coverage

- [ ] F1: `e2e/auth.spec.ts` — unauthenticated `/dashboard` redirects to `/login?returnTo=/dashboard`
- [ ] F2: `e2e/auth.spec.ts` — unauthenticated `/admin/theme` redirects to `/login`
- [ ] F3: `e2e/auth-handler.spec.ts` — full login flow: visit `/login` → auto-redirect to auth-handler form → submit real credentials → callback → land on `/dashboard` → `UserMenu` avatar visible in topbar
- [ ] F4: `e2e/auth-handler.spec.ts` — logout flow: authenticated → click logout in `UserMenu` → redirect to `/login` → navigating to `/dashboard` again redirects back to `/login`
- [ ] F5: `e2e/auth-handler.spec.ts` — browser back after logout: back to `/dashboard` redirects to `/login`
- [ ] F6: `e2e/auth-handler.spec.ts` — invalid callback state: navigate to `/callback?code=fake&state=wrong` → redirect to `/login?error=...`
- [ ] F7: `e2e/auth-handler.spec.ts` — authenticated user visiting `/login` is redirected to `/dashboard`
- [ ] F8: Add `e2e/helpers/auth.ts` helper — export `loginWithCredentials(page: Page, email: string, password: string): Promise<void>` shared across tests
- [ ] F9: Gate all tests requiring a live auth-handler on environment variable `RUN_AUTH_E2E=true` so CI does not fail when auth-handler is not running

**Gate:** F1 and F2 pass in CI without auth-handler. F3–F7 pass locally with both servers running.

---

## Phase G — Agency Model Foundation

- [ ] G1: Add `orgId: string | null` to `AuthUser` in `packages/auth/src/types.ts`
- [ ] G2: Add `orgId: string | null` to `SessionData` in `packages/auth/src/utils/session.ts`
- [ ] G3: Update `encodeSession()` to include `orgId` from `AuthSession.user`
- [ ] G4: Update `decodeSession()` to return `orgId` in the decoded `AuthUser`
- [ ] G5: Update `sessionFromClaims()` to map the `org_id` JWT claim to `orgId`
- [ ] G6: Thread `orgId` through auth-handler `BrowserSession` → `issueAccessToken` → ID token claims so the value round-trips
- [ ] G7: Add `registerClient(client: AuthClientConfig): void` to `AuthHandlerConfigService` — appends to the internal clients map for runtime registration
- [ ] G8: Update all `encodeSession`/`decodeSession` tests and `UserMenu` stories to include `orgId: null` in fixtures so existing tests do not break

**Gate:** `AuthSession.user.orgId` is populated from JWT `org_id` claim. `registerClient()` exists and is type-safe. All existing tests still pass.

---

## File Index

### Modified files

| File                                                           | Change                                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `packages/auth/src/types.ts`                                   | Add `orgId` to `AuthUser`                                                 |
| `packages/auth/src/utils/session.ts`                           | Add `orgId` to `SessionData`, thread through encode/decode/fromClaims     |
| `packages/auth/src/utils/cookies.ts`                           | Confirm Web Crypto only; add JSDoc edge-compatible tag                    |
| `packages/auth/src/adapters/auth-handler/context.tsx`          | Replace `isLoading`/`session` pair with `status` enum                     |
| `packages/auth/src/adapters/auth-handler/provider.tsx`         | Implement status state machine                                            |
| `packages/auth/src/adapters/auth-handler/client.ts`            | Derive `isLoading`/`isAuthenticated` from status                          |
| `packages/auth/src/adapters/auth-handler/middleware.ts`        | Remove duplicate unseal impl; import from utils/cookies                   |
| `apps/web/src/components/auth/UserMenu.tsx`                    | Skeleton on initializing; remove disabled items; use SESSION_STORAGE_KEYS |
| `apps/web/src/app/api/auth/logout/route.ts`                    | Add upstream SSO logout call                                              |
| `apps/web/src/app/api/auth/callback/route.ts`                  | Use `decodeJwtPayload()` util                                             |
| `apps/web/src/app/(auth)/login/[[...rest]]/page.tsx`           | Responsive Tailwind classes                                               |
| `apps/web/src/app/(auth)/signup/[[...rest]]/page.tsx`          | Responsive Tailwind classes                                               |
| `apps/web/src/app/(auth)/forgot-password/[[...rest]]/page.tsx` | Responsive Tailwind classes                                               |
| `apps/web/e2e/auth.spec.ts`                                    | Add/expand route protection tests                                         |
| `apps/web/e2e/auth-handler.spec.ts`                            | Full login, logout, and error scenario tests                              |
| `forge-core/apps/auth-handler/src/oidc-provider.service.ts`    | Remove HTML methods; remove Clerk API calls; inject new services          |
| `forge-core/apps/auth-handler/src/auth-handler.controller.ts`  | Call LoginTemplateService for HTML responses                              |
| `forge-core/apps/auth-handler/src/auth-handler.module.ts`      | Register new services                                                     |
| `forge-core/apps/auth-handler/src/auth-handler.config.ts`      | Add `registerClient()` method                                             |

### New files

| File                                                                    | Purpose                                               |
| ----------------------------------------------------------------------- | ----------------------------------------------------- |
| `packages/auth/src/constants.ts`                                        | `SESSION_STORAGE_KEYS` constants                      |
| `packages/auth/src/utils/jwt.ts`                                        | `decodeJwtPayload<T>()` utility                       |
| `packages/auth/src/utils/jwt.test.ts`                                   | Unit tests for JWT decode                             |
| `apps/web/src/components/auth/UserMenu.stories.tsx`                     | Storybook stories for UserMenu                        |
| `apps/web/src/app/(auth)/login/[[...rest]]/login.stories.tsx`           | Storybook stories for login error state               |
| `apps/web/src/app/callback/callback.stories.tsx`                        | Storybook story for callback loading                  |
| `apps/web/e2e/helpers/auth.ts`                                          | `loginWithCredentials()` E2E helper                   |
| `forge-core/apps/auth-handler/src/auth-handler.constants.ts`            | Cookie names and TTL constants                        |
| `forge-core/apps/auth-handler/src/login-template.service.ts`            | Mobile-first HTML template factory                    |
| `forge-core/apps/auth-handler/src/credential-verifier.interface.ts`     | `ICredentialVerifier` interface + `VerifiedUser` type |
| `forge-core/apps/auth-handler/src/clerk-credential-verifier.service.ts` | Clerk Backend API credential verifier                 |

---

## Gotchas

1. `AuthHandlerProvider` status must never flip from `authenticated` to `unauthenticated` on a transient network error — treat fetch failure as `initializing` and retry or hold the last-known state.
2. The upstream SSO logout fetch in `logout/route.ts` must be fire-and-forget on error — if auth-handler is unreachable the user must still be logged out of agent-forge.
3. `decodeJwtPayload()` must NOT verify the JWT signature — tokens arrive over TLS from a trusted auth-handler. Only payload decoding is needed.
4. Web Crypto `crypto.subtle` is globally available in Edge Runtime and Node 18+ — no polyfill needed, but never use `require('crypto')` which is Node-only.
5. All Storybook stories for `UserMenu` must provide a mock `AuthHandlerContext` via a decorator — no real network calls.
6. E2E tests requiring live credentials must be gated behind `RUN_AUTH_E2E=true` to keep CI green without a running auth-handler.
7. `orgId` in `AuthUser` is `string | null`, never `undefined` — existing spread/destructure code works without optional chaining changes.
8. `LoginTemplateService` and `ClerkCredentialVerifierService` must be in the NestJS DI container — inject via constructor and register in `auth-handler.module.ts`, not instantiated with `new`.

---

## Assumptions

- Spec 00 implementation is complete and the end-to-end login flow is working
- `AUTH_SECRET_KEY` in forge-core is a valid Clerk secret key for the `verify_password` API
- Storybook viewport addon is already configured (required for Phase D verification)
- No database or external state store is introduced in this spec — `registerClient()` is in-memory only
- The `forge-core` auth-handler in-memory store limitation is known and deferred to a later spec
