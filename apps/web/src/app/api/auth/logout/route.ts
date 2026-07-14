import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Logout endpoint — clears all auth state then chains through auth-handler logout.
 * POST only: GET is intentionally omitted to prevent CSRF logout via <img src> or prefetch.
 *
 * Flow:
 * 1. Clear :3000 session cookies (forge_session, forge_refresh, forge_oauth_flow)
 * 2. Redirect browser to auth-handler GET /auth/logout?return_to=/login
 * 3. Auth-handler clears forge_auth_session on :3002 and redirects to /login
 */
export async function POST(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL('/', request.url).origin
  const issuer = process.env.AUTH_HANDLER_ISSUER

  // Build the redirect target: chain through auth-handler logout to clear :3002 session cookie,
  // then have auth-handler redirect back to our /login page.
  const loginUrl = `${appUrl}/login`
  const redirectTarget = issuer
    ? `${issuer}/logout?return_to=${encodeURIComponent(loginUrl)}`
    : loginUrl

  const response = NextResponse.redirect(redirectTarget)

  // Clear all auth cookies
  clearAuthCookies(response)

  return response
}

/**
 * Helper to clear all auth-related cookies.
 */
function clearAuthCookies(response: NextResponse) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  }

  response.cookies.set('forge_session', '', cookieOptions)
  response.cookies.set('forge_refresh', '', cookieOptions)
  response.cookies.set('forge_oauth_flow', '', cookieOptions)

  // Also delete cookies (belt and suspenders approach)
  response.cookies.delete('forge_session')
  response.cookies.delete('forge_refresh')
  response.cookies.delete('forge_oauth_flow')
}
