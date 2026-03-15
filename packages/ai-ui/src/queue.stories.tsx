import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Demo from './queue'

const meta: Meta = {
  title: 'AI/Queue',
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <Demo />,
}

export const Dark: Story = {
  render: () => <Demo />,
  parameters: { themes: { themeOverride: 'dark' } },
}
