// Public server-side auth API.
// PROVIDER SELECTION is automatic via NEXT_PUBLIC_AUTH_PROVIDER env var.
// Do NOT change this file when switching providers — change the env var instead.
export { getSession, requireAuth } from './server-registry'
export type { AuthUser, AuthSession } from './types'
