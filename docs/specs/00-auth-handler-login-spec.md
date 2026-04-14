# Auth Handler Login Migration Spec

**Priority:** 00  
**Goal:** Replace direct Clerk app-facing login with `auth-handler`-backed login in AgentForge while preserving SSR, middleware protection, and API token access.  
**Source:** forge-core `auth-handler` flow + existing AgentForge auth abstraction

---

## Overview

AgentForge currently uses Clerk directly for app login, auth pages, middleware, session lookup, and user UI. The target architecture makes AgentForge an OAuth/OIDC client of forge-core `auth-handler`, with Clerk remaining the upstream identity provider behind `auth-handler`.

Target flow:

1. User visits `/login`, `/signup`, or `/forgot-password`
2. AgentForge starts OAuth with `auth-handler`
3. `auth-handler` redirects to Clerk
4. Clerk returns to `auth-handler`
5. `auth-handler` returns an authorization code to AgentForge `/callback`
6. AgentForge exchanges the code, creates its own app session, stores browser API token state, and redirects to `/dashboard`

Success criteria:

- Auth pages no longer render Clerk UI in-app
- Protected routes remain enforced in middleware and SSR
- App code continues using `getSession()`, `requireAuth()`, and `useUser()`
- The browser can obtain bearer tokens for API calls through `getAccessToken()`
- Logout clears both AgentForge and `auth-handler` session state

---

## Design -> Architecture Mapping

### Provider model

- Add `auth-handler` to `AuthProviderKey`
- Keep registry-driven resolution in `packages/auth`
- Keep `getSession()`, `requireAuth()`, and `useUser()` as the stable public auth API
- Add `getAccessToken(): Promise<string | null>` as the only new public client helper

### Session model

- Access token lives in `sessionStorage`
- Refresh token lives in a secure httpOnly cookie
- App session lives in a secure httpOnly cookie
- Middleware and SSR never depend on browser storage; they use the app session cookie only

### OAuth client model

- Register a dedicated `auth-handler` public client for AgentForge: `agent-forge-web`
- Do not reuse `forge-local-spa`
- Redirect URI points to AgentForge `/callback`
- Default upstream connection is `clerk`
- Requested scope is `openid profile email offline_access agents:read agents:write`

### App-owned auth routes

- `/login` starts the login flow
- `/signup` starts the signup-intent flow
- `/forgot-password` starts the recovery-intent flow
- `/callback` receives the authorization code from `auth-handler`
- `/api/auth/login` creates `state` + PKCE and redirects to `auth-handler`
- `/api/auth/callback` validates state and exchanges code
- `/api/auth/refresh` refreshes the access token using the refresh cookie
- `/api/auth/logout` clears app state and triggers `auth-handler` logout

### Gotchas

1. Next middleware cannot read `sessionStorage`, so cookie-backed app session is mandatory.
2. Refresh tokens must never be exposed to browser JavaScript.
3. `/signup` and `/forgot-password` are app-owned pages in v1 but reuse the same kickoff flow because current `auth-handler` does not yet forward screen-specific upstream hints.
4. Active-path dependence on Clerk UI and Clerk middleware must be removed once `auth-handler` becomes the active provider.
5. The callback flow must use PKCE and state validation on every login attempt.

---

## Phase A — Contracts & Config

- [x] A1: Add `auth-handler` to `AuthProviderKey` in `packages/config/src/properties.ts`
- [x] A2: Add `auth-handler` cases to `packages/auth/src/server-registry.ts`, `client-registry.ts`, `middleware-registry.ts`, and `auth-provider.tsx`
- [x] A3: Extend the public auth client surface with `getAccessToken(): Promise<string | null>`
- [x] A4: Add env vars to `.env.example`: `AUTH_HANDLER_ISSUER`, `AUTH_HANDLER_CLIENT_ID`, `AUTH_HANDLER_REDIRECT_URI`, `AUTH_HANDLER_SCOPE`, `AUTH_HANDLER_CONNECTION`, `AUTH_HANDLER_SESSION_SECRET`
- [x] A5: Define and document dedicated OAuth client `agent-forge-web` in forge-core `auth-handler`
- [x] A6: Set default upstream connection for AgentForge to `clerk`

**Gate:** Provider selection, client contract, and required config are fully defined with no unresolved auth ownership questions.

---

## Phase B — App-Owned Auth Pages & Kickoff

- [x] B1: Replace Clerk-only `/login` page with an app-owned login page
- [x] B2: Replace Clerk-only `/signup` page with an app-owned signup page
- [x] B3: Replace Clerk-only `/forgot-password` page with an app-owned recovery page
- [x] B4: Add `GET /api/auth/login`
- [x] B5: Generate PKCE verifier/challenge and opaque `state`
- [x] B6: Store sealed flow cookie containing `state`, PKCE verifier, auth intent, and return target
- [x] B7: Redirect to `${AUTH_HANDLER_ISSUER}/authorize` with `client_id`, `redirect_uri`, `response_type=code`, `scope`, `state`, `code_challenge`, `code_challenge_method=S256`, and `connection=clerk`

**Gate:** `/login`, `/signup`, and `/forgot-password` all start the `auth-handler` flow and no longer render Clerk components.

---

## Phase C — Callback, Token Exchange, And Session Establishment

- [x] C1: Add app-owned `/callback` page
- [x] C2: Add same-origin callback handler at `POST /api/auth/callback`
- [x] C3: Validate callback `state` against the sealed flow cookie
- [x] C4: Exchange authorization code at `${AUTH_HANDLER_ISSUER}/token`
- [x] C5: Normalize returned claims into the existing `AuthSession` shape
- [x] C6: Set secure httpOnly app session cookie
- [x] C7: Set secure httpOnly refresh-token cookie
- [x] C8: Return access token to the browser callback page for storage in `sessionStorage`
- [x] C9: Redirect successful callback to `/dashboard`
- [x] C10: Reject invalid, expired, missing, or replayed `state`

