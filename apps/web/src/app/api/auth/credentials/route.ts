import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
} from '@forge/auth/src/utils/pkce'
import { sealCookie } from '@forge/auth/src/utils/cookies'

// Reuse the same flow state shape as login/route.ts
interface OAuthFlowState {
  state: string
  codeVerifier: string
  intent: 'login'
  returnTo: string
  createdAt: number
}

/**
 * Credential login route — accepts email/password, verifies via auth-handler's
 * POST /auth/login endpoint (which calls Clerk Backend API), and drives the
 * PKCE callback flow without a browser redirect to the auth-handler domain.
 *
 * Flow:
 * 1. Generate PKCE verifier + challenge + state nonce
 * 2. POST credentials + PKCE params to auth-handler /auth/login
 * 3. Receive { redirectUrl: '/callback?code=...&state=...' } from auth-handler
 * 4. Seal flow state cookie (for PKCE verification in /callback)
 * 5. Redirect browser to /callback with auth code
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; password?: string; returnTo?: string }
  const { email, password, returnTo = '/dashboard' } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  // Validate env vars
  const issuer = process.env.AUTH_HANDLER_ISSUER
  const clientId = process.env.AUTH_HANDLER_CLIENT_ID
  const redirectUri = process.env.AUTH_HANDLER_REDIRECT_URI
  const scope = process.env.AUTH_HANDLER_SCOPE
  const connection = process.env.AUTH_HANDLER_CONNECTION
  const sessionSecret = process.env.AUTH_HANDLER_SESSION_SECRET

  if (!issuer || !clientId || !redirectUri || !scope || !connection || !sessionSecret) {
    console.error('[auth] Missing AUTH_HANDLER_* environment variables')
    return NextResponse.json({ error: 'Configuration error.' }, { status: 500 })
  }

  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = generateState()

  // Call auth-handler credential endpoint
  let redirectUrl: string
  try {
    const loginResponse = await fetch(`${issuer}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        connection,
      }),
    })

    if (!loginResponse.ok) {
      const errorData = (await loginResponse.json().catch(() => ({}))) as { message?: string }
      const status = loginResponse.status
      if (status === 401) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
      }
      console.error('[auth] auth-handler /login error:', status, errorData)
      return NextResponse.json({ error: 'Authentication failed.' }, { status: 502 })
    }

    const data = (await loginResponse.json()) as { redirectUrl?: string }
    if (!data.redirectUrl) {
      return NextResponse.json({ error: 'Invalid response from auth server.' }, { status: 502 })
    }
    redirectUrl = data.redirectUrl
  } catch (err) {
    console.error('[auth] Failed to reach auth-handler:', err)
    return NextResponse.json({ error: 'Auth server unreachable.' }, { status: 503 })
  }

  // Seal flow state cookie so /callback can verify the PKCE code_verifier
  const flowState: OAuthFlowState = {
    state,
    codeVerifier,
    intent: 'login',
    returnTo,
    createdAt: Date.now(),
  }
  const sealedFlow = await sealCookie(flowState, sessionSecret)

  // Return the callback URL — client-side JS will navigate there
  const response = NextResponse.json({ redirectUrl })

  response.cookies.set('forge_oauth_flow', sealedFlow, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60, // 10 minutes
  })

  return response
}
