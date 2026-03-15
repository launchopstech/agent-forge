import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { toast } from 'sonner'
import { Toaster } from './sonner'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Sonner',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast('Event has been created.')}>
          Show Toast
        </Button>
      </div>
    </>
  ),
}

export const Variants: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast('Default message')}>
          Default
        </Button>
        <Button variant="outline" onClick={() => toast.success('Changes saved successfully!')}>
          Success
        </Button>
        <Button variant="outline" onClick={() => toast.error('Something went wrong.')}>
          Error
        </Button>
        <Button variant="outline" onClick={() => toast.warning('Please review your input.')}>
          Warning
        </Button>
        <Button variant="outline" onClick={() => toast.info('New version available.')}>
          Info
        </Button>
      </div>
    </>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast('Event Created', {
            description: 'Monday, January 15 at 3:00 PM',
          })
        }
      >
        Toast with Description
      </Button>
    </>
  ),
}

export const WithAction: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast('File deleted', {
            action: {
              label: 'Undo',
              onClick: () => toast.success('Deletion undone'),
            },
          })
        }
      >
        Toast with Action
      </Button>
    </>
  ),
}
