import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Logout endpoint — clears all auth state and redirects to login.
 * This ensures both AgentForge session cookies are cleared.
 *
 * Note: auth-handler session is in a separate cookie and will expire naturally.
 * For a full SSO logout across all auth-handler clients, we would need to call
 * auth-handler's POST /logout endpoint and use the redirect_to from the response.
 *
 * Client-side logout flow:
 * 1. Clear sessionStorage (access token)
 * 2. Navigate to this endpoint (GET or POST)
 * 3. This endpoint clears cookies and redirects to /login
 */

async function handleLogout(request: NextRequest) {
  // Create redirect response to login page
  const response = NextResponse.redirect(new URL('/login', request.url))

  // Clear all auth cookies
  clearAuthCookies(response)

  return response
}

export async function GET(request: NextRequest) {
  return handleLogout(request)
}

export async function POST(request: NextRequest) {
  return handleLogout(request)
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
