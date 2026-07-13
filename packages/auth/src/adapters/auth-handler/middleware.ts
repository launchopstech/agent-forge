// Edge Runtime compatible middleware adapter for auth-handler.
// Must use Web Crypto API (no Node.js crypto).

import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'
import type { AuthMiddlewareAdapter, MiddlewareFn } from '../../contracts'
import type { SessionData } from '../../utils/session'

export const _typeCheck: AuthMiddlewareAdapter = { buildMiddleware }
void _typeCheck

/**
 * Builds middleware that protects routes based on session cookie.
 * Edge Runtime compatible — uses Web Crypto API for cookie unsealing.
 *
 * @param protectedPatterns - Route patterns requiring authentication
 * @param authRoutePatterns - Auth pages (redirect authenticated users away)
 * @returns Middleware function
 */
export function buildMiddleware(
  protectedPatterns: string[],
  authRoutePatterns: string[]
): MiddlewareFn {
  return async (request: NextRequest, _event: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname

    // Check if route matches any pattern
    const isProtectedRoute = protectedPatterns.some((pattern) => new RegExp(pattern).test(pathname))
    const isAuthRoute = authRoutePatterns.some((pattern) => new RegExp(pattern).test(pathname))

    // Validate session cookie
    const sessionCookie = request.cookies.get('forge_session')
    const hasValidSession = sessionCookie?.value ? await isSessionValid(sessionCookie.value) : false

    // Protected route without valid session → redirect to login
    if (isProtectedRoute && !hasValidSession) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Auth route with valid session → redirect to dashboard
    if (isAuthRoute && hasValidSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Allow request to proceed
    return NextResponse.next()
  }
}

/**
 * Validates a session cookie using Web Crypto API (Edge Runtime compatible).
 * Returns true if session is valid and not expired.
 */
async function isSessionValid(sealedCookie: string): Promise<boolean> {
  const sessionSecret = process.env.AUTH_HANDLER_SESSION_SECRET

  if (!sessionSecret) {
    return false
  }

  try {
    // Unseal using Web Crypto API
    const sessionData = await unsealCookieEdge<SessionData>(sealedCookie, sessionSecret)

    // Check expiry
    return Date.now() < sessionData.expiresAt
  } catch {
    return false
  }
}

/**
 * Edge Runtime compatible cookie unsealing using Web Crypto API.
 * Mirrors the Node.js version but uses SubtleCrypto instead of Node crypto.
 */
async function unsealCookieEdge<T>(sealed: string, secret: string): Promise<T> {
  const parts = sealed.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid sealed cookie format')
  }

  const nonceB64 = parts[0]
  const tagB64 = parts[1]
  const ciphertextB64 = parts[2]

  if (!nonceB64 || !tagB64 || !ciphertextB64) {
    throw new Error('Invalid sealed cookie format - missing parts')
  }

  const nonce = base64urlDecode(nonceB64)
  const tag = base64urlDecode(tagB64)
  const encrypted = base64urlDecode(ciphertextB64)

  // Recombine ciphertext + tag
  const combined = new Uint8Array(encrypted.length + tag.length)
  combined.set(encrypted, 0)
  combined.set(tag, encrypted.length)

  // Derive key from secret
  const encoder = new TextEncoder()
  const secretBytes = encoder.encode(secret)
  const hash = await crypto.subtle.digest('SHA-256', secretBytes)
  const key = await crypto.subtle.importKey('raw', hash, { name: 'AES-GCM', length: 256 }, false, [
    'decrypt',
  ])

  // Decrypt
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, key, combined)

  const json = new TextDecoder().decode(plaintext)
  return JSON.parse(json) as T
}

/**
 * Base64URL decode (Edge Runtime compatible).
 */
function base64urlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4 !== 0) {
    base64 += '='
  }
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
