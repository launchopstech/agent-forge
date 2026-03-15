import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Terminal, AlertCircle, Info } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from './alert'

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert>
      <Terminal className="size-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>
  ),
}

export const WithoutIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Note</AlertTitle>
      <AlertDescription>
        This alert does not have an icon. The layout adjusts automatically.
      </AlertDescription>
    </Alert>
  ),
}

export const InfoOnly: Story = {
  render: () => (
    <Alert>
      <Info className="size-4" />
      <AlertDescription>A description-only alert with no title.</AlertDescription>
    </Alert>
  ),
}

export const Dark: Story = {
  ...Default,
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
