// Edge Runtime compatible. No dynamic imports.
import * as clerkMiddleware from './adapters/clerk/middleware'
import * as nextAuthMiddleware from './adapters/next-auth/middleware'
import * as oktaMiddleware from './adapters/okta/middleware'
import { activeAuthProvider } from '@/config/properties'
import type { AuthMiddlewareAdapter, MiddlewareFn } from './contracts'

function resolve(): AuthMiddlewareAdapter {
  const p = activeAuthProvider
  switch (p) {
    case 'clerk':
      return clerkMiddleware
    case 'next-auth':
      return nextAuthMiddleware
    case 'okta':
      return oktaMiddleware
    default:
      throw new Error(
        `[auth] Unknown NEXT_PUBLIC_AUTH_PROVIDER: "${p}". Valid: clerk | next-auth | okta`
      )
  }
}

export function buildMiddleware(
  protectedPatterns: string[],
  authRoutePatterns: string[]
): MiddlewareFn {
  return resolve().buildMiddleware(protectedPatterns, authRoutePatterns)
}
