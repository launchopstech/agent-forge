'use client'

export const dynamic = 'force-dynamic'

// App-owned login page — email/password form plus hosted provider redirect.
// Submits to /api/auth/credentials which calls auth-handler POST /auth/login,
// then follows the PKCE callback flow to /dashboard.

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription,
} from '@forge/ui'
import { AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const returnTo = searchParams.get('returnTo') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(urlError)
  const [loading, setLoading] = useState(false)
  const [providerLoading, setProviderLoading] = useState(false)

  const startHostedLogin = useCallback(() => {
    setProviderLoading(true)
    const params = new URLSearchParams({ intent: 'login', returnTo })
    window.location.href = `/api/auth/login?${params.toString()}`
  }, [returnTo])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)
      setLoading(true)

      try {
        const res = await fetch('/api/auth/credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, returnTo }),
        })

        const data = (await res.json()) as { redirectUrl?: string; error?: string }

        if (!res.ok || !data.redirectUrl) {
          setError(data.error ?? 'Sign in failed. Please try again.')
          return
        }

        window.location.href = data.redirectUrl
      } catch {
        setError('Unable to reach the server. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [email, password, returnTo]
  )

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{decodeURIComponent(error)}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading || providerLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>
        <button
          type="button"
          onClick={startHostedLogin}
          disabled={loading || providerLoading}
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        >
          {providerLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>
        <div className="text-center text-sm text-muted-foreground">
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
          {' · '}
          <Link href="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
