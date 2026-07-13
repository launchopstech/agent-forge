import type { Meta, StoryObj } from '@storybook/react'
import { AgentDashboard } from './AgentDashboard'

const meta: Meta<typeof AgentDashboard> = {
  title: 'Features/Agents/AgentDashboard',
  component: AgentDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Main agent hub dashboard. Shows metrics, agent table with search/filter, and unresolved intents panel. Loads data via useAgentListStore after auth confirms.',
      },
    },
  },
  args: {
    // Keep auth in loading state so the component renders skeletons without
    // needing a ClerkProvider or live API calls.
    useUser: () => ({ user: null, isLoading: true, isAuthenticated: false }),
  },
}

export default meta
type Story = StoryObj<typeof AgentDashboard>

export const Default: Story = {}
