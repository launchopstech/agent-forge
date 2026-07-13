'use client'

import {
  useUser as useClerkUser,
  getAccessToken as getClerkAccessToken,
} from './adapters/clerk/client'
import {
  useUser as useNextAuthUser,
  getAccessToken as getNextAuthAccessToken,
} from './adapters/next-auth/client'
import {
  useUser as useOktaUser,
  getAccessToken as getOktaAccessToken,
} from './adapters/okta/client'
import {
  useUser as useAuthHandlerUser,
  getAccessToken as getAuthHandlerAccessToken,
} from './adapters/auth-handler/client'
import { activeAuthProvider } from '@forge/config/src/properties'
import type { UseUserReturn } from './types'

const provider = activeAuthProvider

const hooks = {
  clerk: useClerkUser,
  'next-auth': useNextAuthUser,
  okta: useOktaUser,
  'auth-handler': useAuthHandlerUser,
} as const

const tokenGetters = {
  clerk: getClerkAccessToken,
  'next-auth': getNextAuthAccessToken,
  okta: getOktaAccessToken,
  'auth-handler': getAuthHandlerAccessToken,
} as const

const resolvedHook = hooks[provider as keyof typeof hooks]
const resolvedTokenGetter = tokenGetters[provider as keyof typeof tokenGetters]

if (!resolvedHook || !resolvedTokenGetter) {
  throw new Error(
    `[auth] Unknown NEXT_PUBLIC_AUTH_PROVIDER: "${provider}". Valid: clerk | next-auth | okta | auth-handler`
  )
}

export function useUser(): UseUserReturn {
  return resolvedHook()
}

export async function getAccessToken(): Promise<string | null> {
  return resolvedTokenGetter()
}

export type { UseUserReturn } from './types'
