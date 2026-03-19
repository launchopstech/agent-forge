// No 'use client' here — this is an RSC module that renders a client component child.
// Server Components can render Client Components; the 'use client' boundary
// is inside each adapter's provider.tsx.
import { ClerkAuthProvider } from './adapters/clerk/provider'
import { NextAuthProvider } from './adapters/next-auth/provider'
import { OktaAuthProvider } from './adapters/okta/provider'
import { activeAuthProvider } from '@forge/config/src/properties'
import type { AuthProviderComponent } from './contracts'

const providerMap: Record<string, AuthProviderComponent> = {
  clerk: ClerkAuthProvider,
  'next-auth': NextAuthProvider,
  okta: OktaAuthProvider,
}

const Active = providerMap[activeAuthProvider] ?? ClerkAuthProvider

/**
 * Drop-in replacement for <ClerkProvider> in src/app/layout.tsx.
 * Selects the correct context provider based on NEXT_PUBLIC_AUTH_PROVIDER.
 * To switch providers: change the env var — this file does not need to change.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <Active>{children}</Active>
}
