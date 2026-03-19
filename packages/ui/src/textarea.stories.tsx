import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './textarea'
import { Label } from './label'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: { placeholder: 'Type your message here.' },
}

export const WithValue: Story = {
  args: { defaultValue: 'This textarea has some pre-filled content that you can edit.' },
}

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Cannot type here' },
}

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'Too short', placeholder: 'Bio' },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  ),
}

export const Dark: Story = {
  ...Default,
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
