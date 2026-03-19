/**
 * ThemeEditorPanel unit tests.
 *
 * @storybook/manager-api is mocked because it only runs in the Storybook
 * manager iframe; the hooks are not available in jsdom/happy-dom.
 */
import '@testing-library/jest-dom/vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ─── mock @storybook/manager-api ─────────────────────────────────────────────
const mockEmit = vi.fn()
const mockUseGlobals = vi.fn(() => [{ brand: 'default', theme: 'light' }])

vi.mock('@storybook/manager-api', () => ({
  useGlobals: () => mockUseGlobals(),
  // useChannel in manager-api takes 0 args and returns an emit fn
  useChannel: () => mockEmit,
}))

// ─── mock localStorage ────────────────────────────────────────────────────────
let storage: Map<string, string>
const mockLocalStorage = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, val: string) => storage.set(key, val),
  removeItem: (key: string) => storage.delete(key),
}

// ─── import after mocks ───────────────────────────────────────────────────────
import { ThemeEditorPanel } from './ThemeEditorPanel'
import {
  DEFAULT_LIGHT_VARS,
  DEFAULT_DARK_VARS,
} from '../../../../packages/ui/src/theme-editor/constants'

beforeEach(() => {
  storage = new Map()
  vi.stubGlobal('localStorage', mockLocalStorage)
  vi.clearAllMocks()
  mockUseGlobals.mockReturnValue([{ brand: 'default', theme: 'light' }])
})

describe('ThemeEditorPanel — visibility', () => {
  it('renders nothing when active is false', () => {
    const { container } = render(<ThemeEditorPanel active={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the panel when active is true', () => {
    render(<ThemeEditorPanel active />)
    expect(screen.getByText('Reset')).toBeInTheDocument()
    expect(screen.getByText('Export CSS')).toBeInTheDocument()
  })
})

describe('ThemeEditorPanel — group sections', () => {
  it('renders all THEME_GROUP section headers', () => {
    render(<ThemeEditorPanel active />)
    ;['Core', 'Surfaces', 'Interactive', 'Shape', 'Sidebar', 'Charts'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  it('shows the active brand key in the toolbar', () => {
    render(<ThemeEditorPanel active />)
    expect(screen.getByText(/brand: default/)).toBeInTheDocument()
  })

  it('collapses a section when its header is clicked', async () => {
    render(<ThemeEditorPanel active />)
    // --primary is in Core group, should be visible initially
    const primaryInput = document.getElementById('panel-oklch-primary')
    expect(primaryInput).not.toBeNull()

    const coreBtn = screen.getByRole('button', { name: /core/i })
    await userEvent.click(coreBtn)

    // After collapse the input should be gone from DOM
    expect(document.getElementById('panel-oklch-primary')).toBeNull()
  })
})

describe('ThemeEditorPanel — color change', () => {
  it('emits FORGE_THEME_UPDATE when a color hex picker changes', () => {
    render(<ThemeEditorPanel active />)
    const colorInput = document.getElementById('panel-color-primary') as HTMLInputElement
    expect(colorInput).not.toBeNull()
    fireEvent.change(colorInput, { target: { value: '#ff0000' } })
    expect(mockEmit).toHaveBeenCalledWith(
      'FORGE_THEME_UPDATE',
      expect.objectContaining({
        vars: expect.objectContaining({ '--primary': expect.stringMatching(/^oklch/) }),
        mode: 'light',
      })
    )
  })

  it('emits FORGE_THEME_UPDATE when an OKLCH text input changes', () => {
    render(<ThemeEditorPanel active />)
    const textInput = document.getElementById('panel-oklch-primary') as HTMLInputElement
    fireEvent.change(textInput, { target: { value: 'oklch(0.5 0.2 300)' } })
    expect(mockEmit).toHaveBeenCalledWith(
      'FORGE_THEME_UPDATE',
      expect.objectContaining({
        vars: expect.objectContaining({ '--primary': 'oklch(0.5 0.2 300)' }),
        mode: 'light',
      })
    )
  })

  it('saves to localStorage on change', () => {
    render(<ThemeEditorPanel active />)
    const colorInput = document.getElementById('panel-color-primary') as HTMLInputElement
    fireEvent.change(colorInput, { target: { value: '#0000ff' } })
    const stored = mockLocalStorage.getItem('forge_theme_default')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!) as { light: Record<string, string> }
    expect(parsed.light['--primary']).toMatch(/^oklch/)
  })
})

describe('ThemeEditorPanel — Reset', () => {
  it('emits FORGE_THEME_UPDATE with default vars on Reset click', async () => {
    render(<ThemeEditorPanel active />)
    await userEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(mockEmit).toHaveBeenCalledWith(
      'FORGE_THEME_UPDATE',
      expect.objectContaining({ vars: DEFAULT_LIGHT_VARS, mode: 'light' })
    )
  })

  it('removes localStorage entry on Reset click', async () => {
    mockLocalStorage.setItem('forge_theme_default', JSON.stringify({ light: {}, dark: {} }))
    render(<ThemeEditorPanel active />)
    await userEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(mockLocalStorage.getItem('forge_theme_default')).toBeNull()
  })
})

describe('ThemeEditorPanel — mode toggle', () => {
  it('switches mode label from Light to Dark when toggled', async () => {
    render(<ThemeEditorPanel active />)
    const toggle = screen.getByRole('button', { name: /light/i })
    await userEvent.click(toggle)
    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument()
  })

  it('emits FORGE_THEME_UPDATE with dark vars after switching to dark', async () => {
    render(<ThemeEditorPanel active />)
    await userEvent.click(screen.getByRole('button', { name: /light/i }))
    expect(mockEmit).toHaveBeenCalledWith(
      'FORGE_THEME_UPDATE',
      expect.objectContaining({ vars: DEFAULT_DARK_VARS, mode: 'dark' })
    )
  })
})

describe('ThemeEditorPanel — Export CSS', () => {
  it('writes CSS to clipboard on Export CSS click', async () => {
    const writeMock = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText: writeMock } })
    render(<ThemeEditorPanel active />)
    await userEvent.click(screen.getByRole('button', { name: /export css/i }))
    expect(writeMock).toHaveBeenCalledWith(expect.stringContaining(':root {'))
  })
})

describe('ThemeEditorPanel — localStorage load', () => {
  it('loads saved vars from localStorage on mount for the active brand', () => {
    const saved = {
      light: { ...DEFAULT_LIGHT_VARS, '--primary': 'oklch(0.9 0.1 100)' },
      dark: DEFAULT_DARK_VARS,
    }
    mockLocalStorage.setItem('forge_theme_default', JSON.stringify(saved))
    render(<ThemeEditorPanel active />)
    const textInput = document.getElementById('panel-oklch-primary') as HTMLInputElement
    expect(textInput.value).toBe('oklch(0.9 0.1 100)')
  })
})
