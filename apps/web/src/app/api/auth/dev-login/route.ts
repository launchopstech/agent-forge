import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { sealCookie } from '@forge/auth/src/utils/cookies'
import { sessionFromClaims } from '@forge/auth/src/utils/session'

/**
 * Development-only login shortcut for E2E tests.
 * Mints a real session by calling auth-handler's /dev/token endpoint
 * and sealing the resulting claims into a forge_session cookie.
 *
 * Never available in production.
 */
export async function POST(_request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const issuer = process.env.AUTH_HANDLER_ISSUER
  const sessionSecret = process.env.AUTH_HANDLER_SESSION_SECRET

  if (!issuer || !sessionSecret) {
    return NextResponse.json({ error: 'Missing AUTH_HANDLER_* configuration' }, { status: 500 })
  }

  // Get a real JWT from auth-handler dev token endpoint
  let tokenRes: Response
  try {
    tokenRes = await fetch(`${issuer}/dev/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'e2e@test.example.com',
        name: 'E2E Test User',
        scope: 'openid profile email offline_access agents:read agents:write',
      }),
    })
  } catch {
    return NextResponse.json({ error: 'Auth-handler unreachable' }, { status: 503 })
  }

  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Dev token request failed' }, { status: 502 })
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string
    id_token?: string
    expires_in: number
    scope: string
  }

  if (!tokens.id_token) {
    return NextResponse.json({ error: 'No id_token in dev token response' }, { status: 502 })
  }

  // Decode ID token payload (no signature verification needed — fetched from local trusted server)
  let claims: Record<string, unknown>
  try {
    const [, payloadB64] = tokens.id_token.split('.')
    if (!payloadB64) throw new Error('Invalid id_token format')
    let base64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4 !== 0) base64 += '='
    claims = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8')) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Failed to decode id_token' }, { status: 500 })
  }

  // Create sealed session cookie
  const sessionData = sessionFromClaims(claims as Parameters<typeof sessionFromClaims>[0])
  const sealedSession = await sealCookie(sessionData, sessionSecret)

  const response = NextResponse.json({
    success: true,
    accessToken: tokens.access_token,
    expiresIn: tokens.expires_in,
  })

  response.cookies.set('forge_session', sealedSession, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60, // 8 hours
  })

  return response
}
