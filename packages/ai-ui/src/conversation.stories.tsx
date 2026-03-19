import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Demo from './conversation'

const meta: Meta = {
  title: 'AI/Conversation',
  parameters: { layout: 'fullscreen', noLayoutWrapper: true },
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="h-screen">
      <Demo />
    </div>
  ),
}

export const Dark: Story = {
  render: () => (
    <div className="h-screen">
      <Demo />
    </div>
  ),
  parameters: { themes: { themeOverride: 'dark' } },
}
