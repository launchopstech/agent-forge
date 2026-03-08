import type { Meta, StoryObj } from '@storybook/react'
import { Mail, Plus, Trash2 } from 'lucide-react'

import { Button } from './button'
import { Spinner } from './spinner'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Button' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const IconButtons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon-sm" variant="outline" aria-label="Add">
        <Plus />
      </Button>
      <Button size="icon" aria-label="Email">
        <Mail />
      </Button>
      <Button size="icon-lg" variant="destructive" aria-label="Delete">
        <Trash2 />
      </Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>
        <Mail /> Send email
      </Button>
      <Button variant="outline">
        <Plus /> Add item
      </Button>
      <Button variant="destructive">
        <Trash2 /> Delete
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Spinner />
      Loading…
    </Button>
  ),
}

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
}
