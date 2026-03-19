import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Demo from './web-preview'

const meta: Meta = {
  title: 'AI/WebPreview',
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
