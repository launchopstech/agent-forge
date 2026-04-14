// Public auth API.
// PROVIDER SELECTION is automatic via NEXT_PUBLIC_AUTH_PROVIDER env var.
// Do NOT change this file when switching providers — change the env var instead.

// Server-side API (can be imported in Server Components, route handlers, middleware)
export { getSession, requireAuth } from './server-registry'
export type { AuthUser, AuthSession } from './types'

// Client-side API (must be imported in 'use client' components only)
export { getAccessToken } from './client-registry'
