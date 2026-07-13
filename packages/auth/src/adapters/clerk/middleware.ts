// Edge Runtime compatible.
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { AuthMiddlewareAdapter, MiddlewareFn } from '../../contracts'

export const _typeCheck: AuthMiddlewareAdapter = { buildMiddleware }
void _typeCheck

export function buildMiddleware(
  protectedPatterns: string[],
  authRoutePatterns: string[]
): MiddlewareFn {
  const isProtected = createRouteMatcher(protectedPatterns)
  const isAuthRoute = createRouteMatcher(authRoutePatterns)

  return clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()

    if (isAuthRoute(req) && userId) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (isProtected(req) && !userId) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('returnTo', req.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  })
}
