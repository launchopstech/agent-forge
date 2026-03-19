import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeEditor } from './ThemeEditor'
import { DEFAULT_LIGHT_VARS, DEFAULT_DARK_VARS, THEME_GROUPS } from './constants'

const defaultProps = {
  lightVars: DEFAULT_LIGHT_VARS,
  darkVars: DEFAULT_DARK_VARS,
  mode: 'light' as const,
  onChange: vi.fn(),
  onReset: vi.fn(),
  onExport: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ThemeEditor', () => {
  it('renders all group section headers', () => {
    render(<ThemeEditor {...defaultProps} />)
    THEME_GROUPS.forEach((group) => {
      expect(screen.getByText(group.label)).toBeInTheDocument()
    })
  })

  it('calls onChange with updated vars when hex picker changes', () => {
    render(<ThemeEditor {...defaultProps} />)
    const colorInput = document.getElementById('color-primary') as HTMLInputElement
    expect(colorInput).not.toBeNull()
    fireEvent.change(colorInput, { target: { value: '#ff0000' } })
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ '--primary': expect.stringMatching(/^oklch\(/) }),
      'light'
    )
  })

  it('calls onChange with raw OKLCH when text input changes', async () => {
    render(<ThemeEditor {...defaultProps} />)
    const textInput = document.getElementById('oklch-primary') as HTMLInputElement
    expect(textInput).not.toBeNull()
    fireEvent.change(textInput, { target: { value: 'oklch(0.5 0.2 300)' } })
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ '--primary': 'oklch(0.5 0.2 300)' }),
      'light'
    )
  })

  it('calls onReset when Reset button is clicked', async () => {
    render(<ThemeEditor {...defaultProps} />)
    const resetBtn = screen.getByRole('button', { name: /reset/i })
    await userEvent.click(resetBtn)
    expect(defaultProps.onReset).toHaveBeenCalledOnce()
  })

  it('calls onExport when Export CSS button is clicked', async () => {
    render(<ThemeEditor {...defaultProps} />)
    const exportBtn = screen.getByRole('button', { name: /export css/i })
    await userEvent.click(exportBtn)
    expect(defaultProps.onExport).toHaveBeenCalledOnce()
  })

  it('does not render Save button when onSave is undefined', () => {
    render(<ThemeEditor {...defaultProps} />)
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument()
  })

  it('renders Save button when onSave is provided', async () => {
    const onSave = vi.fn()
    render(<ThemeEditor {...defaultProps} onSave={onSave} />)
    const saveBtn = screen.getByRole('button', { name: /save/i })
    expect(saveBtn).toBeInTheDocument()
    await userEvent.click(saveBtn)
    expect(onSave).toHaveBeenCalledOnce()
  })

  it('disables all inputs when readOnly is true', () => {
    render(<ThemeEditor {...defaultProps} readOnly />)
    const allInputs = document.querySelectorAll('input')
    allInputs.forEach((input) => {
      expect(input).toBeDisabled()
    })
  })

  it('renders the mode toggle button', () => {
    render(<ThemeEditor {...defaultProps} />)
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()
  })

  it('renders dark mode toggle when mode is dark', () => {
    render(<ThemeEditor {...defaultProps} mode="dark" />)
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()
  })

  it('renders radius range input with aria-label', () => {
    render(<ThemeEditor {...defaultProps} />)
    const rangeInput = screen.getByRole('slider', { name: '--radius' })
    expect(rangeInput).toBeInTheDocument()
  })

  it('calls onChange when radius slider changes', () => {
    render(<ThemeEditor {...defaultProps} />)
    const rangeInput = screen.getByRole('slider', { name: '--radius' })
    fireEvent.change(rangeInput, { target: { value: '1' } })
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ '--radius': '1rem' }),
      'light'
    )
  })
})
