import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import CanvasDemo from './canvas'

const meta: Meta = {
  title: 'AI/Canvas',
  parameters: { layout: 'fullscreen', noLayoutWrapper: true },
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <CanvasDemo />
    </div>
  ),
}

export const Dark: Story = {
  render: () => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <CanvasDemo />
    </div>
  ),
  parameters: { themes: { themeOverride: 'dark' } },
}
