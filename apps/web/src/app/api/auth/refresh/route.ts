import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { unsealCookie, sealCookie } from '@forge/auth/src/utils/cookies'
import { sessionFromClaims } from '@forge/auth/src/utils/session'

interface RefreshTokenData {
  token: string
  createdAt: number
}

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope?: string
}

/**
 * Token refresh endpoint — exchanges refresh token for new access token.
 * Called by getAccessToken() when browser token is expired or missing.
 *
 * Flow:
 * 1. Read refresh token from httpOnly cookie
 * 2. Exchange with auth-handler for new tokens
 * 3. Update session cookie if needed
 * 4. Update refresh cookie with new refresh token
 * 5. Return new access token to client for sessionStorage
 */
export async function POST(request: NextRequest) {
  try {
    // Validate env vars
    const issuer = process.env.AUTH_HANDLER_ISSUER
    const clientId = process.env.AUTH_HANDLER_CLIENT_ID
    const sessionSecret = process.env.AUTH_HANDLER_SESSION_SECRET

    if (!issuer || !clientId || !sessionSecret) {
      console.error('[auth] Missing AUTH_HANDLER_* environment variables')
      return NextResponse.json({ success: false, error: 'Configuration error' }, { status: 500 })
    }

    // Read refresh token cookie
    const cookieStore = await cookies()
    const refreshCookie = cookieStore.get('forge_refresh')

    if (!refreshCookie?.value) {
      return NextResponse.json(
        { success: false, error: 'No refresh token available' },
        { status: 401 }
      )
    }

    // Unseal refresh token
    let refreshData: RefreshTokenData
    try {
      refreshData = await unsealCookie<RefreshTokenData>(refreshCookie.value, sessionSecret)
    } catch (err) {
      console.error('[auth] Failed to unseal refresh token:', err)
      return NextResponse.json({ success: false, error: 'Invalid refresh token' }, { status: 401 })
    }

    // Exchange refresh token for new access token
    const tokenUrl = `${issuer}/token`
    const tokenParams = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshData.token,
      client_id: clientId,
    })

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}))
      console.error('[auth] Token refresh failed:', errorData)

      // Clear invalid refresh token
      const response = NextResponse.json(
        { success: false, error: errorData.error_description || 'Refresh failed' },
        { status: 401 }
      )
      response.cookies.set('forge_refresh', '', { maxAge: 0, path: '/' })
      return response
    }

    const tokens: TokenResponse = await tokenResponse.json()

    // Create response
    const response = NextResponse.json({
      success: true,
      accessToken: tokens.access_token,
      expiresIn: tokens.expires_in,
    })

    // Update refresh token cookie if new one provided
    if (tokens.refresh_token) {
      const sealedRefresh = await sealCookie(
        { token: tokens.refresh_token, createdAt: Date.now() },
        sessionSecret
      )
      response.cookies.set('forge_refresh', sealedRefresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      })
    }

    return response
  } catch (err) {
    console.error('[auth] Refresh error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
