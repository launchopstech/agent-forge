// ONLY file allowed to import from @clerk/nextjs/server
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { AuthServerAdapter } from '../../contracts'
import type { AuthSession } from '../../types'

// Compile-time check: if AuthServerAdapter changes, this line errors here.
export const _typeCheck: AuthServerAdapter = { getSession, requireAuth }
void _typeCheck

export async function getSession(): Promise<AuthSession | null> {
  const { userId } = await auth()
  if (!userId) return null

  const clerkUser = await currentUser()
  if (!clerkUser) return null

  return {
    user: {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? null,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null,
      avatarUrl: clerkUser.imageUrl ?? null,
    },
  }
}

export async function requireAuth(redirectTo = '/login'): Promise<AuthSession> {
  const session = await getSession()
  if (!session) redirect(redirectTo)
  return session
}
