'use client'

import { ClerkProvider } from '@clerk/nextjs'
import type { AuthProviderComponent } from '../../contracts'

export const _typeCheck: AuthProviderComponent = ClerkAuthProvider
void _typeCheck

export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>
}
