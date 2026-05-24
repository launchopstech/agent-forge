import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
} from '@forge/auth/src/utils/pkce'
import { sealCookie } from '@forge/auth/src/utils/cookies'

// OAuth flow state stored in encrypted cookie during authorization
interface OAuthFlowState {
  state: string
  codeVerifier: string
  intent: 'login' | 'signup' | 'recovery'
  returnTo: string
  createdAt: number
}

/**
 * OAuth kickoff route — initiates OAuth 2.0 authorization code flow with PKCE.
 * Called when user clicks login/signup/forgot-password buttons.
 *
 * Flow:
 * 1. Generate PKCE verifier + challenge + state nonce
 * 2. Seal flow state into encrypted cookie (10 min expiry)
 * 3. Redirect to auth-handler /authorize endpoint
 */
/** Validates returnTo is a same-origin relative path to prevent open redirect. */
function sanitizeReturnTo(value: string | null): string {
  const path = value ?? '/dashboard'
  // Must start with / and not be a protocol-relative URL (//evil.com)
  if (path.startsWith('/') && !path.startsWith('//')) return path
  return '/dashboard'
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const intent = (searchParams.get('intent') ?? 'login') as OAuthFlowState['intent']
  const returnTo = sanitizeReturnTo(searchParams.get('returnTo'))

  // Validate env vars
  const issuer = process.env.AUTH_HANDLER_ISSUER
  const clientId = process.env.AUTH_HANDLER_CLIENT_ID
  const redirectUri = process.env.AUTH_HANDLER_REDIRECT_URI
  const scope = process.env.AUTH_HANDLER_SCOPE
  const connection = process.env.AUTH_HANDLER_CONNECTION
  const sessionSecret = process.env.AUTH_HANDLER_SESSION_SECRET
  const orgId = process.env.AUTH_HANDLER_ORG_ID?.trim() || process.env.NEXT_PUBLIC_ORG_ID?.trim()

  if (!issuer || !clientId || !redirectUri || !scope || !connection || !sessionSecret) {
    console.error('[auth] Missing AUTH_HANDLER_* environment variables')
    return NextResponse.redirect(new URL('/login?error=Configuration error', request.url))
  }

  // Generate PKCE parameters
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state = generateState()

  // Seal flow state into cookie (10 min expiry)
  const flowState: OAuthFlowState = {
    state,
    codeVerifier,
    intent,
    returnTo,
    createdAt: Date.now(),
  }

  const sealedFlow = await sealCookie(flowState, sessionSecret)

  // Build authorization URL
  const authUrl = new URL(`${issuer}/authorize`)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', scope)
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('code_challenge', codeChallenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')
  authUrl.searchParams.set('connection', connection)
  if (orgId) {
    authUrl.searchParams.set('org_id', orgId)
  }

  // Create response with redirect
  const response = NextResponse.redirect(authUrl.toString())

  // Set encrypted flow cookie (httpOnly, Secure in prod, 10 min expiry)
  response.cookies.set('forge_oauth_flow', sealedFlow, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60, // 10 minutes
  })

  return response
}
