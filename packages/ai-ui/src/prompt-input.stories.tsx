import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Demo from './prompt-input'

const meta: Meta = {
  title: 'AI/PromptInput',
  parameters: { layout: 'fullscreen', noLayoutWrapper: true },
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
