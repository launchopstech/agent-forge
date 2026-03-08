import type { Meta, StoryObj } from '@storybook/react'
import { toast } from 'sonner'

import { Toaster } from './sonner'
import { Button } from './button'

const meta = {
  title: 'UI/Sonner',
  component: Toaster,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast('Event has been created.')}>
      Show toast
    </Button>
  ),
}

export const Success: Story = {
  render: () => (
    <Button onClick={() => toast.success('Profile updated successfully.')}>Success toast</Button>
  ),
}

export const Error: Story = {
  render: () => (
    <Button variant="destructive" onClick={() => toast.error('Something went wrong.')}>
      Error toast
    </Button>
  ),
}

export const Warning: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.warning('Your session is about to expire.')}>
      Warning toast
    </Button>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => toast('Default toast message')}>
        Default
      </Button>
      <Button onClick={() => toast.success('Operation successful')}>Success</Button>
      <Button variant="destructive" onClick={() => toast.error('Something went wrong')}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.warning('Please review this')}>
        Warning
      </Button>
    </div>
  ),
}
