import type { Meta, StoryObj } from '@storybook/react'
import { MetricsGrid } from './MetricsGrid'

const meta: Meta<typeof MetricsGrid> = {
  title: 'Features/Agents/MetricsGrid',
  component: MetricsGrid,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof MetricsGrid>

export const Default: Story = {
  args: {
    metrics: {
      totalAgents: 12,
      activeAgents: 5,
      totalMessages: 184,
      period: 'all-time',
    },
  },
}

export const Unavailable: Story = {
  args: {
    metrics: {
      totalAgents: null,
      activeAgents: null,
      totalMessages: null,
      period: 'all-time',
    },
  },
}
