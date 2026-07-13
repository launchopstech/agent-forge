import { NextResponse } from 'next/server'
import { getSession } from '@forge/auth/src/adapters/auth-handler/server'

/**
 * Session endpoint — returns current session for client-side provider.
 * Called by AuthHandlerProvider on mount to hydrate session state.
 */
export async function GET() {
  try {
    const session = await getSession()

    return NextResponse.json({
      session,
    })
  } catch (err) {
    console.error('[auth] Failed to get session:', err)
    return NextResponse.json({ session: null }, { status: 500 })
  }
}
