'use client'

// Public client-side auth hook.
// PROVIDER SELECTION is automatic via NEXT_PUBLIC_AUTH_PROVIDER env var.
// Do NOT change this file when switching providers — change the env var instead.
export { useUser } from '@forge/auth'
export type { UseUserReturn } from '@forge/auth'
