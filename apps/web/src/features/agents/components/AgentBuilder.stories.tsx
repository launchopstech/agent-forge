import type { Meta, StoryObj } from '@storybook/react'
import { AgentBuilder } from './AgentBuilder'

/**
 * AgentBuilder renders the multi-section agent configuration UI.
 * Stories use a static agentId and section prop to render each builder section.
 *
 * Note: full interactivity (store hydration, API calls) requires a running
 * forge-core instance. These stories show the builder shell with section routing.
 */
const meta: Meta<typeof AgentBuilder> = {
  title: 'Features/Agents/AgentBuilder',
  component: AgentBuilder,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Multi-section agent builder. Renders identity, behaviour, actions, knowledge, and channels sections. Wraps each section in a consistent layout with BuilderNav.',
      },
    },
  },
  argTypes: {
    agentId: { control: 'text' },
    section: {
      control: 'select',
      options: ['identity', 'behaviour', 'actions', 'knowledge', 'channels'],
    },
  },
}

export default meta
type Story = StoryObj<typeof AgentBuilder>

export const Identity: Story = {
  args: {
    agentId: 'new',
    section: 'identity',
  },
}

export const Behaviour: Story = {
  args: {
    agentId: 'new',
    section: 'behaviour',
  },
}

export const Actions: Story = {
  args: {
    agentId: 'new',
    section: 'actions',
  },
}

export const Knowledge: Story = {
  args: {
    agentId: 'new',
    section: 'knowledge',
  },
}

export const Channels: Story = {
  args: {
    agentId: 'new',
    section: 'channels',
  },
}
