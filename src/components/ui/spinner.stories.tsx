import type { Meta, StoryObj } from '@storybook/react'

import { Spinner } from './spinner'

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner className="size-3" aria-label="Small spinner" />
      <Spinner className="size-4" aria-label="Default spinner" />
      <Spinner className="size-6" aria-label="Medium spinner" />
      <Spinner className="size-8" aria-label="Large spinner" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner />
      <span>Loading…</span>
    </div>
  ),
}
