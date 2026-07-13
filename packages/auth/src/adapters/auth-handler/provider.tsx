'use client'

/**
 * Auth Handler provider — manages session lifecycle for the auth-handler adapter.
 *
 * Responsibilities:
 *  - Fetch initial session on mount
 *  - Track user activity (mouse, keyboard, touch, visibility)
 *  - Run a 30-second interval to check token expiry
 *    · active + expiring within 5 min  → silent refresh
 *    · idle   + expiring within 3 min  → set status = 'expiring' (triggers warning dialog)
 *    · expired                         → sign out
 *  - Expose refreshSession() and signOut() via context
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AuthHandlerContext, type SessionStatus } from './context'
import type { AuthProviderComponent } from '../../contracts'
import type { AuthSession } from '../../types'

/** User is considered active if they interacted within the last 60 seconds. */
const ACTIVITY_IDLE_MS = 60_000
/** Show warning dialog when remaining time is at or below this threshold AND idle. */
const WARN_THRESHOLD_MS = 3 * 60_000
/** Silently refresh when remaining time is at or below this threshold AND active. */
const REFRESH_THRESHOLD_MS = 5 * 60_000
/** How often to evaluate the token expiry state. */
const CHECK_INTERVAL_MS = 30_000
/** Minimum gap between activity-tracker state updates (throttle). */
const ACTIVITY_THROTTLE_MS = 5_000

export const AuthHandlerProvider: AuthProviderComponent = ({ children }) => {
  const router = useRouter()
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('loading')
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null)

  // Tracks last user interaction — stored in a ref to avoid re-renders on activity.
  const lastActivityAt = useRef<number>(Date.now())
  const lastActivityUpdate = useRef<number>(0)

  // ── Safe sessionStorage helpers (iOS Safari Private Mode guard) ───────────
  // In iOS Safari Private Browsing, sessionStorage.setItem throws SecurityError.
  // We catch silently — tokens still work for the current request, just aren't cached.
  const safeSessionGet = (key: string): string | null => {
    try {
      return sessionStorage.getItem(key)
    } catch {
      return null
    }
  }
  const safeSessionSet = (key: string, value: string): void => {
    try {
      sessionStorage.setItem(key, value)
    } catch {
      /* unavailable */
    }
  }
  const safeSessionRemove = (key: string): void => {
    try {
      sessionStorage.removeItem(key)
    } catch {
      /* unavailable */
    }
  }

  const isUserActive = useCallback(() => Date.now() - lastActivityAt.current < ACTIVITY_IDLE_MS, [])

  // ── Sign out ─────────────────────────────────────────────────────────────

  const signOut = useCallback(
    async (reason: 'session_expired' | 'logout' = 'session_expired') => {
      safeSessionRemove('forge_access_token')
      safeSessionRemove('forge_token_expires_at')
      setSession(null)
      setTokenExpiresAt(null)
      setSessionStatus('expired')
      try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      } catch {
        // best-effort — redirect regardless
      }
      const loginUrl = reason === 'session_expired' ? '/login?reason=session_expired' : '/login'
      router.push(loginUrl)
    },
    [router]
  )

  // ── Refresh session ───────────────────────────────────────────────────────

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      if (!res.ok) return false
      const data = await res.json()
      if (data.accessToken) {
        safeSessionSet('forge_access_token', data.accessToken)
        const exp = Date.now() + (data.expiresIn as number) * 1000
        safeSessionSet('forge_token_expires_at', exp.toString())
        setTokenExpiresAt(exp)
        setSessionStatus('active')
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  // ── Initial session fetch ─────────────────────────────────────────────────

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session', { credentials: 'include' })
        if (!response.ok) {
          setSession(null)
          setSessionStatus('expired')
          return
        }

        const data = await response.json()
        const sessionData: AuthSession | null = data.session ?? null

        if (!sessionData) {
          setSession(null)
          setSessionStatus('expired')
          return
        }

        setSession(sessionData)
        // Seed tokenExpiresAt from sessionStorage so the 30s check interval starts correctly.
        // Token refresh happens lazily on the first getAccessToken() call (client.ts has
        // _refreshInFlight dedup to prevent concurrent refreshes).
        const stored = safeSessionGet('forge_token_expires_at')
        if (stored) setTokenExpiresAt(parseInt(stored, 10))
        setSessionStatus('active')
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[auth-handler] Failed to fetch session:', err)
        setSession(null)
        setSessionStatus('expired')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchSession()
  }, [])

  // ── Activity tracking ─────────────────────────────────────────────────────

  useEffect(() => {
    const onActivity = () => {
      const now = Date.now()
      // Throttle: only update the ref at most once per ACTIVITY_THROTTLE_MS
      if (now - lastActivityUpdate.current >= ACTIVITY_THROTTLE_MS) {
        lastActivityAt.current = now
        lastActivityUpdate.current = now
      }
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'] as const
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }))
    document.addEventListener('visibilitychange', onActivity)

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity))
      document.removeEventListener('visibilitychange', onActivity)
    }
  }, [])

  // ── Token expiry check loop ───────────────────────────────────────────────

  useEffect(() => {
    const check = async () => {
      const stored = safeSessionGet('forge_token_expires_at')
      if (!stored) return // no token yet — nothing to check

      const exp = parseInt(stored, 10)
      const remaining = exp - Date.now()

      if (remaining <= 0) {
        await signOut()
        return
      }

      if (remaining <= WARN_THRESHOLD_MS) {
        if (isUserActive()) {
          const ok = await refreshSession()
          if (!ok) await signOut()
        } else {
          setSessionStatus('expiring')
        }
        return
      }

      if (remaining <= REFRESH_THRESHOLD_MS && isUserActive()) {
        void refreshSession() // fire-and-forget; failure handled on next tick
        return
      }

      // Token is healthy — ensure status is 'active' in case it was 'expiring' and
      // user just clicked "Stay logged in" from the dialog.
      setSessionStatus((prev) => (prev === 'expiring' ? 'active' : prev))
    }

    const id = setInterval(() => void check(), CHECK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [isUserActive, refreshSession, signOut])

  return (
    <AuthHandlerContext.Provider
      value={{ session, isLoading, sessionStatus, tokenExpiresAt, refreshSession, signOut }}
    >
      {children}
    </AuthHandlerContext.Provider>
  )
}
