// Edge Runtime compatible. No dynamic imports.
import * as clerkMiddleware from './adapters/clerk/middleware'
import * as nextAuthMiddleware from './adapters/next-auth/middleware'
import * as oktaMiddleware from './adapters/okta/middleware'
import * as authHandlerMiddleware from './adapters/auth-handler/middleware'
import { activeAuthProvider } from '@forge/config/src/properties'
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
    case 'auth-handler':
      return authHandlerMiddleware
    default:
      throw new Error(
        `[auth] Unknown NEXT_PUBLIC_AUTH_PROVIDER: "${p}". Valid: clerk | next-auth | okta | auth-handler`
      )
  }
}

export function buildMiddleware(
  protectedPatterns: string[],
  authRoutePatterns: string[]
): MiddlewareFn {
  return resolve().buildMiddleware(protectedPatterns, authRoutePatterns)
}
