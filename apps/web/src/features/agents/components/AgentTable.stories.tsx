import type { Meta, StoryObj } from '@storybook/react'
import { AgentTable } from './AgentTable'
import type { Agent } from '../types'

const agents: Agent[] = [
  {
    id: 'agent-live',
    name: 'Support Concierge',
    channels: ['Web', 'Email'],
    conversations: 1240,
    resolution: 82,
    csat: 4.7,
    status: 'live',
  },
  {
    id: 'agent-draft',
    name: 'Sales Qualifier',
    channels: ['Web'],
    conversations: 0,
    resolution: null,
    csat: null,
    status: 'draft',
  },
  {
    id: 'agent-paused',
    name: 'Returns Assistant',
    channels: ['WhatsApp', 'Email'],
    conversations: 318,
    resolution: 71,
    csat: 4.1,
    status: 'paused',
  },
]

const meta: Meta<typeof AgentTable> = {
  title: 'Features/Agents/AgentTable',
  component: AgentTable,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof AgentTable>

export const Default: Story = {
  args: {
    agents,
    title: 'Your Agents',
    page: 1,
    pageSize: 10,
    total: agents.length,
    onPageChange: () => undefined,
  },
}
