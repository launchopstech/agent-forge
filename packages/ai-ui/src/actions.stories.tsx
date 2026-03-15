import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Demo from './actions'

const meta: Meta = {
  title: 'AI/Actions',
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
