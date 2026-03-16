import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { ExampleForm } from './ExampleForm'

const meta = {
  title: 'Features/ExampleForm',
  component: ExampleForm,
  tags: ['autodocs'],
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
} satisfies Meta<typeof ExampleForm>

export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {}

export const WithValidationErrors: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Submit the form without filling it in to see validation errors.
        </p>
        <ExampleForm />
      </div>
    )
  },
}

export const Submitting: Story = {
  render: () => <ExampleForm onSubmit={() => new Promise(() => {})} />,
}

export const Success: Story = {
  render: () => <ExampleForm onSubmit={async () => {}} />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const { within, userEvent } = await import('@storybook/test')
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Name'), 'Jane Smith')
    await userEvent.type(canvas.getByLabelText('Email'), 'jane@example.com')
    await userEvent.type(
      canvas.getByLabelText('Message'),
      'This is a test message that is long enough.'
    )
    await userEvent.click(canvas.getByRole('button', { name: /send message/i }))
  },
}