**Gate:** Valid callbacks establish both app session state and browser token state; invalid callbacks fail closed.

---

## Phase D — Middleware, SSR, And User State

- [x] D1: Implement `packages/auth/src/adapters/auth-handler/server.ts`
- [x] D2: Implement `packages/auth/src/adapters/auth-handler/client.ts`
- [x] D3: Implement `packages/auth/src/adapters/auth-handler/provider.tsx`
- [x] D4: Implement `packages/auth/src/adapters/auth-handler/middleware.ts`
- [x] D5: Make `getSession()` read and validate the app session cookie
- [x] D6: Make `requireAuth()` redirect unauthenticated users to `/login`
- [x] D7: Make `useUser()` expose app-owned user state rather than Clerk hook state
- [x] D8: Keep `apps/web/src/proxy.ts` protection for `/dashboard(.*)`, `/admin(.*)`, and `/agents(.*)`
- [x] D9: Redirect authenticated users away from auth pages to `/dashboard`

**Gate:** Protected routes still work before render, and existing app code continues to rely on the same public auth API.

---

## Phase E — Logout, Refresh, And Dashboard User UI

- [x] E1: Replace Clerk `UserButton` usage with app-owned `UserMenu`
- [x] E2: Add `POST /api/auth/refresh`
- [x] E3: Make `getAccessToken()` return the in-browser access token when valid
- [x] E4: Make `getAccessToken()` call the refresh route when the token is missing or expired
- [x] E5: Use the refresh-token cookie server-side to obtain a new access token from `auth-handler`
- [x] E6: Rotate app session state on refresh when needed
- [x] E7: Add `POST /api/auth/logout`
- [x] E8: Clear app session cookie, refresh cookie, and browser token state on logout
- [x] E9: Call `${AUTH_HANDLER_ISSUER}/logout` with `return_to=/login` so the `auth-handler` browser session is cleared too

**Gate:** Dashboard user UI, transparent refresh, and full logout all work without Clerk-owned UI components.

---

## Phase F — Tests & Verification

- [x] F1: Unit-test session-cookie encode/decode, expiry, and claim normalization
- [x] F2: Unit-test `getSession()`, `requireAuth()`, and `getAccessToken()`
- [x] F3: Route-handler tests for login kickoff, callback success, callback rejection, refresh, and logout
- [x] F4: Middleware tests for unauthenticated `/dashboard` redirect and authenticated `/login` redirect
- [x] F5: E2E test the full login redirect chain through `auth-handler` to `/dashboard`
- [x] F6: E2E test that page reload remains authenticated via app session cookie
- [x] F7: E2E test that expired browser token refreshes without forcing re-login
- [x] F8: E2E test that logout clears both AgentForge and `auth-handler` session state

**Gate:** Auth flow is fully covered at unit, route, middleware, and E2E levels.

---

## File Index

### Modified files

| File                                                           | Change                                               |
| -------------------------------------------------------------- | ---------------------------------------------------- |
| `packages/config/src/properties.ts`                            | Add `auth-handler` provider key                      |
| `packages/auth/src/contracts.ts`                               | Add client helper contract updates                   |
| `packages/auth/src/server-registry.ts`                         | Resolve `auth-handler` server adapter                |
| `packages/auth/src/client-registry.ts`                         | Resolve `auth-handler` client adapter                |
| `packages/auth/src/middleware-registry.ts`                     | Resolve `auth-handler` middleware adapter            |
| `packages/auth/src/auth-provider.tsx`                          | Resolve `auth-handler` provider wrapper              |
| `apps/web/src/proxy.ts`                                        | Keep protected patterns backed by app session cookie |
| `apps/web/src/app/(auth)/login/[[...rest]]/page.tsx`           | Replace Clerk `SignIn`                               |
| `apps/web/src/app/(auth)/signup/[[...rest]]/page.tsx`          | Replace Clerk `SignUp`                               |
| `apps/web/src/app/(auth)/forgot-password/[[...rest]]/page.tsx` | Replace Clerk `SignIn` fallback                      |
| `apps/web/src/app/(dashboard)/layout.tsx`                      | Replace Clerk `UserButtonClient`                     |
| `.env.example`                                                 | Add `auth-handler` env vars                          |

### New files

- `packages/auth/src/adapters/auth-handler/server.ts`
- `packages/auth/src/adapters/auth-handler/client.ts`
- `packages/auth/src/adapters/auth-handler/provider.tsx`
- `packages/auth/src/adapters/auth-handler/middleware.ts`
- `apps/web/src/app/callback/page.tsx`
- `apps/web/src/app/api/auth/login/route.ts`
- `apps/web/src/app/api/auth/callback/route.ts`
- `apps/web/src/app/api/auth/refresh/route.ts`
- `apps/web/src/app/api/auth/logout/route.ts`
- `apps/web/src/components/auth/UserMenu.tsx`

---

## Cross-References

- Add a note in `docs/specs/nextjs-frontend-specs.md` Phase 6 that detailed migration work now lives in `docs/specs/00-auth-handler-login-spec.md`
- Add a short note in `docs/ARCHITECTURE.md` that app-facing auth is moving from direct Clerk integration to `auth-handler`

---

## Assumptions

- `auth-handler` is the primary app-facing login provider
- Clerk remains the first upstream identity provider behind `auth-handler`
- Access token lives in `sessionStorage`, but route protection remains cookie-based
- Refresh token stays server-only in secure httpOnly cookies
- The dedicated OAuth client for AgentForge is `agent-forge-web`
