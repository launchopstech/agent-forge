import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { unsealCookie, sealCookie } from '@forge/auth/src/utils/cookies'
import { sessionFromClaims } from '@forge/auth/src/utils/session'

interface OAuthFlowState {
  state: string
  codeVerifier: string
  intent: 'login' | 'signup' | 'recovery'
  returnTo: string
  createdAt: number
}

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  id_token?: string
  scope?: string
}

interface JWTClaims {
  sub: string
  email?: string
  name?: string
  [key: string]: unknown
}

/**
 * OAuth callback handler — exchanges authorization code for tokens.
 * Called by the /callback page after auth-handler redirects with code.
 *
 * Flow:
 * 1. Validate state against sealed flow cookie
 * 2. Exchange authorization code for tokens
 * 3. Parse ID token claims → AuthSession
 * 4. Set session + refresh cookies (httpOnly)
 * 5. Return access token to client for sessionStorage
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, state } = body

    if (!code || !state) {
      return NextResponse.json({ success: false, error: 'Missing code or state' }, { status: 400 })
    }

    // Validate env vars
    const issuer = process.env.AUTH_HANDLER_ISSUER
    const clientId = process.env.AUTH_HANDLER_CLIENT_ID
    const redirectUri = process.env.AUTH_HANDLER_REDIRECT_URI
    const sessionSecret = process.env.AUTH_HANDLER_SESSION_SECRET

    if (!issuer || !clientId || !redirectUri || !sessionSecret) {
      console.error('[auth] Missing AUTH_HANDLER_* environment variables')
      return NextResponse.json({ success: false, error: 'Configuration error' }, { status: 500 })
    }

    // Read and validate flow cookie
    const cookieStore = await cookies()
    const flowCookie = cookieStore.get('forge_oauth_flow')

    if (!flowCookie?.value) {
      return NextResponse.json(
        { success: false, error: 'Missing or expired flow state' },
        { status: 400 }
      )
    }

    let flowState: OAuthFlowState
    try {
      flowState = await unsealCookie<OAuthFlowState>(flowCookie.value, sessionSecret)
    } catch (err) {
      console.error('[auth] Failed to unseal flow cookie:', err)
      return NextResponse.json({ success: false, error: 'Invalid flow state' }, { status: 400 })
    }

    // Validate state matches
    if (flowState.state !== state) {
      console.error('[auth] State mismatch - possible CSRF attack')
      return NextResponse.json(
        { success: false, error: 'Invalid state parameter' },
        { status: 400 }
      )
    }

    // Validate flow not expired (10 min max)
    const flowAge = Date.now() - flowState.createdAt
    if (flowAge > 10 * 60 * 1000) {
      return NextResponse.json(
        { success: false, error: 'Flow expired - please try again' },
        { status: 400 }
      )
    }

    // Exchange authorization code for tokens
    const tokenUrl = `${issuer}/token`
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: flowState.codeVerifier,
    })

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}))
      console.error('[auth] Token exchange failed:', errorData)
      return NextResponse.json(
        { success: false, error: errorData.error_description || 'Token exchange failed' },
        { status: 401 }
      )
    }

    const tokens: TokenResponse = await tokenResponse.json()

    // Decode ID token claims (no signature verification - fetched over TLS from trusted server)
    let claims: JWTClaims
    if (tokens.id_token) {
      try {
        // JWT is base64url.base64url.base64url - we want the middle part (payload)
        const [, payloadB64] = tokens.id_token.split('.')
        if (!payloadB64) throw new Error('Invalid ID token format')

        // Restore standard base64
        let base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/')
        while (base64.length % 4 !== 0) base64 += '='

        const payload = Buffer.from(base64, 'base64').toString('utf-8')
        claims = JSON.parse(payload)
      } catch (err) {
        console.error('[auth] Failed to decode ID token:', err)
        return NextResponse.json({ success: false, error: 'Invalid ID token' }, { status: 500 })
      }
    } else {
      return NextResponse.json({ success: false, error: 'No ID token returned' }, { status: 500 })
    }

    // Create session from claims
    const sessionData = sessionFromClaims(claims)

    // Seal session cookie (8 hour expiry)
    const sealedSession = await sealCookie(sessionData, sessionSecret)

    // Create response
    const response = NextResponse.json({
      success: true,
      accessToken: tokens.access_token,
      expiresIn: tokens.expires_in,
      returnTo: flowState.returnTo,
    })

    // Set session cookie (httpOnly, Secure in prod)
    response.cookies.set('forge_session', sealedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    })

    // Set refresh token cookie if provided (httpOnly, Secure in prod)
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

    // Clear flow cookie
    response.cookies.set('forge_oauth_flow', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return response
  } catch (err) {
    console.error('[auth] Callback error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
