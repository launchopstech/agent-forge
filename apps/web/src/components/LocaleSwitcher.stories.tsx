import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { LocaleSwitcher } from './LocaleSwitcher'

const meta: Meta<typeof LocaleSwitcher> = {
  title: 'Components/LocaleSwitcher',
  component: LocaleSwitcher,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof LocaleSwitcher>

export const Default: Story = {}

export const InNavbarContext: Story = {
  decorators: [
    (Story) => (
      <nav className="flex items-center justify-between border-b border-border bg-card px-6 py-4 w-[640px]">
        <span className="text-xl font-bold text-foreground">AgentForge</span>
        <Story />
      </nav>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    noLayoutWrapper: true,
  },
}

export const InAuthContext: Story = {
  decorators: [
    (Story) => (
      <div className="relative min-h-[200px] w-[400px] bg-background border border-border rounded-lg">
        <div className="absolute top-4 right-4">
          <Story />
        </div>
        <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
          Auth page content
        </div>
      </div>
    ),
  ],
}
