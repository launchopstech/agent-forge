'use client'

import { useUser } from '@/hooks/use-user'
import type { ComponentType } from 'react'

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback: React.ReactNode = null
) {
  function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useUser()

    if (isLoading) return null
    if (!isAuthenticated) return <>{fallback}</>

    return <WrappedComponent {...props} />
  }

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name})`
  return WithAuthComponent
}
