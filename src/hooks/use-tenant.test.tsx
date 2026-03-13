import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { TenantProvider } from '@/lib/tenant-context'
import { useTenant } from './use-tenant'
import { defaultBrand } from '@/config/brands/default'
import { clientABrand } from '@/config/brands/client-a'
import type { BrandConfig } from '@/config/brands/types'

function makeWrapper(brand: BrandConfig) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <TenantProvider brand={brand}>{children}</TenantProvider>
  }
}

describe('useTenant()', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns default brand config', () => {
    const { result } = renderHook(() => useTenant(), { wrapper: makeWrapper(defaultBrand) })
    expect(result.current.key).toBe('default')
    expect(result.current.site.name).toBe('AgentForge')
  })

  it('returns client-a brand config', () => {
    const { result } = renderHook(() => useTenant(), { wrapper: makeWrapper(clientABrand) })
    expect(result.current.key).toBe('client-a')
    expect(result.current.site.name).toBe('ClientA Platform')
  })

  it('throws when used outside <TenantProvider>', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useTenant())).toThrow(
      'useTenantContext must be used inside <TenantProvider>'
    )
    consoleSpy.mockRestore()
  })
})
