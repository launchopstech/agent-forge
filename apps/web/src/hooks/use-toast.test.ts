import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { reducer, useToast, toast } from './use-toast'

type State = ReturnType<typeof reducer>
type ToasterToast = State['toasts'][number]

// ── Reducer tests (pure function) ──────────────────────────────────────────

describe('toast reducer', () => {
  const emptyState: State = { toasts: [] }

  const makeToast = (id: string): ToasterToast => ({
    id,
    title: 'Test toast',
    open: true,
    onOpenChange: () => {},
  })

  it('adds a toast via ADD_TOAST', () => {
    const next = reducer(emptyState, { type: 'ADD_TOAST', toast: makeToast('1') })
    expect(next.toasts).toHaveLength(1)
    expect(next.toasts[0]?.id).toBe('1')
  })

  it('enforces TOAST_LIMIT of 1 — newest replaces oldest', () => {
    let state = emptyState
    state = reducer(state, { type: 'ADD_TOAST', toast: makeToast('1') })
    state = reducer(state, { type: 'ADD_TOAST', toast: makeToast('2') })
    expect(state.toasts).toHaveLength(1)
    expect(state.toasts[0]?.id).toBe('2')
  })

  it('updates a toast via UPDATE_TOAST', () => {
    let state = reducer(emptyState, { type: 'ADD_TOAST', toast: makeToast('1') })
    state = reducer(state, { type: 'UPDATE_TOAST', toast: { id: '1', title: 'Updated' } })
    expect(state.toasts[0]?.title).toBe('Updated')
  })

  it('DISMISS_TOAST sets open: false for a specific id', () => {
    let state = reducer(emptyState, { type: 'ADD_TOAST', toast: makeToast('1') })
    state = reducer(state, { type: 'DISMISS_TOAST', toastId: '1' })
    expect(state.toasts[0]?.open).toBe(false)
  })

  it('DISMISS_TOAST with no id sets open: false for all toasts', () => {
    // Bypass limit by testing reducer directly with pre-set state
    const stateWithToast = { toasts: [makeToast('1')] }
    const next = reducer(stateWithToast, { type: 'DISMISS_TOAST' })
    expect(next.toasts[0]?.open).toBe(false)
  })

  it('REMOVE_TOAST removes a specific toast', () => {
    let state = reducer(emptyState, { type: 'ADD_TOAST', toast: makeToast('1') })
    state = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' })
    expect(state.toasts).toHaveLength(0)
  })

  it('REMOVE_TOAST with no id clears all toasts', () => {
    let state = reducer(emptyState, { type: 'ADD_TOAST', toast: makeToast('1') })
    state = reducer(state, { type: 'REMOVE_TOAST' })
    expect(state.toasts).toHaveLength(0)
  })
})

// ── useToast + toast() integration tests ───────────────────────────────────

describe('useToast()', () => {
  it('toast() adds an item visible via useToast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      toast({ title: 'Hello' })
    })

    expect(result.current.toasts.length).toBeGreaterThan(0)
    expect(result.current.toasts[0]?.title).toBe('Hello')
  })

  it('toast() returns an id, dismiss, and update handle', () => {
    renderHook(() => useToast())
    let handle: ReturnType<typeof toast>

    act(() => {
      handle = toast({ title: 'With handle' })
    })

    expect(handle!.id).toBeTruthy()
    expect(typeof handle!.dismiss).toBe('function')
    expect(typeof handle!.update).toBe('function')
  })

  it('dismiss(id) sets open to false', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      toast({ title: 'Dismiss me' })
    })

    const id = result.current.toasts[0]?.id ?? ''

    act(() => {
      result.current.dismiss(id)
    })

    expect(result.current.toasts[0]?.open).toBe(false)
  })

  it('dismiss() with no argument dismisses all toasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      toast({ title: 'Toast A' })
    })

    act(() => {
      result.current.dismiss()
    })

    expect(result.current.toasts[0]?.open).toBe(false)
  })
})
