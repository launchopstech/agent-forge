// STUB — Okta middleware is not yet implemented.
// Edge Runtime compatible.
//
// TODO: To implement this adapter:
// 1. Okta uses PKCE redirect flow — session state is typically in a cookie.
// 2. Verify the session cookie using Okta's token introspection API or
//    by verifying the JWT locally with @okta/jwt-verifier (Edge-compatible subset).
// 3. Return a NextMiddleware function that:
//    - Checks if the request has a valid Okta session
//    - Redirects to /login if accessing a protected route without a session
//    - Redirects to /dashboard if accessing an auth route with a valid session
// IMPORTANT: middleware must remain Edge Runtime compatible.

import { NextResponse } from 'next/server'
import { NotImplementedError } from '../../contracts'
import type { AuthMiddlewareAdapter, MiddlewareFn } from '../../contracts'

export const _typeCheck: AuthMiddlewareAdapter = { buildMiddleware }
void _typeCheck

export function buildMiddleware(
  _protectedPatterns: string[],
  _authRoutePatterns: string[]
): MiddlewareFn {
  return (_req) => {
    throw new NotImplementedError('okta', 'buildMiddleware')
    return NextResponse.next() // unreachable
  }
}
