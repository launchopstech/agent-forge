'use client'

import { useUser as useClerkUser } from './adapters/clerk/client'
import { useUser as useNextAuthUser } from './adapters/next-auth/client'
import { useUser as useOktaUser } from './adapters/okta/client'
import { activeAuthProvider } from '@/config/properties'
import type { UseUserReturn } from './types'

const provider = activeAuthProvider

const hooks = {
  clerk: useClerkUser,
  'next-auth': useNextAuthUser,
  okta: useOktaUser,
} as const

const resolvedHook = hooks[provider as keyof typeof hooks]

if (!resolvedHook) {
  throw new Error(
    `[auth] Unknown NEXT_PUBLIC_AUTH_PROVIDER: "${provider}". Valid: clerk | next-auth | okta`
  )
}

export function useUser(): UseUserReturn {
  return resolvedHook()
}

export type { UseUserReturn } from './types'
