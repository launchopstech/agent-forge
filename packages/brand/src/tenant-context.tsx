'use client'

import { createContext, useContext } from 'react'
import type { BrandConfig } from './config/types'

export const TenantContext = createContext<BrandConfig | null>(null)

export function TenantProvider({
  brand,
  children,
}: {
  brand: BrandConfig
  children: React.ReactNode
}) {
  return <TenantContext.Provider value={brand}>{children}</TenantContext.Provider>
}

export function useTenantContext(): BrandConfig {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenantContext must be used inside <TenantProvider>')
  return ctx
}
