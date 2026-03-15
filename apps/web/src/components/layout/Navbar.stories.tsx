import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Navbar } from './Navbar'

const meta: Meta<typeof Navbar> = {
  title: 'Layout/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    noLayoutWrapper: true,
  },
}

export default meta
type Story = StoryObj<typeof Navbar>

export const Desktop: Story = {
  args: {
    ctaPrimary: { label: 'Get Started', href: '/login' },
    ctaSecondary: { label: 'Log in', href: '/login' },
  },
}

export const Mobile: Story = {
  args: {
    ctaPrimary: { label: 'Get Started', href: '/login' },
    ctaSecondary: { label: 'Log in', href: '/login' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '390px' }}>
        <Story />
      </div>
    ),
  ],
}
