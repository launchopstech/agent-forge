import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './input'

// Input is a styled <input> wrapper — tests focus on accessibility-relevant behavior only

describe('Input', () => {
  it('calls onChange when user types', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} aria-label="Text input" />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(handleChange).toHaveBeenCalled()
  })

  it('sets aria-invalid to signal validation errors', () => {
    render(<Input aria-invalid="true" aria-label="Invalid input" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('is disabled when disabled prop is passed', () => {
    render(<Input disabled aria-label="Disabled input" />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
