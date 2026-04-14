'use client'

export const dynamic = 'force-dynamic'

// App-owned signup page for auth-handler OAuth flow.
// Immediately redirects to the OAuth 2.0 authorization code flow with signup intent.

import { useEffect } from 'react'
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

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const returnTo = searchParams.get('returnTo') ?? '/dashboard'

  useEffect(() => {
    if (!error) {
      const params = new URLSearchParams({ intent: 'signup', returnTo })
      window.location.href = `/api/auth/login?${params.toString()}`
    }
  }, [error, returnTo])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>There was a problem creating your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{decodeURIComponent(error)}</AlertDescription>
            </Alert>
            <button
              onClick={() => {
                const params = new URLSearchParams({ intent: 'signup', returnTo })
                window.location.href = `/api/auth/login?${params.toString()}`
              }}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Try Again
            </button>
            <div className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline">
                Already have an account?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Redirecting...</CardTitle>
          <CardDescription>Taking you to sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
