import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AuthLayout } from './AuthLayout'

const meta: Meta<typeof AuthLayout> = {
  title: 'Layout/AuthLayout',
  component: AuthLayout,
  parameters: {
    layout: 'fullscreen',
    noLayoutWrapper: true,
  },
}

export default meta
type Story = StoryObj<typeof AuthLayout>

const LoginCard = () => (
  <div className="w-80 rounded-lg border border-border bg-card p-8 shadow-sm">
    <h2 className="text-xl font-bold text-foreground">Sign in</h2>
    <p className="mt-1 text-sm text-muted-foreground">Enter your credentials</p>
  </div>
)

export const Default: Story = {
  args: {
    children: <LoginCard />,
  },
}

export const WithLogo: Story = {
  args: {
    children: <LoginCard />,
    showLogo: true,
    centered: true,
  },
}

export const TopAligned: Story = {
  args: {
    children: <LoginCard />,
    centered: false,
  },
}
