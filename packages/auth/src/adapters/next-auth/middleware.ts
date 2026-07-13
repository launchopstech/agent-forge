// STUB — NextAuth middleware is not yet implemented.
// Edge Runtime compatible.
//
// TODO: To implement this adapter (NextAuth v5 pattern):
// 1. Import { auth } from './auth-config'
// 2. Return auth(async (req) => {
//      const session = req.auth
//      const url = req.nextUrl
//      if (isAuthRoute(req) && session) return NextResponse.redirect(new URL('/dashboard', url))
//      if (isProtected(req) && !session) return NextResponse.redirect(new URL('/login', url))
//    })
//
// For NextAuth v4: use withAuth() from 'next-auth/middleware' instead.
// IMPORTANT: middleware must remain Edge Runtime compatible — no Node.js-only imports.

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
    throw new NotImplementedError('next-auth', 'buildMiddleware')
    return NextResponse.next() // unreachable
  }
}
