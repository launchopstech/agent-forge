import type { Meta, StoryObj } from '@storybook/react'
import { AgentDashboard } from './AgentDashboard'

/**
 * AgentDashboard renders the main agent hub: metrics, agent table, and unresolved intents.
 *
 * Note: full interactivity (store hydration, API calls) requires a running
 * forge-core instance. These stories show the dashboard shell in its loading state.
 */
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
}

export default meta
type Story = StoryObj<typeof AgentDashboard>

export const Default: Story = {}
