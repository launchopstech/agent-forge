import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Demo from './panel'

const meta: Meta = {
  title: 'AI/Panel',
  parameters: { layout: 'fullscreen', noLayoutWrapper: true },
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Demo />
    </div>
  ),
}

export const Dark: Story = {
  render: () => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Demo />
    </div>
  ),
  parameters: { themes: { themeOverride: 'dark' } },
}
