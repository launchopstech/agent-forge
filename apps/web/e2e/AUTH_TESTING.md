# Auth Handler E2E Testing Guide

This guide explains how to test the auth-handler login flow using Playwright.

## Prerequisites

### 1. Running Services

You need **both** services running:

```bash
# Terminal 1 - forge-core auth-handler
cd /Users/bomatra/Developement/agentic-ai/forge-core
pnpm dev:auth-handler
# Should see: auth-handler listening on http://localhost:3002

# Terminal 2 - agent-forge
cd /Users/bomatra/Developement/agentic-ai/agent-forge
pnpm dev
# Should see: ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 2. Environment Variables

**forge-core `.env.local`:**

```bash
AUTH_PROVIDER=auth-handler
AUTH_HANDLER_ISSUER=http://localhost:3002/auth
AUTH_HANDLER_COOKIE_SECRET=<32-byte-hex-string>
AUTH_HANDLER_CLERK_DISCOVERY_URL=<your-clerk-discovery-url>
AUTH_HANDLER_CLERK_CLIENT_ID=<your-clerk-client-id>
AUTH_HANDLER_CLERK_CLIENT_SECRET=<your-clerk-client-secret>
CORS_ORIGIN=http://localhost:3000
```

**agent-forge `.env.local`:**

```bash
NEXT_PUBLIC_AUTH_PROVIDER=auth-handler
AUTH_HANDLER_ISSUER=http://localhost:3002/auth
AUTH_HANDLER_CLIENT_ID=agent-forge-web
AUTH_HANDLER_REDIRECT_URI=http://localhost:3000/callback
AUTH_HANDLER_SCOPE=openid profile email offline_access agents:read agents:write
AUTH_HANDLER_CONNECTION=clerk
AUTH_HANDLER_SESSION_SECRET=<32-byte-hex-string>
```

## Running Tests

### Method 1: Run all E2E tests

```bash
cd /Users/bomatra/Developement/agentic-ai/agent-forge
pnpm test:e2e
```

### Method 2: Run only auth-handler tests

```bash
pnpm test:e2e e2e/auth-handler.spec.ts
```

### Method 3: Run with UI (interactive debugging)

```bash
pnpm test:e2e:ui
# Then select auth-handler.spec.ts from the UI
```

### Method 4: Run specific test

```bash
pnpm exec playwright test -g "Full login redirect chain"
```

## Test Coverage

The test suite covers all Phase F requirements:

- ✅ **F5**: Full login redirect chain through auth-handler to /dashboard
- ✅ **F6**: Page reload remains authenticated via app session cookie
- ✅ **F7**: Expired browser token refreshes without forcing re-login
- ✅ **F8**: Logout clears both AgentForge and auth-handler session state

Additional tests:

- Protected route middleware redirects
- Authenticated users redirected away from auth pages
- Invalid callback state rejection
- Missing code parameter handling

## Test Approaches

### Approach 1: Mock Auth State (Fast, No OAuth Flow)

Best for most tests that need authenticated state without testing the login flow itself.

```typescript
import { setupAuthState } from './helpers/auth'

test('protected feature works', async ({ page }) => {
  // Skip OAuth flow - set up mock authenticated state
  await setupAuthState(page, {
    userId: 'test-123',
    email: 'test@example.com',
    name: 'Test User',
  })

  await page.goto('/dashboard')
  // Test your feature...
})
```

### Approach 2: Saved Auth State (Real Tokens, Reusable)

Create once, reuse across tests.

**Step 1: Create auth state file (one-time setup)**

```bash
# Start services
cd forge-core && pnpm dev:auth-handler &
cd agent-forge && pnpm dev &

# Manually log in via browser at http://localhost:3000/login
# Complete the full OAuth flow

# Run this script to save the auth state:
pnpm exec playwright codegen http://localhost:3000/dashboard --save-storage=e2e/auth-state.json
```

**Step 2: Use in tests**

```typescript
import { test } from '@playwright/test'

test.use({ storageState: 'e2e/auth-state.json' })

