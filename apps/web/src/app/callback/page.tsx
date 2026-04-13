'use client'

/**
 * OAuth callback landing page.
 * Receives authorization code from auth-handler, exchanges it for tokens,
 * stores session state, and redirects to the app.
 */

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Spinner } from '@forge/ui'
import { AlertCircle } from 'lucide-react'

export default function CallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const errorParam = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      // Check for OAuth error response
      if (errorParam) {
        const message = errorDescription || errorParam
        setError(message)
        // Redirect to login after showing error briefly
        setTimeout(() => {
          router.push(`/login?error=${encodeURIComponent(message)}`)
        }, 2000)
        return
      }

      // Validate required parameters
      if (!code || !state) {
        setError('Invalid callback - missing code or state')
        setTimeout(() => {
          router.push('/login?error=Invalid callback')
        }, 2000)
        return
      }

      try {
        // Exchange code for tokens via same-origin callback handler
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Token exchange failed')
        }

        // Store access token in sessionStorage
        if (data.accessToken) {
          sessionStorage.setItem('forge_access_token', data.accessToken)
          const expiresAt = Date.now() + data.expiresIn * 1000
          sessionStorage.setItem('forge_token_expires_at', expiresAt.toString())
        }

        // Redirect to return URL (default: /dashboard)
        const returnTo = data.returnTo || '/dashboard'
        router.push(returnTo)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        setTimeout(() => {
          router.push(`/login?error=${encodeURIComponent(message)}`)
        }, 2000)
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{error ? 'Authentication Error' : 'Completing sign in...'}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {error ? (
            <>
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-sm text-muted-foreground text-center">{error}</p>
              <p className="text-xs text-muted-foreground">Redirecting to login...</p>
            </>
          ) : (
            <>
              <Spinner className="h-12 w-12" />
              <p className="text-sm text-muted-foreground">Please wait...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
