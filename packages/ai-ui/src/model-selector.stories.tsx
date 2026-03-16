import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Demo from './model-selector'

const meta: Meta = {
  title: 'AI/ModelSelector',
  parameters: { layout: 'padded' },
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