test('protected feature with real auth', async ({ page }) => {
  // Already authenticated!
  await page.goto('/dashboard')
  // Test your feature...
})
```

### Approach 3: Full OAuth Flow (Slow, Complete E2E)

Test the entire OAuth flow including Clerk authentication.

**Option A: With test credentials**

```typescript
test('complete OAuth flow', async ({ page }) => {
  await page.goto('/login')
  await page.click('button:has-text("Continue with Auth Handler")')

  // Wait for auth-handler redirect
  await page.waitForURL(/localhost:3002\/auth\/authorize/)

  // Auth-handler redirects to Clerk
  await page.waitForURL(/clerk\.accounts\.dev/)

  // Fill in Clerk login form
  await page.fill('input[name="identifier"]', 'test@example.com')
  await page.click('button[type="submit"]')
  await page.fill('input[name="password"]', 'test-password')
  await page.click('button[type="submit"]')

  // Should callback to agent-forge
  await page.waitForURL(/localhost:3000\/callback/)

  // Should redirect to dashboard
  await page.waitForURL(/localhost:3000\/dashboard/)
})
```

**Option B: With auth-handler dev token endpoint**

If auth-handler has a `/dev/token` endpoint (bypasses OAuth):

```typescript
test('login via dev token', async ({ page }) => {
  // Get dev token from auth-handler
  const response = await page.request.post('http://localhost:3002/auth/dev/token', {
    data: {
      userId: 'test-123',
      email: 'test@example.com',
      name: 'Test User',
    },
  })

  const { access_token, id_token, refresh_token } = await response.json()

  // Manually set tokens as if callback succeeded
  // ... (implementation depends on your callback handler)
})
```

## Debugging Tests

### View test results

```bash
pnpm exec playwright show-report
```

### Run with headed browser

```bash
pnpm exec playwright test --headed
```

### Run with Playwright Inspector

```bash
PWDEBUG=1 pnpm test:e2e e2e/auth-handler.spec.ts
```

### Check cookies during test

Add this to your test:

```typescript
const cookies = await page.context().cookies()
console.log('Cookies:', cookies)
```

### Check sessionStorage during test

```typescript
const storage = await page.evaluate(() => {
  return {
    session: sessionStorage.getItem('forge_access_token'),
    local: Object.keys(localStorage),
  }
})
console.log('Storage:', storage)
```

### Take screenshot on failure

Already configured in `playwright.config.ts`:

```typescript
use: {
  screenshot: 'only-on-failure',
  trace: 'on-first-retry',
}
```

Screenshots saved to `test-results/`

## Common Issues

### Issue: auth-handler redirect timeout

**Problem**: Test fails waiting for `localhost:3002/auth/authorize`

**Solutions**:

1. Verify auth-handler is running: `curl http://localhost:3002/auth/.well-known/openid-configuration`
2. Check auth-handler logs for errors
3. Verify `AUTH_HANDLER_ISSUER` is correct in `.env.local`

### Issue: Clerk authentication failure

**Problem**: Auth flow fails at Clerk step

**Solutions**:

1. Verify Clerk OAuth app is configured
2. Check `AUTH_HANDLER_CLERK_*` environment variables
3. Use mock auth state instead (see Approach 1 above)

### Issue: Session cookies not set

**Problem**: Callback succeeds but no cookies appear

**Solutions**:

1. Check `/api/auth/callback` logs for errors
2. Verify `AUTH_HANDLER_SESSION_SECRET` is set (32+ chars)
3. Check browser DevTools → Network → /api/auth/callback → Set-Cookie headers

### Issue: Protected routes not redirecting

**Problem**: Can access `/dashboard` without authentication

**Solutions**:

1. Verify `NEXT_PUBLIC_AUTH_PROVIDER=auth-handler` in `.env.local`
2. Check middleware is active: look for `apps/web/src/proxy.ts`
3. Restart dev server after changing env vars

## CI/CD Integration

To run tests in CI:

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install

      # Start auth-handler in background
      - run: |
          cd forge-core
          pnpm dev:auth-handler &
          sleep 5

      # Run E2E tests
      - run: |
          cd agent-forge
          pnpm test:e2e

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: apps/web/playwright-report/
```

## Next Steps

1. Create saved auth state for faster tests
2. Add more edge case tests (network failures, token expiry, etc.)
3. Add visual regression tests for auth pages
4. Set up CI/CD pipeline for E2E tests
