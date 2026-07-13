import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { EmbedSection } from './EmbedSection'
import { updateChannel } from '../api/channels.api'
import type { WorkspaceChannel } from '../types'
import type { Agent } from '@/features/agents/types'

vi.mock('lucide-react', () => ({
  AlertTriangle: () => <span data-testid="icon-alert" />,
  Check: () => <span data-testid="icon-check" />,
  Code2: () => <span data-testid="icon-code" />,
  Copy: () => <span data-testid="icon-copy" />,
  Info: () => <span data-testid="icon-info" />,
  Plus: () => <span data-testid="icon-plus" />,
  X: () => <span data-testid="icon-x" />,
}))

vi.mock('@forge/ui/src/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
    variant,
    className,
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      className={className}
    >
      {children}
    </button>
  ),
}))

vi.mock('@forge/ui/src/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

vi.mock('@forge/ui/src/label', () => ({
  Label: ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}))

vi.mock('@forge/ui/src/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({
    children,
    value,
    disabled,
  }: {
    children: React.ReactNode
    value: string
    disabled?: boolean
  }) => (
    <div aria-disabled={disabled} data-value={value} role="option">
      {children}
    </div>
  ),
  SelectTrigger: ({
    children,
    id,
    className,
  }: {
    children: React.ReactNode
    id?: string
    className?: string
  }) => (
    <button id={id} className={className} type="button">
      {children}
    </button>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
}))

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}))

vi.mock('../api/channels.api', () => ({
  updateChannel: vi.fn(),
}))

const agent: Agent = {
  id: 'agent_123',
  name: 'Support Agent',
  agentType: 'support',
  channels: ['Web'],
  conversations: 0,
  resolution: null,
  csat: null,
  status: 'live',
  shareToken: 'share_123',
}

function makeChannel(config: WorkspaceChannel['config'] = {}): WorkspaceChannel {
  return {
    id: 'ch_website',
    orgId: 'org_123',
    channelType: 'website',
    name: 'Website',
    config: {
      agentId: agent.id,
      brandColor: '#4f2edc',
      mode: 'floating',
      position: 'bottom-right',
      ...config,
    },
    webhookSecret: null,
    status: 'active',
    workspaceInstructions: null,
    createdAt: '2026-05-19T00:00:00.000Z',
    updatedAt: '2026-05-19T00:00:00.000Z',
  }
}

describe('EmbedSection allowed domains', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(updateChannel).mockResolvedValue(makeChannel())
  })

  it('shows a warning when a snippet exists without allowed domains', () => {
    render(<EmbedSection channel={makeChannel()} agents={[agent]} onConfigSaved={vi.fn()} />)

    expect(screen.getByText(/add an allowed domain before installing/i)).toBeInTheDocument()
    expect(screen.getByText(/browser chat requests will be blocked/i)).toBeInTheDocument()
  })

  it('adds, normalizes, and saves allowed domains', async () => {
    render(<EmbedSection channel={makeChannel()} agents={[agent]} onConfigSaved={vi.fn()} />)

    fireEvent.change(screen.getByLabelText(/allowed domain/i), {
      target: { value: 'Example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add/i }))
    fireEvent.click(screen.getByRole('button', { name: /save configuration/i }))

    await waitFor(() =>
      expect(updateChannel).toHaveBeenCalledWith(
        'ch_website',
        expect.objectContaining({
          config: expect.objectContaining({ allowedDomains: ['example.com'] }),
        })
      )
    )
  })

  it('escapes snippet attribute values', () => {
    render(
      <EmbedSection
        channel={makeChannel({ brandName: 'Acme "><img src=x>' })}
        agents={[agent]}
        onConfigSaved={vi.fn()}
      />
    )

    const snippet = screen.getByText((content) => content.includes('data-brand-name='))
    expect(snippet.textContent).toContain('data-brand-name="Acme &quot;&gt;&lt;img src=x&gt;"')
    expect(snippet.textContent).not.toContain('"><img')
  })

  it('includes the API URL in generated snippets', () => {
    render(<EmbedSection channel={makeChannel()} agents={[agent]} onConfigSaved={vi.fn()} />)

    const snippet = screen.getByText((content) => content.includes('data-api-url='))
    expect(snippet.textContent).toContain('data-api-url=')
  })

  it('generates an inline custom element plus loader script for inline mode', () => {
    render(
      <EmbedSection
        channel={makeChannel({ mode: 'inline' })}
        agents={[agent]}
        onConfigSaved={vi.fn()}
      />
    )

    const snippet = screen.getByText((content) => content.includes('<forge-chat'))
    expect(snippet.textContent).toContain('<forge-chat')
    expect(snippet.textContent).toContain('data-mode="inline"')
    expect(snippet.textContent).toContain('</forge-chat>')
    expect(snippet.textContent).toContain('<script')
    expect(snippet.textContent).not.toContain('data-position=')
  })

  it('normalizes malformed mode and position config before rendering and saving', async () => {
    render(
      <EmbedSection
        channel={makeChannel({ mode: 'sideways', position: 'top-left' })}
        agents={[agent]}
        onConfigSaved={vi.fn()}
      />
    )

    const snippet = screen.getByText((content) => content.includes('data-mode='))
    expect(snippet.textContent).toContain('data-mode="floating"')
    expect(snippet.textContent).toContain('data-position="bottom-right"')

    fireEvent.click(screen.getByRole('button', { name: /save configuration/i }))

    await waitFor(() =>
      expect(updateChannel).toHaveBeenCalledWith(
        'ch_website',
        expect.objectContaining({
          config: expect.objectContaining({
            mode: 'floating',
            position: 'bottom-right',
          }),
        })
      )
    )
  })

  it('saves the default brand color when the entered color is invalid', async () => {
    render(<EmbedSection channel={makeChannel()} agents={[agent]} onConfigSaved={vi.fn()} />)

    fireEvent.change(screen.getByRole('textbox', { name: /brand color/i }), {
      target: { value: 'red;}</script>' },
    })
    fireEvent.click(screen.getByRole('button', { name: /save configuration/i }))

    await waitFor(() =>
      expect(updateChannel).toHaveBeenCalledWith(
        'ch_website',
        expect.objectContaining({
          config: expect.objectContaining({ brandColor: '#4f2edc' }),
        })
      )
    )
  })

  it('rejects domains with protocols', () => {
    render(<EmbedSection channel={makeChannel()} agents={[agent]} onConfigSaved={vi.fn()} />)

    fireEvent.change(screen.getByLabelText(/allowed domain/i), {
      target: { value: 'https://example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add/i }))

    expect(screen.getByText(/do not include http/i)).toBeInTheDocument()
    expect(updateChannel).not.toHaveBeenCalled()
  })

  it('removes and saves allowed domains', async () => {
    render(
      <EmbedSection
        channel={makeChannel({ allowedDomains: ['example.com'] })}
        agents={[agent]}
        onConfigSaved={vi.fn()}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /remove example.com/i }))
    fireEvent.click(screen.getByRole('button', { name: /save configuration/i }))

    await waitFor(() =>
      expect(updateChannel).toHaveBeenCalledWith(
        'ch_website',
        expect.objectContaining({
          config: expect.objectContaining({ allowedDomains: [] }),
        })
      )
    )
  })
})
