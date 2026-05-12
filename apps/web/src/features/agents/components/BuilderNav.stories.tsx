import { useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { BuilderNav } from './BuilderNav'
import { useAgentBuilderStore } from '../store/agent-builder.store'
import type { AgentStatus } from '../types'

function BuilderNavStory({ status }: { status: AgentStatus }) {
  useEffect(() => {
    useAgentBuilderStore.setState({
      agentId: 'agent-demo',
      agentStatus: status,
      activeSection: 'identity',
      completedSections: ['identity', 'behaviour'],
      isSaving: false,
      publishAgent: async () => useAgentBuilderStore.setState({ agentStatus: 'live' }),
      pauseAgent: async () => useAgentBuilderStore.setState({ agentStatus: 'paused' }),
      resumeAgent: async () => useAgentBuilderStore.setState({ agentStatus: 'live' }),
    })
  }, [status])

  return (
    <div className="h-[480px] w-[220px] border bg-background">
      <BuilderNav agentId="agent-demo" />
    </div>
  )
}

const meta: Meta<typeof BuilderNavStory> = {
  title: 'Features/Agents/BuilderNav',
  component: BuilderNavStory,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['draft', 'live', 'paused'],
    },
  },
}

export default meta
type Story = StoryObj<typeof BuilderNavStory>

export const Draft: Story = {
  args: { status: 'draft' },
}

export const Live: Story = {
  args: { status: 'live' },
}

export const Paused: Story = {
  args: { status: 'paused' },
}
