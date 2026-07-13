import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MetricsGrid } from './MetricsGrid'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    ({
      totalAgents: 'Total Agents',
      activeAgents: 'Live Agents',
      totalMessages: 'Messages',
    })[key] ?? key,
}))

vi.mock('lucide-react', () => ({
  Bot: () => <span data-testid="bot-icon" />,
  Radio: () => <span data-testid="radio-icon" />,
  MessageCircle: () => <span data-testid="message-icon" />,
}))

describe('MetricsGrid', () => {
  it('renders dashboard metrics', () => {
    render(
      <MetricsGrid
        metrics={{
          totalAgents: 3,
          activeAgents: 2,
          totalMessages: 5000,
          period: 'all-time',
        }}
      />
    )

    expect(screen.getByText('Total Agents')).toBeInTheDocument()
    expect(screen.getByText('Live Agents')).toBeInTheDocument()
    expect(screen.getByText('Messages')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('5,000')).toBeInTheDocument()
  })

  it('renders an em dash when metric values are unavailable', () => {
    render(
      <MetricsGrid
        metrics={{
          totalAgents: null,
          activeAgents: null,
          totalMessages: null,
          period: 'all-time',
        }}
      />
    )

    expect(screen.getAllByText('—')).toHaveLength(3)
  })
})
