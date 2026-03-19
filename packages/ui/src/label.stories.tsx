import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './label'
import { Input } from './input'
import { Checkbox } from './checkbox'

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Label text',
  },
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {}

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="agree" />
      <Label htmlFor="agree">I agree to the terms</Label>
    </div>
  ),
}

export const DisabledState: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64 group" data-disabled="true">
      <Label htmlFor="disabled">Disabled field</Label>
      <Input id="disabled" disabled placeholder="Cannot edit" />
    </div>
  ),
}
