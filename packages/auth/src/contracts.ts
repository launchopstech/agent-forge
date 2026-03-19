import type { AuthSession, UseUserReturn } from './types'
import type { NextRequest, NextFetchEvent, NextResponse } from 'next/server'

/** Explicit proxy/middleware function signature (NextMiddleware is deprecated in Next.js 16). */
export type MiddlewareFn = (
  request: NextRequest,
  event: NextFetchEvent
) => NextResponse | Response | null | void | Promise<NextResponse | Response | null | void>

/**
 * Every server-side auth adapter must satisfy this interface.
 * Implemented by: adapters/clerk/server.ts, adapters/next-auth/server.ts, adapters/okta/server.ts
 */
export interface AuthServerAdapter {
  getSession(): Promise<AuthSession | null>
  requireAuth(redirectTo?: string): Promise<AuthSession>
}

/**
 * Every client-side auth adapter must satisfy this interface.
 * Files implementing this MUST have 'use client' at the top.
 */
export interface AuthClientAdapter {
  useUser(): UseUserReturn
}

/**
 * Every middleware adapter must satisfy this interface.
 * Must be Edge Runtime compatible — no dynamic imports, no Node.js-only APIs.
 */
export interface AuthMiddlewareAdapter {
  buildMiddleware(protectedPatterns: string[], authRoutePatterns: string[]): MiddlewareFn
}

/**
 * Every provider wrapper component must satisfy this interface.
 * Must be a 'use client' component.
 */
export interface AuthProviderComponent {
  (props: { children: React.ReactNode }): React.JSX.Element
}

/**
 * Thrown by stub adapters when a method is called before it is implemented.
 */
export class NotImplementedError extends Error {
  constructor(provider: string, method: string) {
    super(
      `[auth] ${provider}::${method} is not implemented. ` +
        `See src/lib/auth/adapters/${provider}/ for the TODO list.`
    )
    this.name = 'NotImplementedError'
  }
}
